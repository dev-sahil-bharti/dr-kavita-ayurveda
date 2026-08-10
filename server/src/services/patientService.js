const Patient = require('../models/Patient');
const Notification = require('../models/Notification');
const generateToken = require('../utils/generateToken');
const AppError = require('../utils/AppError');

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

exports.loginPatient = async (email, password) => {
  const patient = await Patient.findOne({ email });

  if (!patient || !(await patient.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
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
