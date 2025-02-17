import {Schedules} from '@/types/reserved-schedule';

export const getScheduleCounts = (schedule: Schedules[number] | undefined) => ({
  pending: schedule?.count.pending ?? 0,
  confirmed: schedule?.count.confirmed ?? 0,
  declined: schedule?.count.declined ?? 0,
});
