import React, {useEffect} from 'react';
import type {Dayjs} from 'dayjs';

interface CalendarHeaderProps {
  value: Dayjs;
  onChange: (value: Dayjs) => void;
  setYear: (year: string) => void;
  setMonth: (month: string) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({value, onChange, setYear, setMonth}) => {
  const year = value.year();
  const month = value.month() + 1;

  useEffect(() => {
    setYear(year.toString());
    if (month < 10) {
      setMonth(`0${month.toString()}`);
    } else {
      setMonth(`${month.toString()}`);
    }
  });

  const handlePrev = () => {
    const newValue = value.subtract(1, 'month');
    onChange(newValue);
    if (newValue.month() + 1 < 10) {
      setMonth(`0${(newValue.month() + 1).toString()}`);
    } else {
      setMonth(`${(newValue.month() + 1).toString()}`);
    }

    setYear(newValue.year().toString());
  };

  const handleNext = () => {
    const newValue = value.add(1, 'month');
    onChange(newValue);
    if (newValue.month() + 1 < 10) {
      setMonth(`0${(newValue.month() + 1).toString()}`);
    } else {
      setMonth(`${(newValue.month() + 1).toString()}`);
    }
    setYear(newValue.year().toString());
  };

  return (
    <div className="mb-4 flex items-center justify-center gap-24">
      <button onClick={handlePrev} className="text-balck-100 text-xl font-bold hover:text-gray-700">
        &lt;&lt;
      </button>
      <span className="text-xl font-bold text-black-100">
        {year}년 {month}월
      </span>
      <button onClick={handleNext} className="text-balck-100 text-xl font-bold hover:text-gray-700">
        &gt;&gt;
      </button>
    </div>
  );
};

export default CalendarHeader;
