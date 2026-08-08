const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['patient', 'appointment', 'inquiry', 'system'],
      default: 'system',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'onModel',
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      default: null
    },
    onModel: {
      type: String,
      enum: ['Patient', 'Appointment', 'Inquiry'],
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
