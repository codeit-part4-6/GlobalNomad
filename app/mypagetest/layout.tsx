import Footer from '@/components/common/footer';
import OverlayContainer from '@/components/common/modal/overlay-container';
import React from 'react';

export default function MyPageLayout({side, menu}: {side: React.ReactNode; menu: React.ReactNode}) {
  return (
    <>
      <div className="hidden min-h-740pxr bg-black-400 tablet:block">
        <div>{side}</div>
        <div>{menu}</div>
        <Footer />
      </div>
      <div className="min-h-740pxr bg-black-400 tablet:hidden">
        <div>{side}</div>
        <OverlayContainer>{menu}</OverlayContainer>
        <Footer />
      </div>
    </>
  );
}
