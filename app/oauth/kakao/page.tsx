'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { postOAuth } from '@/service/api/oauth/postOAuth.api';

export default function KakaoOAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasCodeBeenProcessed = useRef(false);
  
  const oauthMutation = useMutation({
    mutationFn: postOAuth,
    onSuccess: (data) => {
      console.log(data)
      sessionStorage.setItem('accessToken', data.accessToken);
      sessionStorage.setItem('refreshToken', data.refreshToken);
      sessionStorage.setItem('userInfo', JSON.stringify(data.user));
      router.push('/');
    },
    onError: (error) => {
      console.error('OAuth 로그인 실패', error);
      router.push('/signin');
    }
  });

  useEffect(() => {
    const code = searchParams.get('code');
    if (code && !hasCodeBeenProcessed.current) {
      hasCodeBeenProcessed.current = true;
      oauthMutation.mutate(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return <div>카카오 로그인 처리 중...</div>;
}