/**
 * MSG91 Login with OTP Widget Integration Service
 * Follows official MSG91 Web SDK / Custom UI specifications
 */

/**
 * Normalizes Indian mobile number to a clean 10-digit format
 * Supports formats: "9876543210", "+919876543210", "919876543210", "+91 98765 43210"
 * @param {string} mobile
 * @returns {string} 10-digit mobile number
 */
export const normalizeIndianMobile = (mobile = '') => {
  if (!mobile) return '';
  const digitsOnly = mobile.toString().replace(/\D/g, '');
  if (digitsOnly.length > 10) {
    return digitsOnly.slice(-10);
  }
  return digitsOnly;
};

/**
 * Validates if the normalized mobile number is a valid 10-digit Indian mobile number
 * @param {string} mobile
 * @returns {boolean}
 */
export const isValidIndianMobile = (mobile = '') => {
  const normalized = normalizeIndianMobile(mobile);
  return /^[6-9]\d{9}$/.test(normalized);
};

/**
 * Formats normalized 10-digit number for MSG91 (91XXXXXXXXXX)
 * @param {string} mobile
 * @returns {string}
 */
export const formatMobileForMsg91 = (mobile = '') => {
  const normalized = normalizeIndianMobile(mobile);
  return `91${normalized}`;
};

/**
 * Parses any error structure from MSG91 SDK callbacks
 * @param {any} error
 * @returns {string}
 */
const parseMsg91Error = (error) => {
  if (!error) return 'Unable to send OTP. Please try again.';
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  if (error.msg) return error.msg;
  if (error.description) return error.description;
  if (typeof error.response === 'string') return error.response;
  if (error.response?.message) return error.response.message;
  if (error.data?.message) return error.data.message;
  return 'OTP operation failed. Please try again.';
};

/**
 * Extracts the JWT access token from MSG91 verify callback payload
 * @param {any} data
 * @returns {string|null}
 */
const extractAccessToken = (data) => {
  if (!data) return null;
  if (typeof data === 'string') return data;
  if (data.message && typeof data.message === 'string' && data.message.length > 20) {
    return data.message;
  }
  if (data['access-token']) return data['access-token'];
  if (data.accessToken) return data.accessToken;
  if (data.token) return data.token;
  if (data.jwt) return data.jwt;
  if (data.data?.token) return data.data.token;
  if (data.data?.['access-token']) return data.data['access-token'];
  return null;
};

let widgetInitPromise = null;

/**
 * Initializes the MSG91 OTP Widget SDK with Custom UI configuration
 * @returns {Promise<void>}
 */
export const initMsg91Widget = () => {
  if (widgetInitPromise) {
    return widgetInitPromise;
  }

  widgetInitPromise = new Promise((resolve, reject) => {
    const widgetId = import.meta.env.VITE_MSG91_WIDGET_ID;
    const tokenAuth = import.meta.env.VITE_MSG91_WIDGET_TOKEN;

    if (!widgetId || !tokenAuth) {
      console.warn(
        '⚠️ MSG91 Widget credentials (VITE_MSG91_WIDGET_ID, VITE_MSG91_WIDGET_TOKEN) not set in client .env.'
      );
    }

    const configuration = {
      widgetId: widgetId || '',
      tokenAuth: tokenAuth || '',
      exposeMethods: true,
      success: (data) => {
        // Global success handler
      },
      failure: (error) => {
        console.warn('MSG91 Widget event error:', error);
      },
    };

    window.configuration = configuration;

    // If initSendOTP is already available on window, configure directly
    if (typeof window.initSendOTP === 'function') {
      try {
        window.initSendOTP(configuration);
        resolve();
      } catch (err) {
        console.error('Error initializing MSG91 Widget:', err);
        reject(err);
      }
      return;
    }

    // Check if script tag already exists
    const existingScript = document.querySelector('script[src*="otp-provider.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        if (typeof window.initSendOTP === 'function') {
          window.initSendOTP(configuration);
        }
        resolve();
      });
      existingScript.addEventListener('error', (err) => {
        reject(new Error('Failed to load MSG91 OTP Widget script'));
      });
      return;
    }

    // Dynamically inject MSG91 Web SDK script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://control.msg91.com/app/assets/otp-provider/otp-provider.js';
    script.async = true;

    script.onload = () => {
      if (typeof window.initSendOTP === 'function') {
        window.initSendOTP(configuration);
      }
      resolve();
    };

    script.onerror = () => {
      widgetInitPromise = null; // allow retry
      reject(new Error('Failed to load MSG91 OTP Widget script. Check network connection.'));
    };

    document.head.appendChild(script);
  });

  return widgetInitPromise;
};

/**
 * Sends OTP via MSG91 Widget custom UI API
 * @param {string} mobile
 * @returns {Promise<any>}
 */
export const sendWidgetOtp = async (mobile) => {
  const normalized = normalizeIndianMobile(mobile);
  if (!isValidIndianMobile(normalized)) {
    throw new Error('Please enter a valid 10-digit Indian mobile number');
  }

  await initMsg91Widget();

  if (typeof window.sendOtp !== 'function') {
    throw new Error('MSG91 OTP Widget is still loading. Please try again in a few seconds.');
  }

  const formattedMobile = formatMobileForMsg91(normalized);

  return new Promise((resolve, reject) => {
    try {
      window.sendOtp(
        formattedMobile,
        (response) => {
          resolve(response);
        },
        (error) => {
          const errMsg = parseMsg91Error(error);
          reject(new Error(errMsg));
        }
      );
    } catch (err) {
      reject(new Error(err.message || 'Failed to dispatch OTP request'));
    }
  });
};

/**
 * Verifies OTP via MSG91 Widget custom UI API and extracts Access Token
 * @param {string} otpCode
 * @returns {Promise<{ success: boolean, accessToken: string, raw: any }>}
 */
export const verifyWidgetOtp = async (otpCode) => {
  if (!otpCode || otpCode.toString().trim().length < 4) {
    throw new Error('Please enter a valid OTP code');
  }

  await initMsg91Widget();

  if (typeof window.verifyOtp !== 'function') {
    throw new Error('MSG91 OTP Widget is not ready. Please try again.');
  }

  const cleanedOtp = otpCode.toString().trim();

  return new Promise((resolve, reject) => {
    try {
      window.verifyOtp(
        cleanedOtp,
        (response) => {
          const token = extractAccessToken(response);
          if (!token) {
            // Check if response contains message or token string
            if (response && response.type === 'error') {
              return reject(new Error(parseMsg91Error(response)));
            }
          }
          resolve({
            success: true,
            accessToken: token || (typeof response === 'string' ? response : JSON.stringify(response)),
            raw: response,
          });
        },
        (error) => {
          const errMsg = parseMsg91Error(error) || 'Invalid or expired OTP. Please try again.';
          reject(new Error(errMsg));
        }
      );
    } catch (err) {
      reject(new Error(err.message || 'OTP verification failed'));
    }
  });
};

/**
 * Retries/Resends OTP via MSG91 Widget
 * @param {string} mobile
 * @returns {Promise<any>}
 */
export const retryWidgetOtp = async (mobile) => {
  await initMsg91Widget();

  if (typeof window.retryOtp === 'function') {
    return new Promise((resolve, reject) => {
      try {
        window.retryOtp(
          '11', // SMS Channel
          (response) => resolve(response),
          (error) => {
            // Fallback to sendWidgetOtp if retryOtp channel fails
            sendWidgetOtp(mobile).then(resolve).catch(reject);
          }
        );
      } catch {
        sendWidgetOtp(mobile).then(resolve).catch(reject);
      }
    });
  }

  return sendWidgetOtp(mobile);
};

export default {
  initMsg91Widget,
  sendWidgetOtp,
  verifyWidgetOtp,
  retryWidgetOtp,
  normalizeIndianMobile,
  isValidIndianMobile,
  formatMobileForMsg91,
};
