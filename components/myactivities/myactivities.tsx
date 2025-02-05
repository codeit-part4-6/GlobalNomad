import Button from '@/components/common/button';
import {useState, useRef, Fragment} from 'react';
import ActivitiesRegister from './activities-register';
import Modal from '@/components/common/modal/modal';
import Image from 'next/image';
import closeButton from '@/public/icon/ic_close_button.svg';
import InfiniteScroll from '../common/lnfiniteScroll';
import {getActivitiesList} from '@/service/api/myactivities/getActivities';
import {Activity} from '@/types/myactivities';
import ActivitiesCard from './activities-card';
import {postActivities} from '@/service/api/myactivities/postActivities';
import {PostActivitiesBody} from '@/types/postActivities.types';
import {useMutation} from '@tanstack/react-query';

export default function MyActivities({onclose}: {onclose: () => void}) {
  const [content, setContent] = useState<'manage' | 'register'>('manage');
  const formRef = useRef<{submitForm: () => void} | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const mutation = useMutation({
    mutationFn: async (body: PostActivitiesBody) => {
      const response = await postActivities(body);
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
      alert(`${error.message}`);
    },
  });

  const handleSubmit = (data: PostActivitiesBody) => {
    console.log('Form Data from Parent:', data);

    mutation.mutate(data);
  };

  const triggerSubmit = () => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onclose();
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="mb-2 flex justify-end tablet:hidden">
          <Image onClick={onclose} src={closeButton} alt="모달 닫기 버튼" className="cursor-pointer" width={48} height={48} />
        </div>
        <div className="mb-16 h-full w-full">
          <div className="item-center mb-4 flex justify-between tablet:mb-6 tablet:mt-0">
            <h1 className="text-3xl font-bold">{content === 'manage' ? '내 체험 관리' : '내 체험 등록'}</h1>
            {content === 'manage' ? (
              <>
                <Button
                  onClick={() => setContent('register')}
                  className="h-[48px] w-[120px] gap-[4px] rounded-[4px] bg-primary pb-[8px] pl-[16px] pr-[16px] pt-[8px] text-white"
                >
                  체험 등록하기
                </Button>
              </>
            ) : (
              <Button
                onClick={triggerSubmit} // 버튼 클릭 시 자식 컴포넌트의 폼 제출 트리거
                className={`h-[48px] w-[120px] gap-[4px] rounded-[4px] pb-[8px] pl-[16px] pr-[16px] pt-[8px] text-white ${
                  isValid ? 'bg-primary' : 'bg-gray-500'
                }`}
              >
                등록하기
              </Button>
            )}
          </div>

          {content === 'manage' && (
            <InfiniteScroll
              className="h-500pxr w-full pc:h-700pxr"
              queryKey="key"
              fetchData={context => getActivitiesList({...context, meta: {size: 20}})}
              render={group => (
                <div className="flex flex-col gap-2 tablet:gap-4 pc:gap-6">
                  {group.pages.flatMap(page =>
                    page.map((data: Activity) => (
                      <Fragment key={data.id}>
                        <ActivitiesCard data={data} />
                      </Fragment>
                    )),
                  )}
                </div>
              )}
            ></InfiniteScroll>
          )}

          {content === 'register' && (
            <>
              <ActivitiesRegister ref={formRef} onSubmitParent={handleSubmit} onValidChange={setIsValid} />
            </>
          )}
        </div>
      </div>
      {isOpen && <Modal type="big" message="체험 등록이 완료되었습니다" onClose={handleClose} />}
    </>
  );
}
