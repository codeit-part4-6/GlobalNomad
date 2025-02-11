'use client';
import Image from 'next/image';
import React, {useEffect, useMemo, useState} from 'react';
import selectDown from '@/public/icon/ic_chevron_down.svg';
import BigCalendar from '@/components/reservation-calendar/big-calendar';
import NonDataPage from '../common/non-data';
import closeButton from '@/public/icon/ic_close_button.svg';
import {useQuery} from '@tanstack/react-query';
import {MyActivitiesResponse} from '@/types/activities';
import {getActivities} from '@/service/api/reservation-calendar/getActivities.api';
import {ScaleLoader} from 'react-spinners';
import {useRouter} from 'next/navigation';

export default function ReservationCalendar() {
  const router = useRouter();
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const {data, isLoading, isError, error} = useQuery<MyActivitiesResponse>({
    queryKey: ['myActivites'],
    queryFn: () => getActivities({size: 20}),
  });

  const myActivities = useMemo(() => data?.activities || [], [data]);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (myActivities.length > 0) {
      setSelectedTitle(myActivities[0].title);
      setSelectedId(myActivities[0].id);
    }
  }, [myActivities]);

  const handleSelect = (title: string, id: number) => {
    setSelectedTitle(title);
    setSelectedId(id);
    setIsOptionOpen(prev => !prev);
  };

  if (isLoading) {
    return (
      <div className="no-scrollbar flex h-740pxr w-full items-center justify-center">
        <ScaleLoader color="#0b3b2d" />
      </div>
    );
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="mb-16 h-full w-full">
      <div className="flex items-start justify-between">
        <p className="mb-8 text-3xl font-bold text-black-50">예약 현황</p>

        <div className="relative h-12 w-12 tablet:hidden" onClick={() => router.back()}>
          <Image src={closeButton} alt="모달 닫기 버튼" className="absolute cursor-pointer" fill />
        </div>
      </div>
      {myActivities.length === 0 ? (
        <NonDataPage />
      ) : (
        <>
          <div
            onClick={() => setIsOptionOpen(prev => !prev)}
            className="relative mb-8 h-14 min-h-14 w-full cursor-pointer rounded border border-gray-700 px-5"
          >
            <p className="absolute -top-3 left-4 bg-black-400 px-1 text-md font-regular text-nomad-black">체험명</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-balck-200 text-lg font-regular">{selectedTitle}</span>
              <div className="relative h-6 w-6">
                <Image className="absolute" fill src={selectDown} alt="메뉴 선택 토글" />
              </div>
            </div>
            {isOptionOpen && (
              <ul className="absolute left-0 z-10 mt-5 w-full rounded border border-gray-300 bg-white shadow-sidenavi-box">
                {myActivities.map(activity => (
                  <li
                    key={activity.id}
                    onClick={e => {
                      e.stopPropagation();
                      handleSelect(activity.title, activity.id);
                    }}
                    className="cursor-pointer px-5 py-18pxr text-lg font-regular text-gray-800 hover:bg-green-50 hover:text-nomad-black"
                  >
                    {activity.title}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <BigCalendar activityId={selectedId} />
        </>
      )}
    </div>
  );
}
