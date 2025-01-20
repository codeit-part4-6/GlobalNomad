'use client';
import SideNavi from '@/components/common/side-navigation/side-navi';
import {useState} from 'react';
import MyActivities from './myactivities';
import ActivitiesRegister from './activities-register';

export default function Page() {
  const [selectedMenu, setSelectedMenu] = useState('treatReservation');
  const [key, setKey] = useState(0); // key 상태로 강제 리렌더링

  const renderContent = () => {
    switch (selectedMenu) {
      case 'myinfo':
        return <div>{/* 여기에 해당 컴포넌트를 추가 */}</div>;
      case 'reserveList':
        return <div>예약 내역 컴포넌트</div>;
      case 'treatReservation':
        return <MyActivities />;
      case 'activitiesRegister':
        return <ActivitiesRegister />;
      case 'reserveCalendar':
        return <div>예약 현황 컴포넌트</div>;
      default:
        return <div>선택된 메뉴가 없습니다.</div>;
    }
  };

  const handleSelectMenu = (menuId: string) => {
    if (menuId === 'treatReservation' && menuId === selectedMenu) {
      setKey(prevKey => prevKey + 1);
    }
    setSelectedMenu(menuId);
  };

  return (
    <div className="px-4 pt-6 tablet:p-6 pc:mt-[4.5rem] pc:w-full pc:max-w-[75rem] pc:p-0">
      <div className="flex tablet:gap-4 pc:gap-6">
        <SideNavi selectedMenu={selectedMenu} onSelectMenu={handleSelectMenu} />
        <div key={key} className="flex-grow">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
