/**
 * Centralized Environment Configuration
 */
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    const cleanUrl = envUrl.trim().replace(/\/+$/, '');
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  }
  // Production fallback to live Render backend
  if (import.meta.env.PROD) {
    return 'https://dr-kavita-ayurveda-server.onrender.com/api';
  }
  return 'http://localhost:5000/api';
};

export const ENV = {
  API_URL: getApiBaseUrl(),
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Dr. Kavita Ayurveda',
  IS_PROD: import.meta.env.PROD,
  IS_DEV: import.meta.env.DEV,
};

export default ENV;
