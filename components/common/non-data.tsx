import React from 'react';
import Image from 'next/image';
import nonData from '@/public/img/img_non_data.svg';

interface NonDataPageProps {
  type?: 'modal' | '';
}

export default function NonDataPage({type}: NonDataPageProps) {
  if (type === 'modal') {
    return (
      <div className="flex min-h-500pxr flex-col items-center justify-center gap-3 pc:gap-5">
        <div className="pc:h-30 pc:w-30 relative h-150pxr w-150pxr">
          <Image src={nonData} alt="내역이 없어요" fill className="absolute" />
        </div>
        <p className="text-lg font-medium text-gray-700">아직 등록한 체험이 없어요</p>
      </div>
    );
  }

  return (
    <div className="mt-60pxr flex min-h-500pxr flex-col items-center justify-center gap-3 tablet:mt-14 pc:mt-86pxr pc:gap-5">
      <div className="relative h-200pxr w-200pxr pc:h-60 pc:w-60">
        <Image src={nonData} alt="내역이 없어요" fill className="absolute" />
      </div>
      <p className="text-xl font-medium text-gray-700">아직 등록한 체험이 없어요</p>
    </div>
  );
}
