import { fetchWrapper } from "../_api/fetch-wrapper.js";

const baseUrl = `/accounts`;

export const accountService = {
  refreshToken
}

function refreshToken() {
  return fetchWrapper.post(`${baseUrl}/refresh-token`, {})
      .then(user => {
          // publish user to subscribers and start timer to refresh token
          //userSubject.next(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          console.log(JSON.parse(localStorage.getItem('currentUser')));
          startRefreshTokenTimer();
          return user;
      });
}