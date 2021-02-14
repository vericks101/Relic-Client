

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
                            <label style="float: left;" for="validationCustom01">Username</label>
                            <input type="text" class="form-control" id="validationCustom01" pattern="^[a-zA-Z0-9]+$" placeholder="Username" value="" required>
                            <div style="float: left;" class="invalid-feedback">  
                                Please provide a valid Username.
                            </div>
                        </span>
                        <br>
                        <span class="col-md-4 mb-3">
                            <label style="float: left;" for="validationCustom02">Password</label>
                            <input type="password" class="form-control" id="validationCustom02" pattern="^[a-zA-Z0-9]+$" placeholder="Password" value="" required>
                            <div style="float: left;" class="invalid-feedback">  
                                Please provide a valid Password.
                            </div>
                        </span>
                    </div>
                    <br>
                    <button style="float: left; margin-right: 10px;" class="btn btn-outline-light" type="submit">Login</button>
                    <button style="float: left;" type="button" class="btn btn-outline-light" data-bs-dismiss="modal">Cancel</button>
                </form>
                <script>
                    (function() {
                        'use strict';
                        window.addEventListener('load', function() {
                            // Fetch all the forms we want to apply custom Bootstrap validation styles to
                            var forms = document.getElementsByClassName('needs-validation');
                            // Loop over them and prevent submission
                            var validation = Array.prototype.filter.call(forms, function(form) {
                                form.addEventListener('submit', function(event) {
                                    if (form.checkValidity() === false) {
                                        event.preventDefault();
                                        event.stopPropagation();
                                    }
                                    form.classList.add('was-validated');
                                }, false);
                            });
                        }, false);
                    })();
                </script>
                </div>
                <div class="modal-footer">
                    <p>Don't have an Ekodex Account?</p>
                    <a class="btn btn-outline-light" href="https://ekodex.netlify.app/" target="_blank" rel="noopener noreferrer" role="button">Create a New Account...</a>
                </div>
            </div>
        </div>
    </div>
`); 