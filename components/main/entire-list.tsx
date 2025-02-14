import {activitiesList} from '@/service/api/activities/getActivities';
import EntireCard from './entire-card';
import {ActivitiesBody, ActivitiesResponse} from '@/types/activities';
import {useQuery} from '@tanstack/react-query';
import {ScaleLoader} from 'react-spinners';
import Pagenation from '../common/pagenation';
import {useEffect, useState} from 'react';
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
        category: activeCategory,
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
    console.log(window.innerWidth);
    updateSize();
    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  if (isEntireLoading) {
    return (
      <div className="min-h-28">
        <ScaleLoader />
      </div>
    );
  }

  return (
    <section className="mb-24pxr mt-24pxr flex max-w-[75rem] flex-col items-start justify-center gap-24pxr tablet:mt-35pxr tablet:gap-32pxr">
      <h2 className="text-[1.125rem]/[1.313rem] font-bold text-black-100 tablet:text-3xl">🥽 모든 체험</h2>
      <EntireCard data={entireActivities} />
      <Pagenation size={entireActivities?.totalCount} showItemCount={pageSize} onChange={handlePageChange} />
    </section>
  );
}
