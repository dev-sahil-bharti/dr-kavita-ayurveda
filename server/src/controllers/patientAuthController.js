const patientService = require('../services/patientService');
const catchAsync = require('../utils/catchAsync');

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
  const patients = await patientService.getAllPatients();
  res.json(patients);
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

// Get currently logged-in user's profile (using token)
exports.getMyProfile = catchAsync(async (req, res) => {
  // req.user.id comes from the auth middleware decoding the JWT
  const patient = await patientService.getPatientProfile(req.user.id);
  res.json(patient);
});
