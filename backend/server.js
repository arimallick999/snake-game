// ==================== SNAKE GAME BACKEND SERVER ====================
// Main Express server file

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');

// ==================== INITIALIZE APP ====================
const app = express();
const PORT = process.env.PORT || 5000;

// ==================== CONNECT TO DATABASE ====================
connectDB();

// ==================== MIDDLEWARE ====================

// CORS - Allow frontend to communicate with backend
app.use(cors({
    origin: true, // Allow all origins for now
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser - Parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting - Prevent abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply rate limiting to all routes
app.use(limiter);

// Stricter rate limit for authentication routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // 5 requests per 15 minutes
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later.'
    }
});

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Request logging (development)
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// ==================== ROUTES ====================

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Snake Game API is running! 🐍',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            game: '/api/game'
        }
    });
});

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/game', gameRoutes);

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║   🐍 Snake Game API Server Started   ║
╠════════════════════════════════════════╣
║   Port: ${PORT}
║   Environment: ${process.env.NODE_ENV || 'development'}
║   Database: MongoDB
╚════════════════════════════════════════╝
    `);
});

// ==================== GRACEFUL SHUTDOWN ====================
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\nSIGINT received. Shutting down gracefully...');
    process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    process.exit(1);
});
