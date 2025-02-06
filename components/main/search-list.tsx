import {JSX} from 'react';
import Image from 'next/image';
import ExPopular from '@/public/img/img_exPopular.webp';
import Star from '@/public/icon/ic_yellowStar.svg';
import Pagenation from '@/components/common/pagenation';
interface SearchListProps {
  keyword: string;
}

export default function SearchList({keyword}: SearchListProps): JSX.Element {
  const handlePageChange = (page: number) => {
    console.log(page);
  };

  return (
    <div className="mb-[12.688rem] tablet:mb-[41.063rem] pc:mb-[20.375rem]">
      <div className="tablet:mb-18 mx-auto mb-16 flex flex-col items-center justify-center">
        <section className="mb-40pxr mt-101pxr flex flex-col items-start gap-3 tablet:mt-110pxr pc:mt-126pxr pc:gap-8">
          <h2 className="text-[1.5rem]/[1.75rem] font-regular text-black-100 tablet:text-[2rem]/[2.375rem]">
            <span className="font-bold">{keyword}</span>(으)로 검색한 결과입니다.
          </h2>
          <div className="text-lg font-regular">총 200개의 결과</div>
        </section>
        <section>
          <div className="grid grid-cols-2 gap-x-2 gap-y-6 tablet:grid-cols-3 tablet:gap-x-4 tablet:gap-y-[3.75rem] pc:grid-cols-4 pc:gap-x-6 pc:gap-y-[4.313rem]">
            {/* 카드 1 */}
            <div className="flex flex-col gap-16pxr">
              <div className="relative flex h-168pxr w-168pxr flex-col gap-16pxr tablet:h-221pxr tablet:w-221pxr">
                <Image src={ExPopular} alt="부산 광안리 드론쇼" fill className="rounded-3xl" />
              </div>
              <div className="flex w-164pxr flex-col gap-15pxr tablet:w-220pxr pc:w-283pxr">
                <div className="flex flex-col gap-10pxr">
                  <div className="flex gap-3pxr">
                    <Image src={Star} alt="별" width={18} height={18} />
                    <div className="flex gap-5pxr">
                      <span className="text-lg font-medium text-black-100 tablet:text-[1rem]/[1.188rem] pc:text-lg">4.9</span>
                      <span className="text-lg font-medium text-gray-500 tablet:text-[1rem]/[1.188rem] pc:text-lg">(293)</span>
                    </div>
                  </div>
                  <h3 className="text-2lg font-semibold text-black-100 tablet:text-[1.5rem]/[1.75rem] pc:text-2xl">부산 광안리 드론쇼</h3>
                </div>
                <div className="flex items-center gap-5pxr">
                  <span className="text-xl font-bold tablet:text-[1.75rem]/[2.063rem] pc:text-2xl">₩ 0</span>
                  <span className="text-lg font-regular text-gray-800 tablet:text-[1.25rem]/[1.438rem] pc:text-xl">/ 인</span>
                </div>
              </div>
            </div>

            {/* 카드 2 */}
            <div className="flex flex-col gap-16pxr">
              <div className="relative flex h-168pxr w-168pxr flex-col gap-16pxr tablet:h-221pxr tablet:w-221pxr">
                <Image src={ExPopular} alt="서울 야경 투어" fill className="rounded-3xl" />
              </div>
              <div className="flex w-164pxr flex-col gap-15pxr tablet:w-220pxr pc:w-283pxr">
                <div className="flex flex-col gap-10pxr">
                  <div className="flex gap-3pxr">
                    <Image src={Star} alt="별" width={18} height={18} />
                    <div className="flex gap-5pxr">
                      <span className="text-lg font-medium text-black-100 tablet:text-[1rem]/[1.188rem] pc:text-lg">4.8</span>
                      <span className="text-lg font-medium text-gray-500 tablet:text-[1rem]/[1.188rem] pc:text-lg">(205)</span>
                    </div>
                  </div>
                  <h3 className="text-2lg font-semibold text-black-100 tablet:text-[1.5rem]/[1.75rem] pc:text-2xl">서울 야경 투어</h3>
                </div>
                <div className="flex items-center gap-5pxr">
                  <span className="text-xl font-bold tablet:text-[1.75rem]/[2.063rem] pc:text-2xl">₩ 30,000</span>
                  <span className="text-lg font-regular text-gray-800 tablet:text-[1.25rem]/[1.438rem] pc:text-xl">/ 인</span>
                </div>
              </div>
            </div>

            {/* 카드 3 */}
            <div className="flex flex-col gap-16pxr">
              <div className="relative flex h-168pxr w-168pxr flex-col gap-16pxr tablet:h-221pxr tablet:w-221pxr">
                <Image src={ExPopular} alt="제주 섬 투어" fill className="rounded-3xl" />
              </div>
              <div className="flex w-164pxr flex-col gap-15pxr tablet:w-220pxr pc:w-283pxr">
                <div className="flex flex-col gap-10pxr">
                  <div className="flex gap-3pxr">
                    <Image src={Star} alt="별" width={18} height={18} />
                    <div className="flex gap-5pxr">
                      <span className="text-lg font-medium text-black-100 tablet:text-[1rem]/[1.188rem] pc:text-lg">4.7</span>
                      <span className="text-lg font-medium text-gray-500 tablet:text-[1rem]/[1.188rem] pc:text-lg">(150)</span>
                    </div>
                  </div>
                  <h3 className="text-2lg font-semibold text-black-100 tablet:text-[1.5rem]/[1.75rem] pc:text-2xl">제주 섬 투어</h3>
                </div>
                <div className="flex items-center gap-5pxr">
                  <span className="text-xl font-bold tablet:text-[1.75rem]/[2.063rem] pc:text-2xl">₩ 50,000</span>
                  <span className="text-lg font-regular text-gray-800 tablet:text-[1.25rem]/[1.438rem] pc:text-xl">/ 인</span>
                </div>
              </div>
            </div>

            {/* 카드 4 */}
            <div className="flex flex-col gap-16pxr">
              <div className="relative flex h-168pxr w-168pxr flex-col gap-16pxr tablet:h-221pxr tablet:w-221pxr">
                <Image src={ExPopular} alt="강릉 바다 여행" fill className="rounded-3xl" />
              </div>
              <div className="flex w-164pxr flex-col gap-15pxr tablet:w-220pxr pc:w-283pxr">
                <div className="flex flex-col gap-10pxr">
                  <div className="flex gap-3pxr">
                    <Image src={Star} alt="별" width={18} height={18} />
                    <div className="flex gap-5pxr">
                      <span className="text-lg font-medium text-black-100 tablet:text-[1rem]/[1.188rem] pc:text-lg">4.6</span>
                      <span className="text-lg font-medium text-gray-500 tablet:text-[1rem]/[1.188rem] pc:text-lg">(120)</span>
                    </div>
                  </div>
                  <h3 className="text-2lg font-semibold text-black-100 tablet:text-[1.5rem]/[1.75rem] pc:text-2xl">강릉 바다 여행</h3>
                </div>
                <div className="flex items-center gap-5pxr">
                  <span className="text-xl font-bold tablet:text-[1.75rem]/[2.063rem] pc:text-2xl">₩ 40,000</span>
                  <span className="text-lg font-regular text-gray-800 tablet:text-[1.25rem]/[1.438rem] pc:text-xl">/ 인</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Pagenation size={31} showItemCount={3} onChange={handlePageChange} />
    </div>
  );
}
