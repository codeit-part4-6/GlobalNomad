'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {useMutation} from '@tanstack/react-query';
import Input from '@/components/common/Input';
import Button from '@/components/common/button';
import Modal from '@/components/common/modal/modal';
import signLogo from '@/public/img/img_signlogo.svg';
import GoogleIcon from '@/public/icon/ic_google.svg';
import KakaoIcon from '@/public/icon/ic_kakao.svg';
import {postSignup} from '@/service/api/users/postSignup.api';
import {SignupBody} from '@/types/postSignup.types';

interface IFormInput {
  email: string;
  nickname: string;
  password: string;
  confirmPassword: string;
}

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    watch,
  } = useForm<IFormInput>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      nickname: '',
      password: '',
      confirmPassword: '',
    },
  });

  const signupMutation = useMutation({
    mutationFn: (signupData: SignupBody) => postSignup(signupData),
  });

  const onSubmit = (data: IFormInput) => {
    signupMutation.mutate(data, {
      // 경고
      onError: () => {
        setModalMessage('이미 사용중인 이메일입니다.');
        setIsModalOpen(true);
      },
      onSuccess: () => {
        setModalMessage('가입이 완료되었습니다!');
        setIsModalOpen(true);
        router.push('/signin');
      },
    });
  };

  const passwordValue = watch('password');

  const handleKakaoLogin = () => {
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI2}&response_type=code`;
    window.location.href = kakaoAuthURL;
  };

  return (
    <>
      <div className="desktop:pt-[7.375rem] desktop:gap-[3.5rem] desktop:w-[640px] desktop:h-[1019px] desktop:top-[118px] desktop:left-[640px] m-auto flex max-w-[40rem] flex-col items-center gap-[1.5rem] pt-[6.875rem] tablet:left-[52px] tablet:top-[118px] tablet:h-[1003px] tablet:w-[640px] tablet:gap-[2.5rem] tablet:pt-[7.875rem]">
        <Link href="/">
          <Image src={signLogo} alt="로고" />
        </Link>
        <form className="flex w-full flex-col items-center justify-center gap-[2.5rem] tablet:gap-[3rem]" onSubmit={handleSubmit(onSubmit)}>
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
              {/* 닉네임 입력란 */}
              <Controller
                name="nickname"
                control={control}
                rules={{
                  required: '필수값입니다.',
                  maxLength: {
                    value: 10,
                    message: '열 자 이하로 작성해 주세요.',
                  },
                }}
                render={({field}) => (
                  <Input
                    label="닉네임"
                    placeholder="닉네임을 입력해 주세요"
                    labelClassName="block text-lg pb-2"
                    className="h-[3.625rem] w-[21.875rem] tablet:h-[3.625rem] tablet:w-[40rem]"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.nickname?.message}
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
              {/* 비밀번호 확인 입력란 */}
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: '필수값입니다.',
                  validate: value => value === passwordValue || '비밀번호가 일치하지 않습니다.',
                }}
                render={({field}) => (
                  <div>
                    <Input
                      label="비밀번호 확인"
                      placeholder="비밀번호를 한번 더 입력해 주세요"
                      labelClassName="block text-lg pb-2"
                      className="h-[3.625rem] w-[21.875rem] tablet:h-[3.625rem] tablet:w-[40rem]"
                      value={field.value}
                      onChange={field.onChange}
                      isPassword={true}
                      type="password"
                      error={errors.confirmPassword?.message}
                    />
                  </div>
                )}
              />
              {/* 회원가입 버튼 */}
              <Button
                className={`h-[3.375rem] w-[21.875rem] gap-[0.5rem] rounded-[0.375rem] text-white sm:px-4 tablet:h-[3rem] tablet:w-[40rem] ${
                  isValid ? 'bg-primary' : 'bg-[#A4A1AA]'
                }`}
                type="submit"
                disabled={!isValid}
              >
                회원가입 하기
              </Button>
            </div>
            {/* 로그인 링크 */}
            <span className="text-center text-[1rem] font-regular leading-[1.19rem] text-gray-800">
              회원이신가요?
              <Link href="/signin" className="ml-[0.3125rem] underline">
                로그인하기
              </Link>
            </span>
            <div className="flex w-full flex-col gap-[1.5rem] tablet:gap-[2.5rem]">
              <div className="flex items-center justify-center">
                <hr className="w-full border border-gray-300" />
                <span className="whitespace-nowrap px-5 text-center text-[0.875rem] font-regular leading-[1.5rem] text-gray-700">
                  SNS 계정으로 로그인하기
                </span>
                <hr className="w-full border border-gray-300" />
              </div>
              <div className="flex justify-center gap-[1rem]">
                <button type="button" onClick={() => alert('Google 로그인 기능이 일시적으로 제한되어 있습니다')}>
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
      {isModalOpen && <Modal message={modalMessage} onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
