import axios, { InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/service/store/authStore';
import { postTokens } from '@/service/api/auth/postTokens.api';

const INSTANCE_URL = axios.create({
  baseURL: 'https://sp-globalnomad-api.vercel.app/11-6',
});

INSTANCE_URL.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;

INSTANCE_URL.interceptors.response.use((response) => response,
  async (error) => {
    const { refreshToken, setLogin, setLogout, user } = useAuthStore.getState();
      if (refreshToken) {
        try {
          isRefreshing = true;
          const refreshedData = await postTokens(refreshToken);
          setLogin(refreshedData.accessToken, refreshedData.refreshToken, user);
          isRefreshing = false;
          return INSTANCE_URL(originalRequest);
        } catch (e) {
          console.error('Refresh token 오류:', e);
          isRefreshing = false;
          setLogout();
          window.location.href = '/signin';
          return Promise.reject(refreshError);
        }
      }
      console.error('refresh token 찾을 수 없음');
      setLogout();
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default INSTANCE_URL;
