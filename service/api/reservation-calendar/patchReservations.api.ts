import {Reservation} from '@/types/reservation-list';
import INSTANCE_URL from '../instance';
import getAccessToken from '../reservation-list/getAccessToken';

interface patchReservationsProps {
  reservationId: number | null;
  activityId: number | null;
  status: string;
}

export async function patchReservations({activityId, reservationId, status}: patchReservationsProps): Promise<Reservation> {
  const accessToken = getAccessToken();
  const response = await INSTANCE_URL.patch(
    `/my-activities/${activityId}/reservations/${reservationId}`,
    {
      status: `${status}`,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return response.data;
}
