import React, {useEffect, useState} from 'react';
import {ReservationProps} from '@/types/reservation-list';
import {ReservationsResponse} from '@/types/my-reservations';
import ConfirmButton from '@/components/reservation-calendar/confirm-button';
import ConfirmChip from '@/components/reservation-calendar/confirm-chip';
import NonDataPage from '@/components/common/non-data';
import TimeDropDown from '@/components/reservation-calendar/time-dropdown';
import {getReservations} from '@/service/api/reservation-calendar/getReservations.api';
import {ScaleLoader} from 'react-spinners';
import {useInView} from 'react-intersection-observer';
import {useInfiniteQuery} from '@tanstack/react-query';

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
      if (totalLoadedReservations >= lastPage.totalCount) return null;
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
          <TimeDropDown
            times={times}
            selectedTime={selectedTime}
            isOpen={isDropdownOpen}
            setIsOpen={setIsDropdownOpen}
            onSelectTime={setSelectedTime}
          />
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
