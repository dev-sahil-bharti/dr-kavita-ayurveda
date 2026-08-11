const adminService = require('../services/adminService');
const catchAsync = require('../utils/catchAsync');

exports.registerAdmin = catchAsync(async (req, res) => {
  const admin = await adminService.registerAdmin(req.body);
  res.status(201).json(admin);
});

exports.loginAdmin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const admin = await adminService.loginAdmin(email, password);
  res.json(admin);
});

exports.updateAdminProfile = catchAsync(async (req, res) => {
  const updatedAdmin = await adminService.updateAdminProfile(req.params.id, req.body);
  res.json(updatedAdmin);
});

exports.changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  await adminService.changePassword(req.params.id, currentPassword, newPassword, confirmPassword);
  res.json({ message: 'Password updated successfully' });
});

exports.getMyProfile = catchAsync(async (req, res) => {
  const admin = await adminService.getAdminProfile(req.user.id);
  res.json({ user: admin });
});

exports.forgotPassword = catchAsync(async (req, res) => {
  const { contact } = req.body;
  if (!contact) {
    const AppError = require('../utils/AppError');
    throw new AppError('Email or Mobile number is required', 400);
  }
  const result = await adminService.forgotPassword(contact);
  res.json(result);
});

exports.resetPassword = catchAsync(async (req, res) => {
  const { contact, otp, newPassword } = req.body;
  if (!contact || !otp || !newPassword) {
    const AppError = require('../utils/AppError');
    throw new AppError('Contact, OTP, and New Password are required', 400);
  }
  const result = await adminService.resetPassword(contact, otp, newPassword);
  res.json(result);
});