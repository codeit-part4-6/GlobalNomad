import React, {useState, useEffect, useRef} from 'react';
import {Calendar} from 'antd';
import type {Dayjs} from 'dayjs';
import CalendarHeader from './calendar-header';
import ReservationContainer from '../common/modal/reservation-container';
import ReservationModal from '../common/modal/reservation-modal';
import {calendarStatusLabels} from '@/constant/reservation-list-constant';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import enUS from 'antd/es/calendar/locale/en_US';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {getReservationDashboard} from '@/service/api/reservation-calendar/getReservationDashboard.api';
import {ReservationDashboardData} from '@/types/reservation-dashboard';
import {renderStore} from '@/service/store/renderStore';

dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  weekdaysMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
});

export default function BigCalendar({activityId}: {activityId: number | null}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTablet, setIsTablet] = useState<boolean | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const modalRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  const updateRender = renderStore(state => state.updateRender);

  const {data} = useQuery<ReservationDashboardData>({
    queryKey: ['reservationDashboard', activityId, year, month],
    queryFn: () => getReservationDashboard({activityId, year, month}),
    enabled: !!activityId,
  });

  const reservationsData: ReservationDashboardData[] = Array.isArray(data) ? data : [];

  const onUpdate = () => {
    updateRender();
    queryClient.invalidateQueries({
      queryKey: ['reservationDashboard'],
    });
    queryClient.invalidateQueries({
      queryKey: ['reservedSchedule'],
    });
    queryClient.invalidateQueries({
      queryKey: ['myReservations'],
    });
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setIsModalOpen(false);
    }
  };

  const handleDateClick = (clickedDate: string) => {
    const hasReservation = reservationsData.some(reservation => reservation.date === clickedDate);
    if (!hasReservation) return;
    setIsModalOpen(prev => !prev);
  };

  function getPageSize(width: number): boolean {
    return width >= 745 && width < 1200;
  }

  useEffect(() => {
    const initialIsTablet = getPageSize(document.documentElement.clientWidth);
    setIsTablet(initialIsTablet); // 브라우저에서만 실행
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = getPageSize(document.documentElement.clientWidth);
      setIsTablet(mobile);
    };
    if (isTablet !== null) {
      // isMobile이 null이 아니면 resize 이벤트 처리
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isTablet]);

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
            handleDateClick(date.format('YYYY-MM-DD'));
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
                      className={`${status === 'completed' ? 'bg-gray-800' : status === 'confirmed' ? 'bg-blue-200' : 'bg-orange-100'} h-2 w-2 rounded-full`}
                    ></div>
                  </div>
                ))}
          </div>
          <span className="absolute left-1 top-1 px-1 text-xl font-medium text-black-300">{date.date()}</span>
          <div className="flex h-full w-full flex-col justify-end">
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
                        : status === 'confirmed'
                          ? 'bg-blue-200 text-white'
                          : 'bg-orange-50 text-orange-100'
                    } text-ellipsis whitespace-nowrap rounded px-2 py-1 text-left text-xs font-medium tablet:text-md`}
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
    <div className="tablet:relative" ref={modalRef}>
      {isModalOpen && !isTablet && (
        <ReservationContainer onClose={() => setIsModalOpen(false)}>
          <ReservationModal onUpdate={onUpdate} onClose={() => setIsModalOpen(false)} selectedDate={selectedDate} activityId={activityId} />
        </ReservationContainer>
      )}
      {isModalOpen && isTablet && (
        <div>
          <ReservationModal onUpdate={onUpdate} onClose={() => setIsModalOpen(false)} selectedDate={selectedDate} activityId={activityId} />
        </div>
      )}
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
