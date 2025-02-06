import INSTANCE_URL from '../instance';
import { EditMypageBody, EditMypageResponse } from '@/types/patchMypage.types';

export async function patchMypage(body: EditMypageBody): Promise<EditMypageResponse> {
  const response = await INSTANCE_URL.patch('/users/me', body);
  return response.data;
}