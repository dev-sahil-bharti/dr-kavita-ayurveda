const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String },
  password: { type: String }, // hashed
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  dob: { type: Date },
  address: { type: String },
  profilePhoto: { type: String }, // Cloudinary URL
  healthConditions: { type: String },
  currentMedications: { type: String },
  consultationType: { type: String, enum: ["In-person", "Online"] },
  referredBy: { type: String },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Hash password before saving
patientSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
patientSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Patient', patientSchema);
