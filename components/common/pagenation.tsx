'use client';
import React, {useCallback, useEffect, useState} from 'react';
import Button from './button';
import Image from 'next/image';

interface PagenationType {
  page: number;
  size: number | undefined;
  showItemCount: number;
  onChange: (page: number) => void;
}

type PageType = {
  key: number;
  val: number;
};

const defaultShowPageCount = 5;

function Pagenation({page, size, showItemCount, onChange}: PagenationType) {
  const [defaultPageInfo, setDefaultPageInfo] = useState<Array<PageType>>([]);
  const [pageInfo, setPageInfo] = useState<Array<PageType>>([]);

  const pageSize = size ? size : 1;

  const handlePrevPage = useCallback(() => {
    // 첫 페이지에서 이전 페이지를 누른다면 1번으로 이동
    // ex) <12345> 에서 < 누른 경우
    if (page <= defaultShowPageCount) {
      setPageInfo(defaultPageInfo);
      onChange(1);
    } else {
      setPageInfo(
        // 현재 페이지의 첫번째 번호에서 defaultShowPageCount 만큼 뺀 번호를 순차 누적적
        defaultPageInfo.map((_, idx) => {
          return {key: idx, val: pageInfo[0].val + idx - defaultShowPageCount};
        }),
      );
      const newPage = pageInfo[0].val - defaultShowPageCount;
      onChange(newPage);
    }
  },[defaultPageInfo, onChange, page, pageInfo]);

  const handleNextPage = useCallback(() => {
    // 다음 pageInfo의 첫번째 값
    const nextFirstPage = pageInfo[0].val + defaultShowPageCount;
    // 마지막 페이지 번호
    const lastPageNum = Math.ceil(pageSize / showItemCount);
    if (nextFirstPage <= lastPageNum) {
      // 계산된 페이지 정보보
      const prevPageArr = [];
      for (let i = 0; i < defaultPageInfo.length; i++) {
        if (nextFirstPage + i <= lastPageNum) {
          prevPageArr.push({key: defaultPageInfo[i].key, val: defaultPageInfo[i].key + nextFirstPage});
        }
      }
      setPageInfo(prevPageArr);
      onChange(nextFirstPage);
    } else {
      onChange(lastPageNum);
    }
  },[defaultPageInfo, onChange, pageInfo, pageSize, showItemCount]);

  const handleBtnClick = (page: number) => {
    onChange(page);
  };

  useEffect(() => {
    if (pageInfo.length < 1) {
      const lastPageNum = Math.ceil(pageSize / showItemCount);
      const pageArr = Array.from({length: lastPageNum > defaultShowPageCount ? defaultShowPageCount : lastPageNum}, (_, i) => i + 1);
      const basePageInfo = pageArr.map((dt, idx) => {
        return {key: idx, val: dt};
      });

      setPageInfo(basePageInfo);
      setDefaultPageInfo(basePageInfo);
    }
  }, [pageInfo, pageSize, showItemCount]);

  return (
    <div className={'flex flex-row items-center justify-center gap-10pxr p-0'}>
      <Button
        key={'prevBtn'}
        className={
          'relative h-40pxr w-40pxr flex-row items-center justify-center gap-10pxr rounded-2xl border border-solid border-gray-500 bg-white p-0 pc:h-55pxr pc:w-55pxr'
        }
        onClick={handlePrevPage}
      >
        <Image
          className={'absolute left-[40%] top-[35%] tablet:left-[40%] tablet:top-[35%] pc:left-[42%] pc:top-[42%]'}
          src="/icon/icon_prevate.svg"
          alt="prev"
          width={21}
          height={21}
        />
      </Button>
      {pageInfo.map(dt => {
        return (
          <Button
            key={`pagenation-${dt.key}-Btn`}
            className={`h-40pxr w-40pxr flex-row items-center justify-center gap-10pxr rounded-2xl border border-solid border-gray-500 p-0 pc:h-55pxr pc:w-55pxr ${page === dt.val ? 'bg-primary text-white' : 'bg-white text-primary'}`}
            onClick={() => handleBtnClick(dt.val)}
          >
            {dt.val}
          </Button>
        );
      })}
      <Button
        key={'nextBtn'}
        className={
          'relative h-40pxr w-40pxr flex-row items-center justify-center gap-10pxr rounded-2xl border border-solid border-gray-500 bg-white p-0 pc:h-55pxr pc:w-55pxr'
        }
        onClick={handleNextPage}
      >
        <Image className={'absolute right-[25%] top-[23%] pc:right-[30%] pc:top-[34%]'} src="/icon/icon_next.svg" alt="next" width={21} height={21} />
      </Button>
    </div>
  );
}

export default Pagenation;
