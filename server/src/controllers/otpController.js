const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const https = require('https');

exports.sendOtp = catchAsync(async (req, res) => {
  const { mobile } = req.body;

  if (!mobile) {
    throw new AppError('Mobile number is required', 400);
  }

  // Remove spaces, +, -, etc.
  let formattedMobile = mobile.replace(/\D/g, '');

  // Add India country code
  if (formattedMobile.length === 10) {
    formattedMobile = `91${formattedMobile}`;
  }

  if (formattedMobile.length !== 12) {
    throw new AppError('Please enter a valid mobile number', 400);
  }

  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_OTP_TEMPLATE_ID;

  if (!authKey) {
    throw new AppError('MSG91_AUTH_KEY is missing', 500);
  }

  if (!templateId) {
    throw new AppError('MSG91_OTP_TEMPLATE_ID is missing', 500);
  }

  const url =
    `https://control.msg91.com/api/v5/otp` +
    `?template_id=${encodeURIComponent(templateId)}` +
    `&mobile=${encodeURIComponent(formattedMobile)}` +
    `&authkey=${encodeURIComponent(authKey)}`;

  console.log('Sending OTP to:', formattedMobile);
  console.log('MSG91 Template ID:', templateId);

  const result = await new Promise((resolve, reject) => {
    const request = https.request(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      (response) => {
        let data = '';

        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          console.log('MSG91 Status:', response.statusCode);
          console.log('MSG91 Response:', data);

          let result;

          try {
            result = JSON.parse(data);
          } catch (error) {
            return reject(
              new AppError(`Invalid response from MSG91: ${data}`, 500)
            );
          }

          if (response.statusCode < 200 || response.statusCode >= 300) {
            return reject(
              new AppError(
                result.message || 'MSG91 failed to send OTP',
                response.statusCode
              )
            );
          }

          if (result.type === 'error') {
            return reject(
              new AppError(
                result.message || 'MSG91 failed to send OTP',
                400
              )
            );
          }

          resolve(result);
        });
      }
    );

    request.on('error', (error) => {
      console.error('MSG91 Request Error:', error);
      reject(
        new AppError('Failed to connect to MSG91', 500)
      );
    });

    request.end();
  });

  res.status(200).json({
    success: true,
    message: 'OTP sent successfully',
    data: result
  });
});


exports.verifyOtp = catchAsync(async (req, res) => {
  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    throw new AppError(
      'Mobile number and OTP are required',
      400
    );
  }

  let formattedMobile = mobile.replace(/\D/g, '');

  if (formattedMobile.length === 10) {
    formattedMobile = `91${formattedMobile}`;
  }

  const authKey = process.env.MSG91_AUTH_KEY;

  if (!authKey) {
    throw new AppError('MSG91_AUTH_KEY is missing', 500);
  }

  const url =
    `https://control.msg91.com/api/v5/otp/verify` +
    `?otp=${encodeURIComponent(otp)}` +
    `&mobile=${encodeURIComponent(formattedMobile)}`;

  const result = await new Promise((resolve, reject) => {
    const request = https.request(
      url,
      {
        method: 'GET',
        headers: {
          authkey: authKey
        }
      },
      (response) => {
        let data = '';

        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          console.log('MSG91 Verify Status:', response.statusCode);
          console.log('MSG91 Verify Response:', data);

          try {
            const result = JSON.parse(data);

            if (result.type === 'error') {
              return reject(
                new AppError(
                  result.message || 'Invalid OTP',
                  400
                )
              );
            }

            resolve(result);
          } catch (error) {
            reject(
              new AppError('Invalid response from MSG91', 500)
            );
          }
        });
      }
    );

    request.on('error', reject);
    request.end();
  });

  res.status(200).json({
    success: true,
    message: 'Mobile number verified successfully',
    data: result
  });
});