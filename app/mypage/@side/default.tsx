'use client';

import {usePathname, useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import SideNavi from '@/components/side-navigation/side-navi';

export default function SideNaviDefault() {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 745);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const selectedMenu = isMobile ? pathname.split('/')[2] : pathname.split('/')[2] || 'myinfo';

  const handleSelectMenu = (menuId: string) => {
    if (isMobile) {
      router.push(`/mypage/${menuId}?modal=true`);
    } else {
      router.push(`/mypage/${menuId}`);
    }
  };

  return (
    <>
      <SideNavi selectedMenu={selectedMenu} onSelectMenu={handleSelectMenu} isMobile={isMobile} />
    </>
  );
}
