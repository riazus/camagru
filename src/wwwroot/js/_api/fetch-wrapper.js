import { accountService } from "../_services/account.js";

export const fetchWrapper = {
  get,
  post,
  post_file,
  put,
  delete: _delete,
};

function get(url) {
  const requestOptions = {
    method: "GET",
    headers: authHeader(url),
  };
  return fetch(url, requestOptions).then(handleResponse);
}

function post(url, body) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader(url) },
    credentials: "include",
    body: JSON.stringify(body),
  };
  //console.log(body, requestOptions);
  return fetch(url, requestOptions).then(handleResponse);
}

function post_file(url, body) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader(url) },
    credentials: "include",
    body: JSON.stringify(body),
  };
  return fetch(url, requestOptions).then().then(handleFileResponse);
}

function put(url, body) {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader(url) },
    body: JSON.stringify(body),
  };
  return fetch(url, requestOptions).then(handleFileResponse);
}

function _delete(url) {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader(url),
  };
  return fetch(url, requestOptions).then(handleResponse);
}

// helpers

function authHeader(url) {
  // return auth header with jwt if user is logged in and request is to the api url
  const user = JSON.parse(localStorage.getItem("currentUser"));
  console.log(`authHeader(${url})`);
  //alert(`authHeader(${url})`);
  //console.log(user);
  const isLoggedIn = user && user.jwtToken;
  //const isApiUrl = url.startsWith("http://localhost:4000");

  if (isLoggedIn) {
    //console.log("AUTHORIZED");
    //console.log(user.jwtToken);
    return { Authorization: `Bearer ${user.jwtToken}` };
  } else {
    console.log("NOT AUTHORIZED");
    return {};
  }
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);

    if (!response.ok) {
      console.log("RESPONSE NOT OKAY");
      if (
        [401, 403].includes(response.status) &&
        JSON.parse(localStorage.getItem("currentUser"))
      ) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        console.log("LOGOUT");
        return accountService.logout();
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}

function handleFileResponse(response) {
  if (!response.ok) {
    console.log("RESPONSE NOT OKAY");
    if (
      [401, 403].includes(response.status) &&
      JSON.parse(localStorage.getItem("currentUser"))
    ) {
      // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
      console.log("LOGOUT");
      return accountService.logout();
    }

    const error =
      (response.data && response.data.message) || response.statusText;
    return Promise.reject(error);
  }

  return response.blob();
}
