'use client';

import { useEffect } from 'react';
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

  const oauthMutation = useMutation({
    mutationFn: postOAuth,
    onSuccess: async (oauthData) => {
      // code로 받지만 token으로 사용
      const token = searchParams.get('code');
      console.log("받은 인가 토큰", token);
      if (token) {
        sessionStorage.setItem('userInfo', JSON.stringify(oauthData));
        try {
          const redirectUri = 'http://localhost:3000/oauth/kakao';
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
                redirectUri: 'http://localhost:3000/oauth/kakao',
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
    const token = searchParams.get('code'); // code로 받지만 token으로 사용
    if (token) {
      oauthMutation.mutate(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return <div>카카오 로그인 처리 중...</div>;
}
