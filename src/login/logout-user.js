function logoutUser() {
    var loggedInText = document.getElementById('logged-in-text');
    var loggedInUsername = document.getElementById('logged-in-username');
    var loginButton = document.getElementById('login-button');
    var logoutButton = document.getElementById('logout-button');
    loggedInText.hidden = true;
    loggedInUsername.innerText = '';
    loggedInUsername.hidden = true;
    loginButton.hidden = false;
    logoutButton.hidden = true;
}