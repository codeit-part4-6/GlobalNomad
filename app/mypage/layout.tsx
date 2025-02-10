'use client';
import OverlayContainer from '@/components/common/modal/overlay-container';
import {useSearchParams} from 'next/navigation';
import React from 'react';

export default function MyPageLayout({side, menu}: {side: React.ReactNode; menu: React.ReactNode; mobileModal: React.ReactNode}) {
  const searchParams = useSearchParams();
  const isModalOpen = searchParams.get('modal') === 'true';
  return (
    <>
      <div className="hidden min-h-740pxr bg-black-400 tablet:block">
        <div>{side}</div>
        <div>{menu}</div>
      </div>
      <div className="min-h-740pxr bg-black-400 tablet:hidden">
        <div>{side}</div>
        {isModalOpen && <OverlayContainer>{menu}</OverlayContainer>}
      </div>
    </>
  );
}
