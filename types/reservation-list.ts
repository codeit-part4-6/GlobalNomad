export interface ReservationListResponse {
  totalCount: number;
  cursorId: string;
  reservations: Reservation[];
}

export interface Reservation {
  id: number;
  scheduleId: number;
  teamId: string;
  userId: number;
  status: string;
  reviewSubmitted: boolean;
  totalPrice: number;
  headCount: number;
  date: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  activity: Activity;
}

export interface Activity {
  id: number;
  title: string;
  bannerImageUrl: string;
}
