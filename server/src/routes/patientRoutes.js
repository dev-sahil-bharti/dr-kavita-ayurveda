const express = require('express');
const router = express.Router();
const { registerPatient, loginPatient, updatePatientProfile, changePassword, getPatientProfile } = require('../controllers/patientAuthController');
const { getPatientAppointmentHistory } = require('../controllers/appointmentController');
const auth = require('../middleware/auth');

const validate = require('../middleware/validate');
const { registerPatientSchema, loginPatientSchema } = require('../schemas/patientSchema');

// Public routes
router.post('/register', validate(registerPatientSchema), registerPatient);
router.post('/login', validate(loginPatientSchema), loginPatient);

// Protected routes
router.get('/', auth, require('../controllers/patientAuthController').getAllPatients);
router.get('/profile', auth, require('../controllers/patientAuthController').getMyProfile);
router.put('/updatePatientProfile/:id', auth, updatePatientProfile);
router.put('/changepassword/:id', auth, changePassword);
router.get('/getPatientProfile/:id', auth, getPatientProfile);

// Appointment History
router.get('/appointments/history', auth, getPatientAppointmentHistory);

module.exports = router;
