export interface SigninBody {
  email: string;
  password: string;
}

export interface SigninResponse {
  user: {
    id: number;
    email: string;
    nickname: string;
    profileImageUrl: string;
    createdAt: string;
    updatedAt: string;
  };
  refreshToken: string;
  accessToken: string;
}