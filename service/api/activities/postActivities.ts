import {ReservationPost} from '@/types/activities-info';
import INSTANCE_URL from '../instance';

const postReservation = async ({pageID, body}: {pageID: string; body: ReservationPost}) => {
  const res = await INSTANCE_URL.post(`/activities/${pageID}/reservations`, body);

  return res.data;
};

export default postReservation;
