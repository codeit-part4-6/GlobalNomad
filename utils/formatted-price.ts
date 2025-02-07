const FormattedPrice = (price: number) => {
  const formattedPrice = price.toLocaleString();
  return formattedPrice;
};

export default FormattedPrice;
