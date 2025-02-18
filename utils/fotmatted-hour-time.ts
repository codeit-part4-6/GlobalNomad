// 시간생성
const generateTimeOptions = (): {value: string; label: string}[] => {
  const times: {value: string; label: string}[] = [];
  for (let hour = 0; hour < 24; hour++) {
    const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
    const time = `${formattedHour}:00`;
    times.push({value: time, label: time});
  }
  return times;
};

// 주간생성
const generateDayCount = (max: number) => {
  const options = [];
  for (let i = 1; i <= max; i++) {
    options.push({value: i.toString(), label: `${i}주`});
  }
  return options;
};

// 날짜생성 controller default 값
const generateDatesForWeeks = (weeks: number) => {
  const startDate = new Date(); // 오늘 날짜
  const dates = [];
  for (let i = 0; i < weeks * 7; i++) {
    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + i);
    dates.push({
      date: newDate.toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '18:00',
    });
  }
  return dates;
};

const findOverlappingSchedules = (schedules: {date?: string; startTime?: string; endTime?: string}[]) => {
  return schedules
    .map((a, i) =>
      schedules.some(
        (b, j) =>
          i !== j &&
          a.date === b.date &&
          a.startTime &&
          a.endTime &&
          b.startTime &&
          b.endTime &&
          ((a.startTime < b.endTime && b.startTime < a.endTime) || (a.startTime === b.startTime && a.endTime === b.endTime)),
      )
        ? i
        : -1,
    )
    .filter(i => i !== -1);
};

export {generateTimeOptions, generateDayCount, generateDatesForWeeks, findOverlappingSchedules};
