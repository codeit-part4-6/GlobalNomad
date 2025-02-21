'use client';
import React, {useEffect} from 'react';
import {useInfiniteQuery, InfiniteData, QueryFunctionContext} from '@tanstack/react-query';
import {useInView} from 'react-intersection-observer';
import {PulseLoader, ScaleLoader} from 'react-spinners';

type FetchData<T> = (context: QueryFunctionContext) => Promise<InfiniteData<T, unknown>>;

interface InfiniteScrollProps<T> {
  fetchData: FetchData<T>;
  queryKey: string;
  render: (data: InfiniteData<T, unknown>) => React.ReactNode;
  className?: string;
}

const InfiniteScroll = <T,>({queryKey, fetchData, render, className}: InfiniteScrollProps<T>) => {
  const {ref, inView} = useInView({
    threshold: 0.9, //  트리거
  });

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading} = useInfiniteQuery<InfiniteData<T>>({
    queryKey: [queryKey],
    queryFn: fetchData,
    getNextPageParam: lastPage => lastPage.pageParams?.[0] ?? null,
    initialPageParam: null,
  });

  const getPage = (data?.pages ?? [])
    .flatMap(group => group.pages)
    .flat()
    .filter(Boolean);
  const hasData = getPage.length > 2;

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  return (
    <>
      <div className={`relative ${className}`}>
        {/* 데이터 영역 */}
        <div className={`h-full overflow-x-hidden ${hasData ? 'custom-scrollbar overflow-y-scroll pr-4' : 'overflow-hidden'}`}>
          {data?.pages.map((group, i) => (
            <div key={i} className="relative">
              {render(group)}
            </div>
          ))}
          {/* 로딩 */}
          {isLoading && (
            <div className="no-scrollbar flex h-full w-full items-center justify-center">
              <ScaleLoader color="#0b3b2d" />
            </div>
          )}
          {/* 페이지 추가 트리거 */}
          <div ref={ref} style={{height: '1px'}}></div>
        </div>
        {/* 하단 트리거로딩 */}
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
