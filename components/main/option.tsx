/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {useRef} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation} from 'swiper/modules'; // Navigation, Pagination 모듈 추가
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Button from '@/components/common/button';
import arrow from '@/public/icon/ic_arrow_next.svg';
import Image from 'next/image';
import {categories} from '@/constant/categories';
import SortSelect from './sort-select';
import {ActivitiesBody} from '@/types/activities';

interface OptionType {
  setActiveCategory: (category: string) => void;
  activeCategory: string | undefined;
  selectedSort: ActivitiesBody['sort'] | undefined;
  onSelectedSort: (value: ActivitiesBody['sort'] | undefined) => void;
}

export default function Option({activeCategory, setActiveCategory, selectedSort, onSelectedSort}: OptionType) {
  // Swiper 인스턴스 참조
  const swiperRef = useRef<any>(null);

  // 오른쪽으로 이동하는 함수
  const handleNextClick = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext(); // 클릭 시 오른쪽으로 이동
    }
  };

  return (
    <div className="flex w-full items-center justify-between">
      <Swiper
        className="!mx-0 flex w-full flex-grow pc:max-w-[900px]"
        ref={swiperRef} // Swiper 인스턴스를 참조
        slidesPerView="auto"
        breakpoints={{
          340: {
            slidesPerView: 3, // 모바일: 3개
          },
          500: {
            slidesPerView: 4.5, // 태블릿: 4개
          },
          600: {
            slidesPerView: 4,
          },
          745: {
            slidesPerView: 4, // 태블릿: 4개
          },
          1000: {
            slidesPerView: 5,
            spaceBetween: 10,
          },
          1200: {
            slidesPerView: 6, // PC: 6개
            spaceBetween: 10,
          },
        }}
        modules={[Navigation]}
      >
        {categories.map(category => (
          <SwiperSlide key={category.id}>
            <Button
              type="button"
              className={`flex h-10 w-20 items-center justify-center gap-2 rounded-[0.938rem] border border-primary text-lg font-medium text-primary hover:bg-secondary tablet:h-[3.625rem] tablet:w-[120px] tablet:gap-[0.875rem] tablet:text-2lg pc:w-[7.938rem] pc:gap-6 ${activeCategory === category.label ? 'bg-primary text-white' : ''} `}
              onClick={() => setActiveCategory(category.label)} // 버튼 클릭 시 상태 변경
            >
              {category.label}
            </Button>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* 오른쪽 화살표 버튼 클릭 시 이동 */}
      <div className="z-20 flex items-center bg-opacity-50 tablet:mr-4 tablet:h-[58px]">
        <Button
          onClick={handleNextClick} // 버튼 클릭 시 오른쪽으로 이동
          className="hidden h-8 w-8 rounded-full border tablet:flex tablet:items-center tablet:justify-center tablet:hover:bg-secondary pc:hidden"
        >
          <Image src={arrow} alt="오른쪽 화살표" width={7} height={13} />
        </Button>
      </div>
      <SortSelect selectedSort={selectedSort} onSelectedSort={onSelectedSort} />
    </div>
  );
}
