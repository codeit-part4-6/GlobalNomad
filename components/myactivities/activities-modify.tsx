import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {Controller, FormProvider, SubmitHandler, useForm} from 'react-hook-form';
import arrowDown from '@/public/icon/icon_arrow_down.svg';
import Input from '@/components/common/Input';
import SelectBox from '@/components/common/selectbox';
import AddressModal from './address-modal';
import TimeList from './time-list';
import ImageList from './image-list';
import {useMutation} from '@tanstack/react-query';
import {getActivitiesId} from '@/service/api/myactivities/getActivitiesId.api';
import {PatchActivitiesBody} from '@/types/patchActivities.types';
import {GetActivitiesResponse, SubImage} from '@/types/getActivitiesId.types';
import Modal from '@/components/common/modal/modal';
import {useSearchParams} from 'next/navigation';

interface ActivitiesModifyProps {
  onSubmitParent?: (data: PatchActivitiesBody & GetActivitiesResponse, queryId: number) => void;
  modifyId: number | null;
  onValidChange?: (isValid: boolean) => void;
}

const ActivitiesModify = forwardRef<{submitForm: () => void}, ActivitiesModifyProps>(({onSubmitParent, modifyId, onValidChange}, ref) => {
  const methods = useForm<PatchActivitiesBody & GetActivitiesResponse>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      category: '',
      description: '',
      address: '',
      price: 0,
      schedules: [],
      bannerImageUrl: '',
      subImages: [],
      subImageIdsToRemove: [],
      scheduleIdsToRemove: [],
      subImageUrlsToAdd: [],
      schedulesToAdd: [],
    },
  });

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    setValue,
    clearErrors,
    trigger,
    reset,
    getValues,
  } = methods;

  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [subImages, setSubImages] = useState<SubImage[]>([]);
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [isOpenError, setIsOpenError] = useState(false);
  const [errorMessege, setErrorMessege] = useState('');
  const searchParams = useSearchParams();
  const [queryId, setQueryId] = useState<number | null>(null);

  // 수정 api
  const mutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await getActivitiesId(id);
      return response;
    },
    onMutate: () => {
      // setLoading(true);
    },

    onSuccess: data => {
      reset({
        ...data,
      });

      const subImagesData = data?.subImages || [];
      const bannerImageUrlData = data.bannerImageUrl;
      setSubImages(subImagesData);
      setBannerImageUrl(bannerImageUrlData);
    },
    onError: error => {
      setIsOpenError(true);
      setErrorMessege(error.message);
    },
  });

  const handleComplete = (data: {address: string; zonecode: string}) => {
    setIsOpen(false);
    setValue('address', data.address);
    clearErrors('address');
  };

  const handleFocus = () => {
    setIsFocused(true);
    setIsOpen(true);
  };

  const onSubmit: SubmitHandler<PatchActivitiesBody & GetActivitiesResponse> = data => {
    console.log('Form Data:', data, queryId); // 여기가 왜 0이뜨지?
    if (onSubmitParent) {
      if (queryId !== null) {
        onSubmitParent(data, queryId);
      }
    }
  };

  const getErrorMessage = (errors: Record<string, {message?: string}>, type: string) => {
    return <span className={`error-message ${errors[type]?.message ? 'visible opacity-100' : 'invisible opacity-0'}`}>{errors[type]?.message}</span>;
  };

  useImperativeHandle(ref, () => ({
    submitForm: handleSubmit(onSubmit),
  }));

  useEffect(() => {
    if (onValidChange) onValidChange(isValid);
  }, [isValid, onValidChange]);

  useEffect(() => {
    const idFromQuery = Number(searchParams.get('id'));

    if (!isNaN(idFromQuery)) {
      setQueryId(idFromQuery);
    }
  }, [searchParams]);

  const mutationRef = useRef(mutation);

  useEffect(() => {
    if (queryId !== null) {
      mutationRef.current.mutate(queryId);
    }
  }, [queryId]);

  useEffect(() => {
    if (modifyId) {
      setQueryId(modifyId);
    }
  }, [modifyId]);

  useEffect(() => {
    const subImagesData = getValues('subImages') || [];
    const bannerImageUrlData = getValues('bannerImageUrl');
    setSubImages(subImagesData);
    setBannerImageUrl(bannerImageUrlData);
  }, [getValues]);

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
          <TimeList type="modify" />
          <div className="mb-4">
            <label className="mb-3 block text-xl font-bold tablet:text-2xl">배너 이미지</label>
            <ImageList trigger={trigger} maxImages={1} name="bannerImageUrl" bannerImageUrl={bannerImageUrl} />
          </div>
          <div className="mb-4">
            <label className="mb-3 block text-xl font-bold tablet:text-2xl">소개 이미지</label>
            <ImageList trigger={trigger} maxImages={4} name="subImages" subImages={subImages} />
            <div className="mt-5 text-2lg font-normal text-gray-800">*이미지를 최대 4개까지 제출해주세요.</div>
          </div>
        </form>
      </FormProvider>
      {isOpenError && <Modal message={errorMessege} onClose={() => setIsOpenError(false)}></Modal>}
    </>
  );
});

ActivitiesModify.displayName = 'ActivitiesModify'; // forwardRef를 사용할 때 displayName 설정

export default ActivitiesModify;
