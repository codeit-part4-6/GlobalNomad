import {JSX} from 'react';
import Image from 'next/image';
import Star from '@/public/icon/ic_yellowStar.svg';
import Pagenation from '@/components/common/pagenation';
import {useQuery} from '@tanstack/react-query';
import {activitiesList} from '@/service/api/activities/getActivities';
import {ActivitiesResponse} from '@/types/activities';
import FormattedPrice from '@/utils/formatted-price';
import {ScaleLoader} from 'react-spinners';
interface SearchListProps {
  keyword: string;
}

export default function SearchList({keyword}: SearchListProps): JSX.Element {
  const {data: searchActivities, isLoading: isEntireLoading} = useQuery<ActivitiesResponse>({
    queryKey: ['SearchActivities', keyword],
    queryFn: () =>
      activitiesList({
        method: 'cursor',
        keyword,
      }),
  });

  console.log(searchActivities);
  const handlePageChange = (page: number) => {
    console.log(page);
  };

  if (isEntireLoading) {
    return (
      <div>
        <ScaleLoader />
      </div>
    );
  }

  return (
    <div className="mb-[12.688rem] tablet:mb-[41.063rem] pc:mb-[20.375rem]">
      <div className="tablet:mb-18 mx-auto mb-16 flex flex-col items-center justify-center">
        <section className="mb-40pxr mt-101pxr flex flex-col items-start gap-3 tablet:mt-110pxr pc:mt-126pxr pc:gap-8">
          <h2 className="text-[1.5rem]/[1.75rem] font-regular text-black-100 tablet:text-[2rem]/[2.375rem]">
            <span className="font-bold">{keyword}</span>(으)로 검색한 결과입니다.
          </h2>
          <div className="text-lg font-regular">총 {searchActivities?.totalCount}개의 결과</div>
        </section>
        <section>
          <div className="grid grid-cols-2 gap-x-2 gap-y-6 tablet:grid-cols-3 tablet:gap-x-4 tablet:gap-y-[3.75rem] pc:grid-cols-4 pc:gap-x-6 pc:gap-y-[4.313rem]">
            {searchActivities?.activities.map(activity => (
              <div className="flex flex-col gap-16pxr" key={activity.id}>
                <div className="relative flex h-168pxr w-168pxr flex-col gap-16pxr tablet:h-221pxr tablet:w-221pxr">
                  <Image src={activity.bannerImageUrl} alt="체험 배너 이미지" fill className="rounded-3xl" />
                </div>
                <div className="flex w-164pxr flex-col gap-15pxr tablet:w-220pxr pc:w-283pxr">
                  <div className="flex flex-col gap-10pxr">
                    <div className="flex gap-3pxr">
                      <Image src={Star} alt="별" width={18} height={18} />
                      <div className="flex gap-5pxr">
                        <span className="text-lg font-medium text-black-100 tablet:text-[1rem]/[1.188rem] pc:text-lg">{activity.rating}</span>
                        <span className="text-lg font-medium text-gray-500 tablet:text-[1rem]/[1.188rem] pc:text-lg">({activity.reviewCount})</span>
                      </div>
                    </div>
                    <h3 className="text-2lg font-semibold text-black-100 tablet:text-[1.5rem]/[1.75rem] pc:text-2xl">{activity.title}</h3>
                  </div>
                  <div className="flex items-center gap-5pxr">
                    <span className="text-xl font-bold tablet:text-[1.75rem]/[2.063rem] pc:text-2xl">₩ {FormattedPrice(activity.price)}</span>
                    <span className="text-lg font-regular text-gray-800 tablet:text-[1.25rem]/[1.438rem] pc:text-xl">/ 인</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Pagenation size={31} showItemCount={3} onChange={handlePageChange} />
    </div>
  );
}
