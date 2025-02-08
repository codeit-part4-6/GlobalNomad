'use client';
import Image from 'next/image';
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
  selectedMenu: string;
  onSelectMenu: (menuId: string) => void;
  isMobile?: boolean;
  onOpenModal?: () => void;
}

export default function SideNavi({selectedMenu, onSelectMenu, isMobile, onOpenModal}: SideNaviProps) {
  const menus = [
    {id: 'myinfo', label: '내 정보', icon: accountCheck, nonIcon: accountUncheck},
    {id: 'reserveList', label: '예약 내역', icon: reserveListCheck, nonIcon: reserveListUncheck},
    {id: 'treatReservation', label: '내 체험 관리', icon: treatReservation, nonIcon: unTreatReservation},
    {id: 'reserveCalendar', label: '예약 현황', icon: reserveCalendar, nonIcon: unReserveCalendar},
  ];

  return (
    <div className="mb-240pxr h-full min-w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sidenavi-box tablet:w-[15.6875rem] tablet:min-w-[15.6875rem] pc:w-[24rem] pc:min-w-[24rem] pc:p-6">
      <div className="relative mx-auto mb-2 h-40 w-40">
        <Image src={defaultProfile} alt="기본 프로필" className="absolute" fill priority />
        <div className="absolute bottom-4 right-4 h-11 w-11">
          <Image src={profileButton} alt="프로필 수정 버튼" fill />
        </div>
      </div>

      {/* 메뉴 */}
      <div className="flex flex-col gap-2">
        {menus.map(menu =>
          isMobile ? (
            <button
              key={menu.id}
              onClick={() => {
                if (onOpenModal) onOpenModal();
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
