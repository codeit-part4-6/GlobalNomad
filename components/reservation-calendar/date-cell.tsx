import {ReservationDashboardData} from '@/types/reservation-dashboard';
import {calendarStatusLabels} from '@/constant/reservation-list-constant';
import {Dayjs} from 'dayjs';

export default function DateCell({
  date,
  reservationsData,
  onClick,
}: {
  date: Dayjs;
  reservationsData: ReservationDashboardData[];
  onClick: () => void;
}) {
  const reservationData = reservationsData.find(reservation => reservation.date === date.format('YYYY-MM-DD'));

  return (
    <div>
      <div onClick={onClick} className="relative h-154pxr border-collapse border border-gray-900 hover:bg-green-50">
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
}
