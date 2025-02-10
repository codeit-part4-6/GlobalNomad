const AdminAuth = (userId: number) => {
  const sessionID = sessionStorage.getItem('userInfo');
  const updateAuth = sessionID && JSON.parse(sessionID).id === userId;
  return updateAuth;
};

export default AdminAuth;
