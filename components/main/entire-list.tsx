import {useEffect, useState} from 'react';
import {ActivitiesBody, ActivitiesResponse} from '@/types/activities';
import EntireCard from '@/components/main/entire-card';
import Pagenation from '@/components/common/pagenation';
import {activitiesList} from '@/service/api/activities/getActivities';
import {ScaleLoader} from 'react-spinners';
import {useQuery} from '@tanstack/react-query';
import {getPageSize} from '@/utils/entire-page-size';

interface EntireListProps {
  activeCategory: string | undefined;
  selectedSort: ActivitiesBody['sort'];
}

export default function EntireList({activeCategory, selectedSort}: EntireListProps) {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(getPageSize(window.innerWidth));
  const {data: entireActivities, isLoading: isEntireLoading} = useQuery<ActivitiesResponse>({
    queryKey: ['EntireActivities', selectedSort, activeCategory, page, pageSize],
    queryFn: () =>
      activitiesList({
        method: 'offset',
        sort: selectedSort,
        category: activeCategory === '전체' ? undefined : activeCategory,
        size: pageSize,
        page,
      }),
  });

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  useEffect(() => {
    const updateSize = () => {
      const newSize = getPageSize(window.innerWidth);
      setPageSize(newSize);
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [activeCategory]);

  if (isEntireLoading) {
    return (
      <section className="mb-24pxr mt-24pxr flex w-full max-w-[75rem] flex-col justify-center gap-24pxr tablet:mt-35pxr tablet:gap-32pxr">
        <h2 className="text-[1.125rem]/[1.313rem] font-bold text-black-100 dark:text-gray-500 tablet:text-3xl">🥽 모든 체험</h2>
        <div className="flex min-h-28 items-center justify-center">
          <ScaleLoader />
        </div>
      </section>
    );
  }

  return (
    <section className="mb-24pxr mt-24pxr flex w-full max-w-[75rem] flex-col items-start justify-center gap-24pxr tablet:mt-35pxr tablet:gap-32pxr">
      <h2 className="text-[1.125rem]/[1.313rem] font-bold text-black-100 dark:text-gray-500 tablet:text-3xl">🥽 모든 체험</h2>
      <EntireCard data={entireActivities} />
      <div className="mx-auto">
        <Pagenation page={page} size={entireActivities?.totalCount} showItemCount={pageSize} onChange={handlePageChange} />
      </div>
    </section>
  );
}
