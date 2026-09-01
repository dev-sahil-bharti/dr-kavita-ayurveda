const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
  {
    contact: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    userType: {
      type: String,
      enum: ['admin', 'patient'],
      default: 'patient',
    },
    purpose: {
      type: String,
      enum: ['register', 'reset_password', 'login', 'verification'],
      default: 'register',
    },
    attempts: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600, // MongoDB TTL: automatically removed after 10 minutes
    },
  },
  { timestamps: false }
);

otpSchema.index({ contact: 1, createdAt: -1 });

module.exports = mongoose.model('Otp', otpSchema);
