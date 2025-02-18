import React from 'react';
import Image from 'next/image';
import {Reservation} from '@/types/reservation-list';
import Button from '@/components/common/button';
import {statusLabels, buttonByStatus} from '@/constant/reservation-list-constant';
import FormatDate from '@/utils/format-date';
import FormattedPrice from '@/utils/formatted-price';

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

interface ReservationCardProps {
  reservation: Reservation;
  onButtonClick: (status: string, id: number) => void;
}

export default function ReservationCard({reservation, onButtonClick}: ReservationCardProps) {
  return (
    <div className="flex h-32 w-full items-center rounded-3xl bg-white shadow-sidenavi-box tablet:h-156pxr pc:h-204pxr">
      <div className="relative aspect-[1/1] h-32 w-32 flex-shrink tablet:h-156pxr tablet:w-156pxr pc:h-204pxr pc:w-204pxr">
        <Image
          className="absolute rounded-bl-3xl rounded-tl-3xl"
          fill
          src={reservation.activity.bannerImageUrl}
          alt="체험 배너 이미지"
          sizes="(max-width: 745px) 128px, (max-width: 1200px) 156px, 204px"
        />
      </div>
      <div className="flex-grow py-11pxr pl-2 pr-14pxr tablet:py-3 tablet:pl-3 tablet:pr-18pxr pc:px-6 pc:py-21pxr">
        <p className={`${statusLabelsColor[reservation.status]} text-md font-bold tablet:text-lg pc:mb-2`}>{statusLabels[reservation.status]}</p>
        <p className="line-clamp-1 text-md font-bold text-nomad-black tablet:mb-1 tablet:text-2lg pc:mb-3 pc:text-xl">{reservation.activity.title}</p>
        <div className="mb-0 flex items-center gap-[0.125rem] text-xs font-regular text-nomad-black tablet:mb-10pxr tablet:text-md pc:mb-4 pc:text-lg">
          <p>
            {FormatDate(reservation.date)} · {reservation.startTime} - {reservation.endTime} · {reservation.headCount}명
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-lg font-medium text-black-100 tablet:text-xl">￦{FormattedPrice(reservation.totalPrice)}</p>
          <Button onClick={() => onButtonClick(`${reservation.status}`, reservation.id)} className={`${buttonStyleByStatus[reservation.status]}`}>
            {buttonByStatus[reservation.status]}
          </Button>
        </div>
      </div>
    </div>
  );
}
