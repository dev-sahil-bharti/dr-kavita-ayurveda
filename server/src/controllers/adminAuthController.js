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