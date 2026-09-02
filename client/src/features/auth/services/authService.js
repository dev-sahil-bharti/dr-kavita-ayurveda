import apiClient from '../../../services/api/client';
import { API_ENDPOINTS } from '../../../services/api/endpoints';
import {
  sendWidgetOtp,
  verifyWidgetOtp,
  retryWidgetOtp,
} from '../../../services/msg91/msg91Widget';

export const authService = {
  // Admin Login
  adminLogin: async (email, password) => {
    const { data } = await apiClient.post(API_ENDPOINTS.AUTH.ADMIN_LOGIN, { email, password });
    return data;
  },

  // Patient Login
  patientLogin: async (emailOrMobile, password) => {
    const { data } = await apiClient.post(API_ENDPOINTS.AUTH.PATIENT_LOGIN, {
      email: emailOrMobile,
      password,
    });
    return data;
  },

  // Patient Register
  patientRegister: async (formData) => {
    const { data } = await apiClient.post(API_ENDPOINTS.AUTH.PATIENT_REGISTER, formData);
    return data;
  },

  // OTP via MSG91 Widget
  sendOtp: async (mobile) => {
    return await sendWidgetOtp(mobile);
  },

  verifyOtp: async (mobile, otp) => {
    return await verifyWidgetOtp(otp);
  },

  retryOtp: async (mobile) => {
    return await retryWidgetOtp(mobile);
  },

  // Validate MSG91 Access Token with Backend
  validateWidgetToken: async (accessToken, mobile) => {
    const { data } = await apiClient.post(API_ENDPOINTS.AUTH.VALIDATE_WIDGET_TOKEN, {
      accessToken,
      mobile,
    });
    return data;
  },

  // Forgot Password
  forgotPassword: async (userType, contact) => {
    const endpoint =
      userType === 'admin'
        ? API_ENDPOINTS.AUTH.ADMIN_FORGOT_PASSWORD
        : API_ENDPOINTS.AUTH.PATIENT_FORGOT_PASSWORD;
    const { data } = await apiClient.post(endpoint, { contact });
    return data;
  },

  // Reset Password
  resetPassword: async (userType, { contact, otp, newPassword }) => {
    const endpoint =
      userType === 'admin'
        ? API_ENDPOINTS.AUTH.ADMIN_RESET_PASSWORD
        : API_ENDPOINTS.AUTH.PATIENT_RESET_PASSWORD;
    const { data } = await apiClient.post(endpoint, { contact, otp, newPassword });
    return data;
  },

  // Profiles
  getAdminProfile: async () => {
    const { data } = await apiClient.get(API_ENDPOINTS.AUTH.ADMIN_PROFILE);
    return data;
  },

  getPatientProfile: async () => {
    const { data } = await apiClient.get(API_ENDPOINTS.AUTH.PATIENT_PROFILE);
    return data;
  },

  updateAdminProfile: async (id, payload) => {
    const { data } = await apiClient.put(API_ENDPOINTS.AUTH.ADMIN_UPDATE_PROFILE(id), payload);
    return data;
  },

  updatePatientProfile: async (id, payload) => {
    const { data } = await apiClient.put(API_ENDPOINTS.AUTH.PATIENT_UPDATE_PROFILE(id), payload);
    return data;
  },

  changeAdminPassword: async (id, payload) => {
    const { data } = await apiClient.put(API_ENDPOINTS.AUTH.ADMIN_CHANGE_PASSWORD(id), payload);
    return data;
  },

  changePatientPassword: async (id, payload) => {
    const { data } = await apiClient.put(API_ENDPOINTS.AUTH.PATIENT_CHANGE_PASSWORD(id), payload);
    return data;
  },
};

export default authService;
