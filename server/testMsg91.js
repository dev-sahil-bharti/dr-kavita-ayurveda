const https = require('https');

const authkey = '558491AHzuhRB5Y6a76c9c6P1';
const mobile = '919569846406';
const otp = '123456';

const url = `https://control.msg91.com/api/v5/otp?authkey=${authkey}&mobile=${mobile}&otp=${otp}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log("Status Code:", res.statusCode);
    console.log("Raw Response from MSG91:", data);
  });
}).on('error', err => {
  console.log("Error:", err.message);
});
