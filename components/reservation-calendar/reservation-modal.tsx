import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import {Schedules} from '@/types/reserved-schedule';
import ReservationInfo from '@/components/reservation-calendar/reservation-info';
import ReservationTab from '@/components/reservation-calendar/reservation-tab';
import {getReservedSchedule} from '@/service/api/reservation-calendar/getReservedSchedule.api';
import {getScheduleCounts} from '@/utils/schedule-count';
import {useQuery} from '@tanstack/react-query';
import closeButton from '@/public/icon/ic_close_button.svg';

interface ReservationModalProps {
  onClose: () => void;
  selectedDate: string;
  activityId: number | null;
}

export default function ReservationModal({onClose, selectedDate, activityId}: ReservationModalProps) {
  const [reservationStatus, setReservationStatus] = useState<'pending' | 'confirmed' | 'declined'>('pending');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const {data: reservedSchedules = []} = useQuery<Schedules>({
    queryKey: ['reservedSchedule', selectedDate],
    queryFn: () => getReservedSchedule({activityId, date: selectedDate}),
    enabled: !!activityId,
  });

  useEffect(() => {
    if (reservedSchedules.length > 0 && !selectedTime) {
      setSelectedTime(`${reservedSchedules[0].startTime} ~ ${reservedSchedules[0].endTime}`);
    }
  }, [reservedSchedules, selectedTime]);

  const selectedSchedule = reservedSchedules.find(schedule => `${schedule.startTime} ~ ${schedule.endTime}` === selectedTime);
  const {pending, confirmed, declined} = getScheduleCounts(selectedSchedule);

  return (
    <div
      onClick={e => e.stopPropagation()}
      className="no-scrollbar fixed z-[60] h-full w-full overflow-y-auto bg-white shadow-sidenavi-box tablet:h-[70%] tablet:max-h-697pxr tablet:w-429pxr tablet:rounded-3xl"
    >
      <div className="h-full w-full pt-6">
        <div className="mb-5 flex items-center justify-between px-6">
          <p className="text-2xl font-bold text-black-100">예약 정보</p>
          <div className="relative h-12 w-12 tablet:h-10 tablet:w-10" onClick={onClose}>
            <Image src={closeButton} alt="모달 닫기 버튼" className="absolute cursor-pointer" fill />
          </div>
        </div>
        <div className="flex gap-3 border-b border-gray-200 px-6">
          <ReservationTab label="신청" count={pending} isActive={reservationStatus === 'pending'} onClick={() => setReservationStatus('pending')} />
          <ReservationTab
            label="승인"
            count={confirmed}
            isActive={reservationStatus === 'confirmed'}
            onClick={() => setReservationStatus('confirmed')}
          />
          <ReservationTab
            label="거절"
            count={declined}
            isActive={reservationStatus === 'declined'}
            onClick={() => setReservationStatus('declined')}
          />
        </div>
        <ReservationInfo
          reservationStatus={reservationStatus}
          reservedScheduleData={reservedSchedules}
          activityId={activityId}
          selectedDate={selectedDate}
          setSelectedTime={setSelectedTime}
          selectedTime={selectedTime}
        />
      </div>
    </div>
  );
}
