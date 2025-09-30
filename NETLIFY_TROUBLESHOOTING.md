# Netlify 404 Error Troubleshooting

## Current Issue: "Page not found" on Netlify

You're seeing Netlify's 404 page instead of your React app. Here's how to fix it:

## ✅ Quick Fix Steps

### 1. **Force Clear Deploy Cache**
In your Netlify dashboard:
1. Go to Site Settings → Build & Deploy
2. Click "Clear cache and retry deploy" 
3. Or trigger a new deploy with: `git commit --allow-empty -m "Force redeploy" && git push`

### 2. **Verify Build Settings**
In Netlify dashboard → Site Settings → Build & Deploy → Build Settings:
- **Build command**: `npm run build:frontend`
- **Publish directory**: `dist/public`
- **Base directory**: (leave empty)

### 3. **Check Deploy Log**
In Netlify dashboard → Deploys → Click on latest deploy:
- Look for any build errors
- Ensure `_redirects` file is being copied
- Check that `index.html` is in the publish directory

## 🔍 Files That Should Fix This

The following files have been updated to fix SPA routing:

### `_redirects` file location: `client/public/_redirects`
```
# API routes should be proxied to your backend server (if needed)
# Uncomment and update the URL below when you have a backend deployed:
# /api/*  https://your-backend-url.com/api/:splat  200!

# Redirect all other routes to index.html for client-side routing (SPA)
/*    /index.html   200
```

### `netlify.toml` configuration:
```toml
[build]
  command = "npm run build:frontend"
  publish = "dist/public"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = false
```

## 🚨 Common Causes & Solutions

### Issue 1: Wrong Publish Directory
**Symptom**: Netlify shows "Page not found"
**Fix**: Make sure publish directory is set to `dist/public` (not just `dist`)

### Issue 2: Missing _redirects File
**Symptom**: Home page works, but refreshing other routes gives 404
**Fix**: Ensure `_redirects` file is in `client/public/` directory

### Issue 3: Build Command Issues
**Symptom**: Build fails or produces wrong output
**Fix**: Use exactly `npm run build:frontend` as the build command

### Issue 4: Caching Issues
**Symptom**: Old version still showing despite new deploys
**Fix**: 
1. Clear Netlify cache (Site Settings → Build & Deploy)
2. Hard refresh browser (Ctrl+Shift+R)
3. Check in incognito mode

## 🔧 Manual Verification Steps

### Step 1: Check Your Built Files
```bash
# In your project directory
npm run build:frontend
ls dist/public/
# Should show: assets/, index.html, _redirects
```

### Step 2: Test Locally
```bash
# Serve the built files locally to test
npx serve dist/public
# Visit http://localhost:3000 and test routing
```

### Step 3: Check Netlify Deploy Log
1. Go to Netlify dashboard
2. Click on your site
3. Go to "Deploys" tab
4. Click on the latest deploy
5. Check the log for:
   - Build success
   - Files being copied
   - Any error messages

## 🎯 Expected Behavior After Fix

✅ **Home page loads**: `https://your-site.netlify.app/`
✅ **Direct URL access works**: `https://your-site.netlify.app/builder`
✅ **Refresh doesn't 404**: Refreshing any page loads the React app
✅ **Navigation works**: Clicking links works normally

## 🆘 If Still Not Working

### Check These in Netlify Dashboard:

1. **Site Overview**: Look for deploy status and error messages
2. **Functions**: Should be empty (we're not using Netlify Functions)
3. **Domain Settings**: Check if custom domain is configured correctly
4. **Environment Variables**: Should only contain `NODE_ENV=production` for now

### Try Alternative Deploy Method:

1. **Manual Deploy**:
   ```bash
   npm run build:frontend
   # Then drag and drop the dist/public folder to Netlify dashboard
   ```

2. **Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=dist/public
   ```

## 📞 Next Steps

1. **Push Updated Files**:
   ```bash
   git add .
   git commit -m "Fix Netlify SPA routing configuration"
   git push origin main
   ```

2. **Wait for Deploy**: Netlify will auto-deploy from your git push

3. **Test**: Visit your site and try different routes

4. **Clear Browser Cache**: Hard refresh or use incognito mode

## 🎉 Success Indicators

- No more Netlify 404 page
- Your React app loads on all routes  
- Browser navigation works correctly
- Page refresh doesn't break routing

If you're still seeing issues after following these steps, check the Netlify deploy logs for specific error messages.
