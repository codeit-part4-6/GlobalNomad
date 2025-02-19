'use client';

import React, {JSX} from 'react';
import Image from 'next/image';
import Button from '@/components/common/button';
import SearchIcon from '@/public/icon/ic_search.svg';

interface SearchProps {
  // 부모로 검색어를 전달하는 콜백
  onClick: (keyword: string) => void;
  keyword: string;
  setKeyword: (keyword: string) => void;
}
export default function Search({onClick, keyword, setKeyword}: SearchProps): JSX.Element {
  const handleClick = () => {
    onClick(keyword);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };

  return (
    <div className="flex h-auto w-full flex-col gap-12pxr rounded-2xl bg-white px-18pxr py-16pxr shadow-lg tablet:gap-8 tablet:px-6 tablet:py-8 dark:bg-slate-600">
      <h2 className="text-lg font-bold text-nomad-black tablet:text-xl">무엇을 체험하고 싶으신가요?</h2>
      <div className="relative flex justify-between gap-10pxr">
        <div className="relative flex w-full items-center rounded border border-solid border-gray-700 pl-2.5">
          <div className="relative h-6 w-6">
            <Image src={SearchIcon} alt="검색" className="absolute" fill />
          </div>
          <label htmlFor="search" className="w-full pl-15pxr pr-15pxr tablet:pl-30pxr">
            <input
              id="search"
              type="search"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="내가 원하는 체험은"
              className="w-full bg-transparent text-[0.875rem]/[1.625rem] font-regular text-black-100 outline-none placeholder:text-gray-500 focus:border-transparent focus:ring-0 tablet:text-lg"
            />
          </label>
        </div>
        {keyword && (
          <div className="absolute -top-3 left-7 bg-white px-2 text-lg font-regular text-gray-500 dark:bg-slate-600">
            <span>내가 원하는 체험은</span>
          </div>
        )}
        <Button
          type="button"
          className="nomad-button-hover h-56pxr w-auto whitespace-nowrap rounded bg-nomad-black px-5 text-lg font-bold text-white tablet:px-10 tablet:py-2"
          onClick={handleClick} // 즉시 검색 실행
        >
          검색하기
        </Button>
      </div>
    </div>
  );
}
