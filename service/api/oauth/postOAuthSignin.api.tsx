import INSTANCE_URL from '../instance';

export async function postOAuthSignin(body: { redirectUri: string; token: string }) {
  const response = await INSTANCE_URL.post('/oauth/sign-in/kakao', body);
  console.log('API 응답 데이터:', response.data);
  return response.data;
}