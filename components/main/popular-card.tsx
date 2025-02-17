import Image from 'next/image';
import Star from '@/public/icon/ic_yellowStar.svg';
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperType from 'swiper';
import {Activities} from '@/types/activities';
import useLocalStorage from 'use-local-storage';
import {useEffect, useState} from 'react';
import {Navigation} from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css';
import {useRouter} from 'next/navigation';
import leftButton from '@/public/icon/ic_left.svg';
import rightButton from '@/public/icon/ic_right.svg';

interface PopularCardProps {
  data?: Activities[];
  fetchNextpage: () => void;
  hasNextPage: boolean;
}

export default function PopularCard({data, fetchNextpage, hasNextPage}: PopularCardProps) {
  const [scrollX, setScrollX] = useLocalStorage('places_list_scroll', 0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const router = useRouter();

  const onSwiper = (swiper: SwiperType) => {
    setSwiperInstance(swiper);
  };

  const onSlideChange = () => {
    if (swiperInstance) {
      setScrollX(swiperInstance.realIndex);
    }
  };

  useEffect(() => {
    if (swiperInstance && scrollX !== 0) {
      swiperInstance.slideTo(scrollX, 0);
    }
  }, [swiperInstance, scrollX]);

  const handleReachEnd = () => {
    if (hasNextPage) {
      fetchNextpage();
    }
  };

  return (
    <>
      <div className="relative flex w-full items-center justify-between px-4 tablet:px-6 pc:px-0">
        <h2 className="text-[1.125rem]/[1.313rem] font-bold text-black-100 tablet:text-[2.25rem]/[2.625rem]">🔥 인기 체험</h2>
        <div className="absolute right-9 hidden pc:flex pc:items-center pc:gap-3">
          <button className="font-medium !text-gray-800" onClick={() => swiperInstance?.slidePrev()}>
            <div className="relative h-9 w-9">
              <Image src={leftButton} alt="슬라이드 좌측 버튼" fill className="absolute" />
            </div>
          </button>
          <button className="font-medium !text-gray-800" onClick={() => swiperInstance?.slideNext()}>
            <div className="relative h-9 w-9">
              <Image src={rightButton} alt="슬라이드 우측 버튼" fill className="absolute" />
            </div>
          </button>
        </div>
      </div>

      <div>
        <Swiper
          style={{width: '100%'}}
          modules={[Navigation]}
          onSwiper={onSwiper}
          onSlideChange={onSlideChange}
          onReachEnd={handleReachEnd}
          breakpoints={{
            375: {slidesPerView: 2, spaceBetween: 8},
            420: {slidesPerView: 2.5, spaceBetween: 8},
            580: {slidesPerView: 3, spaceBetween: 8},
            630: {slidesPerView: 3.5, spaceBetween: 8},
            745: {slidesPerView: 2, spaceBetween: 16},
            970: {slidesPerView: 2.5, spaceBetween: 16},
            1200: {slidesPerView: 3, spaceBetween: 24},
          }}
        >
          {data?.map(({title, price, bannerImageUrl, rating, reviewCount, id}, index) => (
            <SwiperSlide key={`${id}-${index}`} className="w-auto">
              <div
                className="relative flex h-[186px] w-[186px] cursor-pointer items-end rounded-3xl bg-gray-300 tablet:h-[384px] tablet:w-[384px]"
                onClick={() => router.push(`/activities/${id}`)}
              >
                {/* 배경 이미지 */}
                <div className="absolute inset-0">
                  <Image src={bannerImageUrl} alt={title} layout="fill" objectFit="cover" className="rounded-3xl" />
                </div>
                {/* 어두운 오버레이 추가 */}
                <div className="absolute inset-0 rounded-3xl bg-black-50 opacity-20"></div> {/* 어두운 오버레이 */}
                {/* 카드 내용 */}
                <div className="relative z-10 p-4 text-white tablet:p-6">
                  <div className="flex items-center gap-2">
                    <Image src={Star} alt="별" width={18} height={18} />
                    <span className="text-sm font-semibold">
                      {rating} ({reviewCount})
                    </span>
                  </div>
                  <h3 className="mt-1 line-clamp-2 text-lg font-bold tablet:text-xl pc:text-2xl">{title}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-md font-semibold tablet:text-lg">₩ {price.toLocaleString()}</span>
                    <span className="text-sm font-regular text-gray-300">/ 인</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
