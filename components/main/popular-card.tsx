import Image from 'next/image';
import Link from 'next/link';
import Star from '@/public/icon/ic_yellowStar.svg';
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperType from 'swiper';
import {Activities} from '@/types/activities';
import useLocalStorage from 'use-local-storage';
import {useEffect, useState} from 'react';

interface PopularCardProps {
  className?: string;
  data?: Activities[];
  fetchNextpage: () => void;
  hasNextPage: boolean;
}

export default function PopularCard({data, className = '', fetchNextpage, hasNextPage}: PopularCardProps) {
  const [scrollX, setScrollX] = useLocalStorage('places_list_scroll', 0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

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
    <div className={className}>
      <Swiper
        onSwiper={onSwiper}
        onSlideChange={onSlideChange}
        spaceBetween={16}
        slidesPerView="auto"
        onReachEnd={handleReachEnd}
        breakpoints={{
          340: {slidesPerView: 2, spaceBetween: 10},
          745: {slidesPerView: 2},
          1200: {slidesPerView: 3},
        }}
      >
        {data?.map(({title, price, bannerImageUrl, rating, reviewCount, id}, index) => (
          <SwiperSlide key={`${id}-${index}`}>
            <Link href={`/activities/${id}`}>
              <div className="relative flex h-[186px] w-[186px] items-end overflow-hidden rounded-3xl bg-gray-300 tablet:h-[384px] tablet:w-[384px]">
                {/* 배경 이미지 */}
                <div className="absolute inset-0">
                  <Image src={bannerImageUrl} alt={title} layout="fill" objectFit="cover" />
                </div>
                {/* 어두운 오버레이 추가 */}
                <div className="absolute inset-0 bg-black-50 opacity-20"></div> {/* 어두운 오버레이 */}
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
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
