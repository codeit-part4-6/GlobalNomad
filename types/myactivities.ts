export interface MyactivitiesBody {
  cursorId?: number;
  size?: number;
}

export interface MyactivitiesResponse {
  cursorId: number;
  totalCount: number;
  activities: Activity[];
}

export interface Activity {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: string;
  price: number;
  address: string;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}
