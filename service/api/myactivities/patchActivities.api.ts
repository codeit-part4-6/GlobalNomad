import {ServerError} from '@/types/server-error.types';
import INSTANCE_URL from '../instance';
import {PatchActivitiesBody} from '@/types/patchActivities.types';

export async function patchActivities(activityId: number, body: PatchActivitiesBody) {
  try {
    const response = await INSTANCE_URL.patch(`/my-activities/${activityId}`, body);
    return response.data;
  } catch (error: unknown) {
    const serverError = error as ServerError;
    const serverMessage = serverError.response?.data?.message || '알 수 없는 오류가 발생했어요.';
    throw new Error(serverMessage);
  }
}
