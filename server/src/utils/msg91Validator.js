const https = require('https');
const AppError = require('./AppError');

/**
 * Normalizes Indian mobile number to 10 digits
 * @param {string} mobile
 * @returns {string}
 */
const normalizeIndianMobile = (mobile = '') => {
  if (!mobile) return '';
  const digits = mobile.toString().replace(/\D/g, '');
  if (digits.length > 10) {
    return digits.slice(-10);
  }
  return digits;
};

/**
 * Server-side validation of MSG91 Login with OTP Widget Access Token
 * Endpoint: POST https://api.msg91.com/api/v5/widget/verifyAccessToken
 *
 * @param {string} accessToken
 * @returns {Promise<{ valid: boolean, mobile: string, raw: any }>}
 */
const verifyMsg91AccessToken = async (accessToken) => {
  if (!accessToken || typeof accessToken !== 'string' || !accessToken.trim()) {
    throw new AppError('MSG91 access token is required for verification', 400);
  }

  const authKey = process.env.MSG91_AUTH_KEY;
  if (!authKey || authKey.includes('placeholder')) {
    console.error('❌ MSG91_AUTH_KEY is not configured in server environment variables.');
    throw new AppError('Server MSG91 configuration error. Please contact administrator.', 500);
  }

  const cleanToken = accessToken.trim();
  const postData = JSON.stringify({
    'access-token': cleanToken,
  });

  const requestOptions = {
    hostname: 'api.msg91.com',
    port: 443,
    path: '/api/v5/widget/verifyAccessToken',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authkey: authKey,
      'Content-Length': Buffer.byteLength(postData),
    },
    timeout: 10000, // 10 second timeout
  };

  return new Promise((resolve, reject) => {
    const req = https.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const result = JSON.parse(data);

          // Check if response is successful
          if (res.statusCode >= 200 && res.statusCode < 300 && result.type !== 'error') {
            const rawVerifiedMobile =
              result.mobile ||
              result.data?.mobile ||
              result.contact ||
              result.phone ||
              result.data?.contact ||
              '';

            const normalizedMobile = normalizeIndianMobile(rawVerifiedMobile);

            if (process.env.NODE_ENV !== 'production') {
              console.log(`✅ MSG91 Token Verified. Mobile: +91 ${normalizedMobile}`);
            }

            resolve({
              valid: true,
              mobile: normalizedMobile,
              raw: result,
            });
          } else {
            const errorMsg =
              result.message ||
              result.error ||
              result.description ||
              'Invalid or expired MSG91 access token';

            console.warn('⚠️ MSG91 Token Validation Failed:', errorMsg);
            reject(new AppError(errorMsg, 400));
          }
        } catch (parseErr) {
          console.error('❌ Failed to parse MSG91 validation response:', data);
          reject(new AppError('Failed to parse MSG91 validation response', 502));
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new AppError('MSG91 verification request timed out', 504));
    });

    req.on('error', (err) => {
      console.error('❌ MSG91 Network/HTTP Request Error:', err.message);
      reject(new AppError('Failed to connect to MSG91 verification service', 502));
    });

    req.write(postData);
    req.end();
  });
};

module.exports = {
  verifyMsg91AccessToken,
  normalizeIndianMobile,
};
