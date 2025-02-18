'use client';

import {useInfiniteQuery} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import Search from '@/components/main/search';
import SearchList from '@/components/main/search-list';
import PopularCard from '@/components/main/popular-card';
import {activitiesList} from '@/service/api/activities/getActivities';
import EntireList from '@/components/main/entire-list';
import Option from '@/components/main/option';
import {ActivitiesBody} from '@/types/activities';
import {ActivitiesResponse} from '@/types/activities';
import {ScaleLoader} from 'react-spinners';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import MainBanner from '@/components/main/main-banner';

export default function Mainpage() {
  const [searchKeyword, setSearchKeyword] = useState<string | undefined>(undefined);
  const [isShown, setIsShown] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined); // 현재 선택된 카테고리
  const [selectedSort, setSelectedSort] = useState<ActivitiesBody['sort']>('latest');
  const [keyword, setKeyword] = useState<string>(''); // 입력 값을 관리

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching: IsPopularFetching,
  } = useInfiniteQuery<ActivitiesResponse>({
    queryKey: ['getActivities', 'most_reviewd'],
    queryFn: ({pageParam = null}) =>
      activitiesList({
        method: 'cursor',
        sort: 'most_reviewed',
        size: 8,
        cursorId: pageParam as number | null,
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.activities.length === 0) {
        return null;
      }
      const totalActivities = allPages.flatMap(page => page.activities).length;

      if (totalActivities >= lastPage.totalCount) {
        return null;
      }
      return lastPage.cursorId;
    },
    staleTime: 5 * 60 * 1000,
  });

  // ✅ 검색어 입력 시 검색 실행
  const handleClick = (keyword: string | undefined) => {
    setSearchKeyword(keyword);
    setIsShown(true);
  };

  useEffect(() => {
    if (searchKeyword === '' || keyword === '') {
      setIsShown(false);
    }
  }, [searchKeyword, keyword]);

  const popularList = data?.pages.flatMap(page => page.activities) || [];

  return (
    <div className="bg-[rgba(250, 251, 252, 1)] w-full overflow-hidden">
      {/* ✅ Swiper 배너 */}
      <section className="relative h-[240px] tablet:h-[550px]">
        <MainBanner />
        <div className="absolute -bottom-20 left-1/2 z-10 w-full max-w-[1200px] -translate-x-1/2 px-4 tablet:px-6 pc:px-0">
          <div>
            <Search onClick={handleClick} keyword={keyword} setKeyword={setKeyword} />
          </div>
        </div>
      </section>
      {isShown ? (
        <SearchList keyword={searchKeyword} />
      ) : (
        <div className="mb-[12.688rem] flex w-full max-w-[1200px] flex-col items-center justify-center px-4 tablet:mb-[41.063rem] tablet:px-6 pc:mx-auto pc:mb-[21.375rem] pc:px-0">
          {/* ✅ 인기 체험 섹션 */}
          <section className="relative mb-40pxr mt-101pxr flex w-full flex-col gap-4 tablet:mt-110pxr tablet:gap-8 pc:mt-126pxr">
            <PopularCard data={popularList} fetchNextpage={fetchNextPage} hasNextPage={hasNextPage} />
            {IsPopularFetching && (
              <div className="flex min-h-28 justify-center items-center">
                <ScaleLoader />
              </div>
            )}
          </section>
          {/* ✅ 모든 체험 섹션 */}
          <div className="pc:mt-15 pc: mb-6 mt-10 flex w-full items-center justify-between tablet:mb-[2.188rem] tablet:mt-[3.375rem] pc:max-w-[1200px]">
            <Option
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              selectedSort={selectedSort}
              onSelectedSort={setSelectedSort}
            />
          </div>
          <EntireList activeCategory={activeCategory} selectedSort={selectedSort} />
        </div>
      )}
    </div>
  );
}
