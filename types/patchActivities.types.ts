import {SubImage} from './getActivitiesId.types';

export interface PatchActivitiesBody {
  title: string;
  category: string;
  description: string;
  price: number;
  bannerImageUrl: string;
  subImageIdsToRemove: []; // 삭제할 소개이미지 배열
  scheduleIdsToRemove: []; // 삭제할 일정 ID 배열
  subImageUrlsToAdd: string[]; // 추가할 소개이미지 URL
  schedulesToAdd: []; // 추가할 일정 배열
  subImages?: [];
  schedulesToAddTemp?: [];
}
