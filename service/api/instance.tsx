import axios, { InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/service/store/authStore';
import { postTokens } from '@/service/api/auth/postTokens.api';

const INSTANCE_URL = axios.create({
  baseURL: 'https://sp-globalnomad-api.vercel.app/11-6',
});

INSTANCE_URL.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();

    if (config.headers['exclude-access-token']) {
      delete config.headers['exclude-access-token'];
      return config;
    }

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

INSTANCE_URL.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { refreshToken, setLogin, setLogout, user } = useAuthStore.getState();

      if (refreshToken) {
        try {
          console.log('Refreshing access token...');
          const refreshedData = await postTokens(refreshToken);

          setLogin(refreshedData.accessToken, refreshedData.refreshToken, user);

          originalRequest.headers['Authorization'] = `Bearer ${refreshedData.accessToken}`;
          return INSTANCE_URL(originalRequest);
        } catch (refreshError) {
          console.log('Refresh token expired or invalid:', refreshError);
          setLogout();
          window.location.href = '/signin';
        }
      } else {
        console.warn('⚠ No refresh token found. Logging out...');
        setLogout();
        window.location.href = '/signin';
      }
    }

    return Promise.reject(error);
  }
);

export default INSTANCE_URL;
