import { create } from 'zustand';

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
  setLogin: (
    accessToken: string,
    refreshToken: string,
    user: AuthState['user']
  ) => void;
  setLogout: () => void;
  updateNickname: (nickname: string) => void;
}

// 상태가 페이지 새로고침 후에도 유지되도록 sessionStorage에서 상태를 로드
export const useAuthStore = create<AuthState>((set) => {
  let storedUser = null;
  let storedAccessToken = null;
  let storedRefreshToken = null;

  if (typeof window !== 'undefined') {
    try {
      storedUser = sessionStorage.getItem('userInfo');
      storedUser = storedUser ? JSON.parse(storedUser) : null;
      storedAccessToken = sessionStorage.getItem('accessToken') || null;
      storedRefreshToken = sessionStorage.getItem('refreshToken') || null;
    } catch (error) {
      console.error('Failed to parse sessionStorage data:', error);
    }
  }

  return {
    accessToken: storedAccessToken,
    refreshToken: storedRefreshToken,
    user: storedUser,
    setLogin: (accessToken, refreshToken, user) => {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('accessToken', accessToken);
        sessionStorage.setItem('refreshToken', refreshToken);
        sessionStorage.setItem('userInfo', JSON.stringify(user));
      }
      set({ accessToken, refreshToken, user });
    },
    setLogout: () => {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('userInfo');
      }
      set({ accessToken: null, refreshToken: null, user: null });
    },
    updateNickname: (nickname) =>
      set((state) => {
        if (!state.user) return {};
        const updatedUser = { ...state.user, nickname };
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('userInfo', JSON.stringify(updatedUser));
        }
        return { user: updatedUser };
      }),
  };
});
