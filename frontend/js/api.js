// ==================== API COMMUNICATION HELPER ====================
// This file provides helper functions for making API requests
// Full implementation will be completed in Phase 3

// API Base URL - Update this when deploying to production
const API_BASE_URL = 'http://localhost:3001/api';

// ==================== HELPER FUNCTIONS ====================

/**
 * Make an authenticated API request
 */
async function fetchAPI(endpoint, options = {}) {
    const token = localStorage.getItem('token');

    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    };

    // Add authorization header if token exists
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ==================== AUTHENTICATION API ====================

/**
 * Register a new user
 */
async function registerUser(username, email, password) {
    return fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password })
    });
}

/**
 * Login a user
 */
async function loginUser(email, password) {
    return fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
}

// ==================== GAME API ====================

/**
 * Save a game score
 */
async function saveScore(score) {
    return fetchAPI('/game/score', {
        method: 'POST',
        body: JSON.stringify({ score })
    });
}

/**
 * Get global leaderboard
 */
async function getLeaderboard(limit = 10) {
    return fetchAPI(`/game/leaderboard?limit=${limit}`);
}

/**
 * Get user's score history
 */
async function getUserScores() {
    return fetchAPI('/game/user-scores');
}

// ==================== ERROR HANDLING ====================

/**
 * Handle API errors and provide user-friendly messages
 */
function handleAPIError(error) {
    if (error.message.includes('token')) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = 'index.html';
        return 'Session expired. Please login again.';
    }

    return error.message || 'An error occurred. Please try again.';
}
