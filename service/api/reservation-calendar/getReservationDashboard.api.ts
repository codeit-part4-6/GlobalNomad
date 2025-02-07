import {ReservationDashboardData} from '@/types/reservation-dashboard';
import INSTANCE_URL from '../instance';
import getAccessToken from '../reservation-list/getAccessToken';

export async function getReservationDashboard({
  activityId,
  year,
  month,
}: {
  activityId: number | null;
  year: string;
  month: string;
}): Promise<ReservationDashboardData> {
  const accessToken = getAccessToken();
  const params = new URLSearchParams({
    ...(year !== undefined && {year: year.toString()}),
    ...(month !== undefined && {month: month.toString()}),
  });
  const response = await INSTANCE_URL.get(`/my-activities/${activityId}/reservation-dashboard?${params}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}
