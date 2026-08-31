import apiClient from '../../../services/api/client';
import { API_ENDPOINTS } from '../../../services/api/endpoints';

export const publicService = {
  submitInquiry: async (inquiryData) => {
    const { data } = await apiClient.post(API_ENDPOINTS.INQUIRIES.CREATE, inquiryData);
    return data;
  },
};

export default publicService;
