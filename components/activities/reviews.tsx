'use client';
import React, {useState} from 'react';
import Image from 'next/image';
import Pagenation from '@/components/common/pagenation';
import FormatDate from '@/utils/format-date';
import Star from '@/public/icon/ic_star.svg';
import {useQuery} from 'react-query';
import {getActivitiesReviews} from '@/service/api/activities/getActivitiesInfo';
import {ActivitiesReviewsType} from '@/types/activities-info';

const Reviews = ({pageID}: {pageID: string}) => {
  const [page, setPage] = useState<number>(1);

  const {data, isSuccess} = useQuery<ActivitiesReviewsType>({
    queryKey: ['activitiesReviews', page],
    queryFn: () => getActivitiesReviews(pageID, 1, 3),
    structuralSharing: false,
    notifyOnChangeProps: ['data'],
  });

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  return (
    isSuccess && (
      <>
        <div className="w-full pb-34pxr pt-40pxr text-xl font-bold text-nomad-black">후기</div>
        <div className="flex flex-row">
          <p className="mr-16pxr text-4xl font-semibold text-nomad-black">{data.averageRating}</p>
          <div className="flex-col items-start gap-8pxr p-0">
            <p className="text-2lg font-normal text-nomad-black">매우 만족</p>
            <div className="flex flex-row">
              <Image src={Star} alt="별점 이미지" width={16} height={16} priority />
              <p className="ml-5pxr text-md font-normal text-black-100">{`${data.totalCount}개 후기`}</p>
            </div>
          </div>
        </div>
        <div className="table:72pxr mb-40pxr pc:mb-90pxr">
          {data.reviews.map((dt, idx) => {
            return (
              <div className="flex flex-row" key={dt.id}>
                <div className="mr-16pxr h-138pxr w-61pxr">
                  <div className="relative h-45pxr w-45pxr">
                    <Image src={dt.user.profileImageUrl} alt="기본 프로필" className="absolute" fill priority />
                  </div>
                </div>
                <div>
                  <div className="flex flex-row">
                    <p className="text-lg font-bold text-nomad-black">{dt.user.nickname}</p>
                    <p className="mx-8pxr text-lg font-normal text-nomad-black">|</p>
                    <p className="text-lg font-normal text-gray-500">{FormatDate(dt.createdAt)}</p>
                  </div>
                  <p>{dt.content}</p>
                  {idx !== data.reviews.length - 1 && <hr className="my-24pxr" />}
                </div>
              </div>
            );
          })}
        </div>
        <Pagenation size={data.totalCount} showItemCount={3} onChange={handlePageChange} />
      </>
    )
  );
};

export default Reviews;
