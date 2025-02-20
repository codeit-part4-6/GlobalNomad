'use client';
import React from 'react';
import {useSearchParams} from 'next/navigation';
import OverlayContainer from '@/components/common/modal/overlay-container';
import DisableScroll from '@/utils/disable-scroll';

export default function MyPageLayout({side, menu}: {side: React.ReactNode; menu: React.ReactNode}) {
  const searchParams = useSearchParams();
  const isModalOpen = searchParams.get('modal') === 'true';
  DisableScroll(isModalOpen);
  return (
    <>
      {/* pc, 태블릿 */}
      <div className="hidden min-h-[60rem] bg-black-400 dark:bg-stone-950 tablet:block">
        <div className="mx-auto px-4 pt-6 tablet:p-6 pc:w-full pc:max-w-[75rem] pc:p-0 pc:pt-[4.5rem]">
          <div className="flex tablet:gap-4 pc:gap-6">
            <aside>{side}</aside>
            <div className="flex-grow">{menu}</div>
          </div>
        </div>
      </div>

      {/* 모바일 */}
      <div className="min-h-[60rem] bg-black-400 dark:bg-stone-950 tablet:hidden">
        <div className="mx-auto px-4 pt-6 tablet:p-6 pc:w-full pc:max-w-[75rem] pc:p-0 pc:pt-[4.5rem]">
          <aside>{side}</aside>
          {isModalOpen && (
            <OverlayContainer>
              <div className="h-full w-full overflow-y-auto bg-white dark:bg-stone-950">
                <div className="min-h-[60rem] bg-black-400 px-4 pt-6 dark:bg-stone-950">{menu}</div>
              </div>
            </OverlayContainer>
          )}
        </div>
      </div>
    </>
  );
}
