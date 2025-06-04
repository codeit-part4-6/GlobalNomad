import axios, { InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/service/store/authStore';
import { postTokens } from '@/service/api/auth/postTokens.api';
import Cookies from 'js-cookie';

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

INSTANCE_URL.interceptors.response.use((response) => response,
  async (error) => {
    const { refreshToken, setLogin, setLogout, user } = useAuthStore.getState();
    const refrshToken = Cookies.get('refreshToken');
      if (refreshToken) {
        try {
          const refreshedData = await postTokens(refreshToken);
          setLogin(refreshedData.accessToken, refreshedData.refreshToken, user);
          return INSTANCE_URL(originalRequest);
        } catch (e) {
          console.error('Refresh token 오류:', e);
          setLogout();
          window.location.href = '/signin';
          return Promise.reject(refreshError);
        } else {
          console.error('refresh token 찾을 수 없음');
          setLogout();
          window.location.href = '/signin';   
        }
      }
    }
    return Promise.reject(error);
  }
);

export default INSTANCE_URL;
