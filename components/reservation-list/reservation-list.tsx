import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import Button from '@/components/common/button';
import Modal from '@/components/common/modal/modal';
import ReviewModal from '@/components/common/modal/review-modal';
import CustomSelect from '@/components/reservation-list/custom-select';
import {statusLabels, buttonByStatus} from '@/constant/reservation-list-constant';
import NonDataPage from '../common/non-data';
import closeButton from '@/public/icon/ic_close_button.svg';
import {getReservationList} from '@/service/api/reservation-list/getReservation.api';
import {useInfiniteQuery} from '@tanstack/react-query';
import {ReservationListResponse} from '@/types/reservation-list';
import FormattedDotDate from '@/utils/formatted-dot-date';
import {ScaleLoader} from 'react-spinners';
import FormattedPrice from '@/utils/formatted-price';
import {useInView} from 'react-intersection-observer';

export const statusLabelsColor: Record<string, string> = {
  pending: 'text-blue-100',
  confirmed: 'text-orange-100',
  declined: 'text-red-200',
  canceled: 'text-gray-700',
  completed: 'text-gray-700',
};

export const buttonStyleByStatus: Record<string, string> = {
  pending:
    'w-80pxr h-8 py-1 px-2 font-bold text-md text-nomad-black tablet:text-lg tablet:w-112pxr tablet:h-40pxr tablet:px-3 tablet:py-2 bg-white border border-nomad-black rounded-md',
  completed:
    'w-80pxr h-8 py-1 px-2 font-bold text-md text-white tablet:text-lg tablet:w-112pxr tablet:h-40pxr tablet:px-3 tablet:py-2 bg-nomad-black rounded-md',
};

export default function ReservationList({onClose}: {onClose: () => void}) {
  const [orderBy, setOrderBy] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [ref, inView] = useInView({
    threshold: 0.1,
  });

  const {data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage} = useInfiniteQuery<ReservationListResponse>({
    queryKey: ['reservationList'],
    queryFn: ({pageParam = null}) => getReservationList({size: 5, status: '', cursorId: pageParam as number | null}),
    initialPageParam: null,
    getNextPageParam: (lastPage, allPages) => {
      const totalLoadedReservations = allPages.flatMap(page => page.reservations).length;

      if (totalLoadedReservations >= lastPage.totalCount) {
        return null;
      }
      if (lastPage.cursorId === null) {
        return null;
      }
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
        return <Modal reservationId={selectedId} type="small" message="예약을 취소하시겠습니까?" onClose={() => setIsOpen(false)} />;
      case 'completed':
        const selectedData = reservationList.find(reservation => reservation.status === 'completed' && reservation.id === selectedId);
        return <ReviewModal data={selectedData} message={'후기 작성'} onClose={() => setIsOpen(false)} />;
      default:
        return null;
    }
  };

  const filteredReservation = reservationList.filter(reservation => !orderBy || reservation.status === orderBy);

  useEffect(() => {
    // 모달 dim 부분 스크롤 막기
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // 스크롤 비활성화
    } else {
      document.body.style.overflow = ''; // 기본 스크롤 상태로 복구
    }
    return () => {
      document.body.style.overflow = ''; // 컴포넌트가 unmount 될 때도 스크롤 상태 복구
    };
  }, [isOpen]);

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
        <p className="text-3xl font-bold text-black-100">예약 내역</p>
        <div className="flex items-center gap-1">
          <div className="m-0">
            <CustomSelect orderBy={orderBy} handleOrderBy={(value: string) => setOrderBy(value)} />
          </div>
          <div className="relative h-12 w-12 tablet:hidden" onClick={onClose}>
            <Image src={closeButton} alt="모달 닫기 버튼" className="absolute cursor-pointer" fill />
          </div>
        </div>
      </div>

      {!filteredReservation || filteredReservation.length === 0 ? (
        <NonDataPage />
      ) : (
        <div className="flex flex-col gap-2 tablet:gap-4 pc:gap-6">
          {filteredReservation.map(reservation => (
            <div
              key={`list_${reservation.id}`}
              className="flex h-32 w-full items-center rounded-3xl bg-white shadow-sidenavi-box tablet:h-156pxr pc:h-204pxr"
            >
              <div className="relative h-32 w-32 flex-shrink tablet:h-156pxr tablet:w-156pxr pc:h-204pxr pc:w-204pxr">
                <Image className="absolute rounded-bl-3xl rounded-tl-3xl" fill src={reservation.activity.bannerImageUrl} alt="체험 배너 이미지" />
              </div>
              <div className="flex-grow py-11pxr pl-2 pr-14pxr tablet:py-3 tablet:pl-3 tablet:pr-18pxr pc:px-6 pc:py-21pxr">
                <p className={`${statusLabelsColor[reservation.status]} text-md font-bold tablet:text-lg pc:mb-2`}>
                  {statusLabels[reservation.status]}
                </p>
                <p className="text-md font-bold text-nomad-black tablet:mb-1 tablet:text-2lg pc:mb-3 pc:text-xl">{reservation.activity.title}</p>
                <div className="mb-0 flex items-center gap-[0.125rem] text-xs font-regular text-nomad-black tablet:mb-10pxr tablet:text-md pc:mb-4 pc:text-lg">
                  <p>
                    {FormattedDotDate(reservation.date)} · {reservation.startTime} - {reservation.endTime} · {reservation.headCount}명
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-medium text-black-100 tablet:text-xl">￦{FormattedPrice(reservation.totalPrice)}</p>
                  <Button
                    onClick={() => handleButtonClick(`${reservation.status}`, reservation.id)}
                    className={`${buttonStyleByStatus[reservation.status]}`}
                  >
                    {buttonByStatus[reservation.status]}
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-1 h-1" ref={ref} />
        </div>
      )}
      {isOpen && <>{getModalContent()}</>}
    </div>
  );
}
