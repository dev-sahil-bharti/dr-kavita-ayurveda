const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
} = require('../controllers/inquiryController');
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/roleCheck');

// Public route for anyone to submit an inquiry
router.post('/', createInquiry);

// Protected routes for Admin only
router.get('/', auth, authorizeRoles('admin'), getInquiries);
router.patch('/:id/status', auth, authorizeRoles('admin'), updateInquiryStatus);
router.delete('/:id', auth, authorizeRoles('admin'), deleteInquiry);

module.exports = router;
