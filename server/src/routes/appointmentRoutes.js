const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { bookAppointment, getMyAppointments, getAllAppointments, updateAppointmentStatus, getAppointmentsByPatient } = require('../controllers/appointmentController');
const auth = require('../middleware/auth');


// Configure Multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(auth);
// Patient routes
router.post('/book', upload.single('reports'), bookAppointment);
router.get('/my-appointments', getMyAppointments);

// Admin routes (should ideally check role in middleware, but leveraging auth for now based on context)
router.get('/all', getAllAppointments);
router.get('/patient/:patientId', getAppointmentsByPatient);
router.put('/:id/status', updateAppointmentStatus);

module.exports = router;
