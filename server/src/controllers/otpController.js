const https = require('https');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Otp = require('../models/Otp');
const Patient = require('../models/Patient');
const { verifyMsg91AccessToken, normalizeIndianMobile } = require('../utils/msg91Validator');

/**
 * Validate MSG91 Login with OTP Widget Access Token Server-Side
 * POST /api/otp/validate-token
 */
exports.validateWidgetToken = catchAsync(async (req, res) => {
  const { accessToken, token, mobile, purpose = 'register' } = req.body;
  const tokenToValidate = accessToken || token || req.body['access-token'];

  if (!tokenToValidate) {
    throw new AppError('MSG91 access token is required', 400);
  }

  // Verify access token with MSG91 API
  const validationResult = await verifyMsg91AccessToken(tokenToValidate);

  // If a mobile number was provided by the client, ensure it matches MSG91 verified mobile
  if (mobile) {
    const clientMobile = normalizeIndianMobile(mobile);
    if (validationResult.mobile && validationResult.mobile !== clientMobile) {
      throw new AppError('Provided mobile number does not match MSG91 verified mobile number', 400);
    }
  }

  // Check if patient is already registered for registration purpose
  const targetMobile = validationResult.mobile || normalizeIndianMobile(mobile);
  if (purpose === 'register' && targetMobile) {
    const existingPatient = await Patient.findOne({ mobile: targetMobile });
    if (existingPatient) {
      throw new AppError('A patient with this mobile number is already registered. Please login.', 400);
    }
  }

  res.status(200).json({
    success: true,
    verified: true,
    mobile: targetMobile,
    message: 'Mobile number verified successfully via MSG91',
  });
});

/**
 * Send OTP (Direct Gateway / Backend Endpoint)
 * POST /api/otp/send
 */
exports.sendOtp = catchAsync(async (req, res) => {
  const { mobile, purpose = 'register' } = req.body;

  if (!mobile) {
    throw new AppError('Mobile number is required', 400);
  }

  const rawMobile = normalizeIndianMobile(mobile);
  if (rawMobile.length !== 10) {
    throw new AppError('Please enter a valid 10-digit mobile number', 400);
  }

  // Check if patient is already registered
  if (purpose === 'register') {
    const existingPatient = await Patient.findOne({ mobile: rawMobile });
    if (existingPatient) {
      throw new AppError('A patient with this mobile number is already registered. Please login.', 400);
    }
  }

  const formattedMobile = `91${rawMobile}`;
  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_OTP_TEMPLATE_ID;

  if (!authKey || authKey.includes('placeholder')) {
    throw new AppError('MSG91 gateway is not configured on the server. Please check server .env.', 500);
  }

  // Generate 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Send request to MSG91 v5 OTP Endpoint
  const postData = JSON.stringify({
    template_id: templateId || undefined,
    mobile: formattedMobile,
    authkey: authKey,
    otp: otpCode,
  });

  const url = `https://control.msg91.com/api/v5/otp`;

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
        timeout: 10000,
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
              const errMsg = result.message || result.error || 'MSG91 gateway rejected the OTP request';
              console.error('❌ MSG91 Gateway Error:', errMsg);
              reject(new AppError(errMsg, 502));
            }
          } catch {
            if (response.statusCode >= 200 && response.statusCode < 300) {
              resolve({ success: true });
            } else {
              reject(new AppError('Invalid response received from MSG91 gateway', 502));
            }
          }
        });
      }
    );

    req.on('timeout', () => {
      req.destroy();
      reject(new AppError('MSG91 request timed out', 504));
    });

    request.on('error', (err) => {
      console.error('❌ MSG91 Network Error:', err.message);
      reject(new AppError(`MSG91 connection failed: ${err.message}`, 502));
    });

    request.write(postData);
    request.end();
  });

  // Store in MongoDB Otp collection with TTL only on successful gateway dispatch
  await Otp.deleteMany({ contact: rawMobile, purpose });
  await Otp.create({
    contact: rawMobile,
    otp: otpCode,
    userType: 'patient',
    purpose,
  });

  res.status(200).json({
    success: true,
    message: 'OTP sent successfully to your mobile number',
  });
});

/**
 * Verify OTP (Backend Verification Endpoint)
 * POST /api/otp/verify
 */
exports.verifyOtp = catchAsync(async (req, res) => {
  const { mobile, otp, purpose = 'register' } = req.body;

  if (!mobile || !otp) {
    throw new AppError('Mobile number and OTP are required', 400);
  }

  const rawMobile = normalizeIndianMobile(mobile);

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

  storedRecord.isVerified = true;
  await storedRecord.save();

  res.status(200).json({
    success: true,
    message: 'Mobile number verified successfully',
  });
});