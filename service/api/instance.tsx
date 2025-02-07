import axios, { InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/service/store/authStore'; // zustand 스토어
import { postTokens } from '@/service/api/auth/postTokens.api';

const INSTANCE_URL = axios.create({
  baseURL: 'https://sp-globalnomad-api.vercel.app/11-6',
});

// 요청
INSTANCE_URL.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();

    if(config.headers['exclude-access-token']) {
      delete config.headers['exclude-access-token'];
      return config;
    }

    // accessToken이 있으면 요청 헤더 추가
    if(accessToken) config.headers['Authorization'] = `Bearer ${accessToken}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답(갱신 처리)
INSTANCE_URL.interceptors.response.use(
  // 성공 시 응답 반환
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if ( error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { refreshToken, setLogin, setLogout, user } = useAuthStore.getState();

      if (refreshToken) {
        try {
          // postTokens 호출하여 토큰 갱신
          const refreshedData = await postTokens(refreshToken);

          // zustand 스토어에 새 토큰 업데이트
          setLogin(
            refreshedData.accessToken,
            refreshedData.refreshToken,
            user
          );

          // 갱신된 accessToken으로 요청 헤더 업데이트
          originalRequest.headers['Authorization'] = `Bearer ${refreshedData.accessToken}`;

          // 원래 요청 재시도
          return INSTANCE_URL(originalRequest);
        } catch (refreshError) {
          console.error('토큰 갱신 실패:', refreshError);

          // 토큰 갱신 실패 시 로그아웃 처리
          setLogout();
          window.location.href = '/signin';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default INSTANCE_URL;