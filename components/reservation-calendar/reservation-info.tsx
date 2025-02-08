import React, {useEffect, useState} from 'react';
import arrowDown from '@/public/icon/icon_arrow_down.svg';
import Image from 'next/image';
import ConfirmButton from './confirm-button';
import ConfirmChip from './confirm-chip';
import {Schedules} from '@/types/reserved-schedule';
import {useInfiniteQuery} from '@tanstack/react-query';
import {ReservationsResponse} from '@/types/my-reservations';
import {getReservations} from '@/service/api/reservation-calendar/getReservations.api';
import NonDataPage from '../common/non-data';
import {ScaleLoader} from 'react-spinners';
import {useInView} from 'react-intersection-observer';

interface ReservationProps {
  reservationStatus: string;
  reservedScheduleData: Schedules;
  activityId: number | null;
  selectedDate: string;
  setSelectedTime: (time: string) => void;
  selectedTime: string | null;
}

export default function ReservationInfo({
  setSelectedTime,
  selectedTime,
  reservationStatus,
  reservedScheduleData,
  activityId,
  selectedDate,
}: ReservationProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [ref, inView] = useInView({
    threshold: 0.9,
  });

  const selectedSchedule = reservedScheduleData.find(schedule => `${schedule.startTime} ~ ${schedule.endTime}` === selectedTime);
  const selectedScheduleId = selectedSchedule?.scheduleId || reservedScheduleData?.[0]?.scheduleId;

  const {data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage} = useInfiniteQuery<ReservationsResponse>({
    queryKey: ['myReservations', activityId, reservationStatus, selectedTime],
    queryFn: ({pageParam = null}) =>
      getReservations({
        activityId,
        size: 3,
        scheduleId: selectedScheduleId ?? reservedScheduleData[0].scheduleId,
        status: reservationStatus,
        cursorId: pageParam as number | null,
      }),
    initialPageParam: null, // 첫 번째 페이지는 cursorId 없이 요청
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.reservations.length === 0) {
        return null;
      }

      const totalLoadedReservations = allPages.flatMap(page => page.reservations).length;

      if (totalLoadedReservations >= lastPage.totalCount) {
        return null;
      }
      return lastPage.cursorId;
    },

    enabled: !!activityId && !!selectedTime,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && data?.pages.length) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage, data]);

  const times = Array.from(new Set((reservedScheduleData || []).map(reservation => `${reservation.startTime} ~ ${reservation.endTime}`)));
  const reservations = data?.pages.flatMap(page => page.reservations) || [];

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setIsDropdownOpen(false);
  };

  const filteredReservations = selectedTime
    ? reservations.filter(reservation => `${reservation.startTime} ~ ${reservation.endTime}` === selectedTime)
    : reservations;

  const renderChip = (reservationId: number) => {
    switch (reservationStatus) {
      case 'pending':
        return <ConfirmButton activityId={activityId} reservationId={reservationId} />;
      case 'confirmed':
        return <ConfirmChip method={`confirm`} />;
      case 'declined':
        return <ConfirmChip method={`declined`} />;
      default:
        return '';
    }
  };

  return (
    <div className="mt-27pxr px-6">
      <div className="flex flex-col text-start">
        <div>
          <p className="mb-4 text-xl font-semibold leading-none text-black-100">예약 날짜</p>
          <p className="mb-3 text-xl font-regular leading-none text-black-100 tablet:mb-1">{selectedDate}</p>
          <div className="relative mb-30pxr min-h-53pxr w-full rounded-2xl border border-gray-700 px-5 py-4 tablet:rounded-md">
            <div className="flex cursor-pointer items-center justify-between" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <span className="text-2lg font-regular leading-none text-black-100">{selectedTime || '체험 시간을 선택하세요'}</span>
              <div className="relative h-6 w-6">
                <Image className="absolute" fill src={arrowDown} alt="메뉴 선택 토글" />
              </div>
            </div>
            {isDropdownOpen && (
              <ul className="absolute -left-2pxr z-10 mt-5 w-full rounded-md border border-gray-300 bg-white shadow-lg">
                {times.map((time, index) => (
                  <li
                    key={index}
                    className="cursor-pointer px-5 py-18pxr text-lg font-regular text-gray-800 hover:bg-green-50 hover:text-nomad-black"
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div>
          <p className="mb-4 text-xl font-semibold text-black-100">예약 내역</p>

          {filteredReservations.length > 0
            ? filteredReservations.map(reservation => (
                <div key={reservation.id} className="mb-4 flex min-h-116pxr w-full flex-col rounded-xl border border-gray-200 px-4 pb-3 pt-4">
                  <div className="mb-6pxr text-lg font-semibold text-gray-700">
                    닉네임 <span className="ml-10pxr font-medium text-black-100">{reservation.nickname}</span>
                  </div>
                  <div className="mb-6pxr text-lg font-semibold text-gray-700">
                    인원 <span className="ml-10pxr font-medium text-black-100">{reservation.headCount}명</span>
                  </div>
                  <div>{renderChip(reservation.id)}</div>
                </div>
              ))
            : !isFetching && <NonDataPage type="modal" />}
        </div>
        {isFetching && (
          <div className="no-scrollbar flex h-200pxr w-full items-center justify-center">
            <ScaleLoader color="#0b3b2d" />
          </div>
        )}
        <div className="mt-1 h-10" ref={ref}></div>
      </div>
    </div>
  );
}
