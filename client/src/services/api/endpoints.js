/**
 * API Endpoints Catalog
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    ADMIN_LOGIN: '/admin/login',
    ADMIN_PROFILE: '/admin/profile',
    ADMIN_UPDATE_PROFILE: (id) => `/admin/updateAdminProfile/${id}`,
    ADMIN_CHANGE_PASSWORD: (id) => `/admin/changepassword/${id}`,
    ADMIN_FORGOT_PASSWORD: '/admin/forgot-password',
    ADMIN_RESET_PASSWORD: '/admin/reset-password',

    PATIENT_LOGIN: '/patient/login',
    PATIENT_REGISTER: '/patient/register',
    PATIENT_PROFILE: '/patient/profile',
    PATIENT_UPDATE_PROFILE: (id) => `/patient/updatePatientProfile/${id}`,
    PATIENT_CHANGE_PASSWORD: (id) => `/patient/changepassword/${id}`,
    PATIENT_FORGOT_PASSWORD: '/patient/forgot-password',
    PATIENT_RESET_PASSWORD: '/patient/reset-password',

    SEND_OTP: '/otp/send',
    VERIFY_OTP: '/otp/verify',
  },

  // Admin
  ADMIN: {
    DASHBOARD_STATS: '/admin/dashboard-stats',
    PATIENTS_LIST: '/patient',
    ACCEPT_APPOINTMENT: (id) => `/admin/appointments/${id}/accept`,
    COMPLETE_APPOINTMENT: (id) => `/admin/appointments/${id}/complete`,
    MARK_CASH_PAID: (id) => `/admin/appointments/${id}/mark-cash-paid`,
  },

  // Appointments
  APPOINTMENTS: {
    ALL: '/appointments/all',
    MY_APPOINTMENTS: '/appointments/my-appointments',
    BOOK: '/appointments/book',
    UPDATE_STATUS: (id) => `/appointments/${id}/status`,
  },

  // Inquiries
  INQUIRIES: {
    LIST: '/inquiries',
    CREATE: '/inquiries',
    UPDATE_STATUS: (id) => `/inquiries/${id}/status`,
    DELETE: (id) => `/inquiries/${id}`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    READ_ALL: '/notifications/read-all',
  },

  // Settings
  SETTINGS: {
    GET: '/settings',
    UPDATE: '/settings',
  },

  // Payments
  PAYMENT: {
    CREATE_ORDER: '/payment/create-order',
    VERIFY: '/payment/verify',
  },
};

export default API_ENDPOINTS;
