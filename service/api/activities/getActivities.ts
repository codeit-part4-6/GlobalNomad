import INSTANCE_URL from '@/service/api/instance';
import {ActivitiesBody, ActivitiesResponse} from '@/types/activities';

export async function activitiesList(
  {method, sort, size, page, category, keyword, cursorId}: ActivitiesBody = {method: 'offset'},
): Promise<ActivitiesResponse> {
  const params = {
    cursorId,
    method,
    category,
    keyword,
    sort,
    size,
    page,
  };
  if (category) params.category = category;
  const response = await INSTANCE_URL.get('/activities', {params});

  return response.data;
}
