const jwt = require('jsonwebtoken');

const generateToken = (id, role = 'patient') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret_key', {
    expiresIn: '1d',
  });
};

module.exports = generateToken;
