import React, {forwardRef, useImperativeHandle, useState} from 'react';
import Input from '@/components/common/Input';
import SelectBox from '@/components/common/selectbox';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import arrowDown from '@/public/icon/icon_arrow_down.svg';
import AddressModal from './address-modal';

export interface IFormInput {
  username: string;
  email: string;
  time: string;
  birthdate: string;
  category: string;
  description: string;
  price: number;
  address: string;
}

interface ActivitiesRegisterProps {
  onSubmitParent: (data: IFormInput) => void;
}

const ActivitiesRegister = forwardRef<{submitForm: () => void}, ActivitiesRegisterProps>(({onSubmitParent}, ref) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    setError,
    setValue,
  } = useForm<IFormInput>({
    mode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      time: '',
      birthdate: '',
      category: '',
      description: '',
      price: 0,
      address: '',
    },
  });

  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleComplete = (data: {address: string; zonecode: string}) => {
    setIsOpen(false);
    console.log(data);
    setValue('address', data.address);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setIsOpen(true);
  };

  const onSubmit: SubmitHandler<IFormInput> = data => {
    console.log('Form Data:', data);
    onSubmitParent(data);
  };

  useImperativeHandle(ref, () => ({
    submitForm: handleSubmit(onSubmit),
  }));

  const options = [
    {value: '문화 · 예술', label: '문화 · 예술'},
    {value: '식음료', label: '식음료'},
    {value: '스포츠', label: '스포츠'},
    {value: '투어', label: '투어'},
    {value: '관광', label: '관광'},
    {value: '웰빙', label: '웰빙'},
  ];

  return (
    <form className="flex flex-col gap-4">
      <Controller
        name="username"
        control={control}
        rules={{
          required: '필수값입니다',
          minLength: {value: 5, message: '최소5 글자이상 입력해주세요'},
        }}
        render={({field: {value, onBlur, onChange}}) => (
          <Input
            required={true}
            value={value}
            onBlur={() => {
              if (!value.trim()) {
                setError('username', {type: 'manual', message: '필수값입니다.'});
              } else {
                onBlur();
              }
            }}
            onChange={onChange}
            error={errors.username?.message}
            placeholder="제목"
            className="w-full"
          />
        )}
      />
      <Controller
        name="category"
        control={control}
        rules={{
          required: '필수값입니다',
        }}
        render={({field: {value, onChange}}) => (
          <SelectBox deleteButtonImage={arrowDown} value={value} className="w-full bg-white" onChange={onChange} options={options} />
        )}
      />
      <Controller
        name="description"
        control={control}
        rules={{
          required: '필수값입니다',
        }}
        render={({field: {value, onChange}}) => (
          <textarea
            required={true}
            value={value}
            onChange={onChange}
            placeholder="내용"
            className="h-40 w-full cursor-text resize-none rounded-s border border-gray-700 p-4 focus:outline-none focus:ring-2 focus:ring-green-950"
          ></textarea>
        )}
      />
      <Controller
        name="price"
        control={control}
        rules={{
          required: '필수값입니다',
        }}
        render={({field: {value, onChange}}) => (
          <Input
            label="가격"
            value={value ? value.toString() : ''}
            onChange={e => {
              const newValue = e.target.value.replace(/[^0-9]/g, '');
              onChange(newValue ? parseFloat(newValue) : '');
            }}
            className="w-full"
            isMoney={true}
          ></Input>
        )}
      />
      <Controller
        name="address"
        control={control}
        rules={{
          required: '필수값입니다',
        }}
        render={({field: {value, onBlur, onChange}}) => (
          <Input
            label="주소"
            required={true}
            value={value}
            onBlur={() => {
              if (!value.trim()) {
                setError('username', {type: 'manual', message: '필수값입니다.'});
              } else {
                onBlur();
              }
            }}
            onChange={onChange}
            onFocus={handleFocus}
            error={errors.username?.message}
            placeholder="주소를 입력해주세요"
            className="w-full"
          />
        )}
      ></Controller>
      {isFocused && isOpen && <AddressModal onClose={() => setIsOpen(false)} onComplete={handleComplete} />}
    </form>
  );
});

ActivitiesRegister.displayName = 'ActivitiesRegister'; // forwardRef 사용시 displayName 설정

export default ActivitiesRegister;
