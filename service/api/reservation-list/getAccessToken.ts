const getAccessToken = () => {
  const accessToken = sessionStorage.getItem('accessToken');
  return accessToken;
};

export default getAccessToken;
