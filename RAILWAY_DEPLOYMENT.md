# 🚂 Railway Full-Stack Deployment Guide

Deploy both your frontend and backend together on Railway with automatic database setup!

## 🎯 What Railway Provides

✅ **Frontend + Backend hosting** (both in one deployment)  
✅ **Free PostgreSQL database** (automatically configured)  
✅ **Automatic HTTPS** with custom domains  
✅ **Environment variables management**  
✅ **GitHub integration** (auto-deploy on push)  
✅ **Build logs and monitoring**  

## 📋 Prerequisites

- [x] Code pushed to GitHub ✅
- [x] Railway configuration files created ✅
- [x] Environment variables documented ✅

## 🚀 Step-by-Step Deployment

### Step 1: Create Railway Account

1. Go to **[railway.app](https://railway.app)**
2. Click **"Login with GitHub"**
3. Authorize Railway to access your GitHub account

### Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository: **"XITEREDITz/xai"**
4. Railway will automatically detect it's a Node.js project

### Step 3: Add Database

1. In your project dashboard, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will create a database and set `DATABASE_URL` automatically

### Step 4: Configure Environment Variables

In your Railway dashboard, go to **Variables** tab and add:

```bash
# Core Settings
NODE_ENV=production
PORT=5000
SESSION_SECRET=your-super-secret-session-key-change-this

# AI API Keys (get these from your accounts)
ANTHROPIC_API_KEY=your-anthropic-api-key
OPENAI_API_KEY=your-openai-api-key  
GEMINI_API_KEY=your-gemini-api-key

# OAuth Settings (optional - set up later)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret

# PayPal Settings (optional - for payments)
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret

# Ad Settings (optional)
ADSTERRA_PUBLISHER_ID=your-adsterra-publisher-id
ADSTERRA_ZONE_ID=your-adsterra-zone-id
```

**Note**: `DATABASE_URL` is automatically set by Railway when you add PostgreSQL.

### Step 5: Deploy!

1. Railway will automatically start building your app
2. You can watch the build logs in real-time
3. Once complete, you'll get a live URL like: `https://your-app.up.railway.app`

### Step 6: Set Up Database Schema

After deployment, you need to initialize your database:

1. Go to **Railway Dashboard** → **PostgreSQL** → **Query**
2. Or connect using the database URL and run your schema migrations
3. Use your app's database setup scripts if you have them

## 🔧 Build Process Explained

Railway will automatically:
1. **Install dependencies**: `npm ci`
2. **Build frontend**: `vite build` (creates static files)
3. **Build backend**: `esbuild server/index.ts` (bundles Node.js app)
4. **Start server**: `npm start` (serves both frontend and API)

Your server will:
- Serve React app on `/` (all frontend routes)
- Handle API requests on `/api/*`
- Serve static files from `dist/public/`

## 🌐 Custom Domain (Optional)

1. In Railway dashboard, go to **Settings** → **Domains**
2. Click **"Custom Domain"**
3. Add your domain (e.g., `modcraft.ai`)
4. Configure DNS records as shown
5. Railway provides automatic SSL certificates

## 📊 Monitoring & Logs

- **Logs**: Real-time application logs in Railway dashboard
- **Metrics**: CPU, memory, and network usage
- **Deployments**: History of all deployments
- **Database**: Query interface and connection details

## 🔒 Security & Environment Variables

### Required Environment Variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Set to `production` | ✅ Yes |
| `PORT` | Server port (Railway sets this) | ✅ Yes |
| `DATABASE_URL` | PostgreSQL connection (Railway sets this) | ✅ Yes |
| `SESSION_SECRET` | Session encryption key | ✅ Yes |
| `ANTHROPIC_API_KEY` | For AI features | ✅ Yes |
| `OPENAI_API_KEY` | For AI features | ✅ Yes |
| `GEMINI_API_KEY` | For AI features | ✅ Yes |

### Optional Environment Variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_CLIENT_ID` | Google OAuth | ❌ Optional |
| `GITHUB_CLIENT_ID` | GitHub OAuth | ❌ Optional |
| `DISCORD_CLIENT_ID` | Discord OAuth | ❌ Optional |
| `PAYPAL_CLIENT_ID` | PayPal payments | ❌ Optional |

## 🧪 Testing Your Deployment

After deployment, test these features:

### Frontend Tests:
- [ ] Home page loads correctly
- [ ] Navigation works (all routes)
- [ ] Page refresh doesn't show 404
- [ ] UI components render properly

### Backend Tests:
- [ ] API endpoints respond (`/api/auth/me`, etc.)
- [ ] Database connection works
- [ ] Authentication system works
- [ ] AI features work (with API keys)

### Full-Stack Tests:
- [ ] User registration/login
- [ ] Creating projects
- [ ] AI code generation (if API keys configured)
- [ ] All interactive features

## 🚨 Troubleshooting

### Build Fails
- Check build logs in Railway dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility (18.x)

### Database Connection Issues
- Check `DATABASE_URL` is set automatically by Railway
- Ensure database schema is initialized
- Check for connection timeout issues

### API Keys Missing
- Add AI API keys to Railway environment variables
- Restart deployment after adding variables
- Check logs for "API key not found" errors

### Frontend Not Loading
- Check that `dist/public/` directory exists after build
- Verify Vite build completes successfully
- Check server is serving static files correctly

## 🎉 Success Indicators

✅ **Build completes** without errors  
✅ **App starts** and responds to HTTP requests  
✅ **Database connects** successfully  
✅ **Frontend loads** on your Railway URL  
✅ **API endpoints work** (`/api/` routes respond)  
✅ **Authentication works** (login/register)  
✅ **AI features work** (with API keys configured)  

## 📞 Need Help?

### Railway Support:
- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- Railway dashboard has excellent error reporting

### Common Issues:
- **Port issues**: Railway sets `PORT` automatically
- **Database URL**: Generated automatically when you add PostgreSQL
- **Build timeouts**: Usually means missing dependencies
- **Memory issues**: Upgrade Railway plan if needed

---

## 🚀 Ready to Deploy?

1. **Go to [railway.app](https://railway.app)**
2. **Follow the steps above**
3. **Your full-stack app will be live in ~5 minutes!**

Your ModCraftAI app will be available at: `https://your-app.up.railway.app`

Both frontend and backend will work together seamlessly! 🎉
