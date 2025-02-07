import {ReservationListResponse} from '@/types/reservation-list';
import INSTANCE_URL from '../instance';
import getAccessToken from './getAccessToken';

export async function getReservationList({
  cursorId,
  size,
  status,
}: {
  cursorId?: number | null;
  size?: number;
  status?: string;
}): Promise<ReservationListResponse> {
  const accessToken = getAccessToken();
  const params = new URLSearchParams({
    ...(typeof cursorId === 'number' ? {cursorId: cursorId.toString()} : {}),
    ...(size !== undefined && {size: size.toString()}),
    ...(status && {status}),
  });
  const response = await INSTANCE_URL.get(`/my-reservations?${params}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}
