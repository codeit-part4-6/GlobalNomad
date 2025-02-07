export interface ActivitiesInfoType {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: string;
  price: number;
  address: string;
  bannerImageUrl: string;
  subImages: [
    {
      id: number;
      imageUrl: string;
    },
  ];
  schedules: [
    {
      id: number;
      date: string;
      startTime: string;
      endTime: string;
    },
  ];
  reviewCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface SchedulesTimeType {
  startTime: string;
  endTime: string;
  id: number;
}

export interface SchedulesDateType {
  date: string;
  startTime: string;
  endTime: string;
  id: number;
}

export interface SchedulesType {
  date: string;
  times: SchedulesTimeType[];
}

export interface ActivitiesReviewsType {
  averageRating: number;
  totalCount: number;
  reviews: [
    {
      id: number;
      user: {
        profileImageUrl: string;
        nickname: string;
        id: number;
      };
      activityId: number;
      rating: number;
      content: string;
      createdAt: string;
      updatedAt: string;
    },
  ];
}

export interface ReservationPost {
  scheduleId: number;
  headCount: number;
}

export interface ReservationInfoType {
  person: number;
  scheduleModal: boolean;
  personModal: boolean;
  schedule: SchedulesDateType;
  daySchedule: SchedulesType;
}
