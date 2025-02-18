'use client';

import React, {useState} from 'react';

import Error from '@/public/img/img_404.svg';
import {useRouter} from 'next/navigation';
import Image from 'next/image';
import Button from '@/components/common/button';
import {ScaleLoader} from 'react-spinners';

export default function NotFound() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setIsLoading(true);
    router.push('/');
  };

  return (
    <div className="max-h-900pxr h-full w-full py-8">
      <div className="flex flex-col items-center justify-center gap-10 tablet:gap-4">
        <section>
          <div className="relative h-300pxr w-300pxr tablet:h-450pxr tablet:w-450pxr">
            <Image src={Error} alt="404 이미지" fill className="absolute" />
          </div>
        </section>
        <section>
          <div className="text-center">
            <h1 className="dark:text-dark-primary pb-4 text-2xl font-bold text-nomad-black tablet:pb-2 tablet:text-3xl">
              페이지가 없거나 접근할 수 없어요
            </h1>
            <h2 className="text-lg font-medium text-gray-800 tablet:text-2lg dark:text-gray-50">입력하신 주소가 맞는지 다시 확인해주세요!</h2>
          </div>
        </section>
        <section>
          <div>
            <Button
              onClick={handleClick}
              disabled={isLoading}
              type="button"
              className="h-56pxr whitespace-nowrap rounded bg-nomad-black px-20pxr text-lg font-bold text-white tablet:px-10 tablet:py-2"
            >
              {isLoading ? <ScaleLoader width={2} height={10} color="white" /> : '돌아가기'}
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
