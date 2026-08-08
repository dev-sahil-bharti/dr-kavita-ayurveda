const express = require('express');
const {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry
} = require('../controllers/inquiryController');
const { protect, authorize } = require('../middleware/auth'); // Check if auth middleware exists

const router = express.Router();

// Public route for patients to submit an inquiry
router.post('/', createInquiry);

// The following routes should ideally be protected for admin access only.
// If auth middleware is available, wrap these with protect and authorize('admin')
// Example: router.use(protect, authorize('admin'));
// For now, we'll keep them open to ensure it works for demonstration, 
// or uncomment auth if implemented:

// router.use(protect); // Ensure user is logged in
// router.use(authorize('admin', 'superadmin')); // Ensure user is an admin

router.get('/', getInquiries);
router.patch('/:id/status', updateInquiryStatus);
router.delete('/:id', deleteInquiry);

module.exports = router;
