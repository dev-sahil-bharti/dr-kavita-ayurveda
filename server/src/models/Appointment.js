const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  gender: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  occupation: {
    type: String
  },
  urgency: {
    type: String,
    default: 'Standard'
  },
  consultationType: {
    type: String,
    enum: ['In-person', 'Online'],
    default: 'In-person'
  },
  preferredService: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  reasonForVisit: {
    type: String
  },
  isFirstVisit: {
    type: Boolean,
    default: true
  },
  reportsFile: {
    type: String
  },
  therapy: {
    type: String,
  },
  message: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
    default: 'pending'
  },
  doctorNote: { type: String, default: '' },
  paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' },
  paymentLink: { type: String, default: '' },
  paymentMethod: { type: String, enum: ['online', 'cash', null], default: null },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  amount: { type: Number },
  receiptSent: { type: Boolean, default: false },
  cancelReason: { type: String },
  checkedIn: { type: Boolean, default: false },
  checkedInAt: { type: Date },
  followUpDate: { type: Date },
  sessionNumber: { type: Number },        // for multi-session Panchkarma tracking
  totalSessions: { type: Number },        // e.g. 7-day Panchkarma course
  reminderSent: { type: Boolean, default: false }
}, { timestamps: true });

appointmentSchema.index({ date: 1, timeSlot: 1, status: 1 });
appointmentSchema.index({ patient: 1, date: -1 });
appointmentSchema.index({ status: 1, date: 1 });
appointmentSchema.index({ razorpayOrderId: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);

