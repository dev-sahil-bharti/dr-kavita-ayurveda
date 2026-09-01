const patientService = require('../services/patientService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.registerPatient = catchAsync(async (req, res) => {
  const patient = await patientService.registerPatient(req.body);
  res.status(201).json(patient);
});

exports.loginPatient = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const patient = await patientService.loginPatient(email, password);
  res.json(patient);
});

exports.getPatientProfile = catchAsync(async (req, res) => {
  const patient = await patientService.getPatientProfile(req.params.id);
  res.json(patient);
});

exports.getMyProfile = catchAsync(async (req, res) => {
  const patient = await patientService.getPatientProfile(req.user.id);
  res.json(patient);
});

exports.getAllPatients = catchAsync(async (req, res) => {
  const result = await patientService.getAllPatients(req.query);
  if (result.pagination) {
    res.json({
      status: 'success',
      data: result.patients,
      pagination: result.pagination,
    });
  } else {
    res.json(result);
  }
});

exports.updatePatientProfile = catchAsync(async (req, res) => {
  const updatedPatient = await patientService.updatePatientProfile(req.params.id, req.body);
  res.json(updatedPatient);
});

exports.changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  await patientService.changePassword(req.params.id, currentPassword, newPassword, confirmPassword);
  res.json({ message: 'Password updated successfully' });
});

exports.forgotPassword = catchAsync(async (req, res) => {
  const { contact } = req.body;
  if (!contact) {
    throw new AppError('Email or Mobile number is required', 400);
  }
  const result = await patientService.forgotPassword(contact);
  res.json(result);
});

exports.resetPassword = catchAsync(async (req, res) => {
  const { contact, otp, newPassword } = req.body;
  if (!contact || !otp || !newPassword) {
    throw new AppError('Contact, OTP, and New Password are required', 400);
  }
  const result = await patientService.resetPassword(contact, otp, newPassword);
  res.json(result);
});
