import INSTANCE_URL from '../instance';

export async function postOAuthSignin(body: { redirectUri: string; token: string }) {
  const response = await INSTANCE_URL.post('/oauth/sign-in/kakao', body);
  return response.data;
}