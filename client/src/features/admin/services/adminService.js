import apiClient from '../../../services/api/client';
import { API_ENDPOINTS } from '../../../services/api/endpoints';

export const adminService = {
  // Dashboard Stats
  getDashboardStats: async () => {
    const { data } = await apiClient.get(API_ENDPOINTS.ADMIN.DASHBOARD_STATS);
    return data.data;
  },

  // Patients
  getPatients: async () => {
    const { data } = await apiClient.get(API_ENDPOINTS.ADMIN.PATIENTS_LIST);
    return data;
  },

  updatePatient: async (id, updatedData) => {
    const { data } = await apiClient.put(
      API_ENDPOINTS.AUTH.PATIENT_UPDATE_PROFILE(id),
      updatedData
    );
    return data;
  },

  // Appointments
  getAllAppointments: async () => {
    const { data } = await apiClient.get(API_ENDPOINTS.APPOINTMENTS.ALL);
    return data.data;
  },

  acceptAppointment: async (id) => {
    const { data } = await apiClient.patch(API_ENDPOINTS.ADMIN.ACCEPT_APPOINTMENT(id));
    return data;
  },

  updateAppointmentStatus: async (id, status, extraFields = {}) => {
    const { data } = await apiClient.put(API_ENDPOINTS.APPOINTMENTS.UPDATE_STATUS(id), {
      status,
      ...extraFields,
    });
    return data;
  },

  completeAppointment: async (id, completeData) => {
    const { data } = await apiClient.patch(
      API_ENDPOINTS.ADMIN.COMPLETE_APPOINTMENT(id),
      completeData
    );
    return data;
  },

  markCashPaid: async (id, amount) => {
    const { data } = await apiClient.patch(
      API_ENDPOINTS.ADMIN.MARK_CASH_PAID(id),
      { amount }
    );
    return data;
  },

  // Inquiries
  getInquiries: async () => {
    const { data } = await apiClient.get(API_ENDPOINTS.INQUIRIES.LIST);
    return data.data || [];
  },

  resolveInquiry: async (id) => {
    const { data } = await apiClient.patch(API_ENDPOINTS.INQUIRIES.UPDATE_STATUS(id), {
      status: 'resolved',
    });
    return data;
  },

  deleteInquiry: async (id) => {
    const { data } = await apiClient.delete(API_ENDPOINTS.INQUIRIES.DELETE(id));
    return data;
  },

  // Notifications
  getNotifications: async () => {
    const { data } = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.LIST);
    return data;
  },

  markAllNotificationsRead: async () => {
    const { data } = await apiClient.put(API_ENDPOINTS.NOTIFICATIONS.READ_ALL);
    return data;
  },

  // Settings
  getSettings: async () => {
    const { data } = await apiClient.get(API_ENDPOINTS.SETTINGS.GET);
    return data.data;
  },

  updateSettings: async (settingsData) => {
    const { data } = await apiClient.put(API_ENDPOINTS.SETTINGS.UPDATE, settingsData);
    return data;
  },
};

export default adminService;
