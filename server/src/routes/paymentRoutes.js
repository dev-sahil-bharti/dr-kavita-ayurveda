const express = require('express');
const router = express.Router();
const { paymentWebhook } = require('../controllers/paymentController');

// Webhook endpoint (must be public so Razorpay can reach it)
router.post('/webhook', paymentWebhook);

module.exports = router;
