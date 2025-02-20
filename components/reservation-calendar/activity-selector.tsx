import Image from 'next/image';
import selectDown from '@/public/icon/ic_chevron_down.svg';

export default function ActivitySelector({
  activities,
  selectedActivity,
  isOpen,
  onToggle,
  onSelect,
}: {
  activities: {title: string; id: number}[];
  selectedActivity: {title: string; id: number} | null;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (activity: {title: string; id: number}) => void;
}) {
  return (
    <div className="relative mb-8">
      <button onClick={onToggle} className="relative h-14 min-h-14 w-full cursor-pointer rounded border border-gray-700 px-5 text-left">
        <p className="absolute -top-3 left-4 bg-black-400 px-1 text-md font-regular text-nomad-black dark:bg-slate-800 dark:text-gray-500">체험명</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-regular text-black-200 dark:text-gray-100">{selectedActivity?.title || '선택하세요'}</span>
          <Image className="relative h-6 w-6" src={selectDown} alt="메뉴 선택 토글" />
        </div>
      </button>
      {isOpen && (
        <ul className="absolute left-0 z-10 mt-5 w-full rounded border border-gray-300 bg-white shadow-sidenavi-box dark:border-slate-500 dark:bg-slate-400">
          {activities.map(activity => (
            <li
              key={activity.id}
              onClick={() => onSelect(activity)}
              className="cursor-pointer px-5 py-18pxr text-lg font-regular text-gray-800 hover:bg-green-50 hover:text-nomad-black"
            >
              {activity.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
