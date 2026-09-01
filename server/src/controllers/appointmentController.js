const appointmentService = require('../services/appointmentService');
const catchAsync = require('../utils/catchAsync');

exports.bookAppointment = catchAsync(async (req, res) => {
  const appointment = await appointmentService.bookAppointment(req.user.id, req.body, req.file);
  res.status(201).json({ status: 'success', data: appointment });
});

exports.getMyAppointments = catchAsync(async (req, res) => {
  const appointments = await appointmentService.getMyAppointments(req.user.id);
  res.json({ status: 'success', data: appointments });
});

exports.getAllAppointments = catchAsync(async (req, res) => {
  const result = await appointmentService.getAllAppointments(req.query);
  res.json({
    status: 'success',
    data: result.appointments,
    ...(result.pagination && { pagination: result.pagination }),
  });
});

exports.getAppointmentsByPatient = catchAsync(async (req, res) => {
  const appointments = await appointmentService.getAppointmentsByPatient(req.params.patientId);
  res.json({ status: 'success', data: appointments });
});

exports.updateAppointmentStatus = catchAsync(async (req, res) => {
  const { status, date, timeSlot } = req.body;
  const appointment = await appointmentService.updateAppointmentStatus(
    req.params.id,
    status,
    date,
    timeSlot
  );
  res.json({ status: 'success', data: appointment });
});

exports.acceptAppointment = catchAsync(async (req, res) => {
  const appointment = await appointmentService.acceptAppointment(req.params.id);
  res.json({ success: true, message: 'Appointment confirmed successfully', data: appointment });
});

exports.getCalendarAppointments = catchAsync(async (req, res) => {
  const appointments = await appointmentService.getCalendarAppointments(req.query.date);
  res.json({ success: true, data: appointments });
});

exports.checkInAppointment = catchAsync(async (req, res) => {
  const appointment = await appointmentService.checkInAppointment(req.params.id);
  res.json({ success: true, message: 'Patient checked in', data: appointment });
});

exports.markCashPaid = catchAsync(async (req, res) => {
  const appointment = await appointmentService.markCashPaid(req.params.id, req.body.amount);
  res.json({ success: true, message: 'Payment marked as cash', data: appointment });
});

exports.completeAppointment = catchAsync(async (req, res) => {
  const appointment = await appointmentService.completeAppointment(req.params.id, req.body);
  res.json({ success: true, message: 'Consultation completed', data: appointment });
});

exports.getPatientAppointmentHistory = catchAsync(async (req, res) => {
  const appointments = await appointmentService.getPatientAppointmentHistory(req.user.id);
  res.json({ success: true, data: appointments });
});
