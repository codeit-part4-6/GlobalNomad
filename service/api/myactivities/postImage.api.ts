import {ServerError} from '@/types/server-error.types';
import INSTANCE_URL from '../instance';

export async function postImage(formData: FormData) {
  try {
    const response = await INSTANCE_URL.post('/activities/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: unknown) {
    const serverError = error as ServerError;
    const serverMessage = serverError.response?.data?.message || '알 수 없는 오류가 발생했어요.';
    throw new Error(serverMessage);
  }
}
