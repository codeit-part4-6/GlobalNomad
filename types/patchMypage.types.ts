export interface EditMypageBody {
  nickname?: string;
  profileImageUrl?: string | null;
  newPassword?: string;
}

export interface EditMypageResponse {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string;
  createdAt: string;
  updatedAt: string;
}
