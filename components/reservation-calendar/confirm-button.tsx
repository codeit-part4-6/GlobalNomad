import React, {useState} from 'react';
import Button from '../common/button';
import {useMutation} from '@tanstack/react-query';
import {patchReservations} from '@/service/api/reservation-calendar/patchReservations.api';
import {ScaleLoader} from 'react-spinners';

interface patchReservationsProps {
  reservationId: number | null;
  activityId: number | null;
}

export default function ConfirmButton({reservationId, activityId}: patchReservationsProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirmedClick = () => {
    mutation.mutate('confirmed');
  };

  const handleDeclinedClick = () => {
    mutation.mutate('declined');
  };

  const mutation = useMutation({
    mutationFn: async (status: string) => {
      if (reservationId !== null) {
        await patchReservations({activityId, reservationId, status});
      }
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      setLoading(false);
      alert('요청을 처리했습니다');
    },
    onError: () => {
      setLoading(false);
      alert('실패했어요');
    },
  });

  return (
    <div className="flex justify-end gap-6pxr">
      <Button
        onClick={handleConfirmedClick}
        className="h-38pxr w-82pxr rounded-md bg-nomad-black px-10pxr align-middle text-md font-bold leading-none text-white"
        type="button"
      >
        <div className="flex items-center justify-center gap-3">{loading ? <ScaleLoader width={3} height={20} color="#ffffff" /> : '승인하기'}</div>
      </Button>
      <Button
        onClick={handleDeclinedClick}
        className="h-38pxr w-82pxr rounded-md border border-nomad-black px-10pxr text-md font-bold leading-none text-nomad-black"
        type="button"
      >
        거절하기
      </Button>
    </div>
  );
}
