/**
 * Validation Utilities
 */

export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isValidIndianMobile = (mobile) => {
  if (!mobile) return false;
  const digits = String(mobile).replace(/\D/g, '');
  return digits.length === 10 && /^[6-9]/.test(digits);
};

export const isValidPassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};
