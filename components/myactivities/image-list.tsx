import {useState, useRef, useEffect} from 'react';
import {Controller, FieldValues, Path, useFormContext, UseFormTrigger} from 'react-hook-form';
import Image from 'next/image';
import {useMutation} from '@tanstack/react-query';
import {SubImage} from '@/types/getActivitiesId.types';
import {postImage} from '@/service/api/myactivities/postImage.api';
import Modal from '@/components/common/modal/modal';
import cancleBtn from '@/public/icon/ic_cancle_btn.svg';
import plusIcon from '@/public/icon/ic_plus_icon.svg';

interface ImageListType<T extends FieldValues> {
  maxImages?: number;
  name?: 'bannerImageUrl' | 'subImages' | 'subImageUrls' | '';
  trigger: UseFormTrigger<T>;
  bannerImageUrl?: string;
  subImages?: SubImage[];
}

export default function ImageList<T extends FieldValues>({maxImages = 5, name = '', trigger, bannerImageUrl, subImages}: ImageListType<T>) {
  const [imageUrls, setImageUrls] = useState<SubImage[]>(subImages || []);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessege, setErrorMessege] = useState('');
  const [isOpenError, setIsOpenError] = useState(false);

  const {
    control,
    formState: {errors},
    setError,
    clearErrors,
    setValue,
    getValues,
  } = useFormContext();
  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await postImage(formData);
      return response;
    },
    onMutate: () => {
      // setLoading(true);
    },

    onSuccess: data => {
      // setLoading(false);
      if (name === 'subImages') {
        const prevIds = getValues('subImageUrlsToAdd') || [];
        setValue('subImageUrlsToAdd', [...prevIds, data.activityImageUrl]);
      }

      if (name === 'subImageUrls') {
        const prevIds = getValues('subImageUrls') || [];
        setValue('subImageUrls', [...prevIds, data.activityImageUrl]);
      }

      if (name === 'bannerImageUrl') {
        setValue('bannerImageUrl', data.activityImageUrl);
      }
    },
    onError: error => {
      setIsOpenError(true);
      setErrorMessege(error.message);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length + selectedFiles.length > maxImages) {
      setError(name, {type: 'manual', message: `최대 ${maxImages}개의 이미지만 선택할 수 있습니다.`});
      return;
    }
    clearErrors(name);

    if (files) {
      const newFiles = Array.from(files);

      setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);

      const filePromises = newFiles.map(file => {
        return new Promise<void>((resolve, reject) => {
          const formData = new FormData();
          formData.append('image', file);

          mutation.mutate(formData, {
            onSuccess: () => resolve(),
            onError: () => reject(),
          });

          const reader = new FileReader();
          reader.onloadend = () => {
            const fileUrl = reader.result as string;
            if (!imageUrls.some(image => image.imageUrl === fileUrl)) {
              setImageUrls(prevUrls => [...prevUrls, {imageUrl: fileUrl}]);
            }
            resolve();
          };
          reader.onerror = () => reject();
          reader.readAsDataURL(file);
        });
      });

      try {
        await Promise.all(filePromises);
        e.target.value = '';
      } catch (error) {
        console.error('파일 처리 중 오류 발생:', error);
      }
    }
  };

  // 필수값 체크 함수
  const validateImageField = () => {
    if (imageUrls.length === 0) {
      setValue(name, '', {shouldValidate: true});
      setError(name, {type: 'manual', message: '필수 값 입니다.'});
    } else {
      clearErrors(name);
    }
  };

  const handleRemoveImage = (index: number, id?: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);

    const updatedImageUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updatedImageUrls);

    validateImageField();

    // 수정시
    if (id != null) {
      const prevIds = getValues('subImageIdsToRemove') || [];
      setValue('subImageIdsToRemove', [...prevIds, id], {shouldValidate: false});
    }
  };

  useEffect(() => {
    if (trigger) {
      trigger(name as Path<T>); // 유효성 수동 trigger
    }
  }, [trigger, imageUrls, name]);

  useEffect(() => {
    // 초기값
    if (subImages) {
      setImageUrls(subImages);
    }

    if (bannerImageUrl) {
      setImageUrls([{imageUrl: bannerImageUrl}]);
    }
  }, [subImages, bannerImageUrl]);

  useEffect(() => {
    if (imageUrls.length === 0) {
      setValue(name, '', {shouldValidate: true}); // 필수 값 검사를 강제 트리거
      setError(name, {type: 'manual', message: '필수 값 입니다.'});
    } else {
      clearErrors(name);
    }
  }, [imageUrls, name, setError, clearErrors, setValue]);

  return (
    <>
      <div className="flex flex-wrap gap-6">
        {/* 이미지 등록 */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex h-167pxr w-167pxr cursor-pointer items-center justify-center rounded-xl border border-dashed border-gray-800 tablet:h-206pxr tablet:w-206pxr pc:h-180pxr pc:w-180pxr"
        >
          <div className="flex flex-col items-center">
            <Image src={plusIcon} alt="이미지등록" width={48} height={48} className="pb-8" />
            <div>이미지 등록</div>
          </div>
        </div>
        {/* 파일 인풋 */}
        <Controller
          name={name}
          control={control}
          rules={{
            required: imageUrls.length > 0 ? false : '필수 값 입니다.',
            validate: {
              maxImages: () => selectedFiles.length <= maxImages || `최대 ${maxImages}개의 이미지만 선택할 수 있습니다.`,
            },
          }}
          render={() => <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} multiple />}
        />
        {/* 이미지 미리보기 및 삭제 버튼 */}
        {imageUrls.map((imageUrl, index) => {
          if (imageUrl?.imageUrl) {
            return (
              <div key={index} className="relative h-167pxr w-167pxr tablet:h-206pxr tablet:w-206pxr pc:h-180pxr pc:w-180pxr">
                <Image src={imageUrl.imageUrl} alt={`이미지 ${index + 1}`} fill className="rounded-3xl" />
                <div className="absolute right-[-16px] top-[-18px] cursor-pointer p-2" onClick={() => handleRemoveImage(index, imageUrl.id)}>
                  <Image src={cancleBtn} width={24} height={24} alt="이미지삭제" />
                </div>
              </div>
            );
          }
          return null;
        })}
        {/* 오류 메시지 */}
        {typeof errors[name]?.message === 'string' && <span className="error-message">{errors[name]?.message}</span>}
      </div>
      {isOpenError && <Modal message={errorMessege} onClose={() => setIsOpenError(false)}></Modal>}
    </>
  );
}
