import { accountService } from "./_services/account.js";

document.addEventListener("click", async (event) => {
  if (!event.target.matches("button")) {
    return;
  }

  if (event.target.id === "signout-button") {
    try {
      await accountService.logout();
      //alert();
      window.location.replace("/visitor");
    } catch (error) {
      alert(error);
    }
  }
});

document.addEventListener("submit", async (event) => {
  if (!event.target.matches("form")) {
    return;
  }

  event.preventDefault();
  let isFormValid = true;
  const formData = new FormData(event.target);
  const emailInput = document.getElementById("email");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const password2Input = document.getElementById("password2");

  //console.log(`DATA: [email: ${emailInput.value}] [password: ${passwordInput.value}]`);
  //console.log(event.target.id);

  //#region VALIDATION HELPERS
  // Show input error message
  function showError(input, message) {
    isFormValid = false;
    const formControl = input.parentElement;
    formControl.className = 'form-control error';
    const small = formControl.querySelector('small');
    small.innerText = message;
  }

  // Show success outline
  function showSuccess(input) {
    //isFormValid = true;
    const formControl = input.parentElement;
    formControl.className = 'form-control success';
  }

  function checkRequired(inputArr) {
    inputArr.forEach((input) => {
      if (input.value.trim() === '') {
        showError(input, `${getFieldName(input)} is required`);
      } else {
        showSuccess(input);
      }
    }); 
  }

  // Check is mail is valid
  function checkEmail(input) {
    if (String(input.value)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )) {
        showSuccess(input);
      } else {
        showError(input, 'Email is not valid');
      }
  }

  function checkLength(input, min, max) {
    if (input.value.length < min) {
      showError(input, `${getFieldName(input)} must be at least ${min} characters`);
    } else if (input.value.length > max) {
      showError(input, `${getFieldName(input)} must be less than ${max} characters`);
    } else {
      showSuccess(input);
    }
  }

  function checkPassword(input) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/;
    if (!passwordRegex.test(input.value)) {
      showError(input, "Password must include at least one uppercase, one lowecase and one number character.");
    }
    checkLength(input, 6, 32);
  }

  function checkPasswordsMatch(input1, input2) {
    if (input1.value !== input2.value) {
      showError(input2, 'Passwords not match');
    }
  }

  function getFieldName(input) {
    return input.id.charAt(0).toUpperCase() + input.id.slice(1);
  }  
  //#endregion

  if (event.target.id === "login-form") {
    checkRequired([emailInput, passwordInput]);
    checkEmail(emailInput);
    if (!isFormValid) {return;}

    try {
      await accountService.login(emailInput.value, passwordInput.value);
      window.location.replace("/");
    } catch(error) {
      alert(error);
    }
    

  } else if (event.target.id === "register-form") {
    checkRequired([usernameInput, emailInput, passwordInput, password2Input]);
    checkLength(usernameInput, 3, 15);
    checkEmail(emailInput);
    checkPassword(passwordInput);
    checkPassword(password2Input);
    checkPasswordsMatch(passwordInput, password2Input);
    if (!isFormValid) {return;}

    try {
      await accountService.register({
        'username': usernameInput.value,
        'email': emailInput.value,
        'password': passwordInput.value,
        'confirmpassword': password2Input.value
      });

      localStorage.setItem("verification-sent", "true");
      window.location.replace("/verification-sent");
    } catch(error) {
      alert(error);
    }
  }

});

document.addEventListener('click', (e) => {
  if (!e.target.matches("a")) {
      return;
  }
  e.preventDefault();
  urlRoute(e);
});

const urlRoutes = {
  '/403': {
    name: '/403',
    title: 'Camagru | Forbidden',
    headerLink: '',
    mainLink: '403.html',
    footerLink: ''
  },
  '/404': {
    name: '/404',
    title: 'Camagru | Not found',
    headerLink: '',
    mainLink: '404.html',
    footerLink: ''
  },
  '/visitor': {
    name: '/visitor',
    title: 'Camagru',
    headerLink: 'visitor.html',
    mainLink: 'visitor.html',
    footerLink: ''
  },
  '/login': {
    name: '/login',
    title: 'Camagru',
    headerLink: 'login.html',
    mainLink: 'login.html',
    footerLink: ''
  },
  '/register': {
    name: '/register',
    title: 'Camagru | Register',
    headerLink: 'register.html',
    mainLink: 'register.html',
    footerLink: ''
  },
  '/': {
    name: '/',
    title: 'Camagru',
    headerLink: 'home.html',
    mainLink: 'home.html',
    footerLink: ''
  },
  '/verification-sent': {
    name: '/verification-sent',
    title: 'Camagru | Verify',
    headerLink: '',
    mainLink: 'verification-sent.html',
    footerLink: ''
  },
  '/verify-email': {
    name: '/verify-email',
    title: 'Camagru | Verify',
    headerLink: 'register.html',
    mainLink: 'email-verified.html',
    footerLink: ''
  }
}

const afterPageLoad = async (location) => {
  //HEADER

  //FOOTER

  //MAINS
  if (location === '/verify-email') {
    
    const token = localStorage.getItem("token");

    try {
      alert(token);
      await accountService.verifyEmail(token);
      const header = document.getElementById("verify-header");
      header.textContent = "Email verified successfully, you can login now!";

    } catch (error) {
      window.location.replace("/403");
    }
  }
}

const urlRoute = (event) => {
  event.preventDefault();
  //console.log(event.target.href);
  const absoluteURL = event.target.href;
  let relativePath;

  if (absoluteURL.length <= 0) {
    relativePath = "blank";
  } else {
    const url = new URL(absoluteURL);
    relativePath = url.pathname.length > 0 ? url.pathname : "/";
  }

  if (relativePath === window.location.pathname) {
    window.location.replace(window.location.pathname);
  }
  else if (relativePath === '/create-post') {
    window.location.replace('/create-post');
  }
  else {
    urlLocationHandler(relativePath);
  }
}

const urlLocationHandler = async (pathname) => {
  let location;
  if (typeof(pathname) != "object") { // If it hasn't come from window.onpopstate
    location = pathname || window.location.pathname;
    //console.log("ON NOT POPSTATE"+location);
  }
  else {
    location = window.location.pathname;
  }
  // TEMPORARY SOLUTION
  // TODO: DELETE
  // NEED FOR LIVE SERVER
  //location = location.replace('/src/back/wwwroot', '');
  
  let route = urlRoutes[location] || urlRoutes["/404"];
  route = await changeRoute(route);

  location = route.name;
  if (route.headerLink !== '') {
    const headerElement = await (await fetch(`html/headers/${route.headerLink}`)).text();
    //console.log(headerElement);
    document.getElementById('header-section').innerHTML = headerElement;
  }
  if (route.mainLink !== '') {
    const mainElement = await (await fetch(`html/mains/${route.mainLink}`)).text();
    //console.log(mainElement);
    document.getElementById('main-section').innerHTML = mainElement;
  }
  if (route.footerLink !== '') {
    const footerElement = await (await fetch(`html/footers/${route.footerLink}`)).text();
    //console.log(footerElement);
    document.getElementById('footer-section').innerHTML = footerElement;
  }

  if (pathname !== undefined) {
    window.history.replaceState({}, '', window.location.pathname);
  }

  afterPageLoad(location);

  if (typeof(pathname) != "object") { // If it hasn't come from window.onpopstate
    // console.log(pathname);
    // const urlParams = customURLSearchParams(window.location.search);
    // if (urlParams.size > 0 && pathname === undefined) { // pathname === undefined means if it's directly applied from address bar
    //     const queryString = customURLSearchParams(urlParams.object());
    //     window.history.pushState({}, "", `${location}?${queryString}`);
    // }
    // else {
    //     window.history.pushState({}, "", location);
    // }
    //console.log("push state " + location);
    window.history.pushState({}, "", location);
  }
}

const changeRoute = async (route) => {
  accountService.refreshToken();
  const currUser = JSON.parse(localStorage.getItem('currentUser'));

  if (route.name === '/' || route.name === '/visitor') {
    route = currUser ? urlRoutes["/"] : urlRoutes["/visitor"];
  } else if (route.name === '/login') {
    route = currUser ? urlRoutes["/"] : urlRoutes["/login"];
  } else if (route.name === '/register') {
    route = currUser ? urlRoutes["/"] : urlRoutes["/register"];
  } else if (route.name === '/verification-sent') {
    const isVerificationSent = localStorage.getItem("verification-sent");
    route = isVerificationSent === "true" ? urlRoutes["/verification-sent"] : urlRoutes["/visitor"];
  } else if (route.name === '/verify-email') {
    const isVerificationSent = localStorage.getItem("verification-sent");
    if (isVerificationSent) {
      const url = new URL(window.location.href);
      const token = url.searchParams.get("token");
      localStorage.setItem("token", token);
      route = urlRoutes["/verify-email"];
    } else {
      route = urlRoutes["/403"];
    }
  }

  return route;
}

window.onpopstate = urlLocationHandler;
window.addEventListener("popstate", urlRoute);

urlLocationHandler();