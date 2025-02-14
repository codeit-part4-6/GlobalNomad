import Image from 'next/image';
import React, {useEffect, useMemo, useState} from 'react';
import closeButton from '@/public/icon/ic_close_button.svg';
import ReservationInfo from '@/components/reservation-calendar/reservation-info';
import {useQuery} from '@tanstack/react-query';
import {getReservedSchedule} from '@/service/api/reservation-calendar/getReservedSchedule.api';
import {Schedules} from '@/types/reserved-schedule';

interface ReservationModalProps {
  onClose: () => void;
  selectedDate: string;
  activityId: number | null;
}

export default function ReservationModal({onClose, selectedDate, activityId}: ReservationModalProps) {
  const [reservationStatus, setReservationStatus] = useState('pending');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const {data} = useQuery<Schedules>({
    queryKey: ['reservedSchedule', selectedDate],
    queryFn: () => getReservedSchedule({activityId, date: selectedDate}),
    enabled: !!activityId,
  });

  const reservedScheduleData = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const selectedSchedule = reservedScheduleData.find(schedule => `${schedule.startTime} ~ ${schedule.endTime}` === selectedTime);

  const pendingCount = selectedSchedule?.count.pending ?? 0;
  const confirmedCount = selectedSchedule?.count.confirmed ?? 0;
  const declinedCount = selectedSchedule?.count.declined ?? 0;

  useEffect(() => {
    if (reservedScheduleData.length > 0 && selectedTime === null) {
      setSelectedTime(`${reservedScheduleData[0].startTime} ~ ${reservedScheduleData[0].endTime}`);
    }
  }, [reservedScheduleData, selectedTime]);

  return (
    <div
      onClick={e => e.stopPropagation()}
      className="no-scrollbar fixed z-[60] h-full w-full overflow-y-auto border-gray-200 bg-white tablet:h-[70%] tablet:max-h-697pxr tablet:w-429pxr tablet:rounded-3xl tablet:border"
    >
      <div className="h-full w-full pt-6">
        <div className="mb-19pxr flex items-center justify-between px-6 tablet:mb-27pxr">
          <p className="tablet: text-2xl text-[1.75rem] font-bold text-black-100">예약 정보</p>
          <div className="relative h-12 w-12 tablet:h-10 tablet:w-10" onClick={onClose}>
            <Image src={closeButton} alt="모달 닫기 버튼" className="absolute cursor-pointer" fill />
          </div>
        </div>
        <div className="border-b border-gray-200">
          <div className="flex items-center gap-3 px-6">
            <div
              onClick={() => setReservationStatus('pending')}
              className={`relative cursor-pointer pb-15pxr text-xl ${reservationStatus === 'pending' ? 'z-10 -mb-1pxr border-b-2 border-green-100 font-semibold text-green-100' : 'font-regular text-gray-800'} `}
            >
              신청 {pendingCount}
            </div>
            <div
              onClick={() => setReservationStatus('confirmed')}
              className={`relative cursor-pointer pb-15pxr text-xl ${reservationStatus === 'confirmed' ? 'z-10 -mb-1pxr border-b-2 border-green-100 font-semibold text-green-100' : 'font-regular text-gray-800'}`}
            >
              승인 {confirmedCount}
            </div>
            <div
              onClick={() => setReservationStatus('declined')}
              className={`relative cursor-pointer pb-15pxr text-xl ${reservationStatus === 'declined' ? 'z-10 -mb-1pxr border-b-2 border-green-100 font-semibold text-green-100' : 'font-regular text-gray-800'}`}
            >
              거절 {declinedCount}
            </div>
          </div>
        </div>
        <ReservationInfo
          reservationStatus={reservationStatus}
          reservedScheduleData={reservedScheduleData}
          activityId={activityId}
          selectedDate={selectedDate}
          setSelectedTime={setSelectedTime}
          selectedTime={selectedTime}
        />
      </div>
    </div>
  );
}
