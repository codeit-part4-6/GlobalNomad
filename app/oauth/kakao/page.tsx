'use client';

import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { postOAuth } from '@/service/api/oauth/postOAuth.api';
import { postOAuthSignin } from '@/service/api/oauth/postOAuthSignin.api';
import { useAuthStore } from '@/service/store/authStore';
import { AxiosError } from 'axios';

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const processedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  const oauthMutation = useMutation({
    mutationFn: postOAuth,
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: async (oauthData) => {
      const token = searchParams.get('code');
      console.log("받은 인가 토큰", token);

      if (token) {
        sessionStorage.setItem('userInfo', JSON.stringify(oauthData));
        try {
          const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI || '';

          const signinResponse = await postOAuthSignin({
            redirectUri,
            token: token,
          });

          console.log('로그인 성공:', signinResponse);
          const { setLogin } = useAuthStore.getState();
          setLogin(
            signinResponse.accessToken,
            signinResponse.refreshToken,
            signinResponse.user
          );

          router.push('/');
        } catch (error: unknown) {
          if (error instanceof AxiosError && (error.response?.status === 403 || error.response?.status === 404)) {
            console.log('회원가입이 필요합니다. /signup 페이지로 이동합니다.');
            router.push(`/signup?code=${token}`);
          } else {
            console.log('로그인 에러:', error);
            router.push('/signin');
          }
        }
      } else {
        console.log('URL에서 토큰을 찾을 수 없음');
        router.push('/signin');
      }
    },
    onError: (error: AxiosError) => {
      console.log('OAuth 로그인 실패', error);
      router.push('/signin');
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  useEffect(() => {
    const token = searchParams.get('code');
    if (token && !processedRef.current) {
      processedRef.current = true;
      oauthMutation.mutate();
    }
  }, [searchParams, oauthMutation]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      {isLoading ? (
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-700 text-lg font-semibold">
            카카오 로그인 처리 중...
          </p>
        </div>
      ) : (
        <p className="text-gray-700 text-lg">카카오 로그인 처리 완료</p>
      )}
    </div>
  );
}
