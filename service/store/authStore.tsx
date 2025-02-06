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
  const storedAccessToken = sessionStorage.getItem('accessToken');
  const storedRefreshToken = sessionStorage.getItem('refreshToken');
  const storedUser = sessionStorage.getItem('userInfo');

  return {
    accessToken: storedAccessToken ? storedAccessToken : null,
    refreshToken: storedRefreshToken ? storedRefreshToken : null,
    user: storedUser ? JSON.parse(storedUser) : null,
    setLogin: (accessToken, refreshToken, user) => {
      // 상태를 zustand와 sessionStorage에 저장
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('refreshToken', refreshToken);
      sessionStorage.setItem('userInfo', JSON.stringify(user));

      set({
        accessToken,
        refreshToken,
        user,
      });
    },
    setLogout: () => {
      // 상태를 zustand와 sessionStorage에서 제거
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('userInfo');

      set({
        accessToken: null,
        refreshToken: null,
        user: null,
      });
    },
    updateNickname: (nickname) =>
      set((state) => {
        const updatedUser = state.user
          ? { ...state.user, nickname }
          : null;
        if (updatedUser) {
          sessionStorage.setItem('userInfo', JSON.stringify(updatedUser));
        }
        return { user: updatedUser };
      }),
  };
});
