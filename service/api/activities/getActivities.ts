import INSTANCE_URL from '@/service/api/instance';
import {ActivitiesBody, ActivitiesResponse} from '@/types/activities';

export async function activitiesList({method = 'offset', sort, size, cursorId}: ActivitiesBody = {method: 'offset'}): Promise<ActivitiesResponse> {
  const response = await INSTANCE_URL.get('/activities', {
    params: {
      cursorId,
      method,
      sort,
      size,
    },
  });

  return response.data;
}
