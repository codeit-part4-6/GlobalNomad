'use client';
import React, {useReducer} from 'react';
import {useMutation} from 'react-query';
import {ReservationInfoType, SchedulesDateType, SchedulesType} from '@/types/activities-info';
import dayjs from 'dayjs';
import Image from 'next/image';
import SmCalendar from '@/components/activities/sm-calendar';
import Button from '@/components/common/button';
import OverlayContainer from '@/components/common/modal/overlay-container';
import FormatNumberWithCommas from '@/utils/format-number';
import postReservation from '@/service/api/activities/postActivities';
import Plus from '@/public/icon/icon_plus.png';
import Minus from '@/public/icon/icon_minus.png';
import Cancle from '@/public/icon/icon_cancle.png';

const initialState: ReservationInfoType = {
  person: 1,
  scheduleModal: false,
  personModal: false,
  schedule: {date: '', startTime: '', endTime: '', id: 0},
  daySchedule: {date: dayjs().format('YYYY-MM-DD'), times: []},
};

type Action =
  | {type: 'SET_PERSON'; payload: number}
  | {type: 'SET_SCHEDULE_MODAL'; payload: boolean}
  | {type: 'SET_PERSON_MODAL'; payload: boolean}
  | {type: 'SET_SCHEDULE'; payload: SchedulesDateType}
  | {type: 'SET_DAY_SCHEDULE'; payload: SchedulesType};

interface ReservationProps {
  pageID: string;
  price: number;
  state: ReservationInfoType;
  dispatch: React.Dispatch<Action>;
  updatePerson: (count: number) => void;
  updateSchedule: (schedule: SchedulesDateType) => void;
  saveReservation: () => void;
}

const reservationReducer: (state: ReservationInfoType, action: Action) => ReservationInfoType = (state, action) => {
  switch (action.type) {
    case 'SET_PERSON':
      return {...state, person: action.payload};
    case 'SET_SCHEDULE_MODAL':
      return {...state, scheduleModal: action.payload};
    case 'SET_PERSON_MODAL':
      return {...state, personModal: action.payload};
    case 'SET_SCHEDULE':
      return {...state, schedule: action.payload};
    case 'SET_DAY_SCHEDULE':
      return {...state, daySchedule: action.payload};
    default:
      return state;
  }
};

const Reservation = ({device, pageID, price}: {device: string; pageID: string; price: number}) => {
  const [state, dispatch] = useReducer(reservationReducer, initialState);

  const mutation = useMutation(postReservation, {
    onSuccess: () => {
      alert('체험 예약을 완료했습니다.');
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    },
  });

  const handleSelectSchedule = (schedule: SchedulesDateType) => {
    dispatch({type: 'SET_SCHEDULE', payload: schedule});
  };

  const handleUpdatePerson = (count: number) => {
    const person = state.person + count;
    if (person < 1) return alert('최소 예약 인원은 1명입니다.');
    dispatch({type: 'SET_PERSON', payload: person});
  };

  const handleSaveReservation = () => {
    if (!state.schedule) return alert('예약 정보가 없습니다.');
    mutation.mutate({pageID: pageID, body: {scheduleId: state.schedule.id, headCount: state.person}});
  };

  const ReservationDeviceType = ({device}: {device: string}) => {
    switch (device) {
      case 'windows':
        return (
          <ReservationWindowsType
            pageID={pageID}
            price={price}
            state={state}
            dispatch={dispatch}
            updateSchedule={handleSelectSchedule}
            updatePerson={handleUpdatePerson}
            saveReservation={handleSaveReservation}
          />
        );
      case 'tablet':
        return (
          <ReservationTabletType
            pageID={pageID}
            price={price}
            state={state}
            dispatch={dispatch}
            updateSchedule={handleSelectSchedule}
            updatePerson={handleUpdatePerson}
            saveReservation={handleSaveReservation}
          />
        );
      default:
        return (
          <ReservationMobileType
            pageID={pageID}
            price={price}
            state={state}
            dispatch={dispatch}
            updateSchedule={handleSelectSchedule}
            updatePerson={handleUpdatePerson}
            saveReservation={handleSaveReservation}
          />
        );
    }
  };

  return <ReservationDeviceType device={device} />;
};

const ReservationWindowsType = ({pageID, price, state, dispatch, updateSchedule, updatePerson, saveReservation}: ReservationProps) => {
  return (
    <div className="rounded-xl border border-solid border-gray-200 bg-white px-24pxr pb-18pxr pt-24pxr shadow-sidenavi-box tablet:h-full pc:min-h-748pxr pc:min-w-384pxr">
      <div className="mb-16pxr">
        <div className="flex w-auto flex-row gap-3">
          <p className="mb-16pxr text-3xl font-bold text-black-100">{`₩ ${FormatNumberWithCommas(price)}`}</p>
          <p className="mb-16pxr text-2xl font-normal leading-10 text-gray-800">{`/ ${state.person}인`}</p>
        </div>
        <hr />
      </div>
      <div className="my-16pxr">
        <div className="flex w-auto flex-row gap-3">
          <p className="mb-16pxr text-xl font-bold text-nomad-black">날짜</p>
        </div>
        <SmCalendar pageID={pageID} state={state} dispatch={dispatch} onSelect={updateSchedule} />
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
          <p className="h-40pxr w-40pxr flex-row items-start justify-center rounded-s-md bg-white p-10pxr">{state.person}</p>
          <Button
            className="relative h-40pxr w-40pxr flex-row items-start justify-center rounded-s-md bg-white p-10pxr"
            onClick={() => updatePerson(1)}
          >
            <Image src={Plus} width={20} height={20} alt="plus" />
          </Button>
        </div>
        <Button
          className={`my-24pxr flex h-56pxr w-full flex-row items-center justify-center gap-4pxr rounded-s px-8pxr py-40pxr ${!state.schedule?.id ? 'bg-gray-400' : 'bg-nomad-black'}`}
          disabled={!state.schedule?.id}
          onClick={saveReservation}
        >
          <p className="text-lg font-bold text-white">예약하기</p>
        </Button>
      </div>
      <hr />
      <div className="mt-16pxr flex flex-row items-center justify-between">
        <p className="text-xl font-bold text-nomad-black">총 합계</p>
        <p className="text-xl font-bold text-nomad-black">{`₩ ${FormatNumberWithCommas(price * state.person)}`}</p>
      </div>
    </div>
  );
};

const ReservationTabletType = ({pageID, price, state, dispatch, updateSchedule, updatePerson, saveReservation}: ReservationProps) => {
  const handleOpenModal = (status: boolean) => {
    dispatch({type: 'SET_SCHEDULE_MODAL', payload: status});
  };

  return (
    <div className="rounded-xl border border-solid border-gray-200 bg-white px-24pxr pb-18pxr pt-24pxr shadow-sidenavi-box tablet:h-full tablet:min-h-423pxr tablet:min-w-251pxr">
      <div className="mb-16pxr">
        <div className="flex w-auto flex-row gap-3">
          <p className="mb-16pxr text-2xl font-bold text-black-100">{`₩ ${FormatNumberWithCommas(price)}`}</p>
          <p className="mb-16pxr text-2xl font-normal leading-8 text-gray-800">{`/ ${state.person}인`}</p>
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
        {state.schedule.date.length > 0 && (
          <p className="text-lg font-semibold text-nomad-black">{`${state.schedule.date} ${state.schedule.startTime} ~ ${state.schedule.endTime}`}</p>
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
          <p className="h-40pxr w-40pxr flex-row items-start justify-center rounded-s-md bg-white p-10pxr">{state.person}</p>
          <Button
            className="relative h-40pxr w-40pxr flex-row items-start justify-center rounded-s-md bg-white p-10pxr"
            onClick={() => updatePerson(1)}
          >
            <Image src={Plus} width={20} height={20} alt="plus" />
          </Button>
        </div>
        <Button
          className={`my-24pxr flex h-56pxr w-full flex-row items-center justify-center gap-4pxr rounded-md px-8pxr py-40pxr ${!state.schedule.id ? 'bg-gray-400' : 'bg-nomad-black'}`}
          disabled={state.schedule.id === 0}
          onClick={saveReservation}
        >
          <p className="text-lg font-bold text-white">예약하기</p>
        </Button>
      </div>
      <hr />
      <div className="mt-16pxr flex flex-row items-center justify-between">
        <p className="text-xl font-bold text-nomad-black">총 합계</p>
        <p className="text-xl font-bold text-nomad-black">{`₩ ${FormatNumberWithCommas(price * state.person)}`}</p>
      </div>
      {state.scheduleModal && (
        <OverlayContainer onClose={() => handleOpenModal(false)}>
          <div className="relative max-h-700pxr w-480pxr rounded-3xl bg-white px-24pxr pb-32pxr pt-28pxr" onClick={e => e.stopPropagation()}>
            <div className="mb-30pxr flex flex-row justify-between">
              <p className="mb-16pxr text-xl font-bold text-nomad-black">날짜</p>
              <Button onClick={() => handleOpenModal(false)}>
                <Image src={Cancle} width={40} height={40} alt="cancle" />
              </Button>
            </div>
            <div className="mb-100pxr">
              <SmCalendar pageID={pageID} state={state} dispatch={dispatch} onSelect={updateSchedule} />
            </div>
            <Button
              className={`absolute bottom-32pxr left-24pxr flex h-56pxr min-w-432pxr items-center justify-center rounded-md ${!state.schedule.id ? 'bg-gray-400' : 'bg-nomad-black'}`}
              disabled={!state.schedule.id}
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

const ReservationMobileType = ({pageID, price, state, dispatch, updateSchedule, updatePerson, saveReservation}: ReservationProps) => {
  const handleOpenScheduleModal = (status: boolean) => {
    dispatch({type: 'SET_SCHEDULE_MODAL', payload: status});
  };
  const handleOpenPersonModal = () => {
    dispatch({type: 'SET_SCHEDULE_MODAL', payload: false});
    dispatch({type: 'SET_PERSON_MODAL', payload: true});
  };

  const handleClosePersonModal = (status: boolean) => {
    dispatch({type: 'SET_PERSON_MODAL', payload: status});
  };

  return (
    <>
      <div className="sticky bottom-0 left-0 z-10 h-85pxr w-full min-w-375pxr border border-t border-solid border-gray-600 bg-white">
        <div className="flex flex-row flex-wrap justify-between px-18pxr py-18pxr">
          <div className="flex flex-col items-start">
            <div className="flex h-35pxr w-auto flex-row gap-3">
              <p className="text-xl font-bold text-nomad-black">{`₩ ${FormatNumberWithCommas(price * state.person)}`}</p>
              <p className="mb-16pxr text-xl font-normal leading-8 text-gray-800">{`/ ${state.person}인`}</p>
            </div>
            <Button className="border-0 bg-white text-lg font-semibold text-primary" onClick={() => handleOpenScheduleModal(true)}>
              <ins>날짜 선택하기</ins>
            </Button>
          </div>
          <Button
            className={`h-48pxr min-w-106pxr items-center justify-center rounded-md text-lg font-bold text-white ${!state.schedule.id ? 'bg-gray-400' : 'bg-nomad-black'}`}
            disabled={state.schedule.id === 0}
            onClick={saveReservation}
          >
            예약하기
          </Button>
        </div>
      </div>
      {state.scheduleModal && (
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
            <SmCalendar pageID={pageID} device={'mobile'} state={state} dispatch={dispatch} onSelect={updateSchedule} />
            <Button
              className={`absolute bottom-40pxr left-24pxr flex h-56pxr min-w-327pxr flex-row items-center justify-center rounded-md ${!state.schedule?.id ? 'bg-gray-400' : 'bg-nomad-black'}`}
              disabled={!state.schedule.id}
              onClick={handleOpenPersonModal}
            >
              <p className="text-lg font-bold text-white">다음</p>
            </Button>
          </div>
        </OverlayContainer>
      )}
      {state.personModal && (
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
              <div className="shadow-[0px_2px_4px_rgba(5, 16, 55, 0.06)] inset-shadow-[0px_0px_0px_1px_#CDD0DC] flex h-42pxr w-120pxr flex-row items-start gap-10pxr rounded-md border bg-white p-0">
                <Button
                  className="relative h-40pxr w-40pxr flex-row items-start justify-center rounded-s-md bg-white p-10pxr"
                  onClick={() => updatePerson(-1)}
                >
                  <Image src={Minus} width={20} height={20} alt="minus" />
                </Button>
                <p className="h-40pxr w-40pxr flex-row items-start justify-center rounded-s-md bg-white p-10pxr">{state.person}</p>
                <Button
                  className="relative h-40pxr w-40pxr flex-row items-start justify-center rounded-s-md bg-white p-10pxr"
                  onClick={() => updatePerson(1)}
                >
                  <Image src={Plus} width={20} height={20} alt="plus" />
                </Button>
              </div>
            </div>
            <Button
              className="absolute bottom-40pxr left-24pxr flex h-56pxr min-w-327pxr flex-row items-center justify-center rounded-md bg-nomad-black"
              disabled={!state.schedule.id}
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
