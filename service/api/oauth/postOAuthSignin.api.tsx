import INSTANCE_URL from '../instance';

export async function postOAuthSignin(data: { redirectUri: string; token: string }) {
  const response = await INSTANCE_URL.post('/oauth/sign-in/kakao', data);
  console.log('API 응답 데이터:', response.data);
  return response;
}