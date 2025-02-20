'use client';
import React, {useCallback, useState} from 'react';
import {useQuery} from 'react-query';
import {ScaleLoader} from 'react-spinners';
import {ActivitiesReviewsType} from '@/types/activities-info';
import Image from 'next/image';
import {getActivitiesReviews} from '@/service/api/activities/getActivitiesInfo';
import Pagenation from '@/components/common/pagenation';
import activitiesStore from '@/service/store/activitiesstore';
import FormatDate from '@/utils/format-date';
import Star from '@/public/icon/ic_star.svg';
import DefaultProfile from '@/public/img/img_default_profile.svg';

const Reviews = () => {
  const [page, setPage] = useState<number>(1);
  const {pageID} = activitiesStore();

  const {data, isLoading} = useQuery<ActivitiesReviewsType>({
    queryKey: ['activitiesReviews', page, pageID],
    queryFn: () => getActivitiesReviews(pageID, page, 3),
    enabled: !!page,
  });

  const handlePageChange = useCallback((pageNo: number) => {
    setPage(pageNo);
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="flex h-430pxr w-full items-center justify-center">
          <ScaleLoader color="#0b3b2d" />
        </div>
      ) : (
        <ReviewDetail data={data} />
      )}
      <Pagenation size={data?.totalCount} showItemCount={3} onChange={handlePageChange} page={page} />
    </>
  );
};

const ReviewDetail = ({data}: {data: ActivitiesReviewsType | undefined}) => {
  const checkAverageRating = () => {
    if (!data) return '리뷰 데이터가 없습니다.';
    const getAverageRating = Math.round(data.averageRating);
    switch (getAverageRating) {
      case 0:
        return '후기가 없습니다.';
      case 1:
        return '매우 불만족';
      case 2:
        return '불만족';
      case 3:
        return '보통';
      case 4:
        return '만족';
      default:
        return '매우 만족';
    }
  };

  return (
    <>
      <div className="w-full pb-34pxr pt-40pxr text-xl font-bold text-nomad-black dark:text-green-900">후기</div>
      {!data || data.reviews.length < 1 ? (
        <div className="flex flex-col items-center justify-center gap-8pxr">
          <p className="text-xl font-normal text-nomad-black dark:text-dark-primary">⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣶⣄⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀</p>
          <p className="text-xl font-normal text-nomad-black dark:text-dark-primary">⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣦⣄⣀⡀⣠⣾⡇⠀⠀⠀⠀</p>
          <p className="text-xl font-normal text-nomad-black dark:text-dark-primary">⠀⠀⠀⠀⠀⠀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀</p>
          <p className="text-xl font-normal text-nomad-black dark:text-dark-primary">⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⢿⣿⣿⡇⠀⠀⠀⠀</p>
          <p className="text-xl font-normal text-nomad-black dark:text-dark-primary">⠀⣶⣿⣦⣜⣿⣿⣿⡟⠻⣿⣿⣿⣿⣿⣿⣿⡿⢿⡏⣴⣺⣦⣙⣿⣷⣄⠀⠀⠀</p>
          <p className="text-xl font-normal text-nomad-black dark:text-dark-primary">⠀⣯⡇⣻⣿⣿⣿⣿⣷⣾⣿⣬⣥⣭⣽⣿⣿⣧⣼⡇⣯⣇⣹⣿⣿⣿⣿⣧⠀⠀</p>
          <p className="text-xl font-normal text-nomad-black dark:text-dark-primary">⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠸⣿⣿⣿⣿⣿⣿⣿⣷⠀</p>
          <div className="text-2xl font-normal text-nomad-black dark:text-dark-primary">아직 후기가 없습니다.</div>
        </div>
      ) : (
        <>
          <div className="flex flex-row">
            <p className="mr-16pxr text-4xl font-semibold text-nomad-black dark:text-dark-secondary">{data.averageRating.toFixed(1)}</p>
            <div className="flex-col items-start gap-8pxr p-0">
              <p className="text-2lg font-normal text-nomad-black dark:text-dark-secondary">{checkAverageRating()}</p>
              <div className="flex flex-row">
                <Image src={Star} alt="별점 이미지" width={16} height={16} priority />
                <p className="ml-5pxr text-md font-normal text-black-100 dark:text-dark-secondary">{`${data.totalCount}개 후기`}</p>
              </div>
            </div>
          </div>
          <div className="mb-40pxr h-430pxr tablet:mb-72pxr pc:mb-90pxr">
            {data.reviews.map((dt, idx) => {
              return (
                <div className="flex flex-row" key={dt.id}>
                  <div className="mr-16pxr h-138pxr w-61pxr">
                    <div className="relative h-45pxr w-45pxr">
                      <Image src={dt.user.profileImageUrl || DefaultProfile} alt="기본 프로필" className="absolute" fill priority />
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-row">
                      <p className="text-lg font-bold text-nomad-black dark:text-dark-primary">{dt.user.nickname}</p>
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
        </>
      )}
    </>
  );
};

export default Reviews;
