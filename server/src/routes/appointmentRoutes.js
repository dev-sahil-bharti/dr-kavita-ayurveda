const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  bookAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  getAppointmentsByPatient,
  cancelAppointmentByPatient,
} = require('../controllers/appointmentController');
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/roleCheck');

// Configure Multer memory storage with 10MB limit and filetype validation
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/jpg',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    if (allowedMimes.includes(file.mimetype) || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Only Images, PDF, DOC, DOCX, and TXT files are allowed.'), false);
    }
  },
});

router.use(auth);

// Patient routes
router.post('/book', upload.single('reports'), bookAppointment);
router.get('/my-appointments', getMyAppointments);
router.patch('/:id/cancel', cancelAppointmentByPatient);

// Admin routes
router.get('/all', authorizeRoles('admin'), getAllAppointments);
router.get('/patient/:patientId', authorizeRoles('admin'), getAppointmentsByPatient);
router.put('/:id/status', authorizeRoles('admin'), updateAppointmentStatus);

module.exports = router;
