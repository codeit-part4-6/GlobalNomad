import { create } from 'zustand';
import Cookies from 'js-cookie';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: {
    id: number;
    email: string;
    nickname: string;
    profileImageUrl: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  setLogin: (accessToken: string, refreshToken: string, user: AuthState['user']) => void;
  setLogout: () => void;
  updateNickname: (nickname: string) => void;
  updateProfileImageUrl: (profileImageUrl: string | null) => void;
}

export const useAuthStore = create<AuthState>(set => {
  let storedUser = null;

  if (typeof window !== 'undefined') {
    try {
      storedUser = sessionStorage.getItem('userInfo');
      storedUser = storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('sessionStorage data 파싱 실패:', error);
    }
  }

  return {
    accessToken: storedAccessToken,
    user: storedUser,
    setLogin: (accessToken, refreshToken, user) => {
      if (typeof window !== 'undefined') {
        Cookies.set('refreshToken', refreshToken, { secure: true, sameSite: 'strict' });
        sessionStorage.setItem('userInfo', JSON.stringify(user));
      }
      set({accessToken, user});
    },
    setLogout: () => {
      if (typeof window !== 'undefined') {
        Cookies.remove('refreshToken');
        sessionStorage.removeItem('userInfo');
      }
      set({accessToken: null, user: null});
    },
    updateNickname: nickname =>
      set(state => {
        if (!state.user) return {};
        const updatedUser = {...state.user, nickname};
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('userInfo', JSON.stringify(updatedUser));
        }
        return {user: updatedUser};
      }),
    updateProfileImageUrl: profileImageUrl =>
      set(state => {
        if (!state.user) return {};
        const updatedUser = {...state.user, profileImageUrl};
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('userInfo', JSON.stringify(updatedUser));
        }
        return {user: updatedUser};
      }),
  };
});
