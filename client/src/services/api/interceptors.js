import { STORAGE_KEYS } from '../../utils/constants';

/**
 * Request Interceptor to attach Bearer Authorization token
 */
export const requestAuthInterceptor = (config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // If payload is FormData, remove static application/json header so boundary is auto-generated
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
};

export const requestErrorInterceptor = (error) => {
  return Promise.reject(error);
};

/**
 * Response Interceptor for centralized status code and error handling
 */
export const responseSuccessInterceptor = (response) => {
  return response;
};

export const responseErrorInterceptor = (error) => {
  if (error.response && error.response.status === 401) {
    const role = localStorage.getItem(STORAGE_KEYS.ROLE);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.ROLE);

    // Only redirect if not already on a login page
    const currentPath = window.location.pathname;
    if (!currentPath.includes('/login')) {
      if (role === 'admin' || currentPath.startsWith('/admin')) {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/patient/login';
      }
    }
  }

  // Format normalized error message
  const normalizedMessage =
    error.response?.data?.message ||
    error.message ||
    'An unexpected error occurred. Please try again.';

  return Promise.reject({
    ...error,
    message: normalizedMessage,
    status: error.response?.status,
    data: error.response?.data,
  });
};
