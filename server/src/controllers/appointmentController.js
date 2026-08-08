const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Razorpay = require('razorpay');
const { notifyPatient } = require('../utils/notify');
const crypto = require('crypto');

exports.bookAppointment = catchAsync(async (req, res) => {
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
    isFirstVisit 
  } = req.body;

  let reportsFile = '';
  if (req.file) {
    reportsFile = req.file.path;
  }

  const appointment = await Appointment.create({
    patient: req.user.id,
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
    isFirstVisit: isFirstVisit === 'Yes',
    reportsFile,
    therapy: preferredService, // For backward compatibility with Notification
    message: reasonForVisit // For backward compatibility
  });

  // Create Notification
  await Notification.create({
    title: 'New Appointment Requested',
    message: `A new appointment for ${preferredService} was requested.`,
    type: 'appointment',
    relatedId: appointment._id,
    onModel: 'Appointment'
  });

  res.status(201).json({ status: 'success', data: appointment });
});

exports.getMyAppointments = catchAsync(async (req, res) => {
  const appointments = await Appointment.find({ patient: req.user.id }).sort({ date: 1 });
  res.json({ status: 'success', data: appointments });
});

exports.getAllAppointments = catchAsync(async (req, res) => {
  // Populating patient details (name, email, mobile)
  const appointments = await Appointment.find()
    .populate('patient', 'name email mobile')
    .sort({ date: -1 });
  res.json({ status: 'success', data: appointments });
});

exports.updateAppointmentStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status, date, timeSlot } = req.body;

  if (!['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'].includes(status)) {
    return res.status(400).json({ status: 'fail', message: 'Invalid status' });
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
    return res.status(404).json({ status: 'fail', message: 'Appointment not found' });
  }

  // Create Patient Notification if patient exists
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
      recipient: appointment.patient._id || appointment.patient
    });
  }

  res.json({ status: 'success', data: appointment });
});

// ==========================================
// 1. ACCEPT ENDPOINT
// ==========================================
exports.acceptAppointment = catchAsync(async (req, res) => {
  const { id } = req.params;

  const appointment = await Appointment.findById(id).populate('patient', 'name email mobile');
  if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
  
  if (appointment.status !== 'pending') {
    return res.status(400).json({ success: false, message: 'Appointment status must be pending to accept' });
  }

  // Check double-booking race condition
  const existing = await Appointment.findOne({
    date: appointment.date,
    timeSlot: appointment.timeSlot,
    status: { $in: ['pending', 'confirmed'] },
    _id: { $ne: appointment._id }
  });

  if (existing) {
    return res.status(400).json({ success: false, message: 'This slot was already booked by someone else' });
  }

  appointment.status = 'confirmed';

  // Generate Payment Link (Skip if In-person or already paid)
  if (appointment.paymentStatus === 'unpaid' && appointment.consultationType !== 'In-person') {
    try {
      if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
        const instance = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const paymentLinkRequest = {
          amount: 50000, // Amount in paisa (e.g., 500.00 INR) - should be dynamic based on service
          currency: "INR",
          accept_partial: false,
          description: `Consultation for ${appointment.preferredService}`,
          customer: {
            name: appointment.patientName,
            email: appointment.email || 'patient@example.com',
            contact: appointment.mobile
          },
          notify: { sms: false, email: false },
          reminder_enable: false,
          reference_id: appointment._id.toString(),
        };

        const link = await instance.paymentLink.create(paymentLinkRequest);
        appointment.paymentLink = link.short_url;
      } else {
        console.warn('⚠️ Razorpay credentials missing. Generating Mock Payment Link.');
        appointment.paymentLink = `https://mock.rzp.io/${appointment._id}`;
      }
    } catch (err) {
      console.error('Razorpay Link Generation Failed:', err.message);
    }
  }

  await appointment.save();

  // Notify Patient
  await notifyPatient(appointment, 'confirmed');

  res.json({ success: true, message: 'Appointment confirmed successfully', data: appointment });
});


// ==========================================
// 3. ADMIN CALENDAR VIEW
// ==========================================
exports.getCalendarAppointments = catchAsync(async (req, res) => {
  const { date } = req.query; // YYYY-MM-DD
  if (!date) return res.status(400).json({ success: false, message: 'Date query param required' });

  // Start and end of the specified day
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const appointments = await Appointment.find({
    date: { $gte: startOfDay, $lte: endOfDay },
    status: { $in: ['confirmed', 'completed'] }
  }).sort({ timeSlot: 1 });

  res.json({ success: true, data: appointments });
});


// ==========================================
// 5. CHECK-IN ON VISIT DAY
// ==========================================
exports.checkInAppointment = catchAsync(async (req, res) => {
  const { id } = req.params;

  const appointment = await Appointment.findById(id);
  if (!appointment) return res.status(404).json({ success: false, message: 'Not found' });

  if (appointment.status !== 'confirmed' && appointment.status !== 'rescheduled') {
    return res.status(400).json({ success: false, message: 'Appointment must be confirmed or rescheduled to check in' });
  }

  // Check if date is today
  const today = new Date();
  const appDate = new Date(appointment.date);
  if (appDate.toDateString() !== today.toDateString()) {
    return res.status(400).json({ success: false, message: 'Check-in is only allowed on the day of the appointment' });
  }

  appointment.checkedIn = true;
  appointment.checkedInAt = new Date();
  await appointment.save();

  res.json({ success: true, message: 'Patient checked in', data: appointment });
});


// ==========================================
// 6. COMPLETE CONSULTATION + MULTI-SESSION
// ==========================================
exports.completeAppointment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { doctorNote, followUpDate, sessionNumber, totalSessions } = req.body;

  const appointment = await Appointment.findById(id).populate('patient', 'name email mobile');
  if (!appointment) return res.status(404).json({ success: false, message: 'Not found' });

  if (appointment.status !== 'confirmed' && appointment.status !== 'rescheduled') {
    return res.status(400).json({ success: false, message: 'Only confirmed or rescheduled appointments can be completed' });
  }

  appointment.status = 'completed';
  appointment.doctorNote = doctorNote || '';
  if (followUpDate) appointment.followUpDate = new Date(followUpDate);
  if (sessionNumber) appointment.sessionNumber = sessionNumber;
  if (totalSessions) appointment.totalSessions = totalSessions;

  await appointment.save();

  // Multi-session notification
  if (sessionNumber && totalSessions && sessionNumber < totalSessions && followUpDate) {
    await notifyPatient(appointment, 'followup');
  }

  res.json({ success: true, message: 'Consultation completed', data: appointment });
});


// ==========================================
// 6b. PATIENT HISTORY
// ==========================================
exports.getPatientAppointmentHistory = catchAsync(async (req, res) => {
  const appointments = await Appointment.find({
    patient: req.user.id,
    status: 'completed'
  }).sort({ date: -1 });

  res.json({ success: true, data: appointments });
});

