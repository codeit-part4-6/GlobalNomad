import INSTANCE_URL from '../instance';
import getAccessToken from './getAccessToken';
import {ServerError} from '@/types/server-error.types';

export async function postReview(reservationId: number, content: string, rating: number) {
  const accessToken = getAccessToken();
  try {
    const response = await INSTANCE_URL.post(
      `/my-reservations/${reservationId}/reviews`,
      {
        rating,
        content,
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
  } catch (error: unknown) {
    const serverError = error as ServerError;
    const serverMessage = serverError.response?.data?.message || '알 수 없는 오류가 발생했어요.';
    throw new Error(serverMessage);
  }
}
