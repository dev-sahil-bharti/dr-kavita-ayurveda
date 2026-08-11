// Global in-memory store for OTPs
// Note: For a multi-instance production environment, use Redis or a Mongoose model with TTL
const otpStore = new Map();

module.exports = otpStore;
