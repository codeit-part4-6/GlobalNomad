const generateTimeOptions = (): {value: string; label: string}[] => {
  const times: {value: string; label: string}[] = [];
  for (let hour = 0; hour < 24; hour++) {
    const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
    const time = `${formattedHour}:00`;
    times.push({value: time, label: time});
  }
  return times;
};

export default generateTimeOptions;
