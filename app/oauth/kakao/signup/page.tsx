'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { postOAuthSignup } from '@/service/api/oauth/postOAuthSignup.api';
import { useAuthStore } from '@/service/store/authStore';
import { AxiosError } from 'axios';

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (token: string) => {
    const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI2 || '';

    try {
      setIsLoading(true);

      const signupResponse = await postOAuthSignup({
        nickname: `User`,
        redirectUri,
        token,
      });

      console.log('회원가입 성공:', signupResponse);
      saveSession(signupResponse.accessToken, signupResponse.refreshToken, signupResponse.user);

      router.push('/signin');
    } catch (error) {
      const axiosError = error as AxiosError; 
      console.log('회원가입 실패:', axiosError?.response?.data);
      alert('이미 가입된 사용자입니다.')
      setError('이미 가입된 사용자입니다.');
      router.push('/signin');
    } finally {
      setIsLoading(false);
    }
  };

  const saveSession = (accessToken: string, refreshToken: string, user: { id: number; email: string; nickname: string; profileImageUrl: string | null; createdAt: string; updatedAt: string; }) => {
    const { setLogin } = useAuthStore.getState();
    setLogin(accessToken, refreshToken, user);

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  useEffect(() => {
    const token = searchParams.get('code');
    if (!token) {
      setError('잘못된 접근입니다.');
      router.push('/signin');
      return;
    }

    handleSignup(token);
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      {isLoading ? (
        <p className="text-gray-700 text-lg">회원가입 중...</p>
      ) : error ? (
        <div className="text-red-500 text-lg text-center">
          <p>{error}</p>
          <button onClick={() => router.push('/signin')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
            다시 로그인하기
          </button>
        </div>
      ) : (
        <p className="text-gray-700 text-lg">회원가입 준비 완료</p>
      )}
    </div>
  );
}
