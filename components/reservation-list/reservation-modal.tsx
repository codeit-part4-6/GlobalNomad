import {useState} from 'react';
import {ScaleLoader} from 'react-spinners';
import Image from 'next/image';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import Button from '@/components/common/button';
import OverlayContainer from '@/components/common/modal/overlay-container';
import {patchReservationList} from '@/service/api/reservation-list/patchReservation.api';
import checkConfirm from '@/public/icon/icon_confirm.svg';

interface ModalProps {
  message: string;
  onClose: () => void;
  reservationId?: number | null;
}

export default function ReservationModal({message, onClose, reservationId}: ModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (reservationId: number | null) => {
      if (reservationId !== null) {
        await patchReservationList({reservationId});
      }
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['reservationList'],
      });
      setLoading(false);
      onClose();
    },
    onError: () => {
      setLoading(false);
      alert('예약 취소에 실패했어요');
    },
  });

  const handleCancelClick = () => {
    if (reservationId !== null) {
      mutation.mutate(reservationId ?? null);
    }
  };

  return (
    <OverlayContainer onClose={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        className={
          'mx-[2.375rem] flex h-[11.5rem] w-full flex-col items-center justify-center gap-8 rounded-xl bg-white p-[0.375rem] tablet:w-[18.625rem] pc:w-[18.625rem]'
        }
      >
        <div>
          <div className="relative mx-auto mb-4 h-24pxr w-24pxr">
            <Image src={checkConfirm} alt="예약 취소 확인 체크" fill className="absolute" />
          </div>
          <p className="text-lg font-regular">{message}</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onClose}
            className={
              'h-38pxr w-80pxr rounded-md border border-nomad-black px-20pxr py-10pxr text-center text-md font-bold leading-none text-nomad-black'
            }
          >
            아니오
          </Button>
          <Button
            disabled={loading}
            onClick={handleCancelClick}
            className={'h-38pxr w-80pxr rounded-md bg-nomad-black px-14pxr py-10pxr text-center text-md font-bold leading-none text-white'}
          >
            {loading ? <ScaleLoader width={3} height={20} color="#ffffff" /> : '취소하기'}
          </Button>
        </div>
      </div>
    </OverlayContainer>
  );
}
