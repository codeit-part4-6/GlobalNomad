import Image from 'next/image';
import {TimeDropdownProps} from '@/types/reservation-list';
import arrowDown from '@/public/icon/icon_arrow_down.svg';

export default function TimeDropDown({times, selectedTime, isOpen, setIsOpen, onSelectTime}: TimeDropdownProps) {
  console.log(times);
  return (
    <div className="relative mb-30pxr min-h-53pxr w-full rounded-2xl border border-gray-700 px-5 py-4 tablet:rounded-md">
      <div className="flex cursor-pointer items-center justify-between" onClick={() => setIsOpen(!isOpen)}>
        <span className="text-2lg font-regular leading-none text-black-100">{selectedTime || '체험 시간을 선택하세요'}</span>
        <div className="relative h-6 w-6">
          <Image className="absolute" fill src={arrowDown} alt="메뉴 선택 토글" />
        </div>
      </div>
      {isOpen && (
        <ul className="absolute -left-2pxr z-10 mt-5 w-full rounded-md border border-gray-300 bg-white shadow-lg">
          {times.length > 0 ? (
            times.map((time, index) => (
              <li
                key={index}
                className="cursor-pointer px-5 py-18pxr text-lg font-regular text-gray-800 hover:bg-green-50 hover:text-nomad-black"
                onClick={() => {
                  onSelectTime(time);
                  setIsOpen(false);
                }}
              >
                {time}
              </li>
            ))
          ) : (
            <li className="px-5 py-18pxr text-lg font-regular text-gray-500">해당 일자에는 체험 스케줄이 없습니다</li>
          )}
        </ul>
      )}
    </div>
  );
}
