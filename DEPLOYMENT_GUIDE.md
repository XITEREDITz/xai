# ModCraftAI Deployment Guide

## Overview

This application consists of two parts:
1. **Frontend** (React SPA) - Can be deployed to Netlify
2. **Backend** (Express server with database) - Needs to be deployed to a server platform

## Deploying Frontend to Netlify

### Step 1: Prepare Your Repository

1. Make sure all your changes are committed and pushed to GitHub
2. The `netlify.toml` and `_redirects` files have been created for you

### Step 2: Create Netlify Account and Deploy

1. Go to [Netlify](https://netlify.com) and sign up/login
2. Click "New site from Git"
3. Choose your Git provider (GitHub/GitLab/Bitbucket)
4. Select your ModCraftAI repository
5. Configure build settings:
   - **Build command**: `npm run build:frontend`
   - **Publish directory**: `dist/public`
   - **Base directory**: (leave empty)

### Step 3: Configure Environment Variables

In your Netlify dashboard, go to Site Settings → Environment Variables and add:

```
# Required for Vite build process
NODE_ENV=production

# If you plan to use environment variables in your frontend later:
# VITE_API_URL=https://your-backend-domain.com
# VITE_APP_NAME=ModCraftAI
```

**Note**: Only environment variables prefixed with `VITE_` are available in the frontend build.

### Step 4: Deploy

1. Click "Deploy site"
2. Netlify will build and deploy your frontend
3. You'll get a URL like `https://amazing-app-name.netlify.app`

## Backend Deployment Options

Since Netlify only hosts static sites, you'll need to deploy your backend separately. Here are your options:

### Option 1: Railway (Recommended for beginners)

1. Go to [Railway](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your ModCraftAI repository
5. Railway will auto-detect it's a Node.js app
6. Add environment variables:
   ```
   DATABASE_URL=your-production-database-url
   SESSION_SECRET=your-session-secret
   ANTHROPIC_API_KEY=your-api-key
   OPENAI_API_KEY=your-api-key
   GEMINI_API_KEY=your-api-key
   NODE_ENV=production
   PORT=5000
   ```
7. Deploy!

### Option 2: Render

1. Go to [Render](https://render.com)
2. Connect your GitHub account
3. Create a new Web Service
4. Select your repository
5. Configure:
   - **Build Command**: `npm run build:backend`
   - **Start Command**: `npm start`
6. Add environment variables (same as Railway)

### Option 3: Heroku

1. Install Heroku CLI
2. Run these commands:
   ```bash
   heroku create your-app-name
   heroku config:set NODE_ENV=production
   heroku config:set DATABASE_URL=your-database-url
   # ... add other environment variables
   git push heroku main
   ```

## Database Setup

You'll need a PostgreSQL database for production. Options:

1. **Neon** (Free tier available): https://neon.tech
2. **Supabase** (Free tier available): https://supabase.com
3. **Railway PostgreSQL**: Available when you deploy on Railway
4. **Heroku PostgreSQL**: Available as an add-on

## Connecting Frontend to Backend

After deploying both:

1. Update your frontend's API calls to use the backend URL
2. You can do this by:
   - Creating a `VITE_API_URL` environment variable in Netlify
   - Updating your `queryClient.ts` to use the environment variable:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const fullUrl = API_BASE_URL + url;
  const res = await fetch(fullUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });
  // ... rest of the function
}
```

## Domain Configuration (Optional)

1. **Custom Domain for Frontend**: In Netlify dashboard → Domain settings → Add custom domain
2. **Custom Domain for Backend**: Configure in your backend hosting platform
3. **CORS Configuration**: Make sure your backend allows requests from your frontend domain

## SSL/HTTPS

Both Netlify and most backend platforms provide automatic HTTPS certificates.

## Environment Variables Summary

### Netlify (Frontend)
```
NODE_ENV=production
VITE_API_URL=https://your-backend-domain.com
```

### Backend Platform
```
DATABASE_URL=postgres://...
SESSION_SECRET=your-secret
ANTHROPIC_API_KEY=your-key
OPENAI_API_KEY=your-key
GEMINI_API_KEY=your-key
NODE_ENV=production
PORT=5000
PAYPAL_CLIENT_ID=your-paypal-id
PAYPAL_CLIENT_SECRET=your-paypal-secret
GOOGLE_CLIENT_ID=your-google-id
GOOGLE_CLIENT_SECRET=your-google-secret
GITHUB_CLIENT_ID=your-github-id
GITHUB_CLIENT_SECRET=your-github-secret
DISCORD_CLIENT_ID=your-discord-id
DISCORD_CLIENT_SECRET=your-discord-secret
```

## Testing Your Deployment

1. Visit your Netlify URL to test the frontend
2. Check that routing works (navigate to different pages)
3. Test API functionality once backend is connected
4. Check browser console for any errors

## Troubleshooting

### Build Fails on Netlify
- Check the build logs in Netlify dashboard
- Make sure all dependencies are listed in `package.json`
- Verify Node.js version compatibility

### Frontend Can't Connect to Backend
- Check CORS settings on backend
- Verify environment variables are set correctly
- Check network tab in browser dev tools

### 404 Errors on Page Refresh
- Make sure `_redirects` file is in the right location
- Check Netlify redirect rules are working

## Security Considerations

1. Never expose secret keys in frontend environment variables
2. Use HTTPS for all connections
3. Configure proper CORS headers
4. Set secure session cookies in production
5. Use strong database passwords

## Monitoring

Consider setting up:
- Error tracking (Sentry)
- Analytics (Google Analytics, Plausible)
- Uptime monitoring (UptimeRobot)
- Performance monitoring (Lighthouse CI)

## Need Help?

If you encounter issues:
1. Check the deployment logs
2. Review environment variable configuration
3. Test locally first with production-like settings
4. Check CORS and network connectivity
