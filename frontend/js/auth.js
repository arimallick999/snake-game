// ==================== AUTHENTICATION HANDLING ====================
// This file handles user login and registration
// Full implementation will be completed in Phase 3

document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = 'game.html';
        return;
    }

    // Get form elements
    const loginBox = document.getElementById('loginBox');
    const registerBox = document.getElementById('registerBox');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');

    // Toggle between login and register forms
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginBox.classList.add('hidden');
        registerBox.classList.remove('hidden');
        clearErrors();
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerBox.classList.add('hidden');
        loginBox.classList.remove('hidden');
        clearErrors();
    });

    // Handle login form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Clear previous errors
        showError('loginError', '');

        try {
            // Call the API
            const response = await loginUser(email, password);

            if (response.success) {
                // Store token and user info
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', response.data.user.username);
                localStorage.setItem('userId', response.data.user.id);

                // Redirect to game
                window.location.href = 'game.html';
            } else {
                showError('loginError', response.message || 'Login failed');
            }

        } catch (error) {
            showError('loginError', error.message || 'Login failed. Please try again.');
        }
    });

    // Handle register form submission
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        // Clear previous errors
        showError('registerError', '');

        // Validate passwords match
        if (password !== confirmPassword) {
            showError('registerError', 'Passwords do not match!');
            return;
        }

        try {
            // Call the API
            const response = await registerUser(username, email, password);

            if (response.success) {
                // Store token and user info
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', response.data.user.username);
                localStorage.setItem('userId', response.data.user.id);

                // Redirect to game
                window.location.href = 'game.html';
            } else {
                showError('registerError', response.message || 'Registration failed');
            }

        } catch (error) {
            showError('registerError', error.message || 'Registration failed. Please try again.');
        }
    });
});

// ==================== HELPER FUNCTIONS ====================
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
}

function clearErrors() {
    document.getElementById('loginError').textContent = '';
    document.getElementById('registerError').textContent = '';
}
