'use client';
import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import {useQuery} from 'react-query';
import {StaticImport} from 'next/dist/shared/lib/get-img-props';
import {notFound, useParams} from 'next/navigation';
import {ActivitiesInfoType} from '@/types/activities-info';
import {getActivitiesInfo} from '@/service/api/activities/getActivitiesInfo';
import Reservation from '@/components/activities/side-reservation';
import KakaoMap from '@/components/activities/kakomap';
import Reviews from '@/components/activities/reviews';
import Dropbox from '@/components/common/dropbox';
import InitialDevice from '@/utils/initial-device';
import Star from '@/public/icon/ic_star.svg';
import IconMeatball from '@/public/icon/ic_meatball.svg';
import LocationIcon from '@/public/icon/icon_location.svg';
import SkeletonLayout from './skeleton';

const DropboxItems = [
  {id: 1, label: '수정하기', type: 'modify'},
  {id: 2, label: '삭제하기', type: 'delete'},
];

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
            {bannerImg && <Image className="rounded-l-lg" src={bannerImg} fill alt="bannerImag" />}
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

const ActivitiesUpdateModal = ({id}: {id: number}) => {
  const sessionID = sessionStorage.getItem('id');
  const updateAuth = sessionID && +sessionID === id;
  const [isOpenDropbox, setIsOpenDropbox] = useState<boolean>(false);

  const handleActivitiesUpdate = (type: string) => {
    setIsOpenDropbox(false);
    console.log(type);
  };

  return (
    updateAuth && (
      <>
        <Image src={IconMeatball} onClick={() => setIsOpenDropbox(true)} width={40} height={40} alt="자세히보기" priority />;
        {isOpenDropbox && (
          <Dropbox
            onClick={handleActivitiesUpdate}
            onClose={() => setIsOpenDropbox(false)}
            className="right-0 top-10 z-10 mb-4 mr-4 h-115pxr w-160pxr"
            items={DropboxItems}
          />
        )}
      </>
    )
  );
};

export default function Page() {
  const params = useParams();
  const [device, setDevice] = useState<string>('mobile');
  const [pageID, setPageID] = useState<string>('');

  const {data: activitiesInfo, isSuccess: activitiesSuccess} = useQuery<ActivitiesInfoType>({
    queryKey: ['activitiesInfo'],
    queryFn: () => getActivitiesInfo(pageID),
    enabled: !!pageID,
    onError: () => notFound(),
  });

  useEffect(() => {
    if (!params?.id) return notFound();
    setPageID(Array.isArray(params.id) ? params.id[0] : params.id);

    const getDeviceType = InitialDevice();
    setDevice(getDeviceType);
  }, [params.id]);

  return activitiesSuccess ? (
    <div className="container mx-auto tablet:min-w-[43rem] pc:max-w-[75rem]">
      <div className="mx-auto w-full px-24pxr pb-133pxr pt-16pxr tablet:min-w-696pxr tablet:pb-145pxr tablet:pt-24pxr pc:px-0 pc:pb-128pxr pc:pt-78pxr">
        <h4 className="mb-10pxr text-md font-normal text-nomad-black">{activitiesInfo.category}</h4>
        <div className="relative mb-16pxr flex flex-row justify-between">
          <div className="flex-row items-center gap-16pxr p-0 text-xl font-bold text-nomad-black tablet:text-3xl pc:text-3xl">
            {activitiesInfo.title}
          </div>
          <ActivitiesUpdateModal id={activitiesInfo.id} />
        </div>
        <div className="flex flex-row gap-6pxr tablet:mb-25pxr pc:mb-25pxr">
          <Image src={Star} alt="별점 이미지" width={16} height={16} priority />
          {`${activitiesInfo.rating} (${activitiesInfo.reviewCount})`}
          <div className="flex">
            <Image className="m-0 mr-1" src={LocationIcon} alt="Location" width={18} height={18} />
            <p className="text-sm font-normal text-nomad-black opacity-75">{activitiesInfo.address}</p>
          </div>
        </div>
        <BannerFromDivceType device={device} bannerImg={activitiesInfo.bannerImageUrl} subImages={activitiesInfo.subImages} />
        <div className={`relative flex ${device === 'mobile' ? 'flex-col' : 'flex-row'}`}>
          <div className="mb-16pxr mr-24pxr min-w-327pxr tablet:min-w-428pxr pc:min-w-790pxr">
            <hr />
            <div>
              <div className="w-full pb-16pxr pt-15pxr text-xl font-bold text-nomad-black tablet:pb-16pxr tablet:pt-41pxr pc:pb-34pxr pc:pt-40pxr">
                체험 설명
              </div>
              <div className="text-nomad mb-16pxr h-auto min-w-327pxr text-xl font-normal opacity-75 tablet:mb-57pxr tablet:min-w-428pxr pc:mb-34pxr pc:min-w-790pxr">
                안녕하세요! 저희 스트릿 댄스 체험을 소개합니다...
              </div>
            </div>
            <hr />
            <div className="w-full pb-40pxr pt-16pxr text-xl font-bold text-nomad-black tablet:pb-42pxr tablet:pt-40pxr pc:pb-34pxr">
              <KakaoMap address={activitiesInfo.address} houseName={activitiesInfo.address} />
            </div>
            <hr />
            <Reviews pageID={pageID} />
          </div>
          <Reservation device={device} pageID={pageID} price={activitiesInfo.price} />
        </div>
      </div>
    </div>
  ) : (
    <SkeletonLayout />
  );
}
