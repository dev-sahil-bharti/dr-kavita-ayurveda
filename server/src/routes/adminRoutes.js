const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, updateAdminProfile, changePassword } = require('../controllers/adminAuthController');
const auth = require('../middleware/auth');

const validate = require('../middleware/validate');
const { registerAdminSchema, loginAdminSchema } = require('../schemas/adminSchema');

// Public routes
router.post('/register', validate(registerAdminSchema), registerAdmin);
router.post('/login', validate(loginAdminSchema), loginAdmin);

// Protected routes
router.put('/updateAdminProfile/:id', auth, updateAdminProfile);
router.put('/changepassword/:id', auth, changePassword);

// Get current logged-in admin's profile
router.get('/profile', auth, require('../controllers/adminAuthController').getMyProfile);

// ==========================================
// Admin Appointment Management Routes
// ==========================================
const {
  acceptAppointment,
  getCalendarAppointments,
  checkInAppointment,
  completeAppointment
} = require('../controllers/appointmentController');

// Calendar (Make sure this comes before /:id routes to prevent 'calendar' being interpreted as an id)
router.get('/appointments/calendar', auth, getCalendarAppointments);

// Appointment Actions
router.patch('/appointments/:id/accept', auth, acceptAppointment);
router.patch('/appointments/:id/checkin', auth, checkInAppointment);
router.patch('/appointments/:id/complete', auth, completeAppointment);

module.exports = router;
