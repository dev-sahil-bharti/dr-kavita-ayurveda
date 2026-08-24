const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { paymentWebhook, createOrder, verifyPayment } = require('../controllers/paymentController');

// Webhook endpoint (must be public so Razorpay can reach it)
router.post('/webhook', paymentWebhook);

router.post('/create-order', auth, createOrder);
router.post('/verify', auth, verifyPayment);

module.exports = router;
