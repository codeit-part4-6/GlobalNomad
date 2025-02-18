import {Schedules} from '@/types/reserved-schedule';

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

export interface ReservationProps {
  reservationStatus: string;
  reservedScheduleData: Schedules;
  activityId: number | null;
  selectedDate: string;
  setSelectedTime: (time: string) => void;
  selectedTime: string | null;
}

export interface TimeDropdownProps {
  times: string[];
  selectedTime: string | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSelectTime: (time: string) => void;
}
