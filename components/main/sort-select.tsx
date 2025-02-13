import Image from 'next/image';
import {useState} from 'react';
import arrowDown from '@/public/icon/icon_arrow_down.svg';
import {ActivitiesBody} from '@/types/activities';

interface CustomSelectProps {
  selectedSort: ActivitiesBody['sort'] | undefined;
  onSelectedSort: (value: ActivitiesBody['sort'] | undefined) => void;
}

export default function SortSelect({selectedSort, onSelectedSort}: CustomSelectProps) {
  const options = [
    {value: 'price_asc', label: '가격이 낮은 순'},
    {value: 'price_desc', label: '가격이 높은 순'},
  ];
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel = options.find(option => option.value === selectedSort)?.label || '가격';

  const handleSelect = (value: 'most_reviewed' | 'price_asc' | 'price_desc' | 'latest' | undefined) => {
    onSelectedSort(value);
    setIsOpen(true);
  };

  return (
    <div
      onClick={() => setIsOpen(prev => !prev)}
      className="relative h-41pxr w-90pxr cursor-pointer rounded-2xl border border-nomad-black bg-white px-5 py-2 tablet:h-53pxr tablet:w-120pxr tablet:px-5 tablet:py-4 pc:w-127pxr"
    >
      <div className="flex items-center justify-center gap-1 rounded-md tablet:justify-between">
        <span className="text-md font-medium leading-none text-green-100 tablet:text-2lg">{selectedLabel}</span>
        <Image src={arrowDown} alt="Arrow Down" width={16} height={16} />
      </div>

      {isOpen && (
        <ul className="no-scrollbar absolute -right-12 z-10 mt-6 w-40 rounded-md border border-gray-200 bg-white shadow-sidenavi-box tablet:right-1pxr">
          {options.map(option => (
            <li
              key={option.value}
              className="no-scrollbar border-collapse cursor-pointer border-t border-gray-200 px-40pxr py-18pxr text-2lg font-medium text-gray-800 hover:bg-green-50 hover:text-nomad-black"
              onClick={() => handleSelect(option.value as 'price_asc' | 'price_desc' | 'most_reviewed' | 'latest')}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
