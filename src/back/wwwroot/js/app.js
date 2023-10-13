import { accountService } from "./_services/account.js";
import { postService } from "./_services/post.js";

const determineDate = (dateString) => {
  const date = new Date(dateString);
  const currentDate = new Date();
  const timeDifference = Math.abs(currentDate - date);

  const minutesDifference = Math.floor(timeDifference / (1000 * 60));
  const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  if (daysDifference > 0) {
    return `${daysDifference} DAY${daysDifference > 1 ? 'S' : ''} AGO`;
  } else if (hoursDifference > 0) {
    return `${hoursDifference} HOUR${hoursDifference > 1 ? 'S' : ''} AGO`;
  } else if (minutesDifference > 0) {
    return `${minutesDifference} MINUTE${minutesDifference > 1 ? 'S' : ''} AGO`;
  } else {
    return 'RIGHT NOW';
  }
}

const convertStringToElement = (htmlString) => {
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(htmlString, 'text/html');
  return parsedDocument.body.firstChild;
}

let lastPostId = null;
const loadPosts = async (container, userId, reset = false) => {
  let posts;
  
  if (reset) {
    lastPostId = null;
  }
  
  posts = await postService.getChunkPosts(lastPostId);

  if (posts.length <= 0) {return;}

  lastPostId = posts[posts.length - 1].id;

  const postElement = convertStringToElement(await (await fetch(`html/mains/post.html`)).text());
  
  let isLogged = false;
  const currUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currUser) {
    isLogged = true;
  }

  for(let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const newElement = postElement.cloneNode(true);

    const creatorElement = newElement.querySelector('#creator-span');
    const likeCountElement = newElement.querySelector('#likes-span');
    const timeCreatedElement = newElement.querySelector('#time-created-span');
    const imageElement = newElement.querySelector('#image-img');
    const likeElement = newElement.querySelector('#like-button');

    creatorElement.textContent = post.username;
    likeCountElement.textContent = post.likes;
    timeCreatedElement.textContent = determineDate(post.createDate);
    imageElement.src = 'images/' + post.imagePath;

    newElement.setAttribute('post-id', post.id.toString());

    if (isLogged) {
      likeElement.setAttribute('post-id', post.id.toString());
      likeCountElement.setAttribute('post-id', post.id.toString());

      const isUserLikedPost = await postService.isUserLikedPost(post.id);

      if (isUserLikedPost.isLiked) {
        const icon = likeElement.querySelector('#like-true');
        icon.classList.remove('d-none');
      } else {
        const icon = likeElement.querySelector('#like-false');
        icon.classList.remove('d-none');
      }
    } else {
      likeElement.remove();
    }

    container.appendChild(newElement);
  }

};

const buttonLoadingOn = (button) => {
  if (!button) {return;}
  button.classList.toggle('button--loading');
}

const buttonLoadingOff = async (button, removeDisabled = true) => {
  if (!button) {return;}
  button.classList.toggle('button--loading');
}

document.addEventListener("click", async (event) => {
  if (!event.target.matches("button")) {
    return;
  }
 
  if (event.target.id === "signout-button") {
    try {
      await accountService.logout();
      window.location.replace("/login");
    } catch (error) {
      alert(error);
    }
  } else if (event.target.id === "home-button") {
    if (window.location.pathname === '/') {return;}

    window.location.replace('/');

  } else if (event.target.id === "create-post-button") {
    if (window.location.pathname === '/create-post') {return;}

    window.location.replace('/create-post');
  } else if (event.target.id === "settings-button") {
    if (window.location.pathname === '/settings') {return;}

    window.location.replace('/settings');
  } else if (event.target.id === 'like-button') {
    const postId = event.target.getAttribute('post-id');
    const likeCountElement = document.querySelector(`[post-id="${postId}"]#likes-span`);

    const iconTrue = event.target.querySelector('#like-true');
    const iconFalse = event.target.querySelector('#like-false');

    if (iconTrue.classList.contains('d-none')) { // Like
      await postService.like(postId);
      iconTrue.classList.remove('d-none');
      iconFalse.classList.add('d-none');
      likeCountElement.textContent = (parseInt(likeCountElement.textContent) + 1).toString();
    } else { // Remove like
      await postService.dislike(postId);
      iconTrue.classList.add('d-none');
      iconFalse.classList.remove('d-none');
      likeCountElement.textContent = (parseInt(likeCountElement.textContent) - 1).toString();
    }
  }
});

document.addEventListener("submit", async (event) => {
  if (!event.target.matches("form")) {
    return;
  }

  event.preventDefault();
  const submitButton = event.target.querySelector('button[type="submit"]');
  buttonLoadingOn(submitButton);
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
    if (!isFormValid) {buttonLoadingOff(submitButton);return;}

    try {
      await accountService.login(emailInput.value, passwordInput.value);
      window.location.replace("/");
      buttonLoadingOff(submitButton);
    } catch(error) {
      alert(error);
      buttonLoadingOff(submitButton);
    }
  } else if (event.target.id === "register-form") {
    checkRequired([usernameInput, emailInput, passwordInput, password2Input]);
    checkLength(usernameInput, 3, 15);
    checkEmail(emailInput);
    checkPassword(passwordInput);
    checkPassword(password2Input);
    checkPasswordsMatch(passwordInput, password2Input);
    if (!isFormValid) {buttonLoadingOff(submitButton);return;}

    try {
      await accountService.register({
        'username': usernameInput.value,
        'email': emailInput.value,
        'password': passwordInput.value,
        'confirmpassword': password2Input.value
      });

      localStorage.setItem("verification-sent", "true");
      window.location.replace("/verification-sent");
      buttonLoadingOff(submitButton);
    } catch(error) {
      alert(error);
      buttonLoadingOff(submitButton);
    }
  } else if (event.target.id === "forgot-password-form") {
    checkRequired([emailInput]);
    checkEmail(emailInput);
    if (!isFormValid) {buttonLoadingOff(submitButton);return;}

    try {
      await accountService.forgotPassword(emailInput.value);
      localStorage.setItem("reset-password-sent", "true");
      alert("Email instructions sent successfully!");
      buttonLoadingOff(submitButton);
    } catch(error) {
      alert(error);
      buttonLoadingOff(submitButton);
    }
  } else if (event.target.id === "reset-password-form") {
    checkRequired([passwordInput, password2Input]);
    checkPassword(passwordInput);
    checkPassword(password2Input);
    checkPasswordsMatch(passwordInput, password2Input);
    if (!isFormValid) {buttonLoadingOff(submitButton);return;}

    try {
      const resetToken = localStorage.getItem("reset-token");
      await accountService.resetPassword({
        token: resetToken,
        password: passwordInput.value,
        confirmPassword: password2Input.value
      });
      localStorage.removeItem("reset-password-sent");
      localStorage.removeItem("reset-token");
      alert("Password reseted successfully, now you can LogIn!");
      window.location.replace("/login");
      buttonLoadingOff(submitButton);
    } catch(error) {
      alert(error);
      buttonLoadingOff(submitButton);
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
    footerLink: '',
    navbarLink: 'navbar.html'
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
  },
  '/forgot-password': {
    name: '/forgot-password',
    title: 'Camagru | Forgot',
    headerLink: 'register.html',
    mainLink: 'forgot-password.html',
    footerLink: ''
  },
  '/reset-password': {
    name: '/reset-password',
    title: 'Camagru | Reset',
    headerLink: '',
    mainLink: 'reset-password.html',
    footerLink: ''
  },
  '/create-post': {
    name: '/create-post',
    title: 'Camagru | New Post',
    headerLink: 'home.html',
    mainLink: 'create-post.html',
    footerLink: ''
  },
  '/settings': {
    name: '/settings',
    title: 'Camagru | Settings',
    headerLink: 'home.html',
    mainLink: 'settings.html',
    footerLink: ''
  }
}

const afterPageLoad = async (location) => {
  //HEADER
  if (location === '/') {

  } else if (location === '/create-post') {

  } else if (location === '/settings') {

  }
  //FOOTER

  //MAINS
  if (location === '/verify-email') {
    const token = localStorage.getItem("verification-token");

    try {
      alert(token);
      await accountService.verifyEmail(token);
      localStorage.removeItem("verification-token");
      localStorage.removeItem("verification-sent");
      const header = document.getElementById("verify-header");
      header.textContent = "Email verified successfully, you can login now!";

    } catch (error) {
      window.location.replace("/403");
    }
  }

  if (location === '/' || location === '/visitor') {
    const container = document.getElementById('main-posts');
    await loadPosts(container, null, true);

  }
}

const urlRoute = (event) => {
  event.preventDefault();
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
  } else if (route.name === '/forgot-password') {
    route = currUser ? urlRoutes["/"] : urlRoutes["/forgot-password"];
  } else if (route.name === '/create-post') {
    route = currUser ? urlRoutes["/create-post"] : urlRoutes["/visitor"];
  } else if (route.name === '/settings') {
    route = currUser ? urlRoutes["/settings"] : urlRoutes["/visitor"];
  } else if (route.name === '/verification-sent') {
    const isVerificationSent = localStorage.getItem("verification-sent");
    route = isVerificationSent === "true" ? urlRoutes["/verification-sent"] : urlRoutes["/visitor"];
  } else if (route.name === '/verify-email') {
    const isVerificationSent = localStorage.getItem("verification-sent");
    if (isVerificationSent) {
      const url = new URL(window.location.href);
      const token = url.searchParams.get("token");
      localStorage.setItem("verification-token", token);
      route = urlRoutes["/verify-email"];
    } else {
      route = urlRoutes["/403"];
    }
  } else if (route.name === '/reset-password') {
    const isResetSent = localStorage.getItem("reset-password-sent");
    if (isResetSent) {
      const url = new URL(window.location.href);
      const token = url.searchParams.get("token");
      localStorage.setItem("reset-token", token);
      route = urlRoutes["/reset-password"];
    } else {
      route = urlRoutes["/403"];
    }
  }

  return route;
}

window.onpopstate = urlLocationHandler;
window.addEventListener("popstate", urlRoute);

urlLocationHandler();