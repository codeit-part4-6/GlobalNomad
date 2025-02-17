'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Modal from '@/components/common/modal/modal';
import Button from '@/components/common/button';
import { postOAuthSignup } from '@/service/api/oauth/postOAuthSignup.api';
import { useAuthStore } from '@/service/store/authStore';
import { AxiosError } from 'axios';

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

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
      setModalMessage('이미 가입된 사용자입니다.');
      setError('이미 가입된 사용자입니다.');
      setIsModalOpen(true);
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
          <Button className="bg-primary h-[3.375rem] w-[21.875rem] gap-[0.5rem] rounded-[0.375rem] text-white sm:px-4 tablet:h-[3rem] tablet:w-[40rem]" type = 'button' onClick={() => router.push('/signin')}>
            다시 로그인하기
          </Button>
        </div>
      ) : (
        <p className="text-gray-700 text-lg">회원가입 준비 완료</p>
      )}
      {isModalOpen && <Modal message={modalMessage} onClose={handleCloseModal} />}
    </div>
  );
}
