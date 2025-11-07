// Configuration - Update this URL with your backend endpoint
const BACKEND_URL = 'http://localhost:3000/api/login'; // Change this to your actual backend URL

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.querySelector('.login');

    // Handle form submission
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission

        // Get form data
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Basic validation
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        // Disable button and show loading state
        loginButton.disabled = true;
        loginButton.textContent = 'Logging in...';

        try {
            // Prepare data to send
            const loginData = {
                email: email,
                password: password,
                timestamp: new Date().toISOString()
            };

            console.log('Sending login request...', loginData);

            // Send POST request to backend
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            // Parse response
            const data = await response.json();

            if (response.ok) {
                // Success
                console.log('Login successful:', data);
                alert('Login successful!');
                
                // Optional: Store token or redirect
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                }
                
                // Optional: Redirect to dashboard
                // window.location.href = '/dashboard.html';
            } else {
                // Handle error response
                console.error('Login failed:', data);
                alert(data.message || 'Login failed. Please try again.');
            }

        } catch (error) {
            // Handle network or other errors
            console.error('Error during login:', error);
            alert('An error occurred. Please check your connection and try again.');
        } finally {
            // Re-enable button
            loginButton.disabled = false;
            loginButton.textContent = 'Log In';
        }
    });

    // Optional: Add input validation feedback
    emailInput.addEventListener('input', function() {
        if (this.value.trim()) {
            this.style.borderColor = '';
        }
    });

    passwordInput.addEventListener('input', function() {
        if (this.value.trim()) {
            this.style.borderColor = '';
        }
    });
});
