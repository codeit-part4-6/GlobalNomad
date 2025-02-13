import dayjs from 'dayjs';
import {create} from 'zustand';
import {SchedulesType, SchedulesDateType} from '@/types/activities-info';

interface ActivitiesState {
  person: number;
  scheduleModal: boolean;
  personModal: boolean;
  selectedSchedule: SchedulesType;
  dailySchedule: SchedulesDateType;
  updatePerson: (count: number) => void;
  updateSelectedSchedule: (data: SchedulesType) => void;
  updateDailySchedule: (data: SchedulesDateType) => void;
  updateScheduleModal: (open: boolean) => void;
  updatePersonModal: (open: boolean) => void;
}

const activitiesStore = create<ActivitiesState>(set => ({
  person: 1,
  scheduleModal: false,
  personModal: false,
  selectedSchedule: {date: dayjs().format('YYYY-MM-DD'), startTime: '', endTime: '', id: 0},
  dailySchedule: {date: dayjs().format('YYYY-MM-DD'), times: []},
  updatePerson: count => set(state => ({person: state.person + count})),
  updateSelectedSchedule: data => set(() => ({selectedSchedule: data})),
  updateDailySchedule: data => set(() => ({dailySchedule: data})),
  updateScheduleModal: open => set(() => ({scheduleModal: open})),
  updatePersonModal: open => set(() => ({personModal: open})),
}));

export default activitiesStore;
