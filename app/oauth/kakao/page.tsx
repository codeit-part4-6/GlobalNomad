'use client';

import { useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/service/store/authStore';
import { postOAuthSignin } from '@/service/api/oauth/postOAuthSignin.api';
import { postOAuthSignup } from '@/service/api/oauth/postOAuthSignup.api';

export default function KakaoOAuthCallbackPage() {
 const router = useRouter();
 const searchParams = useSearchParams();
 const { setLogin } = useAuthStore();

 const signupMutation = useMutation({
   mutationFn: (data: { nickname: string; redirectUri: string; token: string }) => 
     postOAuthSignup(data),
   onSuccess: (data) => {
     localStorage.setItem('accessToken', data.accessToken);
     localStorage.setItem('refreshToken', data.refreshToken);
     localStorage.setItem('userInfo', JSON.stringify(data.user));
     router.push('/');
   }
 });

 const signinMutation = useMutation({
   mutationFn: (data: { redirectUri: string; token: string }) => 
     postOAuthSignin(data),
   onSuccess: (data) => {
     sessionStorage.setItem('accessToken', data.accessToken);
     sessionStorage.setItem('refreshToken', data.refreshToken);
     sessionStorage.setItem('userInfo', JSON.stringify(data.user));
     setLogin(data.accessToken, data.refreshToken, data.user);
     router.push('/');
   }
 });

 const handleOAuthProcess = useCallback(() => {
   const code = searchParams.get('code');
   const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI || '';

   if (code) {
     // 로컬스토리지 체크
     const storedUserInfo = localStorage.getItem('userInfo');
     
     if (storedUserInfo) {
       // 기존 회원 로그인
       signinMutation.mutate({ 
         redirectUri,
         token: code 
       });
     } else {
       // 신규 회원가입
       signupMutation.mutate({
         nickname: "기본닉네임", // 또는 사용자 입력 받기
         redirectUri,
         token: code
       });
     }
   }
 }, [searchParams, signinMutation, signupMutation]);

 useEffect(() => {
   handleOAuthProcess();
 }, [handleOAuthProcess]);

 return <div>카카오 로그인 처리 중...</div>;
}