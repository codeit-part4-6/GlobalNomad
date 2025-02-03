export interface Schedule {
  date: string;
  startTime: string;
  endTime: string;
}

export interface PostActivitiesBody {
  title: string;
  category: string;
  description: string;
  address: string;
  price: number;
  schedules: Schedule[];
  bannerImageUrl: string;
  subImageUrls: string[];
}
