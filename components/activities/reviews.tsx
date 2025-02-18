'use client';
import React, {useCallback, useState} from 'react';
import {useQuery} from 'react-query';
import {ScaleLoader} from 'react-spinners';
import {ActivitiesReviewsType} from '@/types/activities-info';
import Image from 'next/image';
import {getActivitiesReviews} from '@/service/api/activities/getActivitiesInfo';
import Pagenation from '@/components/common/pagenation';
import FormatDate from '@/utils/format-date';
import Star from '@/public/icon/ic_star.svg';
import DefaultProfile from '@/public/img/img_default_profile.svg';
import activitiesStore from '@/service/store/activitiesstore';

const Reviews = () => {
  const [page, setPage] = useState<number>(1);
  const {pageID} = activitiesStore();

  const {data, isSuccess, isFetching} = useQuery<ActivitiesReviewsType>({
    queryKey: ['activitiesReviews', page, pageID],
    queryFn: () => getActivitiesReviews(pageID, page, 3),
    enabled: !!page,
  });

  const handlePageChange = useCallback((pageNo: number) => {
    setPage(pageNo);
  }, []);

  return (
    isSuccess && (
      <>
        <div className="w-full pb-34pxr pt-40pxr text-xl font-bold text-nomad-black">후기</div>
        <div className="flex flex-row">
          <p className="mr-16pxr text-4xl font-semibold text-nomad-black">{data.averageRating.toFixed(1)}</p>
          <div className="flex-col items-start gap-8pxr p-0">
            <p className="text-2lg font-normal text-nomad-black">매우 만족</p>
            <div className="flex flex-row">
              <Image src={Star} alt="별점 이미지" width={16} height={16} priority />
              <p className="ml-5pxr text-md font-normal text-black-100">{`${data.totalCount}개 후기`}</p>
            </div>
          </div>
        </div>

        <div className="mb-40pxr h-430pxr tablet:mb-72pxr pc:mb-90pxr">
          {isFetching ? (
            <div className="flex h-430pxr w-full items-center justify-center">
              <ScaleLoader color="#0b3b2d" />
            </div>
          ) : (
            data.reviews.map((dt, idx) => {
              return (
                <div className="flex flex-row" key={dt.id}>
                  <div className="mr-16pxr h-138pxr w-61pxr">
                    <div className="relative h-45pxr w-45pxr">
                      <Image src={dt.user.profileImageUrl || DefaultProfile} alt="기본 프로필" className="absolute" fill priority />
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
            })
          )}
        </div>
        <Pagenation size={data.totalCount} showItemCount={3} onChange={handlePageChange} page={page} />
      </>
    )
  );
};

export default Reviews;
