const Patient = require('../models/Patient');
const Notification = require('../models/Notification');
const generateToken = require('../utils/generateToken');
const AppError = require('../utils/AppError');
const otpStore = require('../utils/otpStore');
const notify = require('../utils/notify');

exports.registerPatient = async (data) => {
  const patientExists = await Patient.findOne({ mobile: data.mobile });
  if (patientExists) {
    throw new AppError('Patient with this mobile already exists', 400);
  }

  const patient = await Patient.create(data);

  if (!patient) {
    throw new AppError('Invalid patient data', 400);
  }

  // Create Notification
  await Notification.create({
    title: 'New Patient Registered',
    message: `${patient.name} has just registered.`,
    type: 'patient',
    relatedId: patient._id,
    onModel: 'Patient'
  });

  return {
    _id: patient.id,
    name: patient.name,
    mobile: patient.mobile,
    email: patient.email,
    token: generateToken(patient._id),
  };
};

exports.loginPatient = async (contact, password) => {
  const patient = await Patient.findOne({
    $or: [{ email: contact }, { mobile: contact }]
  });

  if (!patient || !(await patient.comparePassword(password))) {
    throw new AppError('Invalid email/mobile or password', 401);
  }

  return {
    _id: patient.id,
    name: patient.name,
    mobile: patient.mobile,
    email: patient.email,
    token: generateToken(patient._id),
  };
};

exports.getPatientProfile = async (id) => {
  const patient = await Patient.findById(id).select('-password -__v');
  if (!patient) {
    throw new AppError('Patient not found', 404);
  }
  return patient;
};

exports.getAllPatients = async () => {
  // Return all patients, excluding passwords, sorted by newest first
  return await Patient.find({}).select('-password -__v').sort({ createdAt: -1 });
};

exports.updatePatientProfile = async (id, data) => {
  const patient = await Patient.findById(id);
  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  // Update fields
  const updatableFields = ['name', 'mobile', 'email', 'gender', 'dob', 'address', 'profilePhoto', 'healthConditions', 'currentMedications', 'consultationType', 'referredBy', 'password', 'status'];
  
  updatableFields.forEach((field) => {
    if (data[field] !== undefined) {
      patient[field] = data[field];
    }
  });

  const updatedPatient = await patient.save();
  return updatedPatient;
};

exports.changePassword = async (id, currentPassword, newPassword, confirmPassword) => {
  if (newPassword !== confirmPassword) {
    throw new AppError('New password and confirm password do not match', 400);
  }

  const patient = await Patient.findById(id);
  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  const isMatch = await patient.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError('Incorrect current password', 400);
  }

  patient.password = newPassword;
  await patient.save();
};

exports.forgotPassword = async (contact) => {
  // Find patient by email or mobile
  const patient = await Patient.findOne({
    $or: [{ email: contact }, { mobile: contact }]
  });

  if (!patient) {
    throw new AppError('Patient not found with this email or mobile number', 404);
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Log OTP to console for easy testing in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`\n========================================`);
    console.log(`🔑 FORGOT PASSWORD OTP GENERATED`);
    console.log(`To: ${contact} (Patient)`);
    console.log(`OTP Code: ${otp}`);
    console.log(`========================================\n`);
  }

  // Store it with expiry (10 minutes)
  const expiresAt = Date.now() + 10 * 60 * 1000;
  otpStore.set(contact, { otp, expiresAt, userId: patient._id });

  // Send OTP
  if (contact.includes('@')) {
    // Send via email
    await notify.sendEmail(
      patient.email,
      'Password Reset OTP - Dr. Kavita Ayurveda',
      `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`
    );
  } else {
    // Send via SMS
    await notify.sendSMS(
      patient.mobile,
      `Your OTP for Patient password reset is ${otp}. Valid for 10 minutes. - Dr. Kavita Ayurveda`
    );
  }

  return { message: 'OTP sent successfully' };
};

exports.resetPassword = async (contact, otp, newPassword) => {
  const storedData = otpStore.get(contact);

  if (!storedData) {
    throw new AppError('OTP not requested or expired. Please request a new one.', 400);
  }

  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(contact);
    throw new AppError('OTP has expired. Please request a new one.', 400);
  }

  if (storedData.otp !== otp) {
    throw new AppError('Invalid OTP', 400);
  }

  const patient = await Patient.findById(storedData.userId);
  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  patient.password = newPassword;
  await patient.save();

  // Clean up OTP
  otpStore.delete(contact);

  return {
    message: 'Password reset successfully',
    _id: patient.id,
    name: patient.name,
    mobile: patient.mobile,
    email: patient.email,
    token: generateToken(patient._id),
  };
};
