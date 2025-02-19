'use client';
import {useState, useRef, Fragment, useEffect} from 'react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import Image from 'next/image';
import {Activity} from '@/types/myactivities';
import {PostActivitiesBody} from '@/types/postActivities.types';
import {PatchActivitiesBody} from '@/types/patchActivities.types';
import Button from '@/components/common/button';
import Modal from '@/components/common/modal/modal';
import InfiniteScroll from '@/components/common/lnfiniteScroll';
import ActivitiesRegister from './activities-register';
import ActivitiesModify from './activities-modify';
import ActivitiesCard from './activities-card';
import {getActivitiesList} from '@/service/api/myactivities/getActivities';
import {patchActivities} from '@/service/api/myactivities/patchActivities.api';
import {deleteActivities} from '@/service/api/myactivities/deleteActivities.api';
import {postActivities} from '@/service/api/myactivities/postActivities';

import {useRouter} from 'next/navigation';
import NonDataPage from './non-data';
import closeButton from '@/public/icon/ic_close_button.svg';

type ContentType = 'manage' | 'register' | 'modify' | 'delete';

interface MyActivitiesProps {
  contentType: ContentType;
}

export default function MyActivities({contentType}: MyActivitiesProps) {
  const router = useRouter();
  const [content, setContent] = useState<ContentType>(contentType);
  const formRef = useRef<{submitForm: () => void} | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenError, setIsOpenError] = useState(false);
  const [errorMessege, setErrorMessege] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isValidModify, setIsValidModify] = useState(false);
  const [modifyId, setModifyId] = useState(0);
  const queryClient = useQueryClient();

  const postActivitiesMutation = useMutation({
    mutationFn: async (body: PostActivitiesBody) => {
      const response = await postActivities(body);
      return response;
    },
    onMutate: () => {
      // setLoading(true);
    },

    onSuccess: () => {
      setIsOpen(true);
    },
    onError: error => {
      setIsOpenError(true);
      setErrorMessege(error.message);
    },
  });

  const patchActivitiesMutation = useMutation({
    mutationFn: async ({id, body}: {id: number; body: PatchActivitiesBody}) => {
      const response = await patchActivities(id, body);
      return response;
    },
    onMutate: () => {
      // setLoading(true);
    },

    onSuccess: () => {
      // setLoading(false);
      setIsOpen(true);
    },
    onError: error => {
      setIsOpenError(true);
      setErrorMessege(error.message);
    },
  });

  const deleteActivitiesMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await deleteActivities(id);
      return response;
    },
    onMutate: () => {
      // setLoading(true);
    },

    onSuccess: () => {
      // setLoading(false);
      queryClient.invalidateQueries({queryKey: ['myactivities']});
      setIsOpen(true);
    },
    onError: error => {
      setIsOpenError(true);
      setErrorMessege(error.message);
    },
  });

  const updateQueryParams = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(window.location.search);

    Object.entries(newParams).forEach(([key, value]) => {
      params.set(key, value);
    });

    router.push(`?${params.toString()}`);
  };

  const handleClickModify = (id: number) => {
    updateQueryParams({type: 'modify', id: id.toString()});
    setContent('modify');
    setModifyId(id);
  };

  const handleClickDelete = (deleteId: number) => {
    setContent('delete');
    deleteActivitiesMutation.mutate(deleteId);
  };

  const handleSubmit = (data: PostActivitiesBody) => {
    const updateData = {
      ...data,
      bannerImageUrl: data.bannerImageUrl.toString(),
    };

    postActivitiesMutation.mutate(updateData);
  };

  type ActivityData<T> = PatchActivitiesBody & T;

  const handleModifySubmit = <T extends object>(data: ActivityData<T>, queryId: number) => {
    const schedulesToAdd = data.schedulesToAdd || [];
    const filterSchedulesToAdd = data.schedulesToAddTemp;

    if (filterSchedulesToAdd) {
      filterSchedulesToAdd.forEach((data: {id?: number}) => {
        delete data.id;
      });
      schedulesToAdd.push(...filterSchedulesToAdd);
    }

    const params: PatchActivitiesBody = {
      title: data.title,
      category: data.category,
      description: data.description,
      price: data.price,
      bannerImageUrl: data.bannerImageUrl.toString(),
      subImageIdsToRemove: data.subImageIdsToRemove,
      subImageUrlsToAdd: data.subImageUrlsToAdd || [],
      scheduleIdsToRemove: data.scheduleIdsToRemove,
      schedulesToAdd: schedulesToAdd || [],
    };
    patchActivitiesMutation.mutate({id: queryId, body: params});
  };

  const triggerSubmit = () => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    updateQueryParams({type: 'manage'});
  };

  useEffect(() => {
    if (contentType !== content) {
      setContent(contentType);
    }
  }, [contentType, content]);

  return (
    <>
      <div className="flex flex-col">
        <div className="mb-16 h-full w-full">
          <div className="item-center mb-4 flex justify-between tablet:mb-6 tablet:mt-0">
            <h1 className="text-3xl font-bold">{content === 'manage' ? '내 체험 관리' : '내 체험 등록'}</h1>
            <div className="item-center flex gap-1">
              {content === 'manage' ? (
                <>
                  <Button
                    onClick={() => {
                      updateQueryParams({type: 'register'});
                      setContent('register');
                    }}
                    className="green-unrounded-button-hover h-48pxr w-80pxr gap-4pxr rounded-md bg-primary px-15pxr py-8pxr font-bold text-white tablet:w-120pxr"
                  >
                    <span className="hidden tablet:block">체험 등록하기</span>
                    <span className="block tablet:hidden">등록</span>
                  </Button>
                </>
              ) : content === 'register' ? (
                <Button
                  onClick={triggerSubmit} // 버튼 클릭 시 자식 컴포넌트의 폼 제출 트리거
                  className={`h-48pxr w-80pxr gap-4pxr rounded-md pb-8pxr pl-16pxr pr-16pxr pt-8pxr font-bold text-white tablet:w-120pxr ${
                    isValid ? 'green-unrounded-button-hover bg-primary' : 'bg-gray-500'
                  }`}
                >
                  <span className="hidden tablet:block">등록하기</span>
                  <span className="block tablet:hidden">등록</span>
                </Button>
              ) : (
                <Button
                  onClick={triggerSubmit}
                  className={`${isValidModify ? 'green-unrounded-button-hover bg-primary' : 'bg-gray-500'} h-48pxr w-80pxr gap-4pxr rounded-md pb-8pxr pl-16pxr pr-16pxr pt-8pxr font-bold text-white tablet:w-120pxr`}
                >
                  <span className="hidden tablet:block">수정하기</span>
                  <span className="block tablet:hidden">수정</span>
                </Button>
              )}
              <div className="mb-2 flex justify-end tablet:hidden">
                <Image onClick={() => router.back()} src={closeButton} alt="모달 닫기 버튼" className="cursor-pointer" width={48} height={48} />
              </div>
            </div>
          </div>

          {content === 'manage' && (
            <InfiniteScroll
              className="h-700pxr w-full pc:h-700pxr"
              queryKey="myactivities"
              fetchData={context => getActivitiesList({...context, meta: {size: 8}})}
              render={group => {
                if (!group.pages || group.pages.length === 0) {
                  return <NonDataPage />;
                }

                const activities = group.pages.flatMap(page => page);
                return (
                  <div className="flex flex-col gap-2 tablet:gap-4 pc:gap-6">
                    {activities.length > 0 ? (
                      activities.map((data: Activity) => (
                        <Fragment key={data.id}>
                          <ActivitiesCard
                            data={data}
                            onClickModify={() => handleClickModify(data.id)}
                            onClickDelete={() => handleClickDelete(data.id)}
                          />
                        </Fragment>
                      ))
                    ) : (
                      <NonDataPage />
                    )}
                  </div>
                );
              }}
            ></InfiniteScroll>
          )}

          {content === 'register' && (
            <>
              <ActivitiesRegister ref={formRef} onSubmitParent={handleSubmit} onValidChange={setIsValid} />
            </>
          )}
          {content === 'modify' && (
            <>
              <ActivitiesModify ref={formRef} modifyId={modifyId} onSubmitParent={handleModifySubmit} onValidChange={setIsValidModify} />
            </>
          )}
        </div>
      </div>
      {isOpen && (
        <Modal message={`체험 ${content === 'modify' ? '수정' : content === 'register' ? '등록' : '삭제'}이 완료되었습니다`} onClose={handleClose} />
      )}
      {isOpenError && <Modal message={errorMessege} onClose={() => setIsOpenError(false)}></Modal>}
    </>
  );
}
