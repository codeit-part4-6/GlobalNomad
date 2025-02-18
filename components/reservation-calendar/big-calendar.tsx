import React, {useState, useEffect, useRef} from 'react';
import {ReservationDashboardData} from '@/types/reservation-dashboard';
import CalendarHeader from '@/components/reservation-calendar/calendar-header';
import ReservationContainer from '@/components/reservation-calendar/reservation-container';
import ReservationModal from '@/components/reservation-calendar/reservation-modal';
import DateCell from '@/components/reservation-calendar/date-cell';
import {getReservationDashboard} from '@/service/api/reservation-calendar/getReservationDashboard.api';
import {useQuery} from '@tanstack/react-query';
import {Calendar} from 'antd';
import type {Dayjs} from 'dayjs';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import enUS from 'antd/es/calendar/locale/en_US';

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

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside); // 외부 클릭 감지
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isModalOpen]);

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
        fullCellRender={date => <DateCell date={date} reservationsData={reservationsData} onClick={() => setIsModalOpen(prev => !prev)} />}
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
