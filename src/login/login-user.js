// Updates the login modal and application UI based on the attempt to
// login the user.
function loginUser() {
    var loggedInText = document.getElementById('logged-in-text');
    var loggedInUsername = document.getElementById('logged-in-username');
    var loginButton = document.getElementById('login-button');
    var logoutButton = document.getElementById('logout-button');
    loggedInText.hidden = false;
    loggedInUsername.innerText = document.getElementById('usernameField').value;
    loggedInUsername.hidden = false;
    loginButton.hidden = true;
    logoutButton.hidden = false;

    var loginModalElement = document.getElementById('login-modal');
    var loginModal = bootstrap.Modal.getInstance(loginModalElement);
    loginModal.hide();

    document.getElementById('usernameField').value = '';
    document.getElementById('passwordField').value = '';
}

document.write(`
    <div class="modal fade" id="login-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div style="max-width: 558px;" class="modal-dialog modal-dialog-centered">
            <div style="background-color: #191919f2; color: white;" class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">Login</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                <form class="needs-validation" novalidate>
                    <div class="form-row">
                        <span class="col-md-4 mb-3">
                            <label style="float: left;" for="usernameField">Username</label>
                            <input type="text" class="form-control" id="usernameField" pattern="^[a-zA-Z0-9]+$" placeholder="Username" value="" required>
                            <div style="float: left;" class="invalid-feedback">  
                                Please provide a valid Username.
                            </div>
                        </span>
                        <br>
                        <span class="col-md-4 mb-3">
                            <label style="float: left;" for="passwordField">Password</label>
                            <input type="password" class="form-control" id="passwordField" pattern="^[a-zA-Z0-9]+$" placeholder="Password" value="" required>
                            <div style="float: left;" class="invalid-feedback">  
                                Please provide a valid Password.
                            </div>
                        </span>
                        <div style="float: left; margin-top: 5px;">
                            <div id="loading-icon" class="spinner-border" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                            <span id="login-response" style="color: #dc3545;"></span>
                        </div>
                        <br>
                    </div>
                    <br>
                    <button style="float: left; margin-right: 10px;" class="btn btn-outline-light" type="submit">Login</button>
                    <button style="float: left;" type="button" class="btn btn-outline-light" data-bs-dismiss="modal">Cancel</button>
                </form>
                <script>
                    (function() {
                        'use strict';
                        window.addEventListener('load', function() {
                            var forms = document.getElementsByClassName('needs-validation');
                            var loadingIcon = document.getElementById('loading-icon');
                            var loginResponse = document.getElementById('login-response');
                            loadingIcon.hidden = true;
                            loginResponse.hidden = true;
                            var validation = Array.prototype.filter.call(forms, function(form) {
                                form.addEventListener('submit', function(event) {
                                    if (form.checkValidity() === false) {
                                        event.preventDefault();
                                        event.stopPropagation();
                                    } else {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        
                                        loadingIcon.hidden = false;
                                        loginResponse.hidden = true;
                                        fetch('https://relic-server.herokuapp.com/api/user/login', 
                                        {
                                            method: 'POST',
                                            headers: {
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({
                                                username: document.getElementById('usernameField').value, 
                                                password: document.getElementById('passwordField').value
                                            })
                                        }).then(response =>
                                            response.json().then(data => ({ 
                                                data: data, 
                                                status: response.status 
                                            })
                                        ).then(response => {
                                            return response;
                                        }).then(function(response) {
                                            if (response.status === 200) {
                                                console.log("Login was Successful! ");
                                                loadingIcon.hidden = true;
                                                loginUser();
                                            }
                                        }).catch(function(error) {
                                            console.log(error);
                                            console.log("Login was not Successful.");
                                            loadingIcon.hidden = true;
                                            loginResponse.innerText = "Invalid credentials or there was an issue logging in...";
                                            loginResponse.hidden = false;
                                        }))
                                    }
                                    form.classList.add('was-validated');
                                }, false);
                            });
                        }, false);
                    })();
                </script>
                </div>
                <div class="modal-footer">
                    <p>Don't have an relic Account?</p>
                    <a class="btn btn-outline-light" href="https://relic.netlify.app/" target="_blank" rel="noopener noreferrer" role="button">Create a New Account...</a>
                </div>
            </div>
        </div>
    </div>
`); 