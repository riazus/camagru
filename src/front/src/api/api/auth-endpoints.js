import { usmApi } from '../api';
import { API_ROUTES } from '../../config';

const registerNewUser = async (data) => {
  return await usmApi['POST'](API_ROUTES.SIGNUP, data);
};

const loginUser = async (data) => {
  return await usmApi['POST'](API_ROUTES.SIGNIN, data);
};

const logoutUser = async () => {
  return await usmApi['POST'](API_ROUTES.LOGOUT);
};

const fetchAuthUserData = async () => {
  return await usmApi['GET'](API_ROUTES.FETCH_USER);
};

export {registerNewUser, loginUser, logoutUser, fetchAuthUserData};