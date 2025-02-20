import {useState} from 'react';
import Image from 'next/image';
import {Activity} from '@/types/myactivities';
import Dropbox from '@/components/common/dropbox';
import iconStar from '@/public/icon/ic_star.svg';
import iconMeatball from '@/public/icon/ic_meatball.svg';
import {dropboxItems} from '@/constant/myactivities-constant';

interface ActivitiesCardProps {
  data: Activity;
  onClickModify: () => void;
  onClickDelete: () => void;
}

export default function ActivitiesCard({data, onClickModify, onClickDelete}: ActivitiesCardProps) {
  const [isOpenDropbox, setIsOpenDropbox] = useState(false);

  const handleClick = (type: string) => {
    setIsOpenDropbox(false);

    if (type === 'modify') {
      onClickModify();
    } else if (type === 'delete') {
      onClickDelete();
    }
  };

  return (
    <>
      <div className="relative">
        <div
          key={data.id}
          className="flex items-center gap-2 overflow-hidden rounded-3xl bg-white shadow-sidenavi-box dark:bg-sky-100/20 tablet:gap-3 pc:h-204pxr pc:gap-6"
        >
          <div className="relative aspect-[1/1] h-128pxr w-128pxr tablet:h-156pxr tablet:w-156pxr pc:h-204pxr pc:w-204pxr">
            <Image className="absolute rounded-bl-3xl rounded-tl-3xl" src={data.bannerImageUrl} alt="체험관리사진" fill />
          </div>
          <div className="flex flex-grow flex-col items-start py-11pxr pl-2 pr-4 tablet:pl-3 tablet:pr-5 pc:w-548pxr pc:py-22pxr">
            <div className="flex gap-6pxr">
              <Image src={iconStar} width={16} height={16} alt="별점" />
              <div className="text-md tablet:text-lg">
                {data.rating} ({data.reviewCount})
              </div>
            </div>
            <div className="mb-28pxr line-clamp-1 text-md font-bold tablet:mb-33pxr tablet:text-2lg pc:mb-72pxr pc:text-xl">{data.title}</div>
            <div className="flex w-full items-center justify-between pr-2">
              <div className="flex items-center gap-1 text-lg font-medium tablet:text-xl">
                <div>₩{data.price.toLocaleString('ko-KR')}</div>
                <span className="text-lg text-gray-800">/ 인</span>
              </div>
              <Image className="cursor-pointer" onClick={() => setIsOpenDropbox(true)} src={iconMeatball} width={32} height={32} alt="자세히보기" />
            </div>
          </div>
        </div>
        {/* 부모 div 안에서 Dropbox를 오른쪽 아래로 배치 */}
        {isOpenDropbox && (
          <Dropbox
            onClick={handleClick}
            onClose={() => setIsOpenDropbox(false)}
            className="bottom-[-90pxr] right-0 z-10 mb-4 mr-4 w-160pxr"
            items={dropboxItems}
          />
        )}
      </div>
    </>
  );
}
