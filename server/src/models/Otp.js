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
      required: true,
    },
    userType: {
      type: String,
      enum: ['admin', 'patient'],
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600, // MongoDB TTL: automatically deleted after 10 minutes (600 seconds)
    },
  },
  { timestamps: false }
);

otpSchema.index({ contact: 1, createdAt: -1 });

module.exports = mongoose.model('Otp', otpSchema);
