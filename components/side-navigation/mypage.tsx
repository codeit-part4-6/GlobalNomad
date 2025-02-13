'use client';

import {useForm, Controller} from 'react-hook-form';
import {useMutation} from '@tanstack/react-query';
import {useAuthStore} from '@/service/store/authStore';
import {patchMypage} from '@/service/api/users/patchMypage.api';
import {EditMypageBody} from '@/types/patchMypage.types';
import Input from '@/components/common/Input';
import Button from '@/components/common/button';
import Modal from '@/components/common/modal/modal';
import {useEffect, useState} from 'react';
import closeButton from '@/public/icon/ic_close_button.svg';
import {useRouter} from 'next/navigation';
import Image from 'next/image';
import {useImageUrlStore} from '@/service/store/imageURLStore';

interface IFormInput {
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  password: string;
  newPassword: string;
}

export default function MyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const {user, updateNickname, updateProfileImageUrl} = useAuthStore();
  const {profileImageUrl} = useImageUrlStore();
  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors, isValid},
    watch,
  } = useForm<IFormInput>({
    mode: 'onChange',
    defaultValues: {
      email: user ? `${user.email}` : '',
      nickname: user ? `${user.nickname}` : '',
      profileImageUrl: '',
      password: ``,
      newPassword: ``,
    },
  });
  const router = useRouter();

  useEffect(() => {
    if (profileImageUrl) {
      setValue('profileImageUrl', profileImageUrl);
    }
  }, [profileImageUrl, setValue]);

  useEffect(() => {
    if (!user) {
      router.push('/signin');
    }
  }, [user, router]);

  const mypageMutation = useMutation({
    mutationFn: (mypageData: EditMypageBody) => patchMypage(mypageData),
  });

  const onSubmit = async (data: IFormInput) => {
    mypageMutation.mutate(data, {
      onError: () => {
        setModalMessage('마이페이지 저장 중 오류가 발생했습니다.');
        setIsModalOpen(true);
      },
      onSuccess: data => {
        updateNickname(data.nickname);
        updateProfileImageUrl(data.profileImageUrl);
        setModalMessage('마이페이지 정보가 성공적으로 저장되었습니다.');
        setIsModalOpen(true);
      },
    });
  };

  const passwordValue = watch('password');

  return (
    <>
      {isModalOpen && <Modal message={modalMessage} onClose={() => setIsModalOpen(false)} />}
      <form className="h-[472px] w-full gap-[32px]" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4 flex items-center justify-between pc:mb-6">
          <p className="text-[32px] font-[700] leading-[42px] tablet:leading-[38.19px]">내 정보</p>
          <div className="flex items-center gap-1">
            {/* 저장하기 버튼 */}
            <Button
              className={`h-[48px] w-[120px] gap-[4px] rounded-[4px] pb-[8px] pl-[16px] pr-[16px] pt-[8px] text-white ${
                isValid ? 'bg-primary' : 'bg-[#A4A1AA]'
              }`}
              type="submit"
              disabled={!isValid}
            >
              저장하기
            </Button>
            {/* 모달 닫기 - 모바일 */}
            <div className="relative h-12 w-12 tablet:hidden" onClick={() => router.back()}>
              <Image src={closeButton} alt="모달 닫기 버튼" className="absolute cursor-pointer" fill />
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-[16px]">
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
                labelClassName="block text-2xl font-bold pb-4"
                className="h-[3.625rem] w-full tablet:h-[3.625rem]"
                value={field.value}
                onChange={field.onChange}
                error={errors.nickname?.message}
              />
            )}
          />
          {/* 이메일 입력란 */}
          <Controller
            name="email"
            control={control}
            render={({field}) => (
              <Input
                label="이메일"
                placeholder="이메일을 입력해 주세요"
                labelClassName="block text-2xl font-bold pb-4"
                className="h-[3.625rem] w-full tablet:h-[3.625rem]"
                value={field.value}
                error={errors.email?.message}
              />
            )}
          />
          {/* Password Input */}
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
                labelClassName="block text-2xl font-bold pb-4"
                className="h-[3.625rem] w-full tablet:h-[3.625rem]"
                value={field.value}
                onChange={field.onChange}
                isPassword
                type="password"
                error={errors.password?.message}
              />
            )}
          />
          {/* Confirm Password Input */}
          <Controller
            name="newPassword"
            control={control}
            rules={{
              required: '필수값입니다.',
              validate: value => value === passwordValue || '비밀번호가 일치하지 않습니다.',
            }}
            render={({field}) => (
              <Input
                label="비밀번호 확인"
                placeholder="비밀번호를 한번 더 입력해 주세요"
                labelClassName="block text-2xl font-bold pb-4"
                className="h-[3.625rem] w-full tablet:h-[3.625rem]"
                value={field.value}
                onChange={field.onChange}
                isPassword
                type="password"
                error={errors.newPassword?.message}
              />
            )}
          />
        </div>
      </form>
    </>
  );
}
