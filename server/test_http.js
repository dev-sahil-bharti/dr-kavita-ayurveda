const axios = require('axios');

async function test() {
  const mobile = '6666666666';
  try {
    // 1. Register
    try {
      await axios.post('http://localhost:5000/api/patient/register', {
        name: 'HTTP Test 2',
        mobile,
        password: 'oldPassword'
      });
      console.log('Registered');
    } catch (e) {
      if (e.response && e.response.status === 400) console.log('Already registered');
      else throw e;
    }

    // 2. Forgot Password
    await axios.post('http://localhost:5000/api/patient/forgot-password', {
      contact: mobile
    });
    console.log('OTP Requested');

    // We can't read OTP from console, so let's hack into DB for testing...
    // Wait, let's just make a temporary route to get OTPs.
    
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}

test();
