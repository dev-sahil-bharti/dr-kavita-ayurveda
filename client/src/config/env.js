/**
 * Centralized Environment Configuration
 */
export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Dr. Kavita Ayurveda',
  IS_PROD: import.meta.env.PROD,
  IS_DEV: import.meta.env.DEV,
};

export default ENV;
