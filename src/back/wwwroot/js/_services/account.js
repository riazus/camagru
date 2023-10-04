import { fetchWrapper } from "../_api/fetch-wrapper.js";

const baseUrl = `/accounts`;

export const accountService = {
  refreshToken,
  login,
  logout,
  register
}

function refreshToken() {
  return fetchWrapper.post(`${baseUrl}/refresh-token`, {})
      .then(user => {
          // publish user to subscribers and start timer to refresh token
          //userSubject.next(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          //console.log(JSON.parse(localStorage.getItem('currentUser')));
          startRefreshTokenTimer();
          return user;
      });
}

function login(email, password) {
  return fetchWrapper.post(`${baseUrl}/authenticate`, { email, password })
      .then(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          console.log(JSON.parse(localStorage.getItem('currentUser')));
          startRefreshTokenTimer();
          return user;
      })
      .catch((error) => {
        throw error;
      });
}

function logout() {
  // revoke token, stop refresh timer, publish null to user subscribers and redirect to login page
  fetchWrapper.post(`${baseUrl}/revoke-token`, {})
  localStorage.removeItem('currentUser');
  stopRefreshTokenTimer();
}

function register(params) {
  return fetchWrapper.post(`${baseUrl}/register`, params);
}

// helper functions

let refreshTokenTimeout;

function startRefreshTokenTimer() {
  const currUser = JSON.parse(localStorage.getItem('currentUser'));

  //console.log(`jwtTOKEN: ${currUser.jwtToken}`);
  // parse json object from base64 encoded jwt token
  const jwtToken = JSON.parse(atob(currUser.jwtToken.split('.')[1]));

  // set a timeout to refresh the token a minute before it expires
  const expires = new Date(jwtToken.exp * 1000);
  const timeout = expires.getTime() - Date.now() - (60 * 1000);
  refreshTokenTimeout = setTimeout(refreshToken, timeout);
}

function stopRefreshTokenTimer() {
    clearTimeout(refreshTokenTimeout);
}