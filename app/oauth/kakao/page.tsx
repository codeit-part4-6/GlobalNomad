'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { postOAuth } from '@/service/api/oauth/postOAuth.api';
//import { postOAuthSignup } from '@/service/api/oauth/postOAuthSignup.api';
import { useAuthStore } from '@/service/store/authStore';

export default function KakaoOAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oauthMutation = useMutation({
    mutationFn: postOAuth,
    onSuccess: async (data) => {
      const code = searchParams.get('code');

      if (code) {
        sessionStorage.setItem('token', code);
        sessionStorage.setItem('userInfo', JSON.stringify(data));

        // zustand 상태 업데이트
        const { setLogin } = useAuthStore.getState();
        setLogin(code, code, data);

        router.push('/'); 
      } else {
        console.error('Code not found in URL');
        router.push('/signin');
      }
    },
    onError: (error) => {
      console.error('OAuth 로그인 실패', error);
      router.push('/signin');
    },
  });

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      oauthMutation.mutate(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return <div>카카오 로그인 처리 중...</div>;
}
