const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp, validateWidgetToken } = require('../controllers/otpController');

router.post('/send', sendOtp);
router.post('/verify', verifyOtp);
router.post('/validate-token', validateWidgetToken);

module.exports = router;
