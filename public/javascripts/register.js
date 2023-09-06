 
 window.onload=function(){
    document.addEventListener('DOMContentLoaded', function () {
        const form = document.getElementById('registration-form');
        const nameInput = document.getElementById('name');
        const passwordInput = document.getElementById('password');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const nameError = document.getElementById('name-error');
        const passwordError = document.getElementById('password-error');
        const emailError = document.getElementById('email-error');
        const phoneError = document.getElementById('phone-error');
        const successMessage = document.getElementById('success-message');

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            // Reset previous error messages
            nameError.textContent = '';
            passwordError.textContent = '';
            emailError.textContent = '';
            phoneError.textContent = '';
            successMessage.textContent = '';

            const nameValue = nameInput.value.trim();
            const passwordValue = passwordInput.value.trim();
            const emailValue = emailInput.value.trim();
            const phoneValue = phoneInput.value.trim();

            // Validation for name (max 32 characters)
            if (nameValue === '') {
                nameError.textContent = 'Name is required';
            } else if (nameValue.length > 32) {
                nameError.textContent = 'Name must be 32 characters or less';
            }

            // Validation for password (max 32 characters)
            if (passwordValue === '') {
                passwordError.textContent = 'Password is required';
            } else if (passwordValue.length > 32) {
                passwordError.textContent = 'Password must be 32 characters or less';
            }

            // Validation for email (max 36 characters)
            if (emailValue === '') {
                emailError.textContent = 'Email is required';
            } else if (emailValue.length > 36) {
                emailError.textContent = 'Email must be 36 characters or less';
            }

            // Validation for phone (optional)
            if (phoneValue.length > 0 && !isValidPhone(phoneValue)) {
                phoneError.textContent = 'Enter a valid phone number';
            }

            // If all fields are valid, you can proceed with the POST request
            if (!nameError.textContent && !passwordError.textContent && !emailError.textContent && !phoneError.textContent) {
                // Perform the POST request here
                // You can use the `fetch` API or another library to send the data to the server
                // Once the request is successful, display the success message
                successMessage.textContent = 'Registration successful!';
            }
        });

        // Function to validate phone number (simple check for digits)
        function isValidPhone(phone) {
            const phoneRegex = /^\d+$/;
            return phoneRegex.test(phone);
        }
    });
 
 }