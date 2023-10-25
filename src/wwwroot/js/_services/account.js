import { fetchWrapper } from "../_api/fetch-wrapper.js";

const baseUrl = `/accounts`;

export const accountService = {
  refreshToken,
  login,
  logout,
  register,
  verifyEmail,
  forgotPassword,
  resetPassword,
  update,
};

function refreshToken() {
  return fetchWrapper.post(`${baseUrl}/refresh-token`, {}).then((user) => {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      startRefreshTokenTimer();
      return user;
    }
  });
}

function login(email, password) {
  return fetchWrapper
    .post(`${baseUrl}/authenticate`, { email, password })
    .then((user) => {
      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        startRefreshTokenTimer();
        return user;
      }
    })
    .catch((error) => {
      throw error;
    });
}

async function logout() {
  // revoke token, stop refresh timer, publish null to user subscribers and redirect to login page
  await fetchWrapper.post(`${baseUrl}/revoke-token`, {});
  localStorage.removeItem("currentUser");
  stopRefreshTokenTimer();
}

function register(params) {
  return fetchWrapper.post(`${baseUrl}/register`, params);
}

function verifyEmail(token) {
  return fetchWrapper.post(`${baseUrl}/verify-email`, { token });
}

function forgotPassword(email) {
  return fetchWrapper.post(`${baseUrl}/forgot-password`, { email });
}

function resetPassword({ token, password, confirmPassword }) {
  return fetchWrapper.post(`${baseUrl}/reset-password`, {
    token,
    password,
    confirmPassword,
  });
}

function update(params) {
  return fetchWrapper.put(`${baseUrl}`, params);
}

//#region helper functions
let refreshTokenTimeout;

function startRefreshTokenTimer() {
  let currUser;
  const item = localStorage.getItem("currentUser");
  if (item && item !== "undefined") {
    currUser = JSON.parse(item);
  }

  if (currUser) {
    const jwtToken = JSON.parse(atob(currUser.jwtToken.split(".")[1]));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - 60 * 1000;
    refreshTokenTimeout = setTimeout(refreshToken, timeout);
  }
}

function stopRefreshTokenTimer() {
  clearTimeout(refreshTokenTimeout);
}
//#endregion
