import {Reservation} from '@/types/reservation-list';
import INSTANCE_URL from '../instance';
import getAccessToken from './getAccessToken';

export async function patchReservationList({reservationId}: {reservationId: number | null}): Promise<Reservation> {
  const accessToken = getAccessToken();
  const response = await INSTANCE_URL.patch(
    `/my-reservations/${reservationId}`,
    {
      status: 'canceled',
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
