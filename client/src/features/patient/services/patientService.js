import apiClient from '../../../services/api/client';
import { API_ENDPOINTS } from '../../../services/api/endpoints';

export const patientService = {
  // Get Appointments
  getMyAppointments: async () => {
    const { data } = await apiClient.get(API_ENDPOINTS.APPOINTMENTS.MY_APPOINTMENTS);
    return data.data || [];
  },

  getAppointmentHistory: async () => {
    const { data } = await apiClient.get(API_ENDPOINTS.APPOINTMENTS.HISTORY);
    return data.data || [];
  },

  // Book Appointment
  bookAppointment: async (formData) => {
    let payload = formData;

    if (!(formData instanceof FormData)) {
      payload = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
          payload.append(key, formData[key]);
        }
      });
    }

    // Omit explicit Content-Type header so Axios / browser automatically attaches multipart boundary
    const { data } = await apiClient.post(API_ENDPOINTS.APPOINTMENTS.BOOK, payload);
    return data;
  },

  // Payments
  createPaymentOrder: async (appointmentId, amount) => {
    const { data } = await apiClient.post(API_ENDPOINTS.PAYMENT.CREATE_ORDER, {
      appointmentId,
      amount,
    });
    return data;
  },

  verifyPayment: async (paymentDetails) => {
    const { data } = await apiClient.post(API_ENDPOINTS.PAYMENT.VERIFY, paymentDetails);
    return data;
  },
};

export default patientService;
