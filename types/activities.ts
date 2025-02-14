export interface ActivitiesBody {
  method: 'offset' | 'cursor';
  cursorId?: number | null;
  category?: string;
  keyword?: string;
  sort?: 'most_reviewed' | 'price_asc' | 'price_desc' | 'latest' | undefined;
  page?: number | undefined;
  size?: number | undefined;
}

export interface CardData {
  id: number;
  title: string;
  price: number;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
}

export interface ActivitiesResponse {
  cursorId?: number;
  totalCount: number;
  activities: Activities[];
}

export interface MyActivitiesResponse {
  totalCount: number;
  cursorId: string;
  activities: Activities[];
}

export interface Activities {
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

export interface Category {
  id: '문화·예술' | '식음료' | '스포츠' | '투어' | '관광' | '웰빙';
  value: '문화·예술' | '식음료' | '스포츠' | '투어' | '관광' | '웰빙';
}
