import INSTANCE_URL from '../instance';
import { SigninBody, SigninResponse } from '@/types/postSignin.types';

export async function postSignin(body: SigninBody): Promise<SigninResponse> {
  const response = await INSTANCE_URL.post('/auth/login', body);
  console.log('API 응답 데이터:', response.data);
  return response.data;
}
