'use client';

import {useEffect} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import MyActivities from '@/components/myactivities/myactivities';

export default function TreatReservationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentType = searchParams.get('type') as 'manage' | 'register' | 'modify' | 'delete' | null;

  useEffect(() => {
    if (!contentType) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('type', 'manage');
      router.push(`${window.location.pathname}?${searchParams.toString()}`);
    }
  }, [contentType, router]);

  return <MyActivities contentType={contentType ?? 'manage'} />;
}
