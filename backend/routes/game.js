// ==================== GAME ROUTES ====================
// Handles score submission and leaderboard

const express = require('express');
const Score = require('../models/Score');
const User = require('../models/User');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// ==================== SAVE SCORE ====================
// POST /api/game/score
// Protected route - requires authentication
router.post('/score', authenticateToken, async (req, res) => {
    try {
        const { score } = req.body;
        const userId = req.user._id;

        // Validate score
        if (score === undefined || score === null) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a score'
            });
        }

        if (typeof score !== 'number' || score < 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid score value'
            });
        }

        // Create score record
        const newScore = await Score.create({
            userId,
            username: req.user.username,
            score
        });

        // Update user's high score if necessary
        if (score > req.user.highScore) {
            await User.findByIdAndUpdate(userId, { highScore: score });
        }

        res.status(201).json({
            success: true,
            message: 'Score saved successfully',
            data: {
                score: newScore
            }
        });

    } catch (error) {
        console.error('Save score error:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join('. ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error saving score'
        });
    }
});

// ==================== GET LEADERBOARD ====================
// GET /api/game/leaderboard?limit=10
// Public route - anyone can view leaderboard
router.get('/leaderboard', optionalAuth, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        // Validate limit
        if (limit < 1 || limit > 100) {
            return res.status(400).json({
                success: false,
                message: 'Limit must be between 1 and 100'
            });
        }

        // Get top scores
        const leaderboard = await Score.getLeaderboard(limit);

        // Add rank to each entry
        const rankedLeaderboard = leaderboard.map((entry, index) => ({
            rank: index + 1,
            username: entry.username,
            score: entry.score,
            date: entry.gameDate,
            isCurrentUser: req.user ? entry.userId.toString() === req.user._id.toString() : false
        }));

        res.status(200).json({
            success: true,
            data: {
                leaderboard: rankedLeaderboard
            }
        });

    } catch (error) {
        console.error('Get leaderboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching leaderboard'
        });
    }
});

// ==================== GET USER'S SCORE HISTORY ====================
// GET /api/game/user-scores?limit=10
// Protected route - requires authentication
router.get('/user-scores', authenticateToken, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const userId = req.user._id;

        // Validate limit
        if (limit < 1 || limit > 100) {
            return res.status(400).json({
                success: false,
                message: 'Limit must be between 1 and 100'
            });
        }

        // Get user's scores
        const scores = await Score.getUserScores(userId, limit);

        res.status(200).json({
            success: true,
            data: {
                scores
            }
        });

    } catch (error) {
        console.error('Get user scores error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user scores'
        });
    }
});

// ==================== GET USER'S HIGH SCORE ====================
// GET /api/game/high-score
// Protected route - requires authentication
router.get('/high-score', authenticateToken, async (req, res) => {
    try {
        const userId = req.user._id;

        // Get user's highest score
        const highScore = await Score.getUserHighScore(userId);

        res.status(200).json({
            success: true,
            data: {
                highScore
            }
        });

    } catch (error) {
        console.error('Get high score error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching high score'
        });
    }
});

// ==================== GET USER STATISTICS ====================
// GET /api/game/stats
// Protected route - requires authentication
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const userId = req.user._id;

        // Get all user's scores
        const allScores = await Score.find({ userId }).select('score');

        // Calculate statistics
        const totalGames = allScores.length;
        const highScore = await Score.getUserHighScore(userId);

        let averageScore = 0;
        if (totalGames > 0) {
            const totalScore = allScores.reduce((sum, s) => sum + s.score, 0);
            averageScore = Math.round(totalScore / totalGames);
        }

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalGames,
                    highScore,
                    averageScore
                }
            }
        });

    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics'
        });
    }
});

module.exports = router;
