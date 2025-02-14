import React, {useState, useEffect, useRef} from 'react';
import {Calendar} from 'antd';
import type {Dayjs} from 'dayjs';
import CalendarHeader from './calendar-header';
import ReservationContainer from './reservation-container';
import ReservationModal from './reservation-modal';
import {calendarStatusLabels} from '@/constant/reservation-list-constant';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import enUS from 'antd/es/calendar/locale/en_US';
import {useQuery} from '@tanstack/react-query';
import {getReservationDashboard} from '@/service/api/reservation-calendar/getReservationDashboard.api';
import {ReservationDashboardData} from '@/types/reservation-dashboard';

dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  weekdaysMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
});

export default function BigCalendar({activityId}: {activityId: number | null}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const modalRef = useRef<HTMLDivElement | null>(null);

  const {data} = useQuery<ReservationDashboardData>({
    queryKey: ['reservationDashboard', activityId, year, month],
    queryFn: () => getReservationDashboard({activityId, year, month}),
    enabled: !!activityId,
  });

  const reservationsData: ReservationDashboardData[] = Array.isArray(data) ? data : [];

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setIsModalOpen(false);
    }
  };

  const handleDateClick = () => {
    setIsModalOpen(prev => !prev);
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside); // 외부 클릭 감지
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isModalOpen]);

  const DateCell = (date: Dayjs) => {
    const reservationData = reservationsData.find(reservation => reservation.date === date.format('YYYY-MM-DD'));

    return (
      <div>
        <div
          onClick={() => {
            handleDateClick();
          }}
          className="relative h-154pxr border-collapse border border-gray-900 hover:bg-green-50"
        >
          <div className="absolute right-1 top-1 flex gap-1pxr">
            {reservationData &&
              reservationData.reservations &&
              Object.entries(reservationData.reservations)
                .filter(([, count]) => count > 0)
                .map(([status]) => (
                  <div key={status} className="flex">
                    <div
                      className={`${status === 'completed' ? 'bg-gray-800' : status === 'pending' ? 'bg-blue-200' : 'bg-orange-100'} h-2 w-2 rounded-full`}
                    ></div>
                  </div>
                ))}
          </div>
          <span className="absolute left-1 top-1 px-1 text-xl font-medium text-black-300">{date.date()}</span>
          <div className="flex h-full w-full flex-col justify-end pb-2pxr">
            {reservationData &&
              reservationData.reservations &&
              Object.entries(reservationData.reservations)
                .filter(([, count]) => count > 0)
                .map(([status, count]) => (
                  <div
                    key={status}
                    className={`${
                      status === 'completed'
                        ? 'bg-gray-200 text-gray-800'
                        : status === 'pending'
                          ? 'bg-blue-200 text-white'
                          : 'bg-orange-50 text-orange-100'
                    } mx-2pxr text-ellipsis whitespace-nowrap rounded px-2 py-1 text-left text-xs font-medium tablet:text-md`}
                  >
                    <span>
                      {calendarStatusLabels[status]} {count}
                    </span>
                  </div>
                ))}
          </div>
        </div>
      </div>
    );
  };

  const customLocale = {
    ...enUS,
    lang: {
      ...enUS.lang,
      weekdaysMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    },
  };

  return (
    <div ref={modalRef}>
      <Calendar
        onSelect={(date, {source}) => {
          if (source === 'date') {
            const newDate = date.format('YYYY-MM-DD');
            setSelectedDate(newDate);
          }
        }}
        locale={customLocale}
        headerRender={(props: {value: Dayjs; onChange: (value: Dayjs) => void}) => (
          <>
            <CalendarHeader {...props} setYear={setYear} setMonth={setMonth} />
          </>
        )}
        fullCellRender={DateCell}
      />
      {isModalOpen && (
        <ReservationContainer onClose={() => setIsModalOpen(false)}>
          <ReservationModal onClose={() => setIsModalOpen(false)} selectedDate={selectedDate} activityId={activityId} />
        </ReservationContainer>
      )}
      <style>
        {`
          .ant-picker-content th {
            font-size: 1rem;
            font-weight: 500 !important;
            color: #969696 !important;
            padding: 0rem 0.25rem !important;
            border: 1px solid #E8E8E8;
            border-collapse: collapse;
          }
          .ant-picker-content thead {
            text-align: left;
            height: 43px;
          }
        `}
      </style>
    </div>
  );
}
