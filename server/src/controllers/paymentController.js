const catchAsync = require('../utils/catchAsync');
const Appointment = require('../models/Appointment');
const crypto = require('crypto');
const { notifyPatient } = require('../utils/notify');
const { sendReceipt } = require('../utils/receipt');
const razorpay = require('../config/razorpay');

exports.createOrder = catchAsync(async (req, res) => {
  const { appointmentId, amount } = req.body;

  if (!appointmentId || !amount) {
    return res.status(400).json({ success: false, message: 'Appointment ID and amount are required' });
  }

  const options = {
    amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
    currency: 'INR',
    receipt: `receipt_order_${appointmentId}`,
  };

  const order = await razorpay.orders.create(options);

  if (!order) {
    return res.status(500).json({ success: false, message: 'Failed to create Razorpay order' });
  }

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    return res.status(404).json({ success: false, message: 'Appointment not found' });
  }

  appointment.razorpayOrderId = order.id;
  appointment.amount = amount;
  await appointment.save();

  res.status(200).json({
    success: true,
    order,
    key: process.env.RAZORPAY_KEY_ID
  });
});

exports.verifyPayment = catchAsync(async (req, res) => {
  const { appointmentId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!appointmentId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, message: 'Missing payment verification details' });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false, message: 'Invalid signature' });
  }

  const appointment = await Appointment.findById(appointmentId).populate('patient', 'name email mobile');
  if (!appointment) {
    return res.status(404).json({ success: false, message: 'Appointment not found' });
  }

  if (appointment.paymentStatus === 'paid') {
    return res.status(200).json({ success: true, message: 'Payment already verified', data: appointment });
  }

  appointment.paymentStatus = 'paid';
  appointment.paymentMethod = 'online';
  appointment.razorpayPaymentId = razorpay_payment_id;
  await appointment.save();

  await sendReceipt(appointment);

  res.status(200).json({ success: true, message: 'Payment verified successfully', data: appointment });
});

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

  const event = req.body;

  if (event.event === 'payment.captured') {
    const paymentData = event.payload.payment.entity;
    const razorpayOrderId = paymentData.order_id;
    
    if (razorpayOrderId) {
      const appointment = await Appointment.findOne({ razorpayOrderId }).populate('patient', 'name email mobile');
      
      if (appointment && appointment.paymentStatus !== 'paid') {
        appointment.paymentStatus = 'paid';
        appointment.paymentMethod = 'online';
        appointment.razorpayPaymentId = paymentData.id;
        await appointment.save();
        console.log(`✅ Webhook: Payment successful for appointment ${appointment._id}`);
        await sendReceipt(appointment);
      } else if (appointment && appointment.paymentStatus === 'paid') {
        console.log(`✅ Webhook: Payment already processed for appointment ${appointment._id}`);
      } else {
        console.warn(`⚠️ Webhook: Appointment not found for order ${razorpayOrderId}`);
      }
    }
  }

  res.status(200).send('Webhook processed');
});
