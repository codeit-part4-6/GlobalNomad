'use client';
import React, {useEffect} from 'react';
import {useInfiniteQuery, InfiniteData, QueryFunctionContext} from '@tanstack/react-query';
import {useInView} from 'react-intersection-observer';
import {PulseLoader} from 'react-spinners';

type FetchData<T> = (context: QueryFunctionContext) => Promise<InfiniteData<T, unknown>>;

interface InfiniteScrollProps<T> {
  fetchData: FetchData<T>;
  queryKey: string;
  render: (data: InfiniteData<T, unknown>) => React.ReactNode;
  className?: string;
}

const InfiniteScroll = <T,>({queryKey, fetchData, render, className}: InfiniteScrollProps<T>) => {
  const {ref, inView} = useInView({
    threshold: 0.1, // 10%가 화면에 보일 때 트리거
  });

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = useInfiniteQuery<InfiniteData<T>>({
    queryKey: [queryKey],
    queryFn: fetchData,
    getNextPageParam: lastPage => lastPage.pageParams?.[0] ?? null,
    initialPageParam: null,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  return (
    <>
      <div className={`relative ${className}`}>
        {/* 데이터 영역 */}

        <div className="custom-scrollbar h-full overflow-x-hidden overflow-y-scroll pr-4">
          {data?.pages.map((group, i) => (
            <div key={i} className="relative">
              {render(group)}
              {/* 페이지 추가 트리거 */}
              <div ref={ref} className="m-1 h-3"></div>
            </div>
          ))}
        </div>

        {/* 로딩 아이콘: 하단에 위치 */}
        {isFetchingNextPage && (
          <div className="absolute bottom-0 left-0 right-0 z-30 flex items-center justify-center bg-gray-100 py-2 opacity-20">
            <PulseLoader size={15} color="#1C1B1F" />
          </div>
        )}
      </div>
    </>
  );
};

export default InfiniteScroll;
