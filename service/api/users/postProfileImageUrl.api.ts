import INSTANCE_URL from '../instance';

export async function postProfileImageUrl(image: File) {
  try {
    const formData = new FormData();
    formData.append('image', image);
    const response = await INSTANCE_URL.post('/users/me/image', formData);
    return response.data.profileImageUrl;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`이미지 업로드에 실패했어요: ${error.message}`);
    } else {
      throw new Error('이미지 업로드에 실패했어요: 알 수 없는 오류');
    }
  }
}
