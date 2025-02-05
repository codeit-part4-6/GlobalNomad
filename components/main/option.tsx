/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {useState, useRef} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation} from 'swiper/modules'; // Navigation, Pagination 모듈 추가
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Button from '@/components/common/button';
import arrow from '@/public/icon/ic_arrow_next.svg';
import Image from 'next/image';

interface OptionType {
  className: string;
}

export default function Option({className}: OptionType) {
  const [optionState, setOptionState] = useState({price: '가격'});
  const [activeCategory, setActiveCategory] = useState<string | null>(null); // 현재 선택된 카테고리

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOptionState({...optionState, price: event.target.value});
  };

  // Swiper 인스턴스 참조
  const swiperRef = useRef<any>(null);

  const categories = [
    {id: 'culture', label: '문화·예술'},
    {id: 'food', label: '식음료'},
    {id: 'sports', label: '스포츠'},
    {id: 'tour', label: '투어'},
    {id: 'sightseeing', label: '관광'},
    {id: 'wellbeing', label: '웰빙'},
  ];

  // 오른쪽으로 이동하는 함수
  const handleNextClick = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext(); // 클릭 시 오른쪽으로 이동
    }
  };

  return (
    <div className={className}>
      <Swiper
        ref={swiperRef} // Swiper 인스턴스를 참조
        slidesPerView="auto"
        spaceBetween={10}
        breakpoints={{
          340: {
            slidesPerView: 3, // 모바일: 3개
          },
          745: {
            slidesPerView: 4, // 태블릿: 4개
          },
          1200: {
            slidesPerView: 6, // PC: 6개
          },
        }}
        modules={[Navigation]}
      >
        {categories.map(category => (
          <SwiperSlide key={category.id}>
            <Button
              type="button"
              className={`tablet:w-30 flex h-10 w-20 items-center justify-center gap-2 rounded-[0.938rem] border border-primary text-lg font-medium text-primary hover:bg-secondary tablet:h-[3.625rem] tablet:gap-[0.875rem] tablet:text-2lg pc:w-[7.938rem] pc:gap-6 ${activeCategory === category.id ? 'bg-primary text-white' : ''} `}
              onClick={() => setActiveCategory(category.id)} // 버튼 클릭 시 상태 변경
            >
              {category.label}
            </Button>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 오른쪽 화살표 버튼 클릭 시 이동 */}
      <Button
        onClick={handleNextClick} // 버튼 클릭 시 오른쪽으로 이동
        className="absolute right-[13rem] top-[80rem] z-20 hidden h-8 w-8 translate-y-1/2 transform rounded-full border tablet:flex tablet:items-center tablet:justify-center tablet:hover:bg-secondary pc:hidden"
      >
        <Image src={arrow} alt="오른쪽 화살표" width={7} height={13} />
      </Button>

      <select defaultValue="default" onChange={handleChange} className="rounded border px-2 py-1">
        <option value="default" disabled hidden>
          가격
        </option>
        <option value="price_desc">가격이 낮은 순</option>
        <option value="price_asc">가격이 높은 순</option>
      </select>
    </div>
  );
}
