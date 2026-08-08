const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');
const AppError = require('../utils/AppError');

exports.registerAdmin = async (data) => {
  const adminExists = await Admin.findOne({ email: data.email });
  if (adminExists) {
    throw new AppError('Admin already exists', 400);
  }

  const admin = await Admin.create(data);

  if (!admin) {
    throw new AppError('Invalid admin data', 400);
  }

  return {
    _id: admin.id,
    name: admin.name,
    email: admin.email,
    token: generateToken(admin._id, 'admin'),
  };
};

exports.loginAdmin = async (email, password) => {
  const admin = await Admin.findOne({ email });

  if (!admin || !(await admin.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  return {
    _id: admin.id,
    name: admin.name,
    email: admin.email,
    token: generateToken(admin._id, 'admin'),
  };
};

exports.updateAdminProfile = async (id, data) => {
  const admin = await Admin.findById(id);
  if (!admin) {
    throw new AppError('Admin not found', 404);
  }

  admin.name = data.name || admin.name;
  admin.email = data.email || admin.email;
  if (data.password) admin.password = data.password;

  const updatedAdmin = await admin.save();
  return updatedAdmin;
};

exports.changePassword = async (id, currentPassword, newPassword, confirmPassword) => {
  if (newPassword !== confirmPassword) {
    throw new AppError('New password and confirm password do not match', 400);
  }

  const admin = await Admin.findById(id);
  if (!admin) {
    throw new AppError('Admin not found', 404);
  }

  const isMatch = await admin.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError('Incorrect current password', 400);
  }

  admin.password = newPassword;
  await admin.save();
};

exports.getAdminProfile = async (id) => {
  const admin = await Admin.findById(id).select('-password -__v');
  if (!admin) {
    throw new AppError('Admin not found', 404);
  }
  return admin;
};
