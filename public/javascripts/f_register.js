 
 window.onload=function(){
        document.getElementById('registrationForm').addEventListener('submit', function(event) {
            // Prevent the default form submission
            event.preventDefault();
            //check is password the same?
            const passwordInput1 = document.getElementById('psw_1').value;
            const passwordInput2 = document.getElementById('psw_2').value;

            //

            if(passwordInput1 != passwordInput2) {
                alert("The password and confirm field must have the same value!");
                return;
            }

             // Validate value of a password
            const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{10,}$/;
            if (!passwordRegex.test(passwordInput1)) {
                alert('Password must be at least 10 characters long and contain both letters and digits.');
                return;
            }



            // Validate the checkbox
            const agreeCheckbox = document.getElementById('agree');
            if (!agreeCheckbox.checked) {
                alert('Please agree to the terms and conditions.');
                return;
            }

            // If validation passes, submit the form
            this.submit(); // This triggers the form submission
        });
 
 }