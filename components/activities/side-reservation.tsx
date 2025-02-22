'use client';
import React, {useState} from 'react';
import {useMutation} from 'react-query';
import {useParams, useRouter} from 'next/navigation';
import {ResultModalType} from '@/types/common/alert-modal.types';
import Image from 'next/image';
import SmCalendar from '@/components/activities/sm-calendar';
import activitiesStore from '@/service/store/activitiesstore';
import Modal from '@/components/common/modal/modal';
import Button from '@/components/common/button';
import OverlayContainer from '@/components/common/modal/overlay-container';
import InitialDevice from '@/utils/initial-device';
import FormatNumberWithCommas from '@/utils/format-number';
import postReservation from '@/service/api/activities/postActivities';
import Plus from '@/public/icon/icon_plus.png';
import Minus from '@/public/icon/icon_minus.png';
import Cancle from '@/public/icon/icon_cancle.png';

interface ReservationProps {
  price: number;
  person: number;
  selectedSchedule: {date: string; startTime: string; endTime: string; id: number};
  scheduleModal?: boolean;
  personModal?: boolean;
  updatePerson: (count: number) => void;
  saveReservation: () => void;
}

const Reservation = ({device, price}: {device: string; price: number}) => {
  const params = useParams();
  const {person, selectedSchedule, scheduleModal, personModal, setPerson} = activitiesStore();
  const [isPostResultModalOpen, setIsPostResultModalOpen] = useState<ResultModalType>({message: '', isOpen: false});
  const [isNotiModalOpen, setIsNotiModalOpen] = useState<ResultModalType>({message: '', isOpen: false});
  const router = useRouter();
  const pageID = params?.id?.toString() || '';

  const mutation = useMutation(postReservation, {
    onSuccess: () => {
      setIsPostResultModalOpen({message: '체험 예약을 완료했습니다.', isOpen: true});
    },
    onError: error => {
      if (error instanceof Error) {
        setIsPostResultModalOpen({message: error.message, isOpen: true});
      } else {
        setIsPostResultModalOpen({message: '알 수 없는 오류가 발생했습니다.', isOpen: true});
      }
    },
  });

  const handleClosePostResultModal = () => {
    setIsPostResultModalOpen({message: '', isOpen: false});
    const device = InitialDevice();
    if (device === 'mobile') {
      router.push(' /mypage/reserveList?modal=true');
    } else {
      router.push('/mypage/reserveList');
    }
  };

  const handleCloseNotiModal = () => {
    setIsNotiModalOpen({message: '', isOpen: false});
  };

  const handleUpdatePerson = (count: number) => {
    const total = person + count;
    if (total < 1) return setIsNotiModalOpen({message: '최소 예약 인원은 1명입니다.', isOpen: true});
    setPerson(total);
  };

  const handleSaveReservation = () => {
    if (!selectedSchedule) return setIsNotiModalOpen({message: '예약 정보가 없습니다.', isOpen: true});
    mutation.mutate({pageID: pageID, body: {scheduleId: selectedSchedule.id, headCount: person}});
  };

  const ReservationDeviceType = ({device}: {device: string}) => {
    switch (device) {
      case 'windows':
        return (
          <ReservationWindowsType
            price={price}
            person={person}
            selectedSchedule={selectedSchedule}
            updatePerson={handleUpdatePerson}
            saveReservation={handleSaveReservation}
          />
        );
      case 'tablet':
        return (
          <ReservationTabletType
            price={price}
            person={person}
            selectedSchedule={selectedSchedule}
            scheduleModal={scheduleModal}
            updatePerson={handleUpdatePerson}
            saveReservation={handleSaveReservation}
          />
        );
      default:
        return (
          <ReservationMobileType
            price={price}
            person={person}
            selectedSchedule={selectedSchedule}
            scheduleModal={scheduleModal}
            personModal={personModal}
            updatePerson={handleUpdatePerson}
            saveReservation={handleSaveReservation}
          />
        );
    }
  };

  return (
    <>
      <ReservationDeviceType device={device} />
      {isPostResultModalOpen.isOpen && <Modal message={isPostResultModalOpen.message} onClose={handleClosePostResultModal} />}
      {isNotiModalOpen.isOpen && <Modal message={isNotiModalOpen.message} onClose={handleCloseNotiModal} />}
    </>
  );
};

const ReservationWindowsType = ({price, person, selectedSchedule, updatePerson, saveReservation}: ReservationProps) => {
  return (
    <div className="rounded-xl border border-solid border-gray-200 bg-white px-24pxr pb-18pxr pt-24pxr shadow-sidenavi-box tablet:h-full pc:min-h-748pxr pc:min-w-384pxr">
      <div className="mb-16pxr">
        <div className="flex w-auto flex-row gap-3">
          <p className="mb-16pxr text-3xl font-bold text-black-100">{`₩ ${FormatNumberWithCommas(price)}`}</p>
          <p className="mb-16pxr text-2xl font-normal leading-10 text-gray-800">{`/ ${person}인`}</p>
        </div>
        <hr />
      </div>
      <div className="my-16pxr">
        <div className="flex w-auto flex-row gap-3">
          <p className="mb-16pxr text-xl font-bold text-nomad-black">날짜</p>
        </div>
        <SmCalendar />
      </div>
      <hr />
      <div className="mb-24pxr mt-12pxr">
        <p className="mt-16pxr w-full text-xl font-bold text-nomad-black">참여 인원수</p>
        <div className="shadow-[0px_2px_4px_rgba(5, 16, 55, 0.06)] inset-shadow-[0px_0px_0px_1px_#CDD0DC] flex h-43pxr w-120pxr flex-row items-start gap-10pxr rounded-md border bg-white p-0">
          <Button className="relative h-40pxr w-40pxr flex-auto items-start justify-center bg-white p-10pxr" onClick={() => updatePerson(-1)}>
            <Image src={Minus} width={20} height={20} alt="minus" />
          </Button>
          <p className="flex h-40pxr w-40pxr items-start justify-center bg-white p-10pxr text-black-100">{person}</p>
          <Button className="relative h-40pxr w-40pxr flex-auto items-start justify-center bg-white p-10pxr" onClick={() => updatePerson(1)}>
            <Image src={Plus} width={20} height={20} alt="plus" />
          </Button>
        </div>
        <Button
          className={`my-24pxr flex h-56pxr w-full flex-row items-center justify-center gap-4pxr rounded-s px-8pxr py-40pxr ${!selectedSchedule?.id ? 'bg-gray-400' : 'nomad-button-hover cursor-pointer bg-nomad-black'}`}
          disabled={!selectedSchedule?.id}
          onClick={saveReservation}
        >
          <p className="text-lg font-bold text-white">예약하기</p>
        </Button>
      </div>
      <hr />
      <div className="mt-16pxr flex flex-row items-center justify-between">
        <p className="text-xl font-bold text-nomad-black">총 합계</p>
        <p className="text-xl font-bold text-nomad-black">{`₩ ${FormatNumberWithCommas(price * person)}`}</p>
      </div>
    </div>
  );
};

const ReservationTabletType = ({price, person, selectedSchedule, scheduleModal, updatePerson, saveReservation}: ReservationProps) => {
  const {setScheduleModal: updateScheduleModal} = activitiesStore();

  const handleOpenModal = (status: boolean) => {
    updateScheduleModal(status);
  };

  return (
    <div className="rounded-xl border border-solid border-gray-200 bg-white px-24pxr pb-18pxr pt-24pxr shadow-sidenavi-box tablet:h-full tablet:min-h-423pxr tablet:min-w-251pxr">
      <div className="mb-16pxr">
        <div className="flex w-auto flex-row gap-3">
          <p className="mb-16pxr text-2xl font-bold text-black-100">{`₩ ${FormatNumberWithCommas(price)}`}</p>
          <p className="mb-16pxr text-2xl font-normal leading-8 text-gray-800">{`/ ${person}인`}</p>
        </div>
        <hr />
      </div>
      <div className="my-13pxr">
        <div className="flex w-auto flex-row gap-3">
          <p className="mb-16pxr text-xl font-bold text-nomad-black">날짜</p>
        </div>
        <Button
          className="rounded-md border border-gray-100 bg-white px-10pxr text-lg font-semibold text-nomad-black"
          onClick={() => handleOpenModal(true)}
        >
          날짜 선택하기
        </Button>
        {selectedSchedule.date.length > 0 && (
          <p className="text-lg font-semibold text-nomad-black">{`${selectedSchedule.date} ${selectedSchedule.startTime} ~ ${selectedSchedule.endTime}`}</p>
        )}
      </div>
      <hr />
      <div className="mb-24pxr mt-12pxr">
        <p className="mt-16pxr w-full text-xl font-bold text-nomad-black">참여 인원수</p>
        <div className="shadow-[0px_2px_4px_rgba(5, 16, 55, 0.06)] inset-shadow-[0px_0px_0px_1px_#CDD0DC] flex h-43pxr w-120pxr flex-row items-start gap-10pxr rounded-md border bg-white p-0">
          <Button className="relative h-40pxr w-40pxr flex-auto items-start justify-center bg-white p-10pxr" onClick={() => updatePerson(-1)}>
            <Image src={Minus} width={20} height={20} alt="minus" />
          </Button>
          <p className="flex h-40pxr w-40pxr items-center justify-center bg-white text-black-50">{person}</p>
          <Button className="relative h-40pxr w-40pxr flex-auto items-start justify-center bg-white p-10pxr" onClick={() => updatePerson(1)}>
            <Image src={Plus} width={20} height={20} alt="plus" />
          </Button>
        </div>
        <Button
          className={`my-24pxr flex h-56pxr w-full flex-row items-center justify-center gap-4pxr rounded-md px-8pxr py-40pxr ${!selectedSchedule.id ? 'bg-gray-400' : 'nomad-button-hover cursor-pointer bg-nomad-black'}`}
          disabled={selectedSchedule.id === 0}
          onClick={saveReservation}
        >
          <p className="text-lg font-bold text-white">예약하기</p>
        </Button>
      </div>
      <hr />
      <div className="mt-16pxr flex flex-row items-center justify-between">
        <p className="text-xl font-bold text-nomad-black">총 합계</p>
        <p className="text-xl font-bold text-nomad-black">{`₩ ${FormatNumberWithCommas(price * person)}`}</p>
      </div>
      {scheduleModal && (
        <OverlayContainer onClose={() => handleOpenModal(false)}>
          <div className="relative max-h-700pxr w-480pxr rounded-3xl bg-white px-24pxr pb-32pxr pt-28pxr" onClick={e => e.stopPropagation()}>
            <div className="mb-30pxr flex flex-row justify-between">
              <p className="mb-16pxr text-xl font-bold text-nomad-black">날짜</p>
              <Button onClick={() => handleOpenModal(false)}>
                <Image src={Cancle} width={40} height={40} alt="cancle" />
              </Button>
            </div>
            <div className="mb-100pxr">
              <SmCalendar />
            </div>
            <Button
              className={`absolute bottom-32pxr left-24pxr flex h-56pxr min-w-432pxr items-center justify-center rounded-md ${!selectedSchedule.id ? 'bg-gray-400' : 'bg-nomad-black'}`}
              disabled={!selectedSchedule.id}
              onClick={() => handleOpenModal(false)}
            >
              <p className="text-lg font-bold text-white">확인</p>
            </Button>
          </div>
        </OverlayContainer>
      )}
    </div>
  );
};

const ReservationMobileType = ({price, person, selectedSchedule, scheduleModal, personModal, updatePerson, saveReservation}: ReservationProps) => {
  const {setScheduleModal: updateScheduleModal, setPersonModal: updatePersonModal} = activitiesStore();

  const handleOpenScheduleModal = (status: boolean) => {
    updateScheduleModal(status);
  };

  const handleOpenPersonModal = () => {
    updateScheduleModal(false);
    handleClosePersonModal(true);
  };

  const handleClosePersonModal = (status: boolean) => {
    updatePersonModal(status);
  };

  return (
    <>
      <div className="sticky bottom-0 left-0 z-10 h-85pxr w-full min-w-375pxr border border-t border-solid border-gray-600 bg-white">
        <div className="flex flex-row flex-wrap justify-between px-18pxr py-18pxr">
          <div className="flex flex-col items-start">
            <div className="flex h-35pxr w-auto flex-row gap-3">
              <p className="text-xl font-bold text-nomad-black">{`₩ ${FormatNumberWithCommas(price * person)}`}</p>
              <p className="mb-16pxr text-xl font-normal leading-8 text-gray-800">{`/ ${person}인`}</p>
            </div>
            <Button className="border-0 bg-white text-lg font-semibold text-primary" onClick={() => handleOpenScheduleModal(true)}>
              <ins>날짜 선택하기</ins>
            </Button>
          </div>
          <Button
            className={`h-48pxr min-w-106pxr items-center justify-center rounded-md text-lg font-bold text-white ${!selectedSchedule.id ? 'bg-gray-400' : 'bg-nomad-black'}`}
            disabled={selectedSchedule.id === 0}
            onClick={saveReservation}
          >
            예약하기
          </Button>
        </div>
      </div>
      {scheduleModal && (
        <OverlayContainer onClose={() => handleOpenScheduleModal(false)}>
          <div className="relative h-full w-373pxr bg-white px-24pxr pb-40pxr pt-24pxr" onClick={e => e.stopPropagation()}>
            <div className="mb-30pxr flex flex-row justify-between">
              <div className="flex flex-row gap-3">
                <p className="text-xl font-bold text-nomad-black">날짜</p>
              </div>
              <Button onClick={() => handleOpenScheduleModal(false)}>
                <Image src={Cancle} width={40} height={40} alt="cancle" />
              </Button>
            </div>
            <SmCalendar />
            <Button
              className={`absolute bottom-40pxr left-24pxr flex h-56pxr min-w-327pxr flex-row items-center justify-center rounded-md ${!selectedSchedule?.id ? 'bg-gray-400' : 'bg-nomad-black'}`}
              disabled={!selectedSchedule.id}
              onClick={handleOpenPersonModal}
            >
              <p className="text-lg font-bold text-white">다음</p>
            </Button>
          </div>
        </OverlayContainer>
      )}
      {personModal && (
        <OverlayContainer onClose={() => handleClosePersonModal(false)}>
          <div className="relative h-full min-w-373pxr bg-white px-24pxr pb-40pxr pt-24pxr" onClick={e => e.stopPropagation()}>
            <div className="mb-30pxr flex flex-row justify-between">
              <div className="flex flex-row gap-3">
                <p className="text-xl font-bold text-nomad-black">날짜</p>
              </div>
              <Button onClick={() => handleClosePersonModal(false)}>
                <Image src={Cancle} width={40} height={40} alt="cancle" />
              </Button>
            </div>
            <div className="flex flex-col">
              <p className="mb-24pxr">예약할 인원을 선택해주세요.</p>
              <div className="shadow-[0px_2px_4px_rgba(5, 16, 55, 0.06)] inset-shadow-[0px_0px_0px_1px_#CDD0DC] flex h-43pxr w-120pxr flex-row items-start gap-10pxr rounded-md border bg-white p-0">
                <Button className="relative h-40pxr w-40pxr flex-auto items-start justify-center bg-white p-10pxr" onClick={() => updatePerson(-1)}>
                  <Image src={Minus} width={20} height={20} alt="minus" />
                </Button>
                <p className="flex h-40pxr w-40pxr items-start justify-center bg-white p-10pxr dark:text-black-50">{person}</p>
                <Button className="relative h-40pxr w-40pxr flex-auto items-start justify-center bg-white p-10pxr" onClick={() => updatePerson(1)}>
                  <Image src={Plus} width={20} height={20} alt="plus" />
                </Button>
              </div>
            </div>
            <Button
              className="absolute bottom-40pxr left-24pxr flex h-56pxr min-w-327pxr flex-row items-center justify-center rounded-md bg-nomad-black"
              disabled={!selectedSchedule.id}
              onClick={() => handleClosePersonModal(false)}
            >
              <p className="text-lg font-bold text-white">확인</p>
            </Button>
          </div>
        </OverlayContainer>
      )}
    </>
  );
};

export default Reservation;
