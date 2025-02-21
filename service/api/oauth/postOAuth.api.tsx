import INSTANCE_URL from '../instance';

export async function postOAuth() {  
  const appKey = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
  const data = { 
    appKey, 
    provider: 'kakao',
    
  };

  const response = await INSTANCE_URL.post('/oauth/apps', data);
  return response.data;
}