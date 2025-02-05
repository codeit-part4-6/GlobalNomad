'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { postOAuth } from '@/service/api/oauth/postOAuth.api';

export default function KakaoCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) return;

    const fetchKakaoToken = async () => {
      try {
        const response = await postOAuth(code); // 인가 코드 서버 전송
        const { accessToken, refreshToken, user } = response.data;

        // 로그인 상태 저장
        sessionStorage.setItem('accessToken', accessToken);
        sessionStorage.setItem('refreshToken', refreshToken);
        sessionStorage.setItem('userInfo', JSON.stringify(user));

        router.push('/'); // 로그인 성공 후 홈으로 이동
      } catch (error) {
        console.error('카카오 로그인 실패:', error);
        router.push('/signin'); // 로그인 실패 시 다시 로그인 페이지로
      }
    };

    fetchKakaoToken();
  }, [searchParams, router]);

  return <div>카카오 로그인 처리 중...</div>;
}
