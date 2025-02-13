import {ServerError} from '@/types/server-error.types';

const isAdmin = (userId: number) => {
  try {
    const sessionID = sessionStorage.getItem('userInfo');
    if (!sessionID) return false;
    const updateAuth = JSON.parse(sessionID).id === userId;
    return updateAuth;
  } catch (e: unknown) {
    const serverError = e as ServerError;
    console.error(serverError.response?.data?.message);
    return false;
  }
};

export default isAdmin;
