'use client';
import React, {useEffect, useMemo, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {useParams, useRouter} from 'next/navigation';
import {ActivitiesInfoType} from '@/types/activities-info';
import {getActivitiesInfo} from '@/service/api/activities/getActivitiesInfo';
import dayjs from 'dayjs';
import Image from 'next/image';
import {ResultModalType} from '@/types/common/alert-modal.types';
import Modal from '@/components/common/modal/modal';
import SkeletonLayout from '@/app/activities/[id]/skeleton';
import Reservation from '@/components/activities/side-reservation';
import KakaoMap from '@/components/activities/kakomap';
import ActivitiesUpdate from '@/components/activities/activities-update';
import Reviews from '@/components/activities/reviews';
import BannerFromDivceType from '@/components/activities/banner';
import activitiesStore from '@/service/store/activitiesstore';
import InitialDevice from '@/utils/initial-device';
import Star from '@/public/icon/ic_star.svg';
import LocationIcon from '@/public/icon/icon_location.svg';

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const device = InitialDevice();
  const [isPostResultModalOpen, setIsPostResultModalOpen] = useState<ResultModalType>({message: '', isOpen: false});
  const {pageID, setPageID, setPerson, setSelectedSchedule, setDailySchedule} = activitiesStore();
  const {
    data: activitiesInfo,
    isSuccess,
    error,
    isError,
  } = useQuery<ActivitiesInfoType>({
    queryKey: ['activitiesInfo', pageID],
    queryFn: () => getActivitiesInfo(pageID),
    enabled: !!pageID,
  });

  const handleCloseAletModal = () => {
    setIsPostResultModalOpen({message: '', isOpen: false});
    router.back();
  };

  useMemo(() => {
    if (params?.id && pageID !== params?.id.toString()) {
      setPageID(params.id.toString());
      setPerson(1);
      setSelectedSchedule({date: dayjs().format('YYYY-MM-DD'), startTime: '', endTime: '', id: 0});
      setDailySchedule({date: dayjs().format('YYYY-MM-DD'), times: []});
    }
  }, [params?.id, pageID, setPageID, setPerson, setSelectedSchedule, setDailySchedule]);

  useEffect(() => {
    if (isError) {
      setIsPostResultModalOpen({message: error.message, isOpen: true});
    }
  }, [error, isError]);

  useEffect(() => {
    if (!params?.id) {
      setIsPostResultModalOpen({message: '체험 ID가 없습니다.', isOpen: true});
    }
  }, [params?.id]);

  const renderDescription = (description: string) => {
    return description.split('\n').map((dt, idx) => <p key={`description-${idx}`}>{dt}</p>);
  };

  return (
    <>
      {isSuccess ? (
        <div className="container mx-auto tablet:min-w-[43rem] pc:max-w-[75rem]">
          <div className="mx-auto w-full px-24pxr pb-133pxr pt-16pxr tablet:min-w-696pxr tablet:pb-145pxr tablet:pt-24pxr pc:px-0 pc:pb-128pxr pc:pt-78pxr">
            <h4 className="mb-10pxr text-md font-normal text-nomad-black">{activitiesInfo.category}</h4>
            <div className="relative mb-16pxr flex flex-row justify-between">
              <div className="flex-row items-center gap-16pxr p-0 text-xl font-bold text-nomad-black tablet:text-3xl pc:text-3xl">
                {activitiesInfo.title}
              </div>
              <ActivitiesUpdate pageID={pageID} userId={activitiesInfo.userId} />
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
                    {renderDescription(activitiesInfo.description)}
                  </div>
                </div>
                <hr />
                <div className="w-full pb-40pxr pt-16pxr text-xl font-bold text-nomad-black tablet:pb-42pxr tablet:pt-40pxr pc:pb-34pxr">
                  <KakaoMap address={activitiesInfo.address} houseName={activitiesInfo.address} />
                </div>
                <hr />
                <Reviews />
              </div>
              <Reservation device={device} price={activitiesInfo.price} />
            </div>
          </div>
        </div>
      ) : (
        <SkeletonLayout />
      )}
      {isPostResultModalOpen.isOpen && <Modal message={isPostResultModalOpen.message} onClose={handleCloseAletModal} />}
    </>
  );
}
