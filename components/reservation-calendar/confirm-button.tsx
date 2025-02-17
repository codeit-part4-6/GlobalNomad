import React, {useState} from 'react';
import Button from '@/components/common/button';
import Modal from '@/components/common/modal/modal';
import {patchReservations} from '@/service/api/reservation-calendar/patchReservations.api';
import {ScaleLoader} from 'react-spinners';
import {useMutation, useQueryClient} from '@tanstack/react-query';

interface patchReservationsProps {
  reservationId: number | null;
  activityId: number | null;
}

export default function ConfirmButton({reservationId, activityId}: patchReservationsProps) {
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [declineLoading, setDeclinedLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const queryClient = useQueryClient();

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
        return status;
      }
    },
    onMutate: (status: string) => {
      if (status === 'confirmed') {
        setConfirmLoading(true);
      } else {
        setDeclinedLoading(true);
      }
    },
    onSuccess: status => {
      setConfirmLoading(false);
      setDeclinedLoading(false);
      queryClient.invalidateQueries({
        queryKey: ['reservationDashboard'],
      });
      queryClient.invalidateQueries({
        queryKey: ['reservedSchedule'],
      });
      queryClient.invalidateQueries({
        queryKey: ['myReservations'],
      });
      setModalMessage(status === 'confirmed' ? '예약이 승인되었습니다.' : '예약이 거절되었습니다.');
      setIsModalOpen(true);
    },
    onError: () => {
      setConfirmLoading(false);
      setDeclinedLoading(false);
      setModalMessage('요청을 처리하는데 실패했습니다. 다시 시도해주세요.');
      setIsModalOpen(true);
    },
  });

  return (
    <div className="flex justify-end gap-6pxr">
      <Button
        onClick={handleConfirmedClick}
        className="h-38pxr w-82pxr rounded-md bg-nomad-black px-10pxr align-middle text-md font-bold leading-none text-white"
        type="button"
      >
        <div className="flex items-center justify-center gap-3">
          {confirmLoading ? <ScaleLoader width={2} height={10} color="#ffffff" /> : '승인하기'}
        </div>
      </Button>
      <Button
        onClick={handleDeclinedClick}
        className="h-38pxr w-82pxr rounded-md border border-nomad-black px-10pxr text-md font-bold leading-none text-nomad-black"
        type="button"
      >
        <div className="flex items-center justify-center gap-3">
          {declineLoading ? <ScaleLoader width={2} height={10} color="#112211" /> : '거절하기'}
        </div>
      </Button>
      {isModalOpen && <Modal message={modalMessage} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
