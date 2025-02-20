'use client';
import React, {useEffect, useMemo, useState} from 'react';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {MyActivitiesResponse} from '@/types/activities';
import BigCalendar from '@/components/reservation-calendar/big-calendar';
import NonDataPage from '@/components/common/non-data';
import ActivitySelector from '@/components/reservation-calendar/activity-selector';
import {getActivities} from '@/service/api/reservation-calendar/getActivities.api';
import {ScaleLoader} from 'react-spinners';
import {useQuery} from '@tanstack/react-query';
import closeButton from '@/public/icon/ic_close_button.svg';

export default function ReservationCalendar() {
  const router = useRouter();
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const {data, isLoading, isError, error} = useQuery<MyActivitiesResponse>({
    queryKey: ['myActivites'],
    queryFn: () => getActivities({size: 20}),
  });

  const myActivities = useMemo(() => data?.activities || [], [data]);
  const [selectedActivity, setSelectedActivity] = useState<{title: string; id: number} | null>(null);

  useEffect(() => {
    if (myActivities.length > 0) {
      setSelectedActivity(myActivities[0]);
    }
  }, [myActivities]);

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
        <p className="mb-8 text-3xl font-bold text-black-50 dark:text-gray-50">예약 현황</p>

        <div className="relative h-12 w-12 tablet:hidden" onClick={() => router.back()}>
          <Image src={closeButton} alt="모달 닫기 버튼" className="absolute cursor-pointer" fill />
        </div>
      </div>
      {myActivities.length === 0 ? (
        <NonDataPage />
      ) : (
        <>
          <ActivitySelector
            activities={myActivities}
            selectedActivity={selectedActivity}
            isOpen={isOptionOpen}
            onToggle={() => setIsOptionOpen(prev => !prev)}
            onSelect={activity => {
              setSelectedActivity(activity);
              setIsOptionOpen(false);
            }}
          />
          <BigCalendar activityId={selectedActivity?.id ?? null} />
        </>
      )}
    </div>
  );
}
