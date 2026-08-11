const axios = require('axios');

async function test() {
  try {
    const mobile = '9999999999';
    // 1. Register
    console.log('Registering...');
    try {
      await axios.post('http://localhost:5000/api/patient/register', {
        name: 'Test Patient',
        mobile,
        password: 'password123'
      });
    } catch (e) {
      if (e.response && e.response.status === 400) {
        console.log('Already registered.');
      } else {
        throw e;
      }
    }

    // 2. Forgot password
    console.log('Requesting OTP...');
    const res1 = await axios.post('http://localhost:5000/api/patient/forgot-password', {
      contact: mobile
    });
    console.log(res1.data);
    
    // We need the OTP, but it's not returned in the API, it's logged to console by the server.
    // So this test script can't proceed to step 3 automatically unless we expose OTP or read server logs.
    console.log('Please check the server console for the OTP and then call /reset-password manually.');

  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}

test();
