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
  // ✅ CustomInfiniteData 타입 적용
  const size = meta?.size || 20;
  const cursorId = pageParam;

  try {
    const response = await INSTANCE_URL.get('/my-notifications', {
      params: {cursorId, size},
    });

    return {
      pages: [response.data.notifications], // 기존 데이터
      pageParams: [response.data.cursorId], // 기존 데이터
      meta: {totalCount: response.data.totalCount}, // ✅ totalCount 추가
    };
  } catch (error) {
    console.error('에러 발생', error);
    return {
      pages: [[]],
      pageParams: [],
      meta: {totalCount: 0}, // ✅ 오류 발생 시 기본값 설정
    };
  }
}
