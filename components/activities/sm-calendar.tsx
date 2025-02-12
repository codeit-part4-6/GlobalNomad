import React, {useCallback, useEffect} from 'react';
import {useQuery} from 'react-query';
import {getActivitiesSchedule} from '@/service/api/activities/getActivitiesInfo';
import {SchedulesType, SchedulesDateType} from '@/types/activities-info';
import {Calendar} from 'antd';
import dayjs, {Dayjs} from 'dayjs';
import locale from 'antd/es/calendar/locale/ko_KR';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import Button from '@/components/common/button';
import activitiesStore from '@/service/store/activitiesstore';
import {useParams} from 'next/navigation';

interface CalendarHeaderType {
  value: Dayjs;
  onChange: (value: Dayjs) => void;
}
interface SmCalendarType {
  pageID: string;
  device?: string;
}

let defaultTime = {date: '', id: 0, startTime: '', endTime: ''};

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

const SmCalendar = ({device = 'order'}: SmCalendarType) => {
  dayjs.extend(weekday);
  dayjs.extend(localeData);
  dayjs.extend(weekOfYear);
  dayjs.extend(weekYear);
  const params = useParams();
  const {selectedSchedule, dailySchedule, updateSelectedSchedule, updateDailySchedule} = activitiesStore();
  const pageID = params?.id?.toString() || '';

  const {data: monthSchedules, refetch} = useQuery<SchedulesDateType[]>({
    queryKey: ['schedules', selectedSchedule.date],
    queryFn: () => getActivitiesSchedule(pageID, selectedSchedule.date),
    notifyOnChangeProps: ['data'],
    enabled: !!selectedSchedule.date,
  });

  const scheduleMatch = useCallback(
    (date: Dayjs) => {
      if (dayjs(date).isSame(dailySchedule.date)) {
        const getTodaySchedule = monthSchedules?.reduce<SchedulesDateType>((acc, curr) => {
          if (dayjs(curr.date).isSame(date, 'day')) {
            acc = curr;
          }
          return acc;
        }, defaultSchedule);

        if (getTodaySchedule && getTodaySchedule.date.length > 0) {
          updateDailySchedule(getTodaySchedule);
        }
      } else {
        return updateDailySchedule({date: date.format('YYYY-MM-DD'), times: []});
      }
    },
    [dailySchedule.date, monthSchedules, updateDailySchedule],
  );

  const setSelectedSchedule = (time: SchedulesType) => {
    updateSelectedSchedule(time);
  };

  const handleChangeDay = (date: Dayjs) => {
    scheduleMatch(date);
    defaultTime = {...defaultTime, date: date.format('YYYY-MM-DD')};
    setSelectedSchedule(defaultTime);
    refetch();
  };

  const handleSelectTime = ({date, id, startTime, endTime}: SchedulesType) => {
    const getData = {date, id, startTime, endTime};
    setSelectedSchedule(getData);
  };

  const checkTime = (date: string, hour: string) => {
    const getDate = dayjs(`${date} ${hour}:00:00`, 'YYYY-MM-DD HH-mm:ss');
    return dayjs().diff(getDate) > 0;
  };

  useEffect(() => {
    if (monthSchedules && dailySchedule.times.length < 1) {
      scheduleMatch(dayjs(dailySchedule.date));
    }
  }, [monthSchedules, scheduleMatch, dailySchedule]);

  return (
    <>
      <div className="mx-auto w-305pxr items-center justify-center rounded-lg border border-solid border-gray-100 p-0">
        <Calendar
          locale={locale}
          value={dayjs(dailySchedule.date)}
          fullscreen={false}
          headerRender={(props: CalendarHeaderType) => <CalendarHeader {...props} />}
          onChange={date => handleChangeDay(date)}
          onSelect={date => handleChangeDay(date)}
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
          className={`mt-14pxr flex flex-row flex-wrap gap-12pxr overflow-y-scroll ${dailySchedule.times.length < 4 && 'no-scrollbar'} ${device === 'mobile' ? 'h-220pxr' : 'h-110pxr'}`}
        >
          {dailySchedule.times.map(dt => {
            return (
              dt.id > 0 && (
                <Button
                  className={`w-130xr h-46pxr items-center justify-center rounded-lg px-10pxr py-12pxr ${selectedSchedule.id === dt.id ? 'bg-nomad-black' : 'border border-black-50 bg-white'} ${checkTime(dailySchedule.date, dt.startTime) && 'border border-red-200'}`}
                  key={dt.id}
                  onClick={() => handleSelectTime({date: dailySchedule.date, id: dt.id, startTime: dt.startTime, endTime: dt.endTime})}
                  disabled={checkTime(dailySchedule.date, dt.startTime)}
                >
                  <p
                    className={`text-lg font-medium ${selectedSchedule.id === dt.id ? 'text-white' : 'text-black-50'}`}
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
