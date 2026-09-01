const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  bookAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  getAppointmentsByPatient,
} = require('../controllers/appointmentController');
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/roleCheck');

// Configure Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

router.use(auth);

// Patient routes
router.post('/book', upload.single('reports'), bookAppointment);
router.get('/my-appointments', getMyAppointments);

// Admin routes
router.get('/all', authorizeRoles('admin'), getAllAppointments);
router.get('/patient/:patientId', authorizeRoles('admin'), getAppointmentsByPatient);
router.put('/:id/status', authorizeRoles('admin'), updateAppointmentStatus);

module.exports = router;
