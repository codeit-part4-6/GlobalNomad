import INSTANCE_URL from '../instance';
import  {SignupBody, SignupResponse } from '@/types/postSignup.types';

export async function postSignup(body: SignupBody): Promise<SignupResponse> {
  const response = await INSTANCE_URL.post('/users', body);
  return response.data;
}
