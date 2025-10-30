# Deployment Guide: GitHub & Vercel

## Prerequisites
1. GitHub account
2. Vercel account (sign up at https://vercel.com)
3. Node.js installed locally

---

## Step 1: Push to GitHub

### 1.1 Initialize Git Repository (if not already done)
```powershell
cd C:\Users\thoma\hoa-ammenities
git init
```

### 1.2 Add All Files
```powershell
git add .
```

### 1.3 Make Initial Commit
```powershell
git commit -m "Initial commit: Neighbri HOA amenities management app"
```

### 1.4 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `hoa-amenities` (or your preferred name)
3. Description: "HOA amenities reservation management system"
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

### 1.5 Connect Local Repository to GitHub
```powershell
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/hoa-amenities.git
git branch -M main
git push -u origin main
```

**Note:** If prompted for credentials:
- Use a Personal Access Token (not your password)
- Generate one at: https://github.com/settings/tokens
- Token permissions needed: `repo` (full control)

---

## Step 2: Deploy Frontend to Vercel

Since Vercel is primarily for frontend deployment, we'll deploy the frontend there. The backend needs separate hosting (see Step 3).

### 2.1 Install Vercel CLI (Optional - or use Web UI)
```powershell
npm install -g vercel
```

### 2.2 Deploy via Vercel Web UI (Recommended)

1. **Go to https://vercel.com/new**
2. **Import Git Repository**
   - Click "Import Git Repository"
   - Connect your GitHub account if needed
   - Select your `hoa-amenities` repository

3. **Configure Project**
   - **Framework Preset:** Create React App (or Vite if you're using it)
   - **Root Directory:** `frontend` (Important!)
   - **Build Command:** `npm run build` (if using Create React App) or `npm run build` (check your frontend/package.json)
   - **Output Directory:** `build` (for Create React App) or `dist` (for Vite)
   - **Install Command:** `npm install`

4. **Environment Variables**
   Add these environment variables in Vercel:
   - `REACT_APP_API_URL` = Your backend API URL (see Step 3 for backend hosting)
   
   For example, if your backend is at `https://your-backend.herokuapp.com`:
   - `REACT_APP_API_URL` = `https://your-backend.herokuapp.com`

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your frontend will be live at a Vercel URL (e.g., `https://hoa-amenities.vercel.app`)

### 2.3 Deploy via CLI (Alternative)
```powershell
cd frontend
vercel login
vercel
# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? hoa-amenities (or your choice)
# - Directory? ./
# - Override settings? No
```

Then add environment variables:
```powershell
vercel env add REACT_APP_API_URL
# Enter your backend URL when prompted
```

---

## Step 3: Deploy Backend

Vercel can host serverless functions, but for a full Express backend, consider these options:

### Option A: Railway (Recommended for Express backends)
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will detect it's a Node.js project
6. Set Root Directory to `backend`
7. Add environment variables:
   ```
   DB_HOST=your-db-host
   DB_PORT=5432
   DB_NAME=your-db-name
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   JWT_SECRET=your-jwt-secret
   SENDGRID_API_KEY=your-sendgrid-key
   FROM_EMAIL=NeighbriApp@gmail.com
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
8. Railway will provide a public URL for your backend

### Option B: Render
1. Go to https://render.com
2. Sign up with GitHub
3. "New" → "Web Service"
4. Connect your GitHub repo
5. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm run dev` (or `npm start` for production)
6. Add environment variables (same as above)
7. Render provides a public URL

### Option C: Heroku
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set buildpack: `heroku buildpacks:set heroku/nodejs`
5. Set environment variables via Heroku dashboard
6. Deploy: `git push heroku main`

### Option D: Vercel Serverless (Advanced)
If you want to use Vercel for backend too, you'll need to refactor your Express app into serverless functions. This is more complex but possible.

---

## Step 4: Update Frontend Environment Variable

After your backend is deployed:

1. Go back to Vercel dashboard
2. Go to your project → Settings → Environment Variables
3. Update `REACT_APP_API_URL` to your actual backend URL
4. Redeploy the frontend (Vercel will auto-redeploy if you push to main branch)

Or update `frontend/.env.production`:
```env
REACT_APP_API_URL=https://your-backend-url.railway.app
# or whatever your backend URL is
```

---

## Step 5: Update Backend CORS Settings

Update `backend/src/index.ts` to allow your Vercel frontend URL:

```typescript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app', // Add your Vercel URL here
    'https://www.neighbri.com' // Your custom domain if you have one
  ],
  credentials: true
};
```

Then commit and push:
```powershell
git add backend/src/index.ts
git commit -m "Update CORS for Vercel deployment"
git push
```

---

## Step 6: Database Setup

Your PostgreSQL database needs to be accessible from your backend host:

### Option A: Keep Current Database (if accessible externally)
- Ensure your database allows connections from your backend host
- Update firewall rules if needed

### Option B: Use Managed Database
- **Railway:** Offers PostgreSQL databases
- **Render:** Offers managed PostgreSQL
- **Heroku Postgres:** Free tier available
- **Supabase:** Free PostgreSQL hosting
- **Neon:** Serverless PostgreSQL

Update your backend environment variables with the new database connection string.

---

## Step 7: Custom Domain (Optional)

If you have `www.neighbri.com`:

1. **Frontend (Vercel):**
   - Go to Vercel dashboard → Project Settings → Domains
   - Add `www.neighbri.com`
   - Follow DNS configuration instructions

2. **Backend:**
   - Most hosting providers support custom domains
   - Point a subdomain to your backend (e.g., `api.neighbri.com`)

3. **Update Environment Variables:**
   - Update `FRONTEND_URL` in backend to `https://www.neighbri.com`
   - Update CORS settings to include your domain

---

## Troubleshooting

### Frontend can't connect to backend
- Check `REACT_APP_API_URL` environment variable
- Check CORS settings in backend
- Check backend logs for errors

### Build fails on Vercel
- Check build logs in Vercel dashboard
- Ensure Root Directory is set to `frontend`
- Check for missing dependencies

### Backend deployment issues
- Check environment variables are set correctly
- Ensure database is accessible from hosting provider
- Check logs in your hosting provider's dashboard

---

## Quick Reference: Commands

```powershell
# Git Commands
git add .
git commit -m "Your commit message"
git push origin main

# Check git status
git status

# View remote
git remote -v
```

---

## Next Steps After Deployment

1. Test all functionality:
   - User registration
   - Email verification
   - Login
   - Reservation creation
   - Calendar viewing

2. Monitor logs:
   - Vercel dashboard for frontend errors
   - Backend hosting dashboard for API errors

3. Set up monitoring (optional):
   - Sentry for error tracking
   - Vercel Analytics
   - Uptime monitoring

4. Update `README.md` with deployment URLs and instructions

