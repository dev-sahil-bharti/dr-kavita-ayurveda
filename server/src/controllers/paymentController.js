const catchAsync = require('../utils/catchAsync');
const Appointment = require('../models/Appointment');
const crypto = require('crypto');
const { notifyPatient } = require('../utils/notify');

// Webhook endpoint to receive Razorpay payment status
exports.paymentWebhook = catchAsync(async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  // Razorpay sends signature in this header
  const signature = req.headers['x-razorpay-signature'];

  if (!signature || !secret) {
    return res.status(400).send('Missing signature or webhook secret');
  }

  // Verify the signature
  const body = JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  if (expectedSignature !== signature) {
    return res.status(400).send('Invalid signature');
  }

  // Parse the event
  const event = req.body;

  // We are primarily interested in 'payment_link.paid'
  if (event.event === 'payment_link.paid') {
    const paymentLinkData = event.payload.payment_link.entity;
    
    // We saved appointment._id as the reference_id when creating the link
    const appointmentId = paymentLinkData.reference_id;

    const appointment = await Appointment.findById(appointmentId);
    
    if (appointment) {
      appointment.paymentStatus = 'paid';
      await appointment.save();
      console.log(`✅ Payment successful for appointment ${appointmentId}`);
      // Optionally notify patient here if desired, but user didn't explicitly request another notification
    } else {
      console.warn(`⚠️ Payment successful but appointment not found: ${appointmentId}`);
    }
  }

  res.status(200).send('Webhook processed');
});
