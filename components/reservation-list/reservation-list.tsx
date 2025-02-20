'use client';
import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {ReservationListResponse} from '@/types/reservation-list';
import ReviewModal from '@/components/reservation-list/review-modal';
import CustomSelect from '@/components/reservation-list/custom-select';
import NonDataPage from '@/components/common/non-data';
import ReservationModal from '@/components/reservation-list/reservation-modal';
import ReservationCard from '@/components/reservation-list/reservation-card';
import {getReservationList} from '@/service/api/reservation-list/getReservation.api';
import DisableScroll from '@/utils/disable-scroll';
import {useInfiniteQuery} from '@tanstack/react-query';
import {ScaleLoader} from 'react-spinners';
import {useInView} from 'react-intersection-observer';
import closeButton from '@/public/icon/ic_close_button.svg';

export const statusLabelsColor: Record<string, string> = {
  pending: 'text-blue-100',
  confirmed: 'text-orange-100',
  declined: 'text-red-200',
  canceled: 'text-gray-700',
  completed: 'text-gray-700',
};

export const buttonStyleByStatus: Record<string, string> = {
  pending:
    'w-80pxr h-8 py-1 px-2 font-bold text-md text-nomad-black tablet:text-lg tablet:w-112pxr tablet:h-40pxr tablet:px-3 tablet:py-2 bg-white border border-nomad-black rounded-md dark:bg-gray-50 dark:border-gray-200',
  completed:
    'w-80pxr h-8 py-1 px-2 font-bold text-md text-white tablet:text-lg tablet:w-112pxr tablet:h-40pxr tablet:px-3 tablet:py-2 bg-nomad-black rounded-md',
};

export default function ReservationList() {
  const router = useRouter();
  const [orderBy, setOrderBy] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [ref, inView] = useInView({
    threshold: 0.1,
  });
  DisableScroll(isOpen);

  const {data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage} = useInfiniteQuery<ReservationListResponse>({
    queryKey: ['reservationList'],
    queryFn: ({pageParam = null}) => getReservationList({size: 5, status: '', cursorId: pageParam as number | null}),
    initialPageParam: null,
    getNextPageParam: (lastPage, allPages) => {
      const totalLoadedReservations = allPages.flatMap(page => page.reservations).length;
      if (totalLoadedReservations >= lastPage.totalCount) return null;
      if (lastPage.cursorId === null) return null;
      return lastPage.reservations[lastPage.reservations.length - 1].id;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  const reservationList = data?.pages.flatMap(page => page.reservations) || [];

  const handleButtonClick = (status: string, id: number) => {
    setIsOpen(true);
    setModalType(status);
    setSelectedId(id);
  };

  const getModalContent = () => {
    switch (modalType) {
      case 'pending':
        return <ReservationModal reservationId={selectedId} message="예약을 취소하시겠습니까?" onClose={() => setIsOpen(false)} />;
      case 'completed':
        const selectedData = reservationList.find(reservation => reservation.status === 'completed' && reservation.id === selectedId);
        return <ReviewModal data={selectedData} message={'후기 작성'} onClose={() => setIsOpen(false)} />;
      default:
        return null;
    }
  };

  const filteredReservation = reservationList.filter(reservation => !orderBy || reservation.status === orderBy);

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
      <div className="mb-3 flex w-full items-center justify-between tablet:mb-6 tablet:items-start">
        <p className="text-3xl font-bold text-black-100 dark:text-gray-50">예약 내역</p>
        <div className="flex items-center gap-1">
          <div className="m-0">
            <CustomSelect orderBy={orderBy} handleOrderBy={(value: string) => setOrderBy(value)} />
          </div>
          <div className="relative h-12 w-12 tablet:hidden" onClick={() => router.back()}>
            <Image src={closeButton} alt="모달 닫기 버튼" className="absolute cursor-pointer" fill />
          </div>
        </div>
      </div>

      {!filteredReservation || filteredReservation.length === 0 ? (
        <NonDataPage />
      ) : (
        <div className="flex flex-col gap-2 tablet:gap-4 pc:gap-6">
          {filteredReservation.map(reservation => (
            <ReservationCard reservation={reservation} onButtonClick={handleButtonClick} key={`list_${reservation.id}`} />
          ))}
          <div className="mt-1 h-1" ref={ref} />
        </div>
      )}
      {isOpen && <>{getModalContent()}</>}
    </div>
  );
}
