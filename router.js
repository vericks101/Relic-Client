const routes = {
    '/home' : home,
    '/about' : about
};

const rootDiv = document.getElementById('router-content');
rootDiv.innerHTML = routes['/home'];

const onNavigate = (pathname) => {
    window.history.pushState(
        {},
        pathname,
        window.location.origin + pathname
    )
    rootDiv.innerHTML = routes[pathname]
}
  
window.onpopstate = () => {
    rootDiv.innerHTML = routes[window.location.pathname]
}