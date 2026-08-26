const express = require('express');
const router = express.Router();

const adminRoutes = require('./adminRoutes');
const patientRoutes = require('./patientRoutes');
const inquiryRoutes = require('./inquiryRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const notificationRoutes = require('./notificationRoutes');
const otpRoutes = require('./otpRoutes');
const paymentRoutes = require('./paymentRoutes');
const settingRoutes = require('./settingRoutes');
const uploadRoutes = require('./uploadRoutes');

router.use('/admin', adminRoutes);
router.use('/patient', patientRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/otp', otpRoutes);
router.use('/payment', paymentRoutes);
router.use('/settings', settingRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;
