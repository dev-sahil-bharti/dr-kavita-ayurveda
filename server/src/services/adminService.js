const Admin = require('../models/Admin');
const Otp = require('../models/Otp');
const generateToken = require('../utils/generateToken');
const AppError = require('../utils/AppError');
const notify = require('../utils/notify');

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

exports.forgotPassword = async (contact) => {
  const admin = await Admin.findOne({
    $or: [{ email: contact }, { mobileNo: contact }],
  });

  if (!admin) {
    throw new AppError('Admin not found with this email or mobile number', 404);
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store in DB with 10-minute TTL
  await Otp.deleteMany({ contact, userType: 'admin' });
  await Otp.create({
    contact,
    otp,
    userId: admin._id,
    userType: 'admin',
  });

  if (process.env.NODE_ENV === 'development') {
    console.log(`\n========================================`);
    console.log(`🔑 FORGOT PASSWORD OTP (Admin): ${contact} -> ${otp}`);
    console.log(`========================================\n`);
  }

  if (contact.includes('@')) {
    await notify.sendEmail(
      admin.email,
      'Password Reset OTP - Dr. Kavita Ayurveda',
      `Your OTP for Admin password reset is: ${otp}. It is valid for 10 minutes.`
    );
  } else {
    await notify.sendSMS(
      admin.mobileNo,
      `Your OTP for Admin password reset is ${otp}. Valid for 10 minutes. - Dr. Kavita Ayurveda`
    );
  }

  return { message: 'OTP sent successfully' };
};

exports.resetPassword = async (contact, otp, newPassword) => {
  const otpRecord = await Otp.findOne({ contact, userType: 'admin' }).sort({ createdAt: -1 });

  if (!otpRecord) {
    throw new AppError('OTP not requested or expired. Please request a new one.', 400);
  }

  if (otpRecord.attempts >= 5) {
    await Otp.deleteMany({ contact, userType: 'admin' });
    throw new AppError('Too many failed attempts. Please request a new OTP.', 400);
  }

  if (otpRecord.otp !== otp) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    throw new AppError('Invalid OTP', 400);
  }

  const admin = await Admin.findById(otpRecord.userId);
  if (!admin) {
    throw new AppError('Admin not found', 404);
  }

  admin.password = newPassword;
  await admin.save();

  // Invalidate OTP
  await Otp.deleteMany({ contact, userType: 'admin' });

  return {
    message: 'Password reset successfully',
    _id: admin.id,
    name: admin.name,
    email: admin.email,
    token: generateToken(admin._id, 'admin'),
  };
};
