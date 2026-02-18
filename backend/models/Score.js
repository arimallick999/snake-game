// ==================== SCORE MODEL ====================
// This defines the structure of game score data in MongoDB

const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true // Index for faster queries
    },
    username: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: [true, 'Score is required'],
        min: [0, 'Score cannot be negative']
    },
    gameDate: {
        type: Date,
        default: Date.now,
        index: true // Index for sorting by date
    }
});

// ==================== INDEXES ====================
// Compound index for efficient leaderboard queries
scoreSchema.index({ score: -1, gameDate: -1 });

// Index for user-specific score queries
scoreSchema.index({ userId: 1, gameDate: -1 });

// ==================== STATIC METHODS ====================

// Get global leaderboard (top scores)
scoreSchema.statics.getLeaderboard = async function(limit = 10) {
    try {
        return await this.find()
            .sort({ score: -1, gameDate: -1 })
            .limit(limit)
            .populate('userId', 'username')
            .select('username score gameDate');
    } catch (error) {
        throw new Error('Failed to fetch leaderboard');
    }
};

// Get user's score history
scoreSchema.statics.getUserScores = async function(userId, limit = 10) {
    try {
        return await this.find({ userId })
            .sort({ gameDate: -1 })
            .limit(limit)
            .select('score gameDate');
    } catch (error) {
        throw new Error('Failed to fetch user scores');
    }
};

// Get user's highest score
scoreSchema.statics.getUserHighScore = async function(userId) {
    try {
        const result = await this.findOne({ userId })
            .sort({ score: -1 })
            .select('score');

        return result ? result.score : 0;
    } catch (error) {
        throw new Error('Failed to fetch high score');
    }
};

// ==================== INSTANCE METHODS ====================

// Format score data for API response
scoreSchema.methods.toJSON = function() {
    const score = this.toObject();
    delete score.__v;
    return score;
};

module.exports = mongoose.model('Score', scoreSchema);
