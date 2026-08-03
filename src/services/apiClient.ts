import axios from 'axios';
import { Platform } from 'react-native';

const getDefaultBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // Android emulator requires 10.0.2.2 to access host machine localhost
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }
  return 'http://localhost:5000/api';
};

export const apiClient = axios.create({
  baseURL: getDefaultBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      'An unexpected network error occurred';
    console.warn(`[API Client Error] ${error.config?.url}:`, message);
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
