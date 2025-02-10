'use client';
import ActivitiesModify from '@/components/myactivities/activities-modify';
import {useParams} from 'next/navigation';

export default function ActivitiesModifyPage() {
  const {id} = useParams();
  const activityId = id ? Number(id) : null;

  return <ActivitiesModify modifyId={activityId} />;
}
