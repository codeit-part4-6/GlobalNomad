import React, {useCallback, useEffect, useState} from 'react';
import {useQuery} from 'react-query';
import {getActivitiesSchedule} from '@/service/api/activities/getActivitiesInfo';
import {ReservationInfoType, SchedulesDateType, SchedulesType} from '@/types/activities-info';
import {Calendar} from 'antd';
import dayjs, {Dayjs} from 'dayjs';
import locale from 'antd/es/calendar/locale/ko_KR';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import Button from '@/components/common/button';

type Action = {type: 'SET_DAY_SCHEDULE'; payload: SchedulesType};

interface CalendarHeaderType {
  value: Dayjs;
  onChange: (value: Dayjs) => void;
}
interface SmCalendarType {
  pageID: string;
  state: ReservationInfoType;
  device?: string;
  dispatch: React.Dispatch<Action>;
  onSelect: ({date, id, startTime, endTime}: SchedulesDateType) => void;
}

const defaultTime = {date: '', id: 0, startTime: '', endTime: ''};
const defaultSchedule = {
  date: '',
  times: [{startTime: '', endTime: '', id: 0}],
};

const CalendarHeader = ({value, onChange}: CalendarHeaderType) => {
  const year = value.year();
  const month = value.month() + 1;

  const handlePrev = () => {
    onChange(value.subtract(1, 'month'));
  };

  const handleNext = () => {
    onChange(value.add(1, 'month'));
  };

  return (
    <div className="m-5 flex items-center justify-center gap-54pxr">
      <button onClick={handlePrev} className="font-[Open_Sans]] text-xs font-bold text-black-100 hover:text-gray-700">
        &lt;&lt;
      </button>
      <span className="font-[Open_Sans]] text-xs font-bold text-black-100">
        {year}년 {month}월
      </span>
      <button onClick={handleNext} className="font-[Open_Sans]] text-balck-100 text-xs font-bold hover:text-gray-700">
        &gt;&gt;
      </button>
    </div>
  );
};

const SmCalendar = ({pageID, state, device = 'order', dispatch, onSelect}: SmCalendarType) => {
  dayjs.extend(weekday);
  dayjs.extend(localeData);
  dayjs.extend(weekOfYear);
  dayjs.extend(weekYear);
  const [selectDate, setSelectDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [selectTime, setSelectTime] = useState<SchedulesDateType>(state.schedule);

  const {data: schedules} = useQuery<SchedulesType[]>({
    queryKey: ['schedules', selectDate],
    queryFn: () => getActivitiesSchedule(pageID, selectDate),
    enabled: !!selectDate,
    notifyOnChangeProps: ['data'],
  });

  const setScheduleMatch = useCallback(
    (date: Dayjs) => {
      const getTodaySchedule = schedules?.reduce<SchedulesType>((acc, curr) => {
        if (dayjs(curr.date).isSame(date, 'day')) {
          acc = curr;
        }
        return acc;
      }, defaultSchedule);

      if (getTodaySchedule) {
        if (getTodaySchedule.date.length > 0) {
          dispatch({type: 'SET_DAY_SCHEDULE', payload: getTodaySchedule});
        } else {
          dispatch({type: 'SET_DAY_SCHEDULE', payload: {date: date.format('YYYY-MM-DD'), times: [{startTime: '', endTime: '', id: 0}]}});
        }
      }
    },
    [dispatch, schedules],
  );

  const saveTime = useCallback(
    (time: SchedulesDateType) => {
      onSelect(time);
      setSelectTime(time);
    },
    [onSelect],
  );

  const handleChangeDay = (date: Dayjs) => {
    setSelectDate(date.format('YYYY-MM-DD'));
    setScheduleMatch(date);
    saveTime(defaultTime);
  };

  const handleSelectTime = ({date, id, startTime, endTime}: SchedulesDateType) => {
    const getData = {date, id, startTime, endTime};
    saveTime(getData);
  };

  const checkTime = (date: string, hour: string) => {
    const getDate = dayjs(`${date} ${hour}:00:00`, 'YYYY-MM-DD HH-mm:ss');
    return dayjs().diff(getDate) > 0;
  };

  useEffect(() => {
    if (state.daySchedule.times.length < 1 && schedules) {
      setScheduleMatch(dayjs());
    }
  }, [schedules, setScheduleMatch, state.daySchedule.times.length]);

  return (
    <>
      <div className="mx-auto w-305pxr items-center justify-center rounded-lg border border-solid border-gray-100 p-0">
        <Calendar
          locale={locale}
          value={dayjs(state.daySchedule.date)}
          fullscreen={false}
          headerRender={(props: CalendarHeaderType) => <CalendarHeader {...props} />}
          onChange={handleChangeDay}
          onSelect={handleChangeDay}
        />
      </div>
      <div className="min-w-336pxr flex-col">
        <div className="flex flex-row gap-3">
          <p className="mt-16pxr text-2lg font-bold text-nomad-black">예약 가능한 시간</p>
          <div className="mt-16pxr flex flex-row gap-1">
            <div className="m-auto h-10pxr w-10pxr border border-red-200"></div>
            <p className="text-sm font-normal text-nomad-black">예약 불가</p>
          </div>
          <div className="mt-16pxr flex flex-row gap-1">
            <div className="m-auto h-10pxr w-10pxr border border-nomad-black" />
            <p className="text-sm font-normal text-nomad-black">예약 가능</p>
          </div>
        </div>
        <div
          className={`mt-14pxr flex flex-row flex-wrap gap-12pxr overflow-y-scroll ${state.daySchedule.times.length < 4 && 'no-scrollbar'} ${device === 'mobile' ? 'h-220pxr' : 'h-110pxr'}`}
        >
          {state.daySchedule.times.map(dt => {
            return (
              dt.id > 0 && (
                <Button
                  className={`w-130xr h-46pxr items-center justify-center rounded-lg px-10pxr py-12pxr ${selectTime.id === dt.id ? 'bg-nomad-black' : 'border border-black-50 bg-white'} ${checkTime(state.daySchedule.date, dt.startTime) && 'border border-red-200'}`}
                  key={dt.id}
                  onClick={() => handleSelectTime({date: state.daySchedule.date, id: dt.id, startTime: dt.startTime, endTime: dt.endTime})}
                  disabled={checkTime(state.daySchedule.date, dt.startTime)}
                >
                  <p
                    className={`text-lg font-medium ${selectTime.id === dt.id ? 'text-white' : 'text-black-50'}`}
                  >{`${dt.startTime} ~ ${dt.endTime}`}</p>
                </Button>
              )
            );
          })}
        </div>
      </div>
    </>
  );
};

export default SmCalendar;
