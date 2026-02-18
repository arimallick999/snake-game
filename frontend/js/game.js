// ==================== GAME CONFIGURATION ====================
const GRID_SIZE = 20; // Number of cells in each direction
const CELL_SIZE = 20; // Size of each cell in pixels
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE; // Total canvas size
const GAME_SPEED = 100; // Milliseconds between each frame (lower = faster)

// ==================== GAME STATE ====================
let canvas, ctx;
let snake = [];
let food = {};
let direction = { x: 1, y: 0 }; // Start moving right
let nextDirection = { x: 1, y: 0 };
let score = 0;
let highScore = 0;
let gameLoop = null;
let isGameRunning = false;
let isPaused = false;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    checkAuthentication();

    // Initialize canvas
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    // Load high score from localStorage
    loadHighScore();

    // Initialize game elements
    initGame();

    // Set up event listeners
    setupEventListeners();

    // Draw initial state
    draw();
});

// ==================== AUTHENTICATION CHECK ====================
function checkAuthentication() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (!token || !username) {
        // Not authenticated, redirect to login
        window.location.href = 'index.html';
        return;
    }

    // Display username
    document.getElementById('username').textContent = username;
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Start button
    document.getElementById('startBtn').addEventListener('click', startGame);

    // Pause button
    document.getElementById('pauseBtn').addEventListener('click', togglePause);

    // Restart button
    document.getElementById('restartBtn').addEventListener('click', restartGame);

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Keyboard controls
    document.addEventListener('keydown', handleKeyPress);
}

// ==================== GAME INITIALIZATION ====================
function initGame() {
    // Initialize snake in the middle of the canvas
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];

    // Reset direction
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };

    // Reset score
    score = 0;
    updateScore();

    // Generate first food
    generateFood();
}

// ==================== GAME LOOP ====================
function startGame() {
    if (isGameRunning) return;

    isGameRunning = true;
    isPaused = false;

    // Update UI
    document.getElementById('startBtn').classList.add('hidden');
    document.getElementById('pauseBtn').classList.remove('hidden');
    document.getElementById('gameOverlay').classList.add('hidden');

    // Start game loop
    gameLoop = setInterval(update, GAME_SPEED);
}

function update() {
    if (isPaused) return;

    // Update direction
    direction = { ...nextDirection };

    // Calculate new head position
    const head = { ...snake[0] };
    head.x += direction.x;
    head.y += direction.y;

    // Check for collisions
    if (checkCollision(head)) {
        gameOver();
        return;
    }

    // Add new head
    snake.unshift(head);

    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
        score++;
        updateScore();
        generateFood();

        // Update high score
        if (score > highScore) {
            highScore = score;
            saveHighScore();
            document.getElementById('highScore').textContent = highScore;
        }
    } else {
        // Remove tail if no food eaten
        snake.pop();
    }

    // Redraw
    draw();
}

function togglePause() {
    isPaused = !isPaused;
    const pauseBtn = document.getElementById('pauseBtn');
    pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
}

function gameOver() {
    // Stop game loop
    clearInterval(gameLoop);
    isGameRunning = false;

    // Update UI
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOverlay').classList.remove('hidden');
    document.getElementById('pauseBtn').classList.add('hidden');
    document.getElementById('startBtn').classList.remove('hidden');

    // Save score to backend (will be implemented in Phase 3)
    saveScoreToBackend();
}

function restartGame() {
    initGame();
    draw();
    startGame();
}

// ==================== COLLISION DETECTION ====================
function checkCollision(head) {
    // Check wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        return true;
    }

    // Check self collision
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            return true;
        }
    }

    return false;
}

// ==================== FOOD GENERATION ====================
function generateFood() {
    let newFood;
    let isValidPosition = false;

    while (!isValidPosition) {
        newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };

        // Check if food is not on snake
        isValidPosition = !snake.some(segment =>
            segment.x === newFood.x && segment.y === newFood.y
        );
    }

    food = newFood;
}

// ==================== RENDERING ====================
function draw() {
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid (optional, for better visibility)
    drawGrid();

    // Draw snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#4CAF50' : '#66BB6A'; // Head is darker
        ctx.fillRect(
            segment.x * CELL_SIZE,
            segment.y * CELL_SIZE,
            CELL_SIZE - 2,
            CELL_SIZE - 2
        );

        // Add eyes to head
        if (index === 0) {
            ctx.fillStyle = '#fff';
            const eyeSize = 3;
            const eyeOffset = 6;

            if (direction.x === 1) { // Moving right
                ctx.fillRect(segment.x * CELL_SIZE + eyeOffset + 6, segment.y * CELL_SIZE + 4, eyeSize, eyeSize);
                ctx.fillRect(segment.x * CELL_SIZE + eyeOffset + 6, segment.y * CELL_SIZE + 11, eyeSize, eyeSize);
            } else if (direction.x === -1) { // Moving left
                ctx.fillRect(segment.x * CELL_SIZE + eyeOffset - 2, segment.y * CELL_SIZE + 4, eyeSize, eyeSize);
                ctx.fillRect(segment.x * CELL_SIZE + eyeOffset - 2, segment.y * CELL_SIZE + 11, eyeSize, eyeSize);
            } else if (direction.y === 1) { // Moving down
                ctx.fillRect(segment.x * CELL_SIZE + 4, segment.y * CELL_SIZE + eyeOffset + 6, eyeSize, eyeSize);
                ctx.fillRect(segment.x * CELL_SIZE + 11, segment.y * CELL_SIZE + eyeOffset + 6, eyeSize, eyeSize);
            } else { // Moving up
                ctx.fillRect(segment.x * CELL_SIZE + 4, segment.y * CELL_SIZE + eyeOffset - 2, eyeSize, eyeSize);
                ctx.fillRect(segment.x * CELL_SIZE + 11, segment.y * CELL_SIZE + eyeOffset - 2, eyeSize, eyeSize);
            }
        }
    });

    // Draw food
    ctx.fillStyle = '#f44336';
    ctx.beginPath();
    ctx.arc(
        food.x * CELL_SIZE + CELL_SIZE / 2,
        food.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2 - 2,
        0,
        2 * Math.PI
    );
    ctx.fill();
}

function drawGrid() {
    ctx.strokeStyle = '#0f3460';
    ctx.lineWidth = 0.5;

    // Vertical lines
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
        ctx.stroke();
    }

    // Horizontal lines
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
        ctx.stroke();
    }
}

// ==================== INPUT HANDLING ====================
function handleKeyPress(event) {
    // Prevent default behavior for arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
    }

    // Don't change direction if game is not running
    if (!isGameRunning || isPaused) return;

    switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (direction.y === 0) { // Can't reverse
                nextDirection = { x: 0, y: -1 };
            }
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (direction.y === 0) {
                nextDirection = { x: 0, y: 1 };
            }
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (direction.x === 0) {
                nextDirection = { x: -1, y: 0 };
            }
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (direction.x === 0) {
                nextDirection = { x: 1, y: 0 };
            }
            break;
        case ' ':
            // Spacebar to pause/resume
            togglePause();
            break;
    }
}

// ==================== SCORE MANAGEMENT ====================
function updateScore() {
    document.getElementById('currentScore').textContent = score;
}

function loadHighScore() {
    const saved = localStorage.getItem('highScore');
    highScore = saved ? parseInt(saved) : 0;
    document.getElementById('highScore').textContent = highScore;
}

function saveHighScore() {
    localStorage.setItem('highScore', highScore.toString());
}

// ==================== BACKEND INTEGRATION ====================
async function saveScoreToBackend() {
    if (score === 0) {
        return; // Don't save zero scores
    }

    try {
        const response = await saveScore(score);

        if (response.success) {
            console.log('Score saved successfully!', response.data);

            // Refresh leaderboard after saving score
            if (typeof loadLeaderboard === 'function') {
                loadLeaderboard();
            }
            if (typeof loadUserScores === 'function') {
                loadUserScores();
            }
        }
    } catch (error) {
        console.error('Failed to save score:', error);
        // Don't show error to user, just log it
        // Game over screen is already showing
    }
}

function logout() {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    // Redirect to login
    window.location.href = 'index.html';
}
