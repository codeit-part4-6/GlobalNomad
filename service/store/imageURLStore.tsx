import {create} from 'zustand';

interface ImageUrlStore {
  profileImageUrl: string | null;
  setProfileImageUrl: (url: string | null) => void;
}

export const useImageUrlStore = create<ImageUrlStore>(set => {
  let storedImageUrl: string | null = null;
  if (typeof window !== 'undefined') {
    try {
      storedImageUrl = sessionStorage.getItem('profileImageUrl') || null;
    } catch (error) {
      console.error('Failed to parse sessionStorage data:', error);
    }
  }

  return {
    profileImageUrl: storedImageUrl,
    setProfileImageUrl: profileImageUrl => {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('profileImageUrl', profileImageUrl ?? '');
      }
      set({profileImageUrl});
    },
  };
});
