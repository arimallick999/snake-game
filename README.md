# 🐍 Snake Game - Full Stack Web Application

A modern, full-stack implementation of the classic Snake game with user authentication and a global leaderboard. Built from scratch to demonstrate the complete lifecycle of a web application from development to deployment.

![Snake Game](https://img.shields.io/badge/Game-Snake-green)
![Node.js](https://img.shields.io/badge/Node.js-v20+-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🎮 Features

- **Classic Snake Gameplay**: Smooth controls with arrow keys or WASD
- **User Authentication**: Secure registration and login with JWT tokens
- **Global Leaderboard**: Compete with players worldwide
- **Score Tracking**: View your personal score history
- **Responsive Design**: Play on desktop, tablet, or mobile
- **Real-time Updates**: Automatic leaderboard refresh
- **High Score Persistence**: Your records are saved forever

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic markup and Canvas API for game rendering
- **CSS3**: Modern styling with animations and responsive design
- **Vanilla JavaScript**: No frameworks - pure ES6+ JavaScript

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Fast, minimalist web framework
- **MongoDB**: NoSQL database via MongoDB Atlas
- **Mongoose**: Elegant MongoDB object modeling
- **JWT**: Secure authentication tokens
- **bcryptjs**: Password hashing

### Security
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Server-side validation
- **CORS Configuration**: Secure cross-origin requests
- **Security Headers**: XSS protection, content type options

## 📁 Project Structure

```
snake-game/
├── frontend/
│   ├── index.html           # Landing page with login/register
│   ├── game.html            # Game page with canvas
│   ├── css/
│   │   └── styles.css       # All styling
│   └── js/
│       ├── game.js          # Snake game logic
│       ├── auth.js          # Authentication handling
│       ├── leaderboard.js   # Leaderboard display
│       └── api.js           # API communication helper
├── backend/
│   ├── server.js            # Express server entry point
│   ├── config/
│   │   └── db.js            # MongoDB connection
│   ├── models/
│   │   ├── User.js          # User schema
│   │   └── Score.js         # Score schema
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   └── game.js          # Game routes
│   ├── middleware/
│   │   └── auth.js          # JWT verification middleware
│   ├── .env                 # Environment variables
│   ├── .env.example         # Environment template
│   └── package.json         # Dependencies
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher): [Download here](https://nodejs.org/)
- **MongoDB Atlas Account**: [Sign up here](https://www.mongodb.com/cloud/atlas/register) (free tier)
- **Git** (optional): For version control

### Installation

1. **Clone or download this repository**

2. **Set up MongoDB Atlas**:
   - Create a free MongoDB Atlas account
   - Create a new cluster (M0 free tier)
   - Set up database access (create username and password)
   - Set up network access (allow access from anywhere for development)
   - Get your connection string

3. **Configure Backend**:
   ```bash
   cd backend
   npm install
   ```

4. **Set up environment variables**:
   - Copy `.env.example` to `.env`
   - Update the following variables:
     ```env
     PORT=3001
     NODE_ENV=development
     MONGODB_URI=your_mongodb_connection_string_here
     JWT_SECRET=your_secure_random_string_here
     JWT_EXPIRE=7d
     FRONTEND_URL=http://localhost:3000
     ```

5. **Start the backend server**:
   ```bash
   npm start
   ```

   You should see:
   ```
   ╔════════════════════════════════════════╗
   ║   🐍 Snake Game API Server Started   ║
   ╠════════════════════════════════════════╣
   ║   Port: 3001
   ║   Environment: development
   ║   Database: MongoDB
   ╚════════════════════════════════════════╝

   ✅ MongoDB Connected
   ```

6. **Open the frontend**:
   - Simply open `frontend/index.html` in your web browser
   - Or use a local server like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for VS Code

## 🎯 How to Play

1. **Register**: Create a new account with username, email, and password
2. **Login**: Sign in with your credentials
3. **Play**:
   - Use arrow keys or WASD to control the snake
   - Eat the red food to grow and score points
   - Avoid hitting walls or your own tail
4. **Compete**: Check the leaderboard to see how you rank globally
5. **Track Progress**: View your personal score history

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Game
- `POST /api/game/score` - Save game score (requires auth)
- `GET /api/game/leaderboard` - Get global leaderboard
- `GET /api/game/user-scores` - Get user's score history (requires auth)
- `GET /api/game/high-score` - Get user's high score (requires auth)
- `GET /api/game/stats` - Get user statistics (requires auth)

## 🧪 Testing the API

You can test the API using curl or Postman:

```bash
# Register a new user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"player1","email":"player1@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"player1@example.com","password":"password123"}'

# Get leaderboard
curl http://localhost:3001/api/game/leaderboard

# Save score (replace TOKEN with your JWT)
curl -X POST http://localhost:3001/api/game/score \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"score":42}'
```

## 🚢 Deployment

### Backend Deployment (Render)

1. Push your code to GitHub
2. Sign up for [Render](https://render.com/)
3. Create a new Web Service
4. Connect your GitHub repository
5. Configure:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
6. Add environment variables in Render dashboard
7. Deploy!

### Frontend Deployment (Vercel/Netlify)

1. Update `frontend/js/api.js` with your deployed backend URL
2. Sign up for [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/)
3. Connect your GitHub repository
4. Configure:
   - Root directory: `frontend`
5. Deploy!

## 📚 Learning Resources

This project demonstrates:

- **Frontend Development**: HTML structure, CSS styling, JavaScript game logic
- **Backend Development**: REST API design, authentication, database operations
- **Full-Stack Integration**: HTTP requests, JSON data, API communication
- **Database Design**: MongoDB schemas, indexes, queries
- **Security**: Password hashing, JWT tokens, input validation
- **Deployment**: Cloud hosting, environment variables, production configuration

## 🐛 Troubleshooting

### Backend won't start
- Check that MongoDB connection string is correct
- Ensure all environment variables are set
- Verify Node.js version (v16+)

### Can't connect to backend
- Make sure backend server is running
- Check that API_BASE_URL in `frontend/js/api.js` matches your backend URL
- Verify CORS settings in backend

### Game doesn't load
- Open browser console (F12) to check for errors
- Ensure backend is running and accessible
- Check that you're logged in (valid JWT token)

### Port 5000 already in use
- This is common on macOS (AirPlay uses port 5000)
- Change PORT in `.env` to another value (e.g., 3001, 8000)

## 🤝 Contributing

This is an educational project. Feel free to:
- Fork the repository
- Add new features (power-ups, multiplayer, etc.)
- Improve the UI/UX
- Optimize performance
- Fix bugs

## 📝 License

MIT License - feel free to use this project for learning and portfolio purposes.

## 🎓 What's Next?

To extend this project, you could add:

- **Power-ups**: Special food items with different effects
- **Difficulty levels**: Increase speed as score grows
- **Achievements**: Unlock badges for milestones
- **Multiplayer**: Real-time competitive mode
- **Mobile controls**: Touch/swipe gestures
- **Sound effects**: Audio feedback for actions
- **Themes**: Different color schemes
- **Social features**: Friend challenges, share scores
- **Analytics**: Track gameplay statistics
- **Admin dashboard**: Manage users and moderate content

## 👤 Author

Built as a comprehensive full-stack learning project demonstrating modern web development practices.

## 🙏 Acknowledgments

- Classic Snake game for inspiration
- MongoDB Atlas for free database hosting
- Express.js community for excellent documentation
- All the open-source projects that made this possible

---

**Happy Coding! 🐍✨**

Made with Claude Code by Anthropic
