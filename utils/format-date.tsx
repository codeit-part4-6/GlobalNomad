const FormatDate = (date: string) => {
  const getDate = new Date(date).toLocaleDateString().replace(/\./g, '').replace(/\s/g, '.');
  return getDate;
};

export default FormatDate;
