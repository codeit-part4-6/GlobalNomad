import INSTANCE_URL from '../instance';

export async function postOAuth(provider: string) {
  const appKey = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
  const data = { 
    appKey, 
    provider, 
  };

  const response = await INSTANCE_URL.post('/oauth/apps', data);
  console.log('API 응답 데이터:', response.data);
  return response;
}