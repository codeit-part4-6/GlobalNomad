import {PostActivitiesBody} from '@/types/postActivities.types';
import INSTANCE_URL from '../instance';
import {ServerError} from '@/types/server-error.types';

export async function postActivities(body: PostActivitiesBody) {
  try {
    const response = await INSTANCE_URL.post('/activities', body);
    return response.data;
  } catch (error: unknown) {
    const serverError = error as ServerError;
    const serverMessage = serverError.response?.data?.message || '알 수 없는 오류가 발생했어요.';
    throw new Error(serverMessage);
  }
}
