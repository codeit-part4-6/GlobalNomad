'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { postOAuth } from '@/service/api/oauth/postOAuth.api';
import { postOAuthSignin } from '@/service/api/oauth/postOAuthSignin.api';
import { postOAuthSignup } from '@/service/api/oauth/postOAuthSignup.api';
import { useAuthStore } from '@/service/store/authStore';
import { AxiosError } from 'axios';

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);

  const oauthMutation = useMutation({
    mutationFn: postOAuth,
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
          if (error instanceof AxiosError) {
            if (error.response?.status === 404) {
              const signupResponse = await postOAuthSignup({
                nickname: '기본 닉네임',
                redirectUri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI || '',
                token: token,
              });

              console.log('회원가입 성공:', signupResponse);
              const { setLogin } = useAuthStore.getState();
              setLogin(
                signupResponse.accessToken,
                signupResponse.refreshToken,
                signupResponse.user
              );

              router.push('/');
            } else {
              console.error('로그인 에러:', error);
              router.push('/signin');
            }
          } else {
            console.error('알 수 없는 오류 발생:', error);
            router.push('/signin');
          }
        }
      } else {
        console.error('URL에서 토큰을 찾을 수 없음');
        router.push('/signin');
      }
    },
    onError: (error: AxiosError) => {
      console.error('OAuth 로그인 실패', error);
      router.push('/signin');
    },
  });

  useEffect(() => {
    const token = searchParams.get('code');
    if (token && !isProcessing) {
      setIsProcessing(true);
      oauthMutation.mutate();
    }
  }, [searchParams, oauthMutation, isProcessing]);

  return <div>카카오 로그인 처리 중...</div>;
}