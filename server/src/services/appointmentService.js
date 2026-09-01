const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const AppError = require('../utils/AppError');
const Razorpay = require('razorpay');
const { notifyPatient, notifyAdmin } = require('../utils/notify');
const { uploadToCloudinary } = require('../utils/cloudinary');
const { sendReceipt } = require('../utils/receipt');

exports.bookAppointment = async (userId, data, file) => {
  const {
    patientName,
    mobile,
    email,
    gender,
    age,
    occupation,
    urgency,
    consultationType,
    preferredService,
    date,
    timeSlot,
    reasonForVisit,
    isFirstVisit,
  } = data;

  let reportsFile = '';
  if (file) {
    let resourceType = 'auto';
    if (file.mimetype && file.mimetype.startsWith('image/')) {
      resourceType = 'image';
    }
    const uploadResult = await uploadToCloudinary(file.buffer, 'dr_kavita_uploads', resourceType);
    reportsFile = uploadResult.secure_url;
  }

  const appointment = await Appointment.create({
    patient: userId,
    patientName,
    mobile,
    email,
    gender,
    age: Number(age) || 0,
    occupation: occupation || '',
    urgency: urgency || 'Standard',
    consultationType: consultationType || 'In-person',
    preferredService,
    date,
    timeSlot,
    reasonForVisit: reasonForVisit || '',
    isFirstVisit: isFirstVisit === 'Yes' || isFirstVisit === true || isFirstVisit === 'true',
    reportsFile,
    therapy: preferredService,
    message: reasonForVisit || '',
  });

  // Admin Notification
  await Notification.create({
    title: 'New Appointment Requested',
    message: `A new appointment for ${preferredService} was requested by ${patientName}.`,
    type: 'appointment',
    relatedId: appointment._id,
    onModel: 'Appointment',
  });

  // Patient Notification
  await Notification.create({
    title: 'Appointment Requested',
    message: `Your appointment request for ${preferredService} has been received.`,
    type: 'appointment',
    relatedId: appointment._id,
    onModel: 'Appointment',
    recipient: appointment.patient,
  });

  // SMS & Email alerts
  await notifyPatient(appointment, 'requested');
  await notifyAdmin(appointment, 'requested');

  return appointment;
};

exports.getMyAppointments = async (userId) => {
  return await Appointment.find({ patient: userId }).sort({ date: -1 });
};

exports.getAllAppointments = async (query = {}) => {
  const { page, limit, status, search } = query;
  
  const filter = {};
  if (status && status !== 'all') {
    filter.status = status;
  }
  if (search) {
    filter.$or = [
      { patientName: { $regex: search, $options: 'i' } },
      { mobile: { $regex: search, $options: 'i' } },
      { preferredService: { $regex: search, $options: 'i' } },
    ];
  }

  if (page && limit) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [appointments, total] = await Promise.all([
      Appointment.find(filter)
        .populate('patient', 'name email mobile')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limitNum),
      Appointment.countDocuments(filter),
    ]);

    return {
      appointments,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  const appointments = await Appointment.find(filter)
    .populate('patient', 'name email mobile')
    .sort({ date: -1 });

  return { appointments };
};

exports.getAppointmentsByPatient = async (patientId) => {
  return await Appointment.find({ patient: patientId }).sort({ date: -1 });
};

exports.updateAppointmentStatus = async (id, status, date, timeSlot) => {
  if (!['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'].includes(status)) {
    throw new AppError('Invalid appointment status', 400);
  }

  const updateData = { status };
  if (date) updateData.date = date;
  if (timeSlot) updateData.timeSlot = timeSlot;

  const appointment = await Appointment.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  ).populate('patient', 'name email mobile');

  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  if (appointment.patient) {
    let notificationMsg = `Your appointment for ${appointment.therapy || appointment.preferredService} has been ${status}.`;
    if (status === 'rescheduled') {
      notificationMsg = `Your appointment for ${appointment.therapy || appointment.preferredService} has been rescheduled to ${new Date(appointment.date).toLocaleDateString()} at ${appointment.timeSlot}.`;
    }

    await Notification.create({
      title: 'Appointment Status Updated',
      message: notificationMsg,
      type: 'appointment',
      relatedId: appointment._id,
      onModel: 'Appointment',
      recipient: appointment.patient._id || appointment.patient,
    });

    if (['confirmed', 'cancelled', 'rescheduled'].includes(status)) {
      await notifyPatient(appointment, status);
    }
  }

  return appointment;
};

exports.acceptAppointment = async (id) => {
  const appointment = await Appointment.findById(id).populate('patient', 'name email mobile');
  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  if (appointment.status !== 'pending') {
    throw new AppError('Appointment status must be pending to accept', 400);
  }

  // Prevent double-booking race conditions
  const existing = await Appointment.findOne({
    date: appointment.date,
    timeSlot: appointment.timeSlot,
    status: { $in: ['pending', 'confirmed'] },
    _id: { $ne: appointment._id },
  });

  if (existing) {
    throw new AppError('This time slot is already booked by another confirmed appointment', 400);
  }

  appointment.status = 'confirmed';

  // Generate Payment Link for Online Consultations
  if (appointment.paymentStatus === 'unpaid' && appointment.consultationType !== 'In-person') {
    try {
      if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
        const instance = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const paymentLinkRequest = {
          amount: 50000, // 500 INR in paisa
          currency: 'INR',
          accept_partial: false,
          description: `Consultation for ${appointment.preferredService}`,
          customer: {
            name: appointment.patientName,
            email: appointment.email || 'patient@example.com',
            contact: appointment.mobile,
          },
          notify: { sms: false, email: false },
          reminder_enable: false,
          reference_id: appointment._id.toString(),
        };

        const link = await instance.paymentLink.create(paymentLinkRequest);
        appointment.paymentLink = link.short_url;
      } else {
        appointment.paymentLink = `https://mock.rzp.io/${appointment._id}`;
      }
    } catch (err) {
      console.error('Razorpay Link Generation Failed:', err.message);
    }
  }

  await appointment.save();
  await notifyPatient(appointment, 'confirmed');

  return appointment;
};

exports.getCalendarAppointments = async (date) => {
  if (!date) {
    throw new AppError('Date query param required', 400);
  }

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return await Appointment.find({
    date: { $gte: startOfDay, $lte: endOfDay },
    status: { $in: ['confirmed', 'completed'] },
  }).sort({ timeSlot: 1 });
};

exports.checkInAppointment = async (id) => {
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  if (appointment.status !== 'confirmed' && appointment.status !== 'rescheduled') {
    throw new AppError('Appointment must be confirmed or rescheduled to check in', 400);
  }

  const today = new Date();
  const appDate = new Date(appointment.date);
  if (appDate.toDateString() !== today.toDateString()) {
    throw new AppError('Check-in is only allowed on the day of the appointment', 400);
  }

  appointment.checkedIn = true;
  appointment.checkedInAt = new Date();
  await appointment.save();

  return appointment;
};

exports.markCashPaid = async (id, amount) => {
  const appointment = await Appointment.findById(id).populate('patient', 'name email mobile');
  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  if (appointment.paymentStatus === 'paid') {
    throw new AppError('Appointment is already marked as paid', 400);
  }

  appointment.paymentStatus = 'paid';
  appointment.paymentMethod = 'cash';
  appointment.amount = amount || 0;
  await appointment.save();

  await sendReceipt(appointment);

  return appointment;
};

exports.completeAppointment = async (id, details) => {
  const { doctorNote, followUpDate, sessionNumber, totalSessions } = details;

  const appointment = await Appointment.findById(id).populate('patient', 'name email mobile');
  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  if (appointment.status !== 'confirmed' && appointment.status !== 'rescheduled') {
    throw new AppError('Only confirmed or rescheduled appointments can be completed', 400);
  }

  appointment.status = 'completed';
  appointment.doctorNote = doctorNote || '';
  if (followUpDate) appointment.followUpDate = new Date(followUpDate);
  if (sessionNumber) appointment.sessionNumber = sessionNumber;
  if (totalSessions) appointment.totalSessions = totalSessions;

  await appointment.save();

  if (sessionNumber && totalSessions && sessionNumber < totalSessions && followUpDate) {
    await notifyPatient(appointment, 'followup');
  }

  return appointment;
};

exports.getPatientAppointmentHistory = async (userId) => {
  return await Appointment.find({
    patient: userId,
    status: 'completed',
  }).sort({ date: -1 });
};
