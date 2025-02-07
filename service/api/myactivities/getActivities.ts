import {Activity} from '@/types/myactivities';
import {InfiniteData, QueryFunctionContext} from 'react-query';
import INSTANCE_URL from '../instance';

export async function getActivitiesList({pageParam, meta}: QueryFunctionContext): Promise<InfiniteData<Activity[]>> {
  const size = meta?.size || 20;
  const cursorId = pageParam;
  const response = await INSTANCE_URL.get('/my-activities', {
    params: {
      cursorId,
      size,
    },
  });

  return {
    pages: [response.data.activities],
    pageParams: [response.data.cursorId],
  };
}
