const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

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
  const { status } = req.body;

  if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ status: 'fail', message: 'Invalid status' });
  }

  const appointment = await Appointment.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).populate('patient', 'name email mobile');

  if (!appointment) {
    return res.status(404).json({ status: 'fail', message: 'Appointment not found' });
  }

  // Create Patient Notification if patient exists
  if (appointment.patient) {
    await Notification.create({
      title: 'Appointment Status Updated',
      message: `Your appointment for ${appointment.therapy || appointment.preferredService} has been ${status}.`,
      type: 'appointment',
      relatedId: appointment._id,
      onModel: 'Appointment',
      recipient: appointment.patient._id || appointment.patient
    });
  }

  res.json({ status: 'success', data: appointment });
});
