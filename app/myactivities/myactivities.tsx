import Button from '@/components/common/button';
import {useState, useRef} from 'react';
import ActivitiesCard from './activities-card';
import ActivitiesRegister, {IFormInput} from './activities-register';

export default function MyActivities() {
  const [content, setContent] = useState<'manage' | 'register'>('manage');
  const formRef = useRef<{submitForm: () => void} | null>(null);

  const handleSubmit = (data: IFormInput) => {
    console.log('Form Data from Parent:', data);
  };

  const triggerSubmit = () => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  };

  return (
    <>
      <div className="item-center mb-4 mt-4 flex justify-between tablet:mb-6 tablet:mt-0">
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
            className="h-[48px] w-[120px] gap-[4px] rounded-[4px] bg-primary pb-[8px] pl-[16px] pr-[16px] pt-[8px] text-white"
          >
            등록하기
          </Button>
        )}
      </div>

      {content === 'manage' && (
        <div className="flex flex-col gap-6">
          <ActivitiesCard />
          <ActivitiesCard />
          <ActivitiesCard />
        </div>
      )}

      {content === 'register' && (
        <>
          <ActivitiesRegister ref={formRef} onSubmitParent={handleSubmit} />
        </>
      )}
    </>
  );
}
