# 🚀 Deployment Guide

This guide will walk you through deploying your Snake Game to the internet so anyone can play it!

## 📋 Deployment Checklist

Before deploying, make sure you have:
- [x] MongoDB Atlas account with a cluster set up
- [x] GitHub account (for hosting code)
- [x] Backend working locally
- [x] Frontend working locally

## 🔧 Part 1: Deploy Backend to Render

### Step 1: Prepare Your Code

1. Make sure your code is in a GitHub repository:
   ```bash
   cd snake-game
   git init
   git add .
   git commit -m "Initial commit - Snake game with authentication"
   ```

2. Create a new repository on GitHub and push your code:
   ```bash
   git remote add origin YOUR_GITHUB_REPO_URL
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Render

1. Go to [render.com](https://render.com) and sign up/login

2. Click "New +" → "Web Service"

3. Connect your GitHub account and select your repository

4. Configure the service:
   - **Name**: snake-game-api (or any name you prefer)
   - **Environment**: Node
   - **Region**: Choose closest to you
   - **Branch**: main
   - **Root Directory**: backend
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add Environment Variables:
   Click "Advanced" and add these:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_from_env_file
   JWT_EXPIRE=7d
   NODE_ENV=production
   FRONTEND_URL=*
   ```

6. Click "Create Web Service"

7. Wait for deployment (5-10 minutes). You'll get a URL like:
   `https://snake-game-api.onrender.com`

8. Test your API:
   ```bash
   curl https://YOUR_RENDER_URL.onrender.com/
   ```

   You should see:
   ```json
   {
     "success": true,
     "message": "Snake Game API is running! 🐍"
   }
   ```

### Important Notes About Render Free Tier

- **Cold Start**: Free tier services spin down after 15 minutes of inactivity
- **First Request**: May take 30-60 seconds to wake up
- **Workaround**: Use a service like [UptimeRobot](https://uptimerobot.com/) to ping your API every 10 minutes

## 🌐 Part 2: Deploy Frontend to Vercel

### Step 1: Update API URL

1. Open `frontend/js/api.js`

2. Change the API URL to your Render URL:
   ```javascript
   const API_BASE_URL = 'https://YOUR_RENDER_URL.onrender.com/api';
   ```

3. Commit and push the change:
   ```bash
   git add frontend/js/api.js
   git commit -m "Update API URL for production"
   git push
   ```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login

2. Click "Add New..." → "Project"

3. Import your GitHub repository

4. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: frontend
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)

5. Click "Deploy"

6. Wait for deployment (1-2 minutes)

7. You'll get a URL like: `https://snake-game.vercel.app`

### Step 3: Update CORS

1. Go back to Render

2. Update the `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://YOUR_VERCEL_URL.vercel.app
   ```

3. Or for easier configuration during development, use:
   ```
   FRONTEND_URL=*
   ```
   (Note: Using `*` is fine for this project but not recommended for production apps)

## 🎯 Alternative: Deploy Frontend to Netlify

If you prefer Netlify over Vercel:

1. Go to [netlify.com](https://netlify.com) and sign up/login

2. Click "Add new site" → "Import an existing project"

3. Connect to GitHub and select your repository

4. Configure:
   - **Base directory**: frontend
   - **Build command**: (leave empty)
   - **Publish directory**: frontend

5. Click "Deploy site"

6. You'll get a URL like: `https://YOUR_SITE.netlify.app`

## 🔍 Testing Your Deployed Application

1. **Visit your frontend URL**

2. **Register a new account**:
   - Username: testuser
   - Email: test@example.com
   - Password: password123

3. **Play the game**:
   - Score some points
   - Let the game end

4. **Check the leaderboard**:
   - Your score should appear

5. **Test from another device**:
   - Open the URL on your phone
   - Login with the same account
   - Verify your scores are synced

## 🐛 Troubleshooting

### Backend Issues

**"Application failed to respond"**
- Check Render logs: Dashboard → Your Service → Logs
- Verify environment variables are set correctly
- Check MongoDB Atlas network access allows all IPs

**"Cannot connect to MongoDB"**
- Verify MONGODB_URI is correct
- Check MongoDB Atlas is running
- Ensure your cluster has network access configured

### Frontend Issues

**"Failed to fetch"**
- Check browser console (F12) for errors
- Verify API_BASE_URL is correct in `api.js`
- Test the backend URL directly in browser

**CORS errors**
- Update FRONTEND_URL in Render environment variables
- Redeploy backend after changing environment variables

### Slow First Load

- This is normal for Render free tier (cold start)
- Service spins down after 15 minutes of inactivity
- First request can take 30-60 seconds
- Subsequent requests are fast

## 💡 Pro Tips

1. **Custom Domain** (Optional):
   - Buy a domain from Namecheap, Google Domains, etc.
   - Configure in Vercel/Netlify settings
   - Update CORS settings accordingly

2. **Monitoring**:
   - Use Render's built-in logs for backend
   - Use browser dev tools for frontend
   - Consider adding analytics (Google Analytics, Plausible)

3. **Performance**:
   - Render free tier sleeps after inactivity
   - Consider upgrading for production apps
   - Use caching strategies

4. **Security**:
   - Never commit `.env` file to Git
   - Use strong JWT_SECRET (32+ characters)
   - Regularly update dependencies: `npm audit fix`

## 📱 Share Your Game!

Once deployed, share your game:
- Send the URL to friends
- Post on social media
- Add to your portfolio
- Include in your resume/CV

Example:
> "Check out my Snake Game! Built from scratch with Node.js, Express, MongoDB, and vanilla JavaScript. Features user authentication, real-time leaderboards, and responsive design. Play here: https://your-game.vercel.app"

## 🎓 What You've Learned

By deploying this application, you've learned:

- ✅ Git and GitHub for version control
- ✅ Environment variables and configuration
- ✅ Platform-as-a-Service (PaaS) deployment
- ✅ Backend hosting (Render)
- ✅ Frontend hosting (Vercel/Netlify)
- ✅ CORS configuration
- ✅ Production vs development environments
- ✅ Monitoring and debugging deployed applications
- ✅ Connecting frontend to deployed backend
- ✅ Managing secrets in production

## 🚀 Next Steps

Now that your app is deployed:

1. **Test thoroughly** on different devices and browsers
2. **Gather feedback** from users
3. **Iterate and improve** based on feedback
4. **Add new features** (see README.md for ideas)
5. **Monitor performance** and fix any issues
6. **Keep dependencies updated** for security

---

**Congratulations! Your Snake Game is now live on the internet! 🎉**

Made with Claude Code by Anthropic
