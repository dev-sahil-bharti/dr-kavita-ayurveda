const Patient = require('../models/Patient');
const Notification = require('../models/Notification');
const Otp = require('../models/Otp');
const generateToken = require('../utils/generateToken');
const AppError = require('../utils/AppError');
const notify = require('../utils/notify');

exports.registerPatient = async (data) => {
  const normalizedMobile = (data.mobile || '').replace(/\D/g, '').slice(-10);

  if (normalizedMobile.length !== 10) {
    throw new AppError('Please provide a valid 10-digit mobile number', 400);
  }

  const patientExists = await Patient.findOne({ mobile: normalizedMobile });
  if (patientExists) {
    throw new AppError('A patient with this mobile number already exists. Please login.', 400);
  }

  const patient = await Patient.create({
    ...data,
    mobile: normalizedMobile,
    isVerified: true,
  });

  if (!patient) {
    throw new AppError('Invalid patient data', 400);
  }

  // Cleanup registration OTP record
  await Otp.deleteMany({ contact: normalizedMobile, purpose: 'register' });

  // Create Notification
  await Notification.create({
    title: 'New Patient Registered',
    message: `${patient.name} has just registered.`,
    type: 'patient',
    relatedId: patient._id,
    onModel: 'Patient',
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
    $or: [{ email: contact }, { mobile: contact }],
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

exports.getAllPatients = async (query = {}) => {
  const { page, limit, search, status } = query;
  const filter = {};

  if (status && status !== 'all') {
    filter.status = status;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { mobile: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  if (page && limit) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [patients, total] = await Promise.all([
      Patient.find(filter)
        .select('-password -__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Patient.countDocuments(filter),
    ]);

    return {
      patients,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  return await Patient.find(filter).select('-password -__v').sort({ createdAt: -1 });
};

exports.updatePatientProfile = async (id, data) => {
  const patient = await Patient.findById(id);
  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  const updatableFields = [
    'name',
    'mobile',
    'email',
    'gender',
    'dob',
    'address',
    'profilePhoto',
    'healthConditions',
    'currentMedications',
    'consultationType',
    'referredBy',
    'password',
    'status',
  ];

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
  const patient = await Patient.findOne({
    $or: [{ email: contact }, { mobile: contact }],
  });

  if (!patient) {
    throw new AppError('Patient not found with this email or mobile number', 404);
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store in DB model with 10-min TTL
  await Otp.deleteMany({ contact, userType: 'patient' });
  await Otp.create({
    contact,
    otp,
    userId: patient._id,
    userType: 'patient',
  });

  if (process.env.NODE_ENV === 'development') {
    console.log(`\n========================================`);
    console.log(`🔑 FORGOT PASSWORD OTP (Patient): ${contact} -> ${otp}`);
    console.log(`========================================\n`);
  }

  // Send OTP
  if (contact.includes('@')) {
    await notify.sendEmail(
      patient.email,
      'Password Reset OTP - Dr. Kavita Ayurveda',
      `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`
    );
  } else {
    await notify.sendSMS(
      patient.mobile,
      `Your OTP for Patient password reset is ${otp}. Valid for 10 minutes. - Dr. Kavita Ayurveda`
    );
  }

  return { message: 'OTP sent successfully' };
};

exports.resetPassword = async (contact, otp, newPassword) => {
  const otpRecord = await Otp.findOne({ contact, userType: 'patient' }).sort({ createdAt: -1 });

  if (!otpRecord) {
    throw new AppError('OTP not requested or expired. Please request a new one.', 400);
  }

  if (otpRecord.attempts >= 5) {
    await Otp.deleteMany({ contact, userType: 'patient' });
    throw new AppError('Too many failed attempts. Please request a new OTP.', 400);
  }

  if (otpRecord.otp !== otp) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    throw new AppError('Invalid OTP', 400);
  }

  const patient = await Patient.findById(otpRecord.userId);
  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  patient.password = newPassword;
  await patient.save();

  // Invalidate OTP after successful reset
  await Otp.deleteMany({ contact, userType: 'patient' });

  return {
    message: 'Password reset successfully',
    _id: patient.id,
    name: patient.name,
    mobile: patient.mobile,
    email: patient.email,
    token: generateToken(patient._id),
  };
};
