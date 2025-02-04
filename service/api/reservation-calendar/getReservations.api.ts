import {ReservationsResponse} from '@/types/my-reservations';
import INSTANCE_URL from '../instance';
import getAccessToken from '../reservation-list/getAccessToken';

export async function getReservations({
  activityId,
  size,
  scheduleId,
  status,
}: {
  activityId: number | null;
  size?: number;
  scheduleId: number;
  status: string;
}): Promise<ReservationsResponse> {
  const accessToken = getAccessToken();
  const params = new URLSearchParams({
    ...(size !== undefined && {size: size.toString()}),
    ...(scheduleId !== undefined && {scheduleId: scheduleId.toString()}),
    ...(status !== undefined && {status: status.toString()}),
  });
  const response = await INSTANCE_URL.get(`/my-activities/${activityId}/reservations?${params}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}
