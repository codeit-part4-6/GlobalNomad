'use client';

import {useQueries} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import Search from '@/components/main/search';
import SearchList from '@/components/main/search-list';
import PopularCard from '@/components/main/popular-card';
import {activitiesList} from '@/service/api/activities/getActivities';
import EntireList from '@/components/main/entire-list';
import SortSelect from '@/components/main/sort-select';
import Option from '@/components/main/option';
import {ActivitiesBody} from '@/types/activities';

// ✅ 여러 개의 API를 병렬 호출하는 커스텀 훅
const useMultipleActivities = () => {
  return useQueries({
    queries: [
      {
        queryKey: ['popular', {method: 'offset', category: undefined, sort: 'most_reviewed', size: 1000, page: 1}],
        queryFn: () => activitiesList({method: 'offset', category: undefined, sort: 'most_reviewed', size: 1000, page: 1}),
      },
    ],
  });
};

export default function Mainpage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isShown, setIsShown] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined); // 현재 선택된 카테고리
  const [selectedSort, setSelectedSort] = useState<ActivitiesBody['sort']>('latest');

  // ✅ 여러 개의 API 호출 (인기 체험 + 모든 체험)
  const [popularQuery] = useMultipleActivities();

  // ✅ 검색어 입력 시 검색 실행
  const handleClick = (keyword: string) => {
    setSearchKeyword(keyword);
    setIsShown(true);
  };

  useEffect(() => {
    if (searchKeyword === '') {
      setIsShown(false);
    }
  }, [searchKeyword]);

  // ✅ 로딩 상태 처리
  if (popularQuery.isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-[rgba(250, 251, 252, 1)]">
      <section className="relative flex h-240pxr w-auto flex-col bg-[url('/img/img_banner.jpg')] bg-cover bg-center bg-no-repeat tablet:h-550pxr">
        <div className="ml-24pxr mt-74pxr flex h-auto w-184pxr flex-col gap-8pxr text-white tablet:mb-244pxr tablet:ml-32pxr tablet:mt-144pxr tablet:w-auto pc:mb-229pxr pc:ml-328pxr pc:mt-159pxr">
          <h3 className="text-[1.5rem]/[1.75rem] font-bold tablet:text-[3.375rem]/[4rem] pc:text-[4.25rem]/[5.072rem]">부산 광안리 드론쇼</h3>
          <h2 className="px:text-[1.5rem]/[1.75rem] text-[0.875rem]/[1.625rem] font-bold tablet:text-[1.25rem]/[1.625rem]">1월의 인기 경험 BEST</h2>
        </div>
      </section>
      <Search onClick={handleClick} />
      {isShown ? (
        <SearchList keyword={searchKeyword} />
      ) : (
        <div className="mb-[12.688rem] flex flex-col items-center justify-center tablet:mb-[41.063rem] pc:mb-[21.375rem]">
          {/* ✅ 인기 체험 섹션 */}
          <section className="tablet:w-200 w-97 mx-auto mb-40pxr mt-101pxr flex max-w-[75rem] flex-col items-start justify-center gap-4 tablet:mt-110pxr tablet:gap-8 pc:mt-126pxr">
            <h2 className="text-[1.125rem]/[1.313rem] font-bold text-black-100 tablet:text-[2.25rem]/[2.625rem]">🔥 인기 체험</h2>
            <PopularCard className="min-w-[24.25rem] max-w-[75rem]" data={popularQuery.data} />
          </section>
          {/* ✅ 모든 체험 섹션 */}
          <div className="flex items-center">
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
