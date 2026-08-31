import axios from 'axios';
import { ENV } from '../../config/env';
import {
  requestAuthInterceptor,
  requestErrorInterceptor,
  responseSuccessInterceptor,
  responseErrorInterceptor,
} from './interceptors';

export const apiClient = axios.create({
  baseURL: ENV.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(requestAuthInterceptor, requestErrorInterceptor);
apiClient.interceptors.response.use(responseSuccessInterceptor, responseErrorInterceptor);

export default apiClient;
