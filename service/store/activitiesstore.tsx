import dayjs from 'dayjs';
import {create} from 'zustand';
import {PageType} from '@/types/common/alert-modal.types';
import {SchedulesType, SchedulesDateType} from '@/types/activities-info';

interface ActivitiesState {
  pageID: string;
  person: number;
  scheduleModal: boolean;
  personModal: boolean;
  selectedSchedule: SchedulesType;
  dailySchedule: SchedulesDateType;
  setPageID: (id: string) => void;
  setPerson: (count: number) => void;
  setSelectedSchedule: (data: SchedulesType) => void;
  setDailySchedule: (data: SchedulesDateType) => void;
  setScheduleModal: (open: boolean) => void;
  setPersonModal: (open: boolean) => void;
}

const activitiesStore = create<ActivitiesState>(set => ({
  pageID: '',
  person: 1,
  scheduleModal: false,
  personModal: false,
  selectedSchedule: {date: dayjs().format('YYYY-MM-DD'), startTime: '', endTime: '', id: 0},
  dailySchedule: {date: dayjs().format('YYYY-MM-DD'), times: []},
  setPageID: id => set(() => ({pageID: id})),
  setPerson: count => set(() => ({person: count})),
  setSelectedSchedule: data => set(() => ({selectedSchedule: data})),
  setDailySchedule: data => set(() => ({dailySchedule: data})),
  setScheduleModal: open => set(() => ({scheduleModal: open})),
  setPersonModal: open => set(() => ({personModal: open})),
}));

export default activitiesStore;
