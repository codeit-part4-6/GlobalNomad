'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import Input from '@/components/common/Input';
import Button from '@/components/common/button';
import Modal from '@/components/common/modal/modal';
import signLogo from '@/public/img/img_signlogo.svg';
import GoogleIcon from '@/public/icon/ic_google.svg';
import KakaoIcon from '@/public/icon/ic_kakao.svg';
import { postSignin } from '@/service/api/auth/postSignin.api';
import { postTokens } from '@/service/api/auth/postTokens.api';
import { SigninBody } from '@/types/postSignin.types';
import { useAuthStore } from '@/service/store/authStore';

interface IFormInput {
  email: string;
  password: string;
}

export default function Page() {
  const { setLogin } = useAuthStore(); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm<IFormInput>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signinMutation = useMutation({
    mutationFn: (signinData: SigninBody) => postSignin(signinData),
  });

  const onSubmit = (data: IFormInput) => {
    signinMutation.mutate(data, {
      // 경고
      onError: () => {
        setModalMessage('비밀번호가 일치하지 않습니다.');
        setIsModalOpen(true);
      },
      onSuccess: async (data) => {
        try {
          // Zustand에 로그인 상태 업데이트
          setLogin(data.accessToken, data.refreshToken, data.user);

          sessionStorage.setItem('accessToken', data.accessToken);
          sessionStorage.setItem('refreshToken', data.refreshToken);

          const { id, email, nickname, profileImageUrl, createdAt, updatedAt } = data.user;
          sessionStorage.setItem(
            'userInfo',
            JSON.stringify({ id, email, nickname, profileImageUrl, createdAt, updatedAt })
          );

          const refreshedData = await postTokens(data.refreshToken);
          if (refreshedData) sessionStorage.setItem('accessToken', refreshedData.accessToken);

          router.push('/');
        } catch (e) {
          console.error(e);
        }
      },
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleKakaoLogin = () => {
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoAuthURL;
  }

  return (
    <>
      <div className="flex flex-col items-center max-w-[40rem] m-auto pt-[6.875rem] gap-[1.5rem] tablet:pt-[7.875rem] tablet:gap-[2.5rem] desktop:pt-[7.375rem] desktop:gap-[3.5rem]">
        <Link href="/">
          <Image src={signLogo} alt="로고" />
        </Link>
        <form 
          className="flex flex-col gap-[2.5rem] w-full items-center justify-center tablet:gap-[3rem]" 
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-[1.625rem] tablet:gap-[2rem]">
            <div className="flex flex-col gap-[1.75rem]">
              {/* 이메일 입력란 */}
              <Controller
                name="email"
                control={control}
                rules={{
                  required: '필수값입니다.',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: '이메일 형식으로 작성해 주세요.',
                  },
                }}
                render={({field}) => (
                  <Input
                    label="이메일"
                    placeholder="이메일을 입력해 주세요"
                    labelClassName="block text-lg pb-2"
                    className="h-[3.625rem] w-[21.875rem] tablet:h-[3.625rem] tablet:w-[40rem]"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.email?.message}
                  />
                )}
              />
              {/* 비밀번호 입력란 */}
              <Controller
                name="password"
                control={control}
                rules={{
                  required: '필수값입니다.',
                  minLength: {
                    value: 8,
                    message: '8자 이상으로 작성해 주세요.',
                  },
                }}
                render={({field}) => (
                  <Input
                    label="비밀번호"
                    placeholder="비밀번호를 입력해 주세요"
                    labelClassName="block text-lg pb-2"
                    className="h-[3.625rem] w-[21.875rem] tablet:h-[3.625rem] tablet:w-[40rem]"
                    value={field.value}
                    onChange={field.onChange}
                    isPassword={true}
                    type="password"
                    error={errors.password?.message}
                  />
                )}
              />
              <Button 
                className={`h-[3.375rem] w-[21.875rem] gap-[0.5rem] rounded-[0.375rem] text-white sm:px-4 tablet:h-[3rem] tablet:w-[40rem] ${
                  isValid ? 'bg-primary' : 'bg-[#A4A1AA]'
                }`}
                type="submit"
                disabled={!isValid}>
                로그인 하기
              </Button>
            </div>
            <span className="text-gray-800 text-[1rem] font-regular leading-[1.19rem] text-center">
              회원이 아니신가요?
              <Link href="/signup" className="underline ml-[0.3125rem]">
                회원가입하기
              </Link>
            </span>
            <div className="flex flex-col gap-[1.5rem] tablet:gap-[2.5rem]">
              <div className="flex justify-center items-center">
                <hr className="w-[5rem] border border-gray-300" />
                <span className="text-gray-700 text-[0.875rem] leading-[1.5rem] font-regular text-center">
                  SNS 계정으로 로그인하기
                </span>
                <hr className="w-[5rem] border border-gray-300" />
              </div>
              <div className="flex justify-center gap-[1rem]">
                <button type="button" onClick={() => alert("Google 로그인 기능이 일시적으로 제한되어 있습니다")}>
                  <Image src={GoogleIcon} alt="google icon" />
                </button>
                <button type="button" onClick={handleKakaoLogin}>
                  <Image src={KakaoIcon} alt="kakao icon" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      {isModalOpen && 
        <Modal 
          type="big" 
          message={modalMessage} 
          onClose={handleCloseModal} 
        />}
    </>
  );
}
