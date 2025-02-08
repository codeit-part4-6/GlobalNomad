import INSTANCE_URL from '../instance';

export async function postOAuth(code: string) {  
  const appKey = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
  const data = { 
    appKey, 
    provider: 'kakao',
    code,
  };

  const response = await INSTANCE_URL.post('/oauth/apps', data);
  console.log('OAuth API 응답 데이터:', response.data);
  return response.data;
}