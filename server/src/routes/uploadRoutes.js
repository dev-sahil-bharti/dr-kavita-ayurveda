const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFile } = require('../controllers/uploadController');
const AppError = require('../utils/AppError');

// Configure Multer with memory storage
// Files are not saved to disk; instead they are available at req.file.buffer
const storage = multer.memoryStorage();

// Optionally add a file filter if you want to restrict file types
const fileFilter = (req, file, cb) => {
  // Accept images and pdfs, you can expand this list
  if (
    file.mimetype.startsWith('image/') || 
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/msword' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    cb(null, true);
  } else {
    cb(new AppError('Unsupported file type. Please upload an image, PDF, or Word document.', 400), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Route: POST /api/upload
// Uses multer middleware to parse the 'file' field
router.post('/', upload.single('file'), uploadFile);

module.exports = router;
