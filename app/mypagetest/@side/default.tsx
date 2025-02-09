'use client';

import {usePathname, useRouter} from 'next/navigation';
import SideNavi from '@/components/side-navigation/side-navi';

export default function SideNaviDefault() {
  const pathname = usePathname();
  const router = useRouter();

  const selectedMenu = pathname.split('/')[2] || 'myinfo';

  const handleSelectMenu = (menuId: string) => {
    router.push(`/mypagetest/${menuId}`);
  };

  return <SideNavi selectedMenu={selectedMenu} onSelectMenu={handleSelectMenu} />;
}
