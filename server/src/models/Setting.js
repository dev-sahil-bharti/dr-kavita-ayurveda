const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  // Appearance
  theme: { 
    type: String, 
    enum: ['light', 'dark', 'system'],
    default: 'system' 
  },
  
  // Clinic Info
  clinicAddress: { type: String, default: '123 Wellness Avenue, Ayurveda City' },
  workingDays: { type: String, default: 'Monday - Saturday' },
  workingHours: { type: String, default: '09:00 AM - 07:00 PM' },
  maxAppointmentsPerDay: { type: Number, default: 30 },
  
  // Notifications
  emailAlerts: { type: Boolean, default: true },
  smsAlerts: { type: Boolean, default: true },
  dailySummary: { type: Boolean, default: true },
  marketingEmails: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
