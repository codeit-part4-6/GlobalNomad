'use client';
import OverlayContainer from '@/components/common/modal/overlay-container';
import SideNavi from '@/components/side-navigation/side-navi';
import Mypage from '@/components/side-navigation/mypage';
import React, {useState, useEffect} from 'react';
import ReservationList from '../../components/reservation-list/reservation-list';
import Navbar from '@/components/common/navbar';
import ReservationCalendar from '../../components/reservation-calendar/reservation-calendar';
import Footer from '@/components/common/footer';
import MyActivities from '../../components/myactivities/myactivities';
import ActivitiesRegister from '../../components/myactivities/activities-register';

export default function Page() {
  const [selectedMenu, setSelectedMenu] = useState('myinfo');
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [key, setKey] = useState(0);

  function getPageSize(width: number): boolean {
    return width < 745;
  }

  const handleSelectMenu = (menuId: string) => {
    if (menuId === 'treatReservation' && menuId === selectedMenu) {
      setKey(prevKey => prevKey + 1);
    }
    setSelectedMenu(menuId);
  };

  useEffect(() => {
    const initialIsMobil = getPageSize(document.documentElement.clientWidth);
    setIsMobile(initialIsMobil); // 브라우저에서만 실행
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = getPageSize(document.documentElement.clientWidth);
      setIsMobile(mobile);

      if (!mobile && selectedMenu === '') {
        setSelectedMenu('myinfo');
      }
    };
    if (isMobile !== null) {
      // isMobile이 null이 아니면 resize 이벤트 처리
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [selectedMenu, isMobile]);

  const renderContent = () => {
    switch (selectedMenu) {
      case 'myinfo':
        return (
          <div className="flex justify-center">
            <Mypage />
          </div>
        );
      case 'reserveList':
        return <ReservationList onClose={() => setIsOpen(false)} />;
      case 'treatReservation':
        return (
          <MyActivities
            onclose={() => {
              handleSelectMenu('treatReservation');
              setIsOpen(false);
            }}
          />
        );
      case 'activitiesRegister':
        return <ActivitiesRegister />;
      case 'reserveCalendar':
        return <ReservationCalendar onClose={() => setIsOpen(false)} />;
      default:
        return <div>선택된 메뉴가 없습니다.</div>;
    }
  };

  if (isMobile === null) {
    return null; // 클라이언트에서 isMobile 값을 정할 때까지 아무것도 렌더링하지 않음
  }

  return (
    <div className="mx-auto px-4 pt-6 tablet:p-6 pc:w-full pc:max-w-[75rem] pc:p-0 pc:pt-[4.5rem]">
      {isMobile ? (
        // **모바일 환경**
        <div className="">
          <SideNavi selectedMenu={selectedMenu} onSelectMenu={handleSelectMenu} isMobile={isMobile} onOpenModal={() => setIsOpen(true)} />
          {isOpen && (
            <OverlayContainer>
              <div className="h-full w-full overflow-y-auto bg-white">
                <Navbar />
                <div className="min-h-740pxr bg-black-400 px-4 pt-6" key={key}>
                  {renderContent()}
                </div>
                <Footer />
              </div>
            </OverlayContainer>
          )}
        </div>
      ) : (
        // **PC/태블릿 환경**
        <div className="flex tablet:gap-4 pc:gap-6">
          <SideNavi selectedMenu={selectedMenu} onSelectMenu={handleSelectMenu} />
          <div className="flex-grow" key={key}>
            {renderContent()}
          </div>
        </div>
      )}
    </div>
  );
}
