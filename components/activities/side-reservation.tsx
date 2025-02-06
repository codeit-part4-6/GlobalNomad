'use client';
import React, {useCallback, useEffect, useState} from 'react';
import Image from 'next/image';
import SmCalendar from '@/components/activities/sm-calendar';
import Button from '@/components/common/button';
import OverlayContainer from '@/components/common/modal/overlay-container';
import Plus from '@/public/icon/icon_plus.png';
import Minus from '@/public/icon/icon_minus.png';
import Cancle from '@/public/icon/icon_cancle.png';
import {ReservationPost, SchedulesDateType} from '@/types/activities-info';
import FormatNumberWithCommas from '@/utils/format-number';
import {useMutation} from 'react-query';
import postReservation from '@/service/api/activities/postActivities';

interface ReservationProps {
  pageID: string;
  person: number;
  price: number;
  mutate: (data: {pageID: string; body: ReservationPost}) => void;
  updatePerson: (count: number) => void;
}

const Reservation = ({device, pageID, price}: {device: string; pageID: string; price: number}) => {
  const [person, setPerson] = useState<number>(1);

  const mutation = useMutation(postReservation, {
    onSuccess: () => {
      alert('데이터가 성공적으로 저장되었습니다.');
    },
  });

  const handleUpdatePerson = useCallback(
    (count: number) => {
      if (person + count < 1) return alert('최소 예약 인원은 1명입니다.');
      setPerson(person + count);
    },
    [person],
  );

  const ReservationDeviceType = ({device}: {device: string}) => {
    switch (device) {
      case 'windows':
        return <ReservationWindowsType pageID={pageID} person={person} price={price} mutate={mutation.mutate} updatePerson={handleUpdatePerson} />;
      case 'tablet':
        return <ReservationTabletType pageID={pageID} person={person} price={price} mutate={mutation.mutate} updatePerson={handleUpdatePerson} />;
      default:
        return <ReservationMobileType pageID={pageID} person={person} price={price} mutate={mutation.mutate} updatePerson={handleUpdatePerson} />;
    }
  };

  return <ReservationDeviceType device={device} />;
};

const ReservationWindowsType = ({pageID, person, price, mutate, updatePerson}: ReservationProps) => {
  const [reservationInfo, setReservationInfo] = useState<SchedulesDateType>();

  const handleSelectSchedule = ({date, id, startTime, endTime}: SchedulesDateType) => {
    setReservationInfo({date, id, startTime, endTime});
  };

  const handleSaveReservation = () => {
    if (!reservationInfo) return alert('예약 정보가 없습니다.');
    mutate({pageID: pageID, body: {scheduleId: reservationInfo.id, headCount: person}});
  };

  return (
    <div className="rounded-xl border border-solid border-gray-200 bg-white px-24pxr pb-18pxr pt-24pxr shadow-sidenavi-box tablet:h-full pc:min-h-748pxr pc:min-w-384pxr">
      <div className="mb-16pxr">
        <div className="flex w-auto flex-row gap-3">
          <p className="mb-16pxr text-3xl font-bold text-black-100">{`₩ ${FormatNumberWithCommas(price)}`}</p>
          <p className="mb-16pxr text-2xl font-normal leading-10 text-gray-800">{`${person}/ 인`}</p>
        </div>
        <hr />
      </div>
      <div className="my-16pxr">
        <div className="flex w-auto flex-row gap-3">
          <p className="mb-16pxr text-xl font-bold text-nomad-black">날짜</p>
        </div>
        <SmCalendar pageID={pageID} onSelect={handleSelectSchedule} />
      </div>
      <hr />
      <div className="mb-24pxr mt-12pxr">
        <p className="mt-16pxr w-full text-xl font-bold text-nomad-black">참여 인원수</p>
        <div className="shadow-[0px_2px_4px_rgba(5, 16, 55, 0.06)] inset-shadow-[0px_0px_0px_1px_#CDD0DC] flex h-42pxr w-120pxr flex-row items-start gap-10pxr rounded-md border bg-white p-0">
          <Button
            className="relative h-40pxr w-40pxr flex-row items-start justify-center rounded-s-md bg-white p-10pxr"
            onClick={() => updatePerson(-1)}
          >
            <Image src={Minus} width={20} height={20} alt="minus" />
          </Button>
          <p className="h-40pxr w-40pxr flex-row items-start justify-center rounded-s-md bg-white p-10pxr">{person}</p>
          <Button
            className="relative h-40pxr w-40pxr flex-row items-start justify-center rounded-s-md bg-white p-10pxr"
            onClick={() => updatePerson(1)}
          >
            <Image src={Plus} width={20} height={20} alt="plus" />
          </Button>
        </div>
        <Button
          className={`my-24pxr flex h-56pxr w-full flex-row items-center justify-center gap-4pxr rounded-s px-8pxr py-40pxr ${!reservationInfo?.id ? 'bg-gray-400' : 'bg-nomad-black'}`}
          disabled={!reservationInfo?.id}
          onClick={handleSaveReservation}
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

const ReservationTabletType = ({pageID, person, price, mutate, updatePerson}: ReservationProps) => {
  const [reservationInfo, setReservationInfo] = useState<SchedulesDateType>();
  const [modalStatus, setModalStatus] = useState<boolean>(false);

  const handleSelectSchedule = ({date, id, startTime, endTime}: SchedulesDateType) => {
    setReservationInfo({date, id, startTime, endTime});
  };

  const handleOpenModal = (status: boolean) => {
    if (status) setReservationInfo(undefined);
    setModalStatus(status);
  };

  const handleSaveReservation = () => {
    if (!reservationInfo) return alert('예약 정보가 없습니다.');
    mutate({pageID: pageID, body: {scheduleId: reservationInfo.id, headCount: person}});
  };

  return (
    <div className="rounded-xl border border-solid border-gray-200 bg-white px-24pxr pb-18pxr pt-24pxr shadow-sidenavi-box tablet:h-full tablet:min-h-423pxr tablet:min-w-251pxr">
      <div className="mb-16pxr">
        <div className="flex w-auto flex-row gap-3">
          <p className="mb-16pxr text-2xl font-bold text-black-100">{`₩ ${FormatNumberWithCommas(price)}`}</p>
          <p className="mb-16pxr text-2xl font-normal leading-8 text-gray-800">{`${person}/ 인`}</p>
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
        {reservationInfo?.id && (
          <p className="text-lg font-semibold text-nomad-black">{`${reservationInfo?.date} ${reservationInfo?.startTime} ~ ${reservationInfo?.endTime}`}</p>
        )}
      </div>
      <hr />
      <div className="mb-24pxr mt-12pxr">
        <p className="mt-16pxr w-full text-xl font-bold text-nomad-black">참여 인원수</p>
        <div className="shadow-[0px_2px_4px_rgba(5, 16, 55, 0.06)] inset-shadow-[0px_0px_0px_1px_#CDD0DC] flex h-42pxr w-120pxr flex-row items-start gap-10pxr rounded-md border bg-white p-0">
          <Button
            className="relative h-40pxr w-40pxr flex-row items-start justify-center rounded-s-md bg-white p-10pxr"
            onClick={() => updatePerson(-1)}
          >
            <Image src={Minus} width={20} height={20} alt="minus" />
          </Button>
          <p className="h-40pxr w-40pxr flex-row items-start justify-center rounded-s-md bg-white p-10pxr">{person}</p>
          <Button
            className="relative h-40pxr w-40pxr flex-row items-start justify-center rounded-s-md bg-white p-10pxr"
            onClick={() => updatePerson(1)}
          >
            <Image src={Plus} width={20} height={20} alt="plus" />
          </Button>
        </div>
        <Button
          className={`my-24pxr flex h-56pxr w-full flex-row items-center justify-center gap-4pxr rounded-md px-8pxr py-40pxr ${!reservationInfo?.id ? 'bg-gray-400' : 'bg-nomad-black'}`}
          disabled={!reservationInfo?.id}
          onClick={handleSaveReservation}
        >
          <p className="text-lg font-bold text-white">예약하기</p>
        </Button>
      </div>
      <hr />
      <div className="mt-16pxr flex flex-row items-center justify-between">
        <p className="text-xl font-bold text-nomad-black">총 합계</p>
        <p className="text-xl font-bold text-nomad-black">{`₩ ${FormatNumberWithCommas(price * person)}`}</p>
      </div>
      {modalStatus && (
        <OverlayContainer onClose={() => handleOpenModal(false)}>
          <div onClick={e => e.stopPropagation()} className="max-h-700pxr w-480pxr rounded-3xl bg-white px-24pxr pb-32pxr pt-28pxr">
            <div className="mb-30pxr flex flex-row justify-between">
              <p className="mb-16pxr text-xl font-bold text-nomad-black">날짜</p>
              <Button onClick={() => handleOpenModal(false)}>
                <Image src={Cancle} width={40} height={40} alt="cancle" />
              </Button>
            </div>
            <SmCalendar pageID={pageID} onSelect={handleSelectSchedule} />
            <Button
              className={`mb-10pxr flex h-56pxr w-full items-center justify-center rounded-md bg-nomad-black px-8pxr ${!reservationInfo && 'bg-gray-400'}`}
              disabled={!reservationInfo}
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

const ReservationMobileType = ({pageID, person, price, mutate, updatePerson}: ReservationProps) => {
  const [reservationInfo, setReservationInfo] = useState<SchedulesDateType>();
  const [modalStatus, setModalStatus] = useState<boolean>(false);

  const handleSelectSchedule = ({date, id, startTime, endTime}: SchedulesDateType) => {
    setReservationInfo({date, id, startTime, endTime});
  };

  const handleOpenModal = (status: boolean) => {
    setModalStatus(status);
  };

  const handleSaveReservation = () => {
    if (!reservationInfo) return alert('예약 정보가 없습니다.');
    mutate({pageID: pageID, body: {scheduleId: reservationInfo.id, headCount: person}});
  };

  useEffect(() => {
    // 임시 작업으로 추후 제거 예정
    updatePerson(1);
  }, [updatePerson]);

  return (
    <>
      <div className="sticky bottom-0 left-0 z-10 h-85pxr w-full min-w-375pxr border border-t border-solid border-gray-600 bg-white">
        <div className="flex flex-row flex-wrap justify-between px-18pxr py-18pxr">
          <div className="flex flex-col items-start">
            <div className="flex h-35pxr w-auto flex-row gap-3">
              <p className="text-xl font-bold text-nomad-black">{`₩ ${FormatNumberWithCommas(price)}`}</p>
              <p className="mb-16pxr text-xl font-normal leading-8 text-gray-800">{`${person}/ 인`}</p>
            </div>
            <Button className="border-0 bg-white text-lg font-semibold text-primary" onClick={() => handleOpenModal(true)}>
              <ins>날짜 선택하기</ins>
            </Button>
          </div>
          <Button
            className={`h-48pxr min-w-106pxr items-center justify-center rounded-md bg-gray-500 text-lg font-bold text-white ${!reservationInfo && 'bg-gray-400'}`}
            disabled={!reservationInfo}
            onClick={handleSaveReservation}
          >
            예약하기
          </Button>
        </div>
      </div>
      {modalStatus && (
        <OverlayContainer onClose={() => handleOpenModal(false)}>
          <div onClick={e => e.stopPropagation()} className="h-full min-w-373pxr bg-white px-24pxr pb-40pxr pt-24pxr">
            <div className="mb-30pxr flex flex-row justify-between">
              <div className="flex flex-row gap-3">
                <p className="text-xl font-bold text-nomad-black">날짜</p>
              </div>
              <Button onClick={() => handleOpenModal(false)}>
                <Image src={Cancle} width={40} height={40} alt="cancle" />
              </Button>
            </div>
            <div className="mx-auto mb-24pxr min-w-305pxr items-center justify-center rounded-lg border border-solid border-gray-100 p-0">
              <SmCalendar pageID={pageID} onSelect={handleSelectSchedule} />
            </div>
            <Button
              className={`min-w-432px flex h-56pxr w-full flex-row items-center justify-center gap-4pxr rounded-md bg-nomad-black ${!reservationInfo && 'bg-gray-400'}`}
              disabled={!reservationInfo}
              onClick={() => handleOpenModal(false)}
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
