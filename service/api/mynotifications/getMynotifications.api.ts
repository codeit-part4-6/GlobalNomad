import {InfiniteData, QueryFunctionContext} from '@tanstack/react-query';
import {AxiosError} from 'axios'; // AxiosError 추가
import INSTANCE_URL from '../instance';
import {Notifications} from '@/types/getMynotifications';

interface ServerError {
  message?: string;
}

export interface CustomInfiniteData<TData, TPageParam = unknown> extends InfiniteData<TData, TPageParam> {
  meta?: {
    totalCount: number;
  };
}

export async function getMynotifications({pageParam, meta}: QueryFunctionContext): Promise<CustomInfiniteData<Notifications[], number>> {
  const size = meta?.size || 20;
  const cursorId = pageParam;

  try {
    const response = await INSTANCE_URL.get('/my-notifications', {
      params: {cursorId, size},
    });

    return {
      pages: [response.data.notifications],
      pageParams: [response.data.cursorId],
      meta: {totalCount: response.data.totalCount},
    };
  } catch (error) {
    console.error('에러 발생', error);
    return {
      pages: [[]],
      pageParams: [],
      meta: {totalCount: 0},
    };
  }
}
