import Image from 'next/image';
import ExPopular from '@/public/img/img_exPopular.webp';
import Star from '@/public/icon/ic_yellowStar.svg';
import Pagenation from '../common/pagenation';

export default function EntireCard() {
  const handlePageChange = (page: number) => {
    console.log(page);
  };

  return (
    <div className="flex flex-col">
      <div className="tablet:mb-18 mb-16 grid w-[21.5rem] grid-cols-2 gap-x-2 gap-y-[0.313rem] tablet:w-[43.438rem] tablet:grid-cols-3 tablet:gap-x-8 tablet:gap-y-4 pc:w-[75.25rem] pc:grid-cols-4 pc:gap-x-6 pc:gap-y-12">
        {/* 카드 1 */}
        <div className="flex flex-col gap-16pxr">
          <div className="relative flex h-168pxr w-168pxr flex-col gap-16pxr tablet:h-221pxr tablet:w-221pxr pc:h-283pxr pc:w-283pxr">
            <Image src={ExPopular} alt="부산 광안리 드론쇼" fill className="rounded-3xl" />
          </div>
          <div className="flex flex-col gap-15pxr">
            <div className="flex flex-col gap-10pxr">
              <div className="flex gap-3pxr">
                <Image src={Star} alt="별" width={18} height={18} />
                <div className="flex gap-5pxr">
                  <span className="text-lg font-medium text-black-100 tablet:text-[1rem]/[1.188rem]">4.9</span>
                  <span className="text-lg font-medium text-gray-500 tablet:text-[1rem]/[1.188rem]">(293)</span>
                </div>
              </div>
              <h3 className="text-2lg font-semibold text-black-100 tablet:text-[1.5rem]/[1.75rem]">부산 광안리 드론쇼</h3>
            </div>
            <div className="flex items-center gap-5pxr">
              <span className="text-lg font-semibold tablet:text-[1.75rem]/[2.063rem]">₩ 0</span>
              <span className="text-md font-regular text-gray-800 tablet:text-[1.25rem]/[1.438rem]">/ 인</span>
            </div>
          </div>
        </div>

        {/* 카드 2 */}
        <div className="flex flex-col gap-16pxr">
          <div className="relative flex h-168pxr w-168pxr flex-col gap-16pxr tablet:h-221pxr tablet:w-221pxr pc:h-283pxr pc:w-283pxr">
            <Image src={ExPopular} alt="서울 야경 투어" fill className="rounded-3xl" />
          </div>
          <div className="flex flex-col gap-15pxr">
            <div className="flex flex-col gap-10pxr">
              <div className="flex gap-3pxr">
                <Image src={Star} alt="별" width={18} height={18} />
                <div className="flex gap-5pxr">
                  <span className="text-lg font-medium text-black-100 tablet:text-[1rem]/[1.188rem]">4.8</span>
                  <span className="text-lg font-medium text-gray-500 tablet:text-[1rem]/[1.188rem]">(205)</span>
                </div>
              </div>
              <h3 className="text-2lg font-semibold text-black-100 tablet:text-[1.5rem]/[1.75rem]">서울 야경 투어</h3>
            </div>
            <div className="flex items-center gap-5pxr">
              <span className="text-lg font-semibold tablet:text-[1.75rem]/[2.063rem]">₩ 30,000</span>
              <span className="text-md font-regular text-gray-800 tablet:text-[1.25rem]/[1.438rem]">/ 인</span>
            </div>
          </div>
        </div>

        {/* 카드 3 */}
        <div className="flex flex-col gap-16pxr">
          <div className="relative flex h-168pxr w-168pxr flex-col gap-16pxr tablet:h-221pxr tablet:w-221pxr pc:h-283pxr pc:w-283pxr">
            <Image src={ExPopular} alt="제주 섬 투어" fill className="rounded-3xl" />
          </div>
          <div className="flex flex-col gap-15pxr">
            <div className="flex flex-col gap-10pxr">
              <div className="flex gap-3pxr">
                <Image src={Star} alt="별" width={18} height={18} />
                <div className="flex gap-5pxr">
                  <span className="text-lg font-medium text-black-100 tablet:text-[1rem]/[1.188rem]">4.7</span>
                  <span className="text-lg font-medium text-gray-500 tablet:text-[1rem]/[1.188rem]">(150)</span>
                </div>
              </div>
              <h3 className="text-2lg font-semibold text-black-100 tablet:text-[1.5rem]/[1.75rem]">제주 섬 투어</h3>
            </div>
            <div className="flex items-center gap-5pxr">
              <span className="text-lg font-semibold tablet:text-[1.75rem]/[2.063rem]">₩ 50,000</span>
              <span className="text-md font-regular text-gray-800 tablet:text-[1.25rem]/[1.438rem]">/ 인</span>
            </div>
          </div>
        </div>

        {/* 카드 4 */}
        <div className="flex flex-col gap-16pxr">
          <div className="relative flex h-168pxr w-168pxr flex-col gap-16pxr tablet:h-221pxr tablet:w-221pxr pc:h-283pxr pc:w-283pxr">
            <Image src={ExPopular} alt="강릉 바다 여행" fill className="rounded-3xl" />
          </div>
          <div className="flex flex-col gap-15pxr">
            <div className="flex flex-col gap-10pxr">
              <div className="flex gap-3pxr">
                <Image src={Star} alt="별" width={18} height={18} />
                <div className="flex gap-5pxr">
                  <span className="text-lg font-medium text-black-100 tablet:text-[1rem]/[1.188rem]">4.6</span>
                  <span className="text-lg font-medium text-gray-500 tablet:text-[1rem]/[1.188rem]">(120)</span>
                </div>
              </div>
              <h3 className="text-2lg font-semibold text-black-100 tablet:text-[1.5rem]/[1.75rem]">강릉 바다 여행</h3>
            </div>
            <div className="flex items-center gap-5pxr">
              <span className="text-lg font-semibold tablet:text-[1.75rem]/[2.063rem]">₩ 40,000</span>
              <span className="text-md font-regular text-gray-800 tablet:text-[1.25rem]/[1.438rem]">/ 인</span>
            </div>
          </div>
        </div>
      </div>
      <Pagenation size={31} showItemCount={3} onChange={handlePageChange} />
    </div>
  );
}
