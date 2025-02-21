import INSTANCE_URL from '../instance';
import { SigninBody, SigninResponse } from '@/types/postSignin.types';

export async function postSignin(body: SigninBody): Promise<SigninResponse> {
  const response = await INSTANCE_URL.post('/auth/login', body);
  return response.data;
}
