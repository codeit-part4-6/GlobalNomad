'use client';

import {useInfiniteQuery} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import Search from '@/components/main/search';
import SearchList from '@/components/main/search-list';
import PopularCard from '@/components/main/popular-card';
import {activitiesList} from '@/service/api/activities/getActivities';
import EntireList from '@/components/main/entire-list';
import SortSelect from '@/components/main/sort-select';
import Option from '@/components/main/option';
import {ActivitiesBody} from '@/types/activities';
import {ActivitiesResponse} from '@/types/activities';
import {ClipLoader} from 'react-spinners';

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
      <section className="relative flex h-240pxr w-auto flex-col bg-[url('/img/img_banner1.jpg')] bg-cover bg-center bg-no-repeat tablet:h-550pxr">
        <div className="ml-24pxr mt-74pxr flex h-auto w-184pxr flex-col gap-8pxr text-white tablet:mb-244pxr tablet:ml-32pxr tablet:mt-144pxr tablet:w-auto pc:mb-229pxr pc:ml-328pxr pc:mt-159pxr">
          <h3 className="text-[1.5rem]/[1.75rem] font-bold tablet:text-[3.375rem]/[4rem] pc:text-[4.25rem]/[5.072rem]">부산 광안리 드론쇼</h3>
          <h2 className="px:text-[1.5rem]/[1.75rem] text-[0.875rem]/[1.625rem] font-bold tablet:text-[1.25rem]/[1.625rem]">2월의 인기 경험 BEST</h2>
        </div>
        <div className="absolute -bottom-20 left-1/2 w-full max-w-[1200px] -translate-x-1/2 px-4 tablet:px-6 pc:px-0">
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
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-gray-100 bg-opacity-20">
                <ClipLoader size={50} color="#112211" />
              </div>
            )}
          </section>
          {/* ✅ 모든 체험 섹션 */}
          <div className="flex w-full items-center">
            <Option
              className="pc:mt-15 mb-6 mt-10 flex min-w-[21.25rem] max-w-[75.25rem] items-center justify-between tablet:mb-[2.188rem] tablet:mt-[3.375rem]"
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
            <SortSelect selectedSort={selectedSort} onSelectedSort={setSelectedSort} />
          </div>
          <EntireList activeCategory={activeCategory} selectedSort={selectedSort} />
        </div>
      )}
    </div>
  );
}
