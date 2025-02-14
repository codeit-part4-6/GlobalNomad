'use client';
import React from 'react';
import {StaticImport} from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';

interface BannerType {
  device: string;
  bannerImg?: string | StaticImport;
  subImages: {id: number; imageUrl: string}[];
}

const BannerFromDivceType = ({device, bannerImg, subImages}: BannerType) => {
  switch (device) {
    case 'mobile':
      return <div className="relative h-310pxr w-full">{bannerImg && <Image src={bannerImg} fill alt="bannerImag" />}</div>;
    default:
      return (
        <div className="my-32pxr mb-85pxr flex min-h-310pxr min-w-375pxr flex-row gap-8pxr tablet:min-h-310pxr tablet:min-w-696pxr pc:min-h-534pxr pc:min-w-[75rem]">
          <div className="relative min-h-310pxr min-w-375pxr tablet:min-h-310pxr tablet:min-w-346pxr pc:min-h-534pxr pc:min-w-595pxr">
            {bannerImg && <Image className="rounded-l-lg" src={bannerImg} fill alt="bannerImag" priority />}
          </div>
          <div className="flex min-h-310pxr w-full min-w-375pxr flex-row flex-wrap items-start p-0 tablet:h-310pxr tablet:w-346pxr tablet:gap-4pxr pc:h-534pxr pc:w-595pxr pc:gap-8pxr">
            {subImages.map((dt, idx) => (
              <div key={`${idx}-subImages`} className={`relative min-h-152pxr min-w-170pxr tablet:h-152pxr tablet:w-160pxr pc:h-263pxr pc:w-290pxr`}>
                <Image className={`${idx === 1 && 'rounded-tr-lg'} ${idx === 3 && 'rounded-br-lg'}`} src={dt.imageUrl} fill alt="subImages" />
              </div>
            ))}
          </div>
        </div>
      );
  }
};

export default BannerFromDivceType;
