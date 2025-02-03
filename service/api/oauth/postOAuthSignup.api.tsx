import INSTANCE_URL from '../instance';
import  {SignupBody, SignupResponse } from '@/types/postSignup.types';

export async function postOAuthSignup(body: SignupBody): Promise<SignupResponse> {
  const response = await INSTANCE_URL.post('/oauth/sign-up/kakao', body);
  return response.data;
}