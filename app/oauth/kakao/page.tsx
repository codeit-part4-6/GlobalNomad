'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { postOAuth } from '@/service/api/oauth/postOAuth.api';

export default function KakaoOAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const oauthMutation = useMutation({
    mutationFn: postOAuth,
    onSuccess: (data) => {
      // 세션 스토리지에 토큰 및 사용자 정보 저장
      sessionStorage.setItem('accessToken', data.accessToken);
      sessionStorage.setItem('refreshToken', data.refreshToken);
      sessionStorage.setItem('userInfo', JSON.stringify(data.user));

      // 홈페이지로 리다이렉트
      router.push('/');
    },
    onError: (error) => {
      console.error('OAuth 로그인 실패', error);
      router.push('/signin');
    }
  });

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      oauthMutation.mutate(code);
    }
  }, [searchParams]);

  return <div>카카오 로그인 처리 중...</div>;
}