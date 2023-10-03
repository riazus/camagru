import { accountService } from "./_services/account.js";

const urlRoutes = {
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
    headerLink: '',
    mainLink: 'home.html',
    footerLink: ''
  },
}

const afterPageLoad = async (location) => {
  //HEADER

  //FOOTER

  //MAINS

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
    console.log("ON NOT POPSTATE"+location);
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

  console.log(pathname);
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
    console.log("push state " + location);
    window.history.pushState({}, "", location);
  }
}

const changeRoute = async (route) => {
  //accountService.refreshToken();
  //currUser = JSON.parse(localStorage.getItem('currentUser'));
  const currUser = undefined;

  if (route.name === '/' || route.name === 'visitor') {
    route = currUser ? urlRoutes["/"] : urlRoutes["/visitor"];
  } else if (route.name === '/login') {
    route = currUser ? urlRoutes["/"] : urlRoutes["/login"];
  } else if (route.name === '/register') {
    route = currUser ? urlRoutes["/"] : urlRoutes["/register"];
  }

  return route;
}

window.onpopstate = urlLocationHandler;
window.addEventListener("popstate", urlRoute);

urlLocationHandler();