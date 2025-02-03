const generateTimeOptions = (): {value: string; label: string}[] => {
  const times: {value: string; label: string}[] = [];
  for (let hour = 0; hour < 24; hour++) {
    const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
    const time = `${formattedHour}:00`;
    times.push({value: time, label: time});
  }
  return times;
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

export {generateTimeOptions, findOverlappingSchedules};
