const mongoose = require('mongoose');
const Patient = require('./src/models/Patient');
const patientService = require('./src/services/patientService');
const otpStore = require('./src/utils/otpStore');

async function test() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/drkavita');
    
    console.log('Connected to DB');
    
    const mobile = '8888888888';
    
    // Register
    try {
      await patientService.registerPatient({
        name: 'Direct Test',
        mobile,
        password: 'oldPassword123'
      });
      console.log('Registered successfully');
    } catch (e) {
      if (e.message.includes('already exists')) {
        console.log('Already registered');
      } else {
        throw e;
      }
    }
    
    // Forgot password
    await patientService.forgotPassword(mobile);
    const stored = otpStore.get(mobile);
    console.log(`OTP generated: ${stored.otp}`);
    
    // Reset password
    await patientService.resetPassword(mobile, stored.otp, 'newPassword456');
    console.log('Password reset successfully');
    
    // Login with new password
    const loginRes = await patientService.loginPatient(mobile, 'newPassword456');
    console.log('Login successful with new password! Token:', loginRes.token);
    
  } catch (err) {
    console.error('Test Failed:', err.message);
  } finally {
    mongoose.disconnect();
  }
}

test();
