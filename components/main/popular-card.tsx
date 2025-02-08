import Image from 'next/image';
import Star from '@/public/icon/ic_yellowStar.svg';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination} from 'swiper/modules';

interface PopularCardType {
  className: string;
}

export default function PopularCard({className}: PopularCardType) {
  return (
    <div className={className}>
      <Swiper
        modules={[Pagination]} // Pagination 모듈 추가
        spaceBetween={16} // 슬라이드 간격
        slidesPerView="auto" // 한 번에 보이는 슬라이드 개수
        breakpoints={{
          // 반응형 설정
          340: {slidesPerView: 2, spaceBetween: 10}, // Tablet 이상에서 2개씩
          745: {slidesPerView: 2}, // Tablet 이상에서 2개씩
          1200: {slidesPerView: 3}, // Desktop에서 3개씩
        }}
      >
        <SwiperSlide key={'SwiperSlide1'}>
          <div className="flex h-186pxr w-186pxr items-end rounded-3xl bg-[url('/img/img_exPopular.webp')] bg-cover bg-no-repeat text-white tablet:h-384pxr tablet:w-384pxr">
            <div className="gap-6pxr pb-24pxr pl-20pxr pt-42pxr">
              <div className="flex gap-5pxr">
                <Image src={Star} alt="별" width={18} height={18} />
                <span className="text-md font-semibold">4.9 (293)</span>
              </div>
              <h3 className="text-2lg font-bold tablet:text-3xl">부산 광안리 드론쇼</h3>
              <div className="flex items-center gap-5pxr">
                <span className="text-lg font-semibold tablet:text-xl">₩ 0</span>
                <span className="text-md font-regular text-gray-600">/ 인</span>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide key={'SwiperSlide2'}>
          <div className="flex h-186pxr w-186pxr items-end rounded-3xl bg-[url('/img/img_exPopular.webp')] bg-cover bg-no-repeat text-white tablet:h-384pxr tablet:w-384pxr">
            <div className="gap-6pxr pb-24pxr pl-20pxr pt-42pxr">
              <div className="flex gap-5pxr">
                <Image src={Star} alt="별" width={18} height={18} />
                <span className="text-md font-semibold">4.9 (293)</span>
              </div>
              <h3 className="text-2lg font-bold tablet:text-3xl">서울 야경 투어</h3>
              <div className="flex items-center gap-5pxr">
                <span className="text-lg font-semibold tablet:text-xl">₩ 0</span>
                <span className="text-md font-regular text-gray-600">/ 인</span>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide key={'SwiperSlide3'}>
          <div className="flex h-186pxr w-186pxr items-end rounded-3xl bg-[url('/img/img_exPopular.webp')] bg-cover bg-no-repeat text-white tablet:h-384pxr tablet:w-384pxr">
            <div className="gap-6pxr pb-24pxr pl-20pxr pt-42pxr">
              <div className="flex gap-5pxr">
                <Image src={Star} alt="별" width={18} height={18} />
                <span className="text-md font-semibold">4.9 (293)</span>
              </div>
              <h3 className="text-2lg font-bold tablet:text-3xl">제주 섬 투어</h3>
              <div className="flex items-center gap-5pxr">
                <span className="text-lg font-semibold tablet:text-xl">₩ 0</span>
                <span className="text-md font-regular text-gray-600">/ 인</span>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide key={'SwiperSlide4'}>
          <div className="flex h-186pxr w-186pxr items-end rounded-3xl bg-[url('/img/img_exPopular.webp')] bg-cover bg-no-repeat text-white tablet:h-384pxr tablet:w-384pxr">
            <div className="flex flex-col gap-6pxr pb-24pxr pl-20pxr pt-42pxr">
              <div className="flex gap-5pxr">
                <Image src={Star} alt="별" width={18} height={18} />
                <span className="text-md font-semibold">4.9 (293)</span>
              </div>
              <h3 className="text-2lg font-bold tablet:text-3xl">제주 섬 투어</h3>
              <div className="flex items-center gap-5pxr">
                <span className="text-lg font-semibold tablet:text-xl">₩ 0</span>
                <span className="text-md font-regular text-gray-600">/ 인</span>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide key={'SwiperSlide5'}>
          <div className="flex h-186pxr w-186pxr items-end rounded-3xl bg-[url('/img/img_exPopular.webp')] bg-cover bg-no-repeat text-white tablet:h-384pxr tablet:w-384pxr">
            <div className="flex flex-col gap-6pxr pb-24pxr pl-20pxr pt-42pxr">
              <div className="flex gap-5pxr">
                <Image src={Star} alt="별" width={18} height={18} />
                <span className="text-md font-semibold">4.9 (293)</span>
              </div>
              <h3 className="text-2lg font-bold tablet:text-3xl">제주 섬 투어</h3>
              <div className="flex items-center gap-5pxr">
                <span className="text-lg font-semibold tablet:text-xl">₩ 0</span>
                <span className="text-md font-regular text-gray-600">/ 인</span>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide key={'SwiperSlide6'}>
          <div className="flex h-186pxr w-186pxr items-end rounded-3xl bg-[url('/img/img_exPopular.webp')] bg-cover bg-no-repeat text-white tablet:h-384pxr tablet:w-384pxr">
            <div className="flex flex-col gap-6pxr pb-24pxr pl-20pxr pt-42pxr">
              <div className="flex gap-5pxr">
                <Image src={Star} alt="별" width={18} height={18} />
                <span className="text-md font-semibold">4.9 (293)</span>
              </div>
              <h3 className="text-2lg font-bold tablet:text-3xl">제주 섬 투어</h3>
              <div className="flex items-center gap-5pxr">
                <span className="text-lg font-semibold tablet:text-xl">₩ 0</span>
                <span className="text-md font-regular text-gray-600">/ 인</span>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
