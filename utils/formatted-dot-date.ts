const FormattedDotDate = (date: string) => {
  const newDate = date.split('-').join('. ');
  return newDate;
};

export default FormattedDotDate;
