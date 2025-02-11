import Image from 'next/image';
import Link from 'next/link';
import Star from '@/public/icon/ic_yellowStar.svg';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination} from 'swiper/modules';
import {ActivitiesResponse} from '@/types/activities';

interface PopularCardProps {
  className?: string;
  data?: ActivitiesResponse;
}

export default function PopularCard({data, className = ''}: PopularCardProps) {
  return (
    <div className={className}>
      <Swiper
        modules={[Pagination]}
        spaceBetween={16}
        slidesPerView="auto"
        breakpoints={{
          340: {slidesPerView: 2, spaceBetween: 10},
          745: {slidesPerView: 2},
          1200: {slidesPerView: 3},
        }}
      >
        {data?.activities?.map(({title, price, bannerImageUrl, rating, reviewCount, id}) => (
          <SwiperSlide key={id}>
            <Link href={`/activities/${id}`}>
              <div className="relative flex h-[186px] w-[186px] items-end overflow-hidden rounded-3xl bg-gray-300 tablet:h-[384px] tablet:w-[384px]">
                {/* 배경 이미지 */}
                <Image src={bannerImageUrl} alt={title} layout="fill" objectFit="cover" />

                {/* 카드 내용 */}
                <div className="from-black/60 relative z-10 bg-gradient-to-t to-transparent p-4 text-white tablet:p-6">
                  <div className="flex items-center gap-2">
                    <Image src={Star} alt="별" width={18} height={18} />
                    <span className="text-sm font-semibold">
                      {rating} ({reviewCount})
                    </span>
                  </div>
                  <h3 className="mt-1 text-lg font-bold tablet:text-xl">{title}</h3>
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
