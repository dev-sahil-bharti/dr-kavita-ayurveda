const { loginPatientSchema } = require('./src/schemas/patientSchema');

try {
  loginPatientSchema.parse({
    body: {
      email: '9876543210',
      password: 'newPassword123'
    }
  });
  console.log('Valid!');
} catch (e) {
  console.log('Invalid:', e.errors);
}
