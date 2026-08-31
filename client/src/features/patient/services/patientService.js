import apiClient from '../../../services/api/client';
import { API_ENDPOINTS } from '../../../services/api/endpoints';

export const patientService = {
  // Get Appointments
  getMyAppointments: async () => {
    const { data } = await apiClient.get(API_ENDPOINTS.APPOINTMENTS.MY_APPOINTMENTS);
    return data.data || [];
  },

  // Book Appointment
  bookAppointment: async (formData) => {
    // Check if formData is already a FormData instance or an object
    let payload = formData;
    let headers = {};

    if (!(formData instanceof FormData)) {
      payload = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          payload.append(key, formData[key]);
        }
      });
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      headers['Content-Type'] = 'multipart/form-data';
    }

    const { data } = await apiClient.post(API_ENDPOINTS.APPOINTMENTS.BOOK, payload, { headers });
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
