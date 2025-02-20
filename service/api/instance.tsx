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

// 토큰 갱신 진행 중 여부를 추적
let isRefreshing = false;

INSTANCE_URL.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshing) {
      originalRequest._retry = true;
      const { refreshToken, setLogin, setLogout, user } = useAuthStore.getState();

      if (refreshToken) {
        try {
          isRefreshing = true;
          console.log('Refreshing access token...');
          const refreshedData = await postTokens(refreshToken);

          if (!refreshedData || !refreshedData.accessToken) {
            throw new Error('Failed to refresh token');
          }

          setLogin(refreshedData.accessToken, refreshedData.refreshToken, user);
          originalRequest.headers['Authorization'] = `Bearer ${refreshedData.accessToken}`;
          isRefreshing = false;
          return INSTANCE_URL(originalRequest);
        } catch (refreshError) {
          console.log('Refresh token expired or invalid:', refreshError);
          isRefreshing = false;
          setLogout();
          window.location.href = '/signin';
          return Promise.reject(refreshError);
        }
      }
      
      console.warn('⚠ No refresh token found. Logging out...');
      setLogout();
      window.location.href = '/signin';
      return Promise.reject(new Error('No refresh token'));
    }

    return Promise.reject(error);
  }
);

export default INSTANCE_URL;
