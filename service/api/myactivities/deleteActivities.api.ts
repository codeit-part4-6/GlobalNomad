import {ServerError} from '@/types/server-error.types';
import INSTANCE_URL from '../instance';

export async function deleteActivities(activityId: number) {
  try {
    const response = await INSTANCE_URL.delete(`/my-activities/${activityId}`);
    return response.data;
  } catch (error: unknown) {
    const serverError = error as ServerError;
    const serverMessage = serverError.response?.data?.message || '알 수 없는 오류가 발생했어요.';
    throw new Error(serverMessage);
  }
}
