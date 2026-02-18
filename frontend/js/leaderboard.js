// ==================== LEADERBOARD MANAGEMENT ====================
// This file handles fetching and displaying the leaderboard
// Full implementation will be completed in Phase 3

document.addEventListener('DOMContentLoaded', () => {
    // Load leaderboard data
    loadLeaderboard();

    // Load user's recent scores
    loadUserScores();

    // Set up refresh button
    document.getElementById('refreshLeaderboard').addEventListener('click', () => {
        loadLeaderboard();
        loadUserScores();
    });

    // Auto-refresh every 30 seconds
    setInterval(() => {
        loadLeaderboard();
        loadUserScores();
    }, 30000);
});

// ==================== LOAD LEADERBOARD ====================
async function loadLeaderboard() {
    const container = document.getElementById('leaderboardContainer');

    try {
        container.innerHTML = '<div class="loading">Loading leaderboard...</div>';

        // Fetch from backend API
        const response = await getLeaderboard(10);

        if (response.success) {
            displayLeaderboard(response.data.leaderboard);
        } else {
            container.innerHTML = '<div class="error-message">Failed to load leaderboard</div>';
        }
    } catch (error) {
        console.error('Leaderboard error:', error);
        container.innerHTML = '<div class="error-message">Failed to load leaderboard</div>';
    }
}

function displayLeaderboard(data) {
    const container = document.getElementById('leaderboardContainer');
    const currentUsername = localStorage.getItem('username');

    if (data.length === 0) {
        container.innerHTML = '<p class="loading">No scores yet. Be the first!</p>';
        return;
    }

    const list = document.createElement('ul');
    list.className = 'leaderboard-list';

    data.forEach((entry, index) => {
        const item = document.createElement('li');
        item.className = 'leaderboard-item';

        // Highlight current user
        if (entry.username === currentUsername) {
            item.classList.add('current-user');
        }

        // Rank with medals
        const rank = document.createElement('span');
        rank.className = 'leaderboard-rank';
        if (index === 0) rank.classList.add('gold');
        if (index === 1) rank.classList.add('silver');
        if (index === 2) rank.classList.add('bronze');
        rank.textContent = `#${entry.rank}`;

        // Info
        const info = document.createElement('div');
        info.className = 'leaderboard-info';

        const name = document.createElement('span');
        name.className = 'leaderboard-name';
        name.textContent = entry.username;

        const date = document.createElement('span');
        date.className = 'leaderboard-date';
        date.textContent = formatDate(entry.date);

        info.appendChild(name);
        info.appendChild(date);

        // Score
        const score = document.createElement('span');
        score.className = 'leaderboard-score';
        score.textContent = entry.score;

        item.appendChild(rank);
        item.appendChild(info);
        item.appendChild(score);
        list.appendChild(item);
    });

    container.innerHTML = '';
    container.appendChild(list);
}

// ==================== LOAD USER SCORES ====================
async function loadUserScores() {
    const container = document.getElementById('userScoresContainer');

    try {
        container.innerHTML = '<div class="loading">Loading your scores...</div>';

        // Fetch from backend API
        const response = await getUserScores();

        if (response.success) {
            displayUserScores(response.data.scores);
        } else {
            container.innerHTML = '<div class="error-message">Failed to load your scores</div>';
        }
    } catch (error) {
        console.error('User scores error:', error);
        container.innerHTML = '<div class="error-message">Failed to load your scores</div>';
    }
}

function displayUserScores(scores) {
    const container = document.getElementById('userScoresContainer');

    if (scores.length === 0) {
        container.innerHTML = '<p class="loading">No scores yet. Start playing!</p>';
        return;
    }

    const list = document.createElement('div');

    scores.slice(0, 5).forEach(entry => {
        const item = document.createElement('div');
        item.className = 'score-item';

        const date = document.createElement('span');
        date.className = 'score-date';
        date.textContent = formatDate(entry.gameDate);

        const score = document.createElement('span');
        score.className = 'score-value';
        score.textContent = entry.score;

        item.appendChild(date);
        item.appendChild(score);
        list.appendChild(item);
    });

    container.innerHTML = '';
    container.appendChild(list);
}

// ==================== HELPER FUNCTIONS ====================
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString();
    }
}
