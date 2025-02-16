import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay} from 'swiper/modules';
import {banners} from '@/constant/banners';

export default function MainBanner() {
  return (
    <Swiper
      modules={[Autoplay]}
      spaceBetween={0}
      slidesPerView={1}
      loop={true}
      autoplay={{delay: 3000, disableOnInteraction: false}}
      className="h-full w-full"
    >
      {banners.map((banner, index) => (
        <SwiperSlide key={index}>
          <div className="flex h-full w-full items-center bg-cover bg-center bg-no-repeat" style={{backgroundImage: `url(${banner.img})`}}>
            <div className="ml-6 text-white tablet:ml-32 pc:ml-80">
              <h3 className="mb-2 text-2xl font-bold tablet:text-5xl pc:text-6xl">{banner.title}</h3>
              <h2 className="text-lg font-semibold tablet:text-2xl">{banner.subtitle}</h2>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
