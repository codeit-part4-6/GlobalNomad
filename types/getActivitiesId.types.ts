import {Schedule} from './postActivities.types';

export interface SubImage {
  id?: number;
  imageUrl: string;
}

export interface GetActivitiesResponse {
  id: number;
  useId: number;
  title: string;
  category: string;
  description: string;
  address: string;
  price: number;
  schedules: Schedule[];
  bannerImageUrl: string;
  subImages: [];
  updatedAt: string;
  createdAt: string;
  reviewCount: number;
  rating: number;
}
