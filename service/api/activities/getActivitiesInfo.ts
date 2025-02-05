import {ActivitiesInfoType, ActivitiesReviewsType, SchedulesType} from '@/types/activities-info';
import INSTANCE_URL from '@/service/api/instance';

export async function getActivitiesInfo(pageID: string): Promise<ActivitiesInfoType> {
  const res = await INSTANCE_URL.get(`/activities/${pageID}`);

  return res.data;
}

export async function getActivitiesSchedule(pageID: string, date: string | undefined): Promise<SchedulesType[]> {
  if (!date) return [];
  const params = new URLSearchParams();
  const splitDate = date.split('-');
  params.set('year', splitDate[0]);
  params.set('month', splitDate[1]);

  const res = await INSTANCE_URL.get(`/activities/${pageID}/available-schedule/`, {params});
  return res.data;
}

export async function getActivitiesReviews(pageID: string, page: number, size: number): Promise<ActivitiesReviewsType> {
  const params = new URLSearchParams(`size=${size}`);
  params.set('page', page.toString());

  const res = await INSTANCE_URL.get(`/activities/${pageID}/reviews`, {params});

  return res.data;
}
