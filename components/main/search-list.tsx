import {JSX, useEffect, useState} from 'react';
import Image from 'next/image';
import Star from '@/public/icon/ic_yellowStar.svg';
import Pagenation from '@/components/common/pagenation';
import {useQuery} from '@tanstack/react-query';
import {activitiesList} from '@/service/api/activities/getActivities';
import {ActivitiesResponse} from '@/types/activities';
import FormattedPrice from '@/utils/formatted-price';
import {ScaleLoader} from 'react-spinners';
import {getSearchPageSize} from '@/utils/search-page-size';
interface SearchListProps {
  keyword: string | undefined;
}

export default function SearchList({keyword}: SearchListProps): JSX.Element {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(getSearchPageSize(window.innerWidth));
  const {data: searchActivities, isLoading: isEntireLoading} = useQuery<ActivitiesResponse>({
    queryKey: ['SearchActivities', keyword, page, pageSize],
    queryFn: (): Promise<ActivitiesResponse> =>
      activitiesList({
        method: 'offset',
        keyword,
        sort: 'latest',
        page,
        size: pageSize,
      }),
    enabled: !!keyword,
  });

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  useEffect(() => {
    const updateSize = () => {
      const newSize = getSearchPageSize(window.innerWidth);
      setPageSize(newSize);
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return (
    <div className="mb-[12.688rem] tablet:mb-[41.063rem] pc:mb-[20.375rem]">
      <div className="tablet:mb-18 mx-auto mb-16 flex flex-col items-center justify-center">
        <section className="mb-40pxr mt-101pxr flex w-full max-w-[1200px] flex-col items-start gap-3 px-4 tablet:mt-110pxr tablet:px-6 pc:mt-126pxr pc:px-0">
          <h2 className="text-[1.5rem]/[1.75rem] font-regular text-black-100 tablet:text-[2rem]/[2.375rem]">
            <span className="font-bold">{keyword}</span>(으)로 검색한 결과입니다.
          </h2>
          <div className="text-lg font-regular">총 {searchActivities?.totalCount}개의 결과</div>
        </section>
        <section className="w-full max-w-[1200px] px-4 tablet:px-6 pc:px-0">
          <div className="grid grid-cols-2 gap-x-2 gap-y-6 tablet:grid-cols-3 tablet:gap-x-4 tablet:gap-y-[3.75rem] pc:grid-cols-4 pc:gap-x-6 pc:gap-y-[4.313rem]">
            {searchActivities?.activities.map(activity => (
              <div className="flex flex-col gap-16pxr" key={activity.id}>
                <div className="relative flex h-168pxr w-full flex-col gap-16pxr object-contain tablet:h-221pxr tablet:min-w-221pxr pc:h-283pxr pc:min-w-283pxr">
                  <Image src={activity.bannerImageUrl} alt="체험 배너 이미지" fill className="rounded-3xl" />
                </div>
                <div className="flex w-full flex-col gap-15pxr tablet:min-w-220pxr pc:min-w-283pxr">
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
      {isEntireLoading && (
        <div>
          <ScaleLoader />
        </div>
      )}
      <Pagenation size={searchActivities?.totalCount} showItemCount={pageSize} onChange={handlePageChange} />
    </div>
  );
}
