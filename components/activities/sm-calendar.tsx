import React, {useCallback, useEffect, useState} from 'react';
import {Dayjs} from 'dayjs';
import dayjs from 'dayjs';
import {Calendar} from 'antd';
import locale from 'antd/es/calendar/locale/ko_KR';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import {getActivitiesSchedule} from '@/service/api/activities/getActivitiesInfo';
import {useQuery} from 'react-query';
import {SchedulesDateType, SchedulesType} from '@/types/activities-info';
import Button from '../common/button';

interface CalendarHeaderType {
  value: Dayjs;
  onChange: (value: Dayjs) => void;
}
interface SmCalendarType {
  pageID: string;
  onSelect: ({date, id, startTime, endTime}: SchedulesDateType) => void;
}

const DefaultTime = {date: '', id: 0, startTime: '', endTime: ''};

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

const SmCalendar = ({pageID, onSelect}: SmCalendarType) => {
  dayjs.extend(weekday);
  dayjs.extend(localeData);
  dayjs.extend(weekOfYear);
  dayjs.extend(weekYear);
  const [selectedDay, setSelectedDay] = useState<Dayjs>(dayjs());
  const [daySchedule, setDaySchedule] = useState<SchedulesType>();
  const [selectTime, setSelectTime] = useState<SchedulesDateType>(DefaultTime);

  const {data: schedules} = useQuery<SchedulesType[]>({
    queryKey: ['schedules', selectedDay],
    queryFn: () => getActivitiesSchedule(pageID, selectedDay?.format('YYYY-MM-DD')),
    structuralSharing: false,
    notifyOnChangeProps: ['data'],
  });

  const getScheduleMatch = useCallback(
    (date: Dayjs) => {
      const getTodaySchedule = schedules?.reduce<SchedulesType>(
        (acc, curr) => {
          if (dayjs(curr.date).isSame(date, 'day')) {
            acc = curr;
          }
          return acc;
        },
        {
          date: '',
          times: [{startTime: '', endTime: '', id: 0}],
        },
      );

      if (!getTodaySchedule || getTodaySchedule.date.length < 1) return undefined;

      // 현재 날짜와 시간 보다 이전이라면 제거
      return getTodaySchedule;
    },
    [schedules],
  );

  const saveTime = useCallback(
    (time: SchedulesDateType) => {
      onSelect(time);
      setSelectTime(time);
    },
    [onSelect],
  );

  const handleOnSelect = useCallback(
    (date: Dayjs) => {
      setSelectedDay(date);
      saveTime(DefaultTime);
    },
    [saveTime],
  );

  const handleTimeClick = ({date, id, startTime, endTime}: SchedulesDateType) => {
    const getData = {date, id, startTime, endTime};
    saveTime(getData);
  };

  useEffect(() => {
    if (schedules && selectedDay) {
      setDaySchedule(getScheduleMatch(selectedDay));
    }
  }, [getScheduleMatch, schedules, selectedDay]);

  return (
    <>
      <div className="mx-auto w-305pxr items-center justify-center rounded-lg border border-solid border-gray-100 p-0">
        <Calendar
          locale={locale}
          value={selectedDay}
          fullscreen={false}
          headerRender={(props: CalendarHeaderType) => <CalendarHeader {...props} />}
          onSelect={handleOnSelect}
        />
      </div>
      <div className="min-w-336pxr flex-col">
        <p className="mt-16pxr w-full text-2lg font-bold text-nomad-black">예약 가능한 시간</p>
        <div className="no-scrollbar mb-16pxr mt-14pxr flex h-110pxr flex-row flex-wrap gap-12pxr overflow-y-scroll">
          <div className="mb-16pxr flex flex-row flex-wrap gap-12pxr">
            {daySchedule &&
              daySchedule.times.map(dt => {
                return (
                  <Button
                    className={`w-130xr h-46pxr items-center justify-center rounded-lg px-10pxr py-12pxr ${selectTime.id === dt.id ? 'bg-nomad-black' : 'border border-black-50 bg-white'}`}
                    key={dt.id}
                    onClick={() => handleTimeClick({date: daySchedule.date, id: dt.id, startTime: dt.startTime, endTime: dt.endTime})}
                  >
                    <p
                      className={`text-lg font-medium ${selectTime.id === dt.id ? 'text-white' : 'text-black-50'}`}
                    >{`${dt.startTime} ~ ${dt.endTime}`}</p>
                  </Button>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default SmCalendar;
