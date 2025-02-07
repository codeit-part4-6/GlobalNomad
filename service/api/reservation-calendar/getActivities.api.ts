import INSTANCE_URL from '../instance';
import getAccessToken from '../reservation-list/getAccessToken';
import {MyActivitiesResponse} from '@/types/activities';

export async function getActivities({cursorId, size}: {cursorId?: number; size?: number}): Promise<MyActivitiesResponse> {
  const accessToken = getAccessToken();
  const params = new URLSearchParams({
    ...(cursorId !== undefined && {cursorId: cursorId.toString()}),
    ...(size !== undefined && {size: size.toString()}),
  });
  const response = await INSTANCE_URL.get(`/my-activities?${params}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}
