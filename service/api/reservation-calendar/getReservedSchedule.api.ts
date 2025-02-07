import INSTANCE_URL from '../instance';
import getAccessToken from '../reservation-list/getAccessToken';
import {Schedules} from '@/types/reserved-schedule';

export async function getReservedSchedule({activityId, date}: {activityId: number | null; date: string}): Promise<Schedules> {
  const accessToken = getAccessToken();
  const params = new URLSearchParams({
    ...(date !== undefined && {date: date.toString()}),
  });
  const response = await INSTANCE_URL.get(`/my-activities/${activityId}/reserved-schedule?${params}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}
