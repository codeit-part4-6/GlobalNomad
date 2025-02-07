import {ReservationPost} from '@/types/activities-info';
import INSTANCE_URL from '@/service/api/instance';
import getAccessToken from '@/service/api/reservation-list/getAccessToken';
import {ServerError} from '@/types/server-error.types';

const postReservation = async ({pageID, body}: {pageID: string; body: ReservationPost}) => {
  try {
    const res = await INSTANCE_URL.post(`/activities/${pageID}/reservations`, body, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    return res.data;
  } catch (e: unknown) {
    const serverError = e as ServerError;
    const serverMessage = serverError.response?.data?.message || '알 수 없는 오류가 발생했어요.';
    throw new Error(serverMessage);
  }
};

export default postReservation;
