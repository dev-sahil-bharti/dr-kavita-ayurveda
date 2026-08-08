const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const https = require('https');

// In-memory store for OTPs (For production, use Redis or a Mongoose OTP model with TTL)
const otpStore = new Map();

exports.sendOtp = catchAsync(async (req, res) => {
  const { mobile } = req.body;

  if (!mobile) {
    throw new AppError('Mobile number is required', 400);
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store it with expiry (5 minutes)
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otpStore.set(mobile, { otp, expiresAt });

  // Format mobile for MSG91 (add 91 if exactly 10 digits)
  let formattedMobile = mobile.replace(/\D/g, ''); // remove non-digits
  if (formattedMobile.length === 10) {
    formattedMobile = '91' + formattedMobile;
  }

  // Log OTP to console for easy testing
  console.log(`\n========================================`);
  console.log(`📱 OTP GENERATED (Also sending via MSG91)`);
  console.log(`To: ${formattedMobile}`);
  console.log(`OTP Code: ${otp}`);
  console.log(`========================================\n`);

  // REAL SMS SENDING via MSG91
  const msg91AuthKey = process.env.MSG91_AUTH_KEY;
  const msg91TemplateId = process.env.MSG91_OTP_TEMPLATE_ID;
  
  if (!msg91AuthKey) {
    console.warn('MSG91_AUTH_KEY is not defined in .env');
  }

  let url = `https://control.msg91.com/api/v5/otp?authkey=${msg91AuthKey}&mobile=${formattedMobile}&otp=${otp}`;
  if (msg91TemplateId && msg91TemplateId !== 'your_template_id') {
    url += `&template_id=${msg91TemplateId}`;
  }

  await new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.type === 'error') {
            console.error('MSG91 Error:', result);
            reject(new AppError(result.message || 'Failed to send OTP via MSG91', 500));
          } else {
            console.log(`📱 REAL SMS SENT to ${formattedMobile} via MSG91`);
            resolve();
          }
        } catch (e) {
          // If response isn't JSON, just log it
          console.log(`📱 REAL SMS response: ${data}`);
          resolve();
        }
      });
    }).on('error', (err) => {
      console.error('MSG91 Request Error:', err);
      reject(new AppError('Failed to connect to MSG91 SMS service', 500));
    });
  });

  res.status(200).json({
    success: true,
    message: 'OTP sent successfully'
  });
});

exports.verifyOtp = catchAsync(async (req, res) => {
  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    throw new AppError('Mobile number and OTP are required', 400);
  }

  const storedData = otpStore.get(mobile);

  if (!storedData) {
    throw new AppError('OTP not requested or expired. Please request a new one.', 400);
  }

  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(mobile);
    throw new AppError('OTP has expired. Please request a new one.', 400);
  }

  if (storedData.otp !== otp) {
    throw new AppError('Invalid OTP', 400);
  }

  // If verified, delete the OTP to prevent reuse
  otpStore.delete(mobile);

  res.status(200).json({
    success: true,
    message: 'Mobile number verified successfully'
  });
});
