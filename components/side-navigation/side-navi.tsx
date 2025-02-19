'use client';
import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {postProfileImageUrl} from '@/service/api/users/postProfileImageUrl.api';
import {useAuthStore} from '@/service/store/authStore';
import {useImageUrlStore} from '@/service/store/imageURLStore';
import defaultProfile from '@/public/img/img_default_profile.svg';
import profileButton from '@/public/icon/icon_profile-button.svg';
import accountCheck from '@/public/icon/icon_accoutn_check.svg';
import accountUncheck from '@/public/icon/icon_accoutn_uncheck.svg';
import reserveListCheck from '@/public/icon/icon_textbox_check.svg';
import reserveListUncheck from '@/public/icon/icon_textbox_uncheck.svg';
import treatReservation from '@/public/icon/icon_cog.svg';
import unTreatReservation from '@/public/icon/icon_cog_un.svg';
import reserveCalendar from '@/public/icon/icon_calendar_check.svg';
import unReserveCalendar from '@/public/icon/icon_calendar_uncheck.svg';

interface SideNaviProps {
  selectedMenu: string | null;
  onSelectMenu: (menuId: string) => void;
  isMobile?: boolean | null;
}

export default function SideNavi({selectedMenu, onSelectMenu, isMobile}: SideNaviProps) {
  const [isPossible, setIsPossible] = useState(false);
  const {user} = useAuthStore();
  const {setProfileImageUrl} = useImageUrlStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isModalOpen = searchParams.get('modal') === 'true';

  const menus = [
    {id: 'myinfo', label: '내 정보', icon: accountCheck, nonIcon: accountUncheck},
    {id: 'reserveList', label: '예약 내역', icon: reserveListCheck, nonIcon: reserveListUncheck},
    {id: 'treatReservation', label: '내 체험 관리', icon: treatReservation, nonIcon: unTreatReservation},
    {id: 'reserveCalendar', label: '예약 현황', icon: reserveCalendar, nonIcon: unReserveCalendar},
  ];
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user?.profileImageUrl) {
      setPreview(user?.profileImageUrl);
    }
  }, [user?.profileImageUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    let profileImageUrl = user?.profileImageUrl;
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      profileImageUrl = await postProfileImageUrl(file);
    } else if (!preview) {
      setPreview(null);
      profileImageUrl = null;
    }
    if (isMobile) {
      router.push('/mypage/myinfo?modal=true');
    }
    setProfileImageUrl(profileImageUrl ?? null);
  };

  useEffect(() => {
    setIsPossible(pathname === '/mypage' || pathname === '/mypage/myinfo' || (pathname === '/mypage/myinfo' && isModalOpen));
  }, [pathname, isModalOpen]);

  return (
    <div className="mb-240pxr min-w-full rounded-xl border border-gray-200 bg-white p-6 tablet:w-[15.6875rem] tablet:min-w-[15.6875rem] pc:w-[24rem] pc:min-w-[24rem] pc:p-6 dark:bg-gray-800/30">
      <div className="relative mx-auto mb-2 h-40 w-40">
        <Image
          src={preview || defaultProfile}
          alt="최초 프로필"
          className="absolute rounded-full object-cover shadow-sidenavi-box"
          fill
          priority
          sizes="160px"
        />
        <label
          htmlFor="profile-upload"
          className={`absolute bottom-2 right-2 h-11 w-11 cursor-pointer hover:opacity-80 ${!isPossible ? 'hidden' : ''}`}
        >
          <Image src={profileButton} alt="프로필 수정 버튼" fill />
          <input type="file" className="hidden" id="profile-upload" onChange={handleFileChange} disabled={!isPossible} />
        </label>
      </div>

      {/* 메뉴 */}
      <div className="flex flex-col gap-2">
        {menus.map(menu =>
          isMobile ? (
            <button
              key={menu.id}
              onClick={() => {
                onSelectMenu(menu.id);
              }}
              className={`flex w-full items-center gap-[0.875rem] rounded-xl px-4 py-[0.625rem] hover:bg-green-50 ${
                selectedMenu === menu.id ? 'bg-green-50' : ''
              }`}
            >
              <div className="relative h-6 w-6">
                <Image src={selectedMenu === menu.id ? menu.icon : menu.nonIcon} alt={`${menu.label} 이미지`} className="absolute" fill />
              </div>
              <div className="flex flex-grow">
                <p className={`text-lg font-bold ${selectedMenu === menu.id ? 'text-nomad-black' : 'text-gray-600'}`}>{menu.label}</p>
              </div>
            </button>
          ) : (
            <button
              key={menu.id}
              onClick={() => onSelectMenu(menu.id)}
              className={`flex w-full items-center gap-[0.875rem] rounded-xl px-4 py-[0.625rem] hover:bg-green-50 ${
                selectedMenu === menu.id ? 'bg-green-50' : ''
              }`}
            >
              <div className="relative h-6 w-6">
                <Image src={selectedMenu === menu.id ? menu.icon : menu.nonIcon} alt={`${menu.label} 이미지`} className="absolute" fill />
              </div>
              <div className="flex flex-grow">
                <p className={`text-lg font-bold ${selectedMenu === menu.id ? 'text-nomad-black' : 'text-gray-600'}`}>{menu.label}</p>
              </div>
            </button>
          ),
        )}
      </div>
    </div>
  );
}
