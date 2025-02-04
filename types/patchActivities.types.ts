export interface PatchActivitiesBody {
  title: string;
  category: string;
  description: string;
  address: string;
  price: number;
  bannerImageUrl: string;
  subImageIdsToRemove: []; // 삭제할 이미지  배열
  subImageUrlsToAdd: string[]; // 추가할 이미지 URL
  scheduleIdsToRemove: []; // 삭제할 일정 ID 배열
  schedulesToAdd: Schedule[]; // 추가할 일정 배열
}

export interface Times {
  endTime: string;
  startTime: string;
  id: number;
}

export interface Schedule {
  date: string;
  times: Times[];
}

export interface SubImages {
  imageUrl: string;
  id: number;
}
