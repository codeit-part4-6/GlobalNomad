'use client';
import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {Controller, FormProvider, SubmitHandler, useForm} from 'react-hook-form';
import {PostActivitiesBody} from '@/types/postActivities.types';
import Input from '@/components/common/Input';
import SelectBox from '@/components/common/selectbox';
import AddressModal from './address-modal';
import ImageList from './image-list';
import TimeList from './time-list';
import arrowDown from '@/public/icon/icon_arrow_down.svg';

interface ActivitiesRegisterProps {
  onSubmitParent?: (data: PostActivitiesBody) => void;
  onValidChange?: (isValid: boolean) => void;
}

const ActivitiesRegister = forwardRef<{submitForm: () => void}, ActivitiesRegisterProps>(({onSubmitParent, onValidChange}, ref) => {
  const methods = useForm<PostActivitiesBody>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      category: '',
      description: '',
      address: '',
      price: 0,
      schedules: [{date: '', startTime: '09:00', endTime: '18:00'}],
      bannerImageUrl: '',
      subImageUrls: [],
    },
  });

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    setValue,
    clearErrors,
    trigger,
  } = methods;

  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleComplete = (data: {address: string; zonecode: string}) => {
    setIsOpen(false);
    setValue('address', data.address);
    clearErrors('address');
  };

  const handleFocus = () => {
    setIsFocused(true);
    setIsOpen(true);
  };

  const onSubmit: SubmitHandler<PostActivitiesBody> = data => {
    console.log('Form Data:', data);
    if (onSubmitParent) {
      onSubmitParent(data);
    }
  };

  const getErrorMessage = (errors: Record<string, {message?: string}>, type: string) => {
    return <span className={`error-message ${errors[type]?.message ? 'visible opacity-100' : 'invisible opacity-0'}`}>{errors[type]?.message}</span>;
  };

  useImperativeHandle(ref, () => ({
    submitForm: handleSubmit(onSubmit),
  }));

  useEffect(() => {
    if (onValidChange) onValidChange(isValid); // ref 로전달불가 props로 직접전달
  }, [isValid, onValidChange]);

  const options = [
    {value: '문화 · 예술', label: '문화 · 예술'},
    {value: '식음료', label: '식음료'},
    {value: '스포츠', label: '스포츠'},
    {value: '투어', label: '투어'},
    {value: '관광', label: '관광'},
    {value: '웰빙', label: '웰빙'},
  ];

  return (
    <>
      <FormProvider {...methods}>
        <form className="flex flex-col py-4">
          <div className="mb-4">
            <Controller
              name="title"
              control={control}
              rules={{
                required: '필수 값 입니다.',
                minLength: {value: 5, message: '최소 5글자이상 입력해주세요'},
              }}
              render={({field: {value, onChange}}) => (
                <Input
                  required={true}
                  value={value}
                  onChange={onChange}
                  error={errors.title?.message}
                  maxLength={50}
                  placeholder="제목 ex) K-뷰티 메이크업 클래스"
                  className="placehorder w-full"
                />
              )}
            />
          </div>
          <div className="mb-4">
            <Controller
              name="category"
              control={control}
              rules={{
                required: '필수 값 입니다.',
              }}
              render={({field: {value, onChange}}) => (
                <SelectBox
                  label="카테고리"
                  selectButtonImage={arrowDown}
                  value={value}
                  className="w-full bg-white"
                  onChange={onChange}
                  options={options}
                />
              )}
            />
            {getErrorMessage(errors, 'category')}
          </div>
          <div className="mb-4">
            <Controller
              name="description"
              control={control}
              rules={{
                required: '필수 값 입니다.',
              }}
              render={({field: {value, onChange}}) => (
                <textarea
                  required={true}
                  value={value}
                  maxLength={1000}
                  onChange={onChange}
                  placeholder="체험 중 어떤 활동을 하게 될지 알려주세요."
                  className="placehorder h-40 w-full cursor-text resize-none rounded-s border border-gray-700 p-4 focus:outline-none focus:ring-2 focus:ring-green-950"
                ></textarea>
              )}
            />
            {getErrorMessage(errors, 'description')}
          </div>
          <div className="mb-4">
            <Controller
              name="price"
              control={control}
              rules={{
                required: '필수 값 입니다.',
              }}
              render={({field: {value, onChange}}) => (
                <Input
                  label="가격"
                  type="tel"
                  pattern="[0-9,]*"
                  value={value ? value.toString() : ''}
                  onChange={e => {
                    const newValue = e.target.value.replace(/[^0-9]/g, '');
                    onChange(newValue ? parseFloat(newValue) : '');
                  }}
                  className="w-full"
                  error={errors.price?.message}
                  isMoney={true}
                ></Input>
              )}
            />
          </div>
          <div className="mb-4">
            <Controller
              name="address"
              control={control}
              rules={{
                required: '필수 값 입니다.',
              }}
              render={({field: {value, onChange}}) => (
                <Input
                  label="주소"
                  required={true}
                  value={value}
                  onChange={onChange}
                  onFocus={handleFocus}
                  error={errors.address?.message}
                  placeholder="주소를 입력해주세요"
                  className="placehorder w-full"
                />
              )}
            ></Controller>
          </div>
          {isFocused && isOpen && <AddressModal onClose={() => setIsOpen(false)} onComplete={handleComplete} />}
          <TimeList type="register" />
          <div className="mb-4">
            <label className="mb-3 block text-xl font-bold tablet:text-2xl">배너 이미지</label>
            <ImageList trigger={trigger} maxImages={1} name="bannerImageUrl" />
          </div>
          <div className="mb-4">
            <label className="mb-3 block text-xl font-bold tablet:text-2xl">소개 이미지</label>
            <ImageList trigger={trigger} maxImages={4} name="subImageUrls" />
            <div className="mt-5 text-2lg font-normal text-gray-800">*이미지를 최대 4개까지 제출해주세요.</div>
          </div>
        </form>
      </FormProvider>
    </>
  );
});

ActivitiesRegister.displayName = 'ActivitiesRegister'; // forwardRef를 사용할 때 displayName 설정

export default ActivitiesRegister;
