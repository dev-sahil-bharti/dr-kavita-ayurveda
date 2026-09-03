const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const AppError = require('../utils/AppError');
const Razorpay = require('razorpay');
const { notifyPatient, notifyAdmin, notifyAdminAppointmentCancelled } = require('../utils/notify');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');
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
  let documents = [];
  let uploadedPublicId = null;
  let uploadedResourceType = 'auto';

  console.log('📝 [Appointment Booking] Patient ID:', userId);
  console.log('📝 [Appointment Booking] Patient Name:', patientName, 'Mobile:', mobile);
  if (file) {
    console.log(`📄 [Appointment Booking] Attached Document: ${file.originalname} (${(file.size / 1024).toFixed(1)} KB, MIME: ${file.mimetype})`);
  } else {
    console.log('ℹ️ [Appointment Booking] No document attached.');
  }

  if (file) {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
      uploadedResourceType = 'image';
    } else if (file.mimetype === 'application/pdf') {
      uploadedResourceType = 'auto';
    } else {
      uploadedResourceType = 'raw';
    }

    try {
      console.log(`☁️ [Cloudinary] Uploading to dr-kavita-ayurveda/appointments as ${uploadedResourceType}...`);
      const uploadResult = await uploadToCloudinary(
        file.buffer,
        'dr-kavita-ayurveda/appointments',
        uploadedResourceType
      );

      console.log(`✅ [Cloudinary] Upload success! URL: ${uploadResult.secure_url}`);
      reportsFile = uploadResult.secure_url;
      uploadedPublicId = uploadResult.public_id;

      documents.push({
        originalName: file.originalname || 'Medical Document',
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        resourceType: uploadResult.resource_type || uploadedResourceType,
        format: uploadResult.format || file.originalname.split('.').pop(),
        bytes: uploadResult.bytes || file.size,
        uploadedAt: new Date(),
      });
    } catch (uploadError) {
      console.error('❌ Cloudinary Upload Failed:', uploadError.message);
      throw new AppError('Failed to upload medical document to Cloudinary. Please try again.', 500);
    }
  }

  let appointment;
  try {
    appointment = await Appointment.create({
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
      documents,
      therapy: preferredService,
      message: reasonForVisit || '',
    });
  } catch (dbError) {
    // Prevent orphaned Cloudinary files if DB creation fails
    if (uploadedPublicId) {
      deleteFromCloudinary(uploadedPublicId, uploadedResourceType).catch((err) =>
        console.error('Failed to cleanup Cloudinary file:', err.message)
      );
    }
    throw dbError;
  }

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

  // SMS & Email alerts (dispatched in background so client gets an instant response)
  notifyPatient(appointment, 'requested').catch((err) =>
    console.error('Failed to notify patient on booking:', err.message)
  );
  notifyAdmin(appointment, 'requested').catch((err) =>
    console.error('Failed to notify admin on booking:', err.message)
  );

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
      notifyPatient(appointment, status).catch((err) =>
        console.error(`Failed to notify patient on status ${status}:`, err.message)
      );
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
  notifyPatient(appointment, 'confirmed').catch((err) =>
    console.error('Failed to notify patient on accept:', err.message)
  );

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

  sendReceipt(appointment).catch((err) =>
    console.error('Failed to send receipt:', err.message)
  );

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
    notifyPatient(appointment, 'followup').catch((err) =>
      console.error('Failed to notify patient on followup:', err.message)
    );
  }

  return appointment;
};

exports.getPatientAppointmentHistory = async (userId) => {
  return await Appointment.find({
    patient: userId,
    status: 'completed',
  }).sort({ date: -1 });
};

exports.cancelPatientAppointment = async (userId, appointmentId, reason, note) => {
  if (!reason || !reason.trim()) {
    throw new AppError('Cancellation reason is required', 400);
  }

  const appointment = await Appointment.findOne({
    _id: appointmentId,
    patient: userId,
  }).populate('patient', 'name email mobile');

  if (!appointment) {
    throw new AppError('Appointment not found or unauthorized', 404);
  }

  if (appointment.status === 'completed' || appointment.status === 'cancelled') {
    throw new AppError(`Cannot cancel an appointment that is already ${appointment.status}`, 400);
  }

  const cleanReason = reason.trim();
  const cleanNote = note ? note.trim() : '';
  const fullReason = cleanNote ? `${cleanReason}: ${cleanNote}` : cleanReason;

  appointment.status = 'cancelled';
  appointment.cancellation = {
    reason: cleanReason,
    note: cleanNote,
    cancelledBy: 'patient',
    cancelledAt: new Date(),
  };
  appointment.cancelReason = fullReason;
  await appointment.save();

  // Admin In-App Notification
  Notification.create({
    title: 'Appointment Cancelled by Patient',
    message: `Appointment for ${appointment.therapy || appointment.preferredService} on ${new Date(appointment.date).toLocaleDateString()} was cancelled by patient (${appointment.patientName}). Reason: ${fullReason}`,
    type: 'appointment',
    relatedId: appointment._id,
    onModel: 'Appointment',
  }).catch((err) => console.error('Failed to create admin cancellation notification:', err.message));

  // Patient In-App Notification
  Notification.create({
    title: 'Appointment Cancelled',
    message: `Your appointment for ${appointment.therapy || appointment.preferredService} on ${new Date(appointment.date).toLocaleDateString()} has been cancelled.`,
    type: 'appointment',
    relatedId: appointment._id,
    onModel: 'Appointment',
    recipient: appointment.patient._id || appointment.patient,
  }).catch((err) => console.error('Failed to create patient cancellation notification:', err.message));

  // Patient SMS & Email alerts (non-blocking)
  notifyPatient(appointment, 'cancelled').catch((err) =>
    console.error('Failed to notify patient on cancel:', err.message)
  );

  // Admin Cancellation Email Alert (non-blocking)
  notifyAdminAppointmentCancelled(appointment).catch((err) =>
    console.error('Failed to send admin cancellation email:', err.message)
  );

  return appointment;
};

