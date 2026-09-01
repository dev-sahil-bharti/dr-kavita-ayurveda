const https = require('https');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Otp = require('../models/Otp');
const Patient = require('../models/Patient');

/**
 * Send OTP for Registration or Verification
 * Sensitive variables (MSG91_AUTH_KEY, MSG91_OTP_TEMPLATE_ID) loaded exclusively from .env
 */
exports.sendOtp = catchAsync(async (req, res) => {
  const { mobile, purpose = 'register' } = req.body;

  if (!mobile) {
    throw new AppError('Mobile number is required', 400);
  }

  // Normalize mobile number
  let rawMobile = mobile.replace(/\D/g, '');
  if (rawMobile.length > 10) {
    rawMobile = rawMobile.slice(-10);
  }

  if (rawMobile.length !== 10) {
    throw new AppError('Please enter a valid 10-digit mobile number', 400);
  }

  // Check if patient is already registered when registering
  if (purpose === 'register') {
    const existingPatient = await Patient.findOne({ mobile: rawMobile });
    if (existingPatient) {
      throw new AppError('A patient with this mobile number is already registered. Please login.', 400);
    }
  }

  const formattedMobile = `91${rawMobile}`;
  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_OTP_TEMPLATE_ID;

  // Generate 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Store in MongoDB Otp collection with TTL (10 minutes)
  await Otp.deleteMany({ contact: rawMobile, purpose });
  await Otp.create({
    contact: rawMobile,
    otp: otpCode,
    userType: 'patient',
    purpose,
  });

  // If MSG91 credentials are provided in .env, dispatch via MSG91 SMS gateway
  if (authKey && templateId && !authKey.includes('placeholder')) {
    const postData = JSON.stringify({
      template_id: templateId,
      mobile: formattedMobile,
      authkey: authKey,
      otp: otpCode,
    });

    const url = `https://control.msg91.com/api/v5/otp`;

    try {
      await new Promise((resolve, reject) => {
        const request = https.request(
          url,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              authkey: authKey,
              'Content-Length': Buffer.byteLength(postData),
            },
          },
          (response) => {
            let data = '';
            response.on('data', (chunk) => (data += chunk));
            response.on('end', () => {
              try {
                const result = JSON.parse(data);
                if (response.statusCode >= 200 && response.statusCode < 300 && result.type !== 'error') {
                  resolve(result);
                } else {
                  console.warn('⚠️ MSG91 response warning:', result.message || data);
                  resolve(result); // Fallback to DB OTP
                }
              } catch {
                resolve({ fallback: true });
              }
            });
          }
        );

        request.on('error', (err) => {
          console.warn('⚠️ MSG91 network error, falling back to local OTP:', err.message);
          resolve({ fallback: true });
        });

        request.write(postData);
        request.end();
      });
    } catch (err) {
      console.warn('MSG91 request failed, fallback active:', err.message);
    }
  }

  // Development & Debug Logging
  if (process.env.NODE_ENV !== 'production') {
    console.log(`\n========================================`);
    console.log(`📱 REGISTRATION OTP GENERATED`);
    console.log(`Mobile: +91 ${rawMobile}`);
    console.log(`OTP Code: ${otpCode}`);
    console.log(`Valid for 10 minutes`);
    console.log(`========================================\n`);
  }

  res.status(200).json({
    success: true,
    message: 'OTP sent successfully to your mobile number',
  });
});

/**
 * Verify OTP
 */
exports.verifyOtp = catchAsync(async (req, res) => {
  const { mobile, otp, purpose = 'register' } = req.body;

  if (!mobile || !otp) {
    throw new AppError('Mobile number and OTP are required', 400);
  }

  let rawMobile = mobile.replace(/\D/g, '');
  if (rawMobile.length > 10) {
    rawMobile = rawMobile.slice(-10);
  }

  // Check in MongoDB Otp collection
  const storedRecord = await Otp.findOne({
    contact: rawMobile,
    purpose,
  }).sort({ createdAt: -1 });

  if (!storedRecord) {
    throw new AppError('OTP expired or not requested. Please request a new one.', 400);
  }

  if (storedRecord.attempts >= 5) {
    await Otp.deleteMany({ contact: rawMobile, purpose });
    throw new AppError('Too many failed attempts. Please request a new OTP.', 400);
  }

  if (storedRecord.otp !== otp.toString().trim()) {
    storedRecord.attempts += 1;
    await storedRecord.save();
    throw new AppError('Invalid OTP. Please check the code and try again.', 400);
  }

  // Mark OTP record as verified
  storedRecord.isVerified = true;
  await storedRecord.save();

  res.status(200).json({
    success: true,
    message: 'Mobile number verified successfully',
  });
});