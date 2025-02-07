interface ScheduleCount {
  declined: number;
  confirmed: number;
  pending: number;
}

export interface Schedule {
  scheduleId: number;
  startTime: string;
  endTime: string;
  count: ScheduleCount;
}

export type Schedules = Schedule[];
