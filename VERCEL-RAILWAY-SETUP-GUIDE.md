# Complete Vercel + Railway Setup Guide

This guide will walk you through setting up your backend on Railway and connecting your Vercel frontend to it.

---

## **PART 1: Fix Railway Backend (Backend Service)**

### **Step 1: Check Why Railway Backend Crashed**

1. **Go to Railway Dashboard**
   - Open https://railway.app in your browser
   - Log in if needed
   - Click on your project (e.g., "bountiful-serenity" or "production")

2. **Find Your Backend Service**
   - You should see "hoa-amenities" service (with the GitHub icon)
   - Click on it to open the service details

3. **Check Logs**
   - Click on the **"Logs"** tab at the top
   - Scroll down to see recent error messages
   - Look for red error text - this tells us why it crashed
   
   **Common errors you might see:**
   - Database connection errors
   - Missing environment variables
   - Build/compilation errors
   - Port binding issues

4. **Copy the Error Message**
   - Take a screenshot or copy the last few error lines
   - This will help diagnose the issue

---

### **Step 2: Check Railway Backend Configuration**

1. **Go to Backend Service Settings**
   - In your "hoa-amenities" service
   - Click the **"Settings"** tab at the top

2. **Verify Root Directory**
   - Look for **"Root Directory"** setting
   - It should be set to: `backend`
   - If it's empty or wrong:
     - Click to edit
     - Enter: `backend`
     - Click "Save" or "Update"

3. **Check Build/Start Commands**
   - Look for **"Build Command"** field
   - It should be: `npm ci && npm run build`
   - Look for **"Start Command"** field
   - It should be: `npm start`
   - If these are missing or wrong:
     - Click to edit
     - Enter the correct commands
     - Save

---

### **Step 3: Set Up Environment Variables in Railway Backend**

1. **Navigate to Variables**
   - In your "hoa-amenities" service
   - Click the **"Variables"** tab at the top

2. **Add Database Connection Variables**
   - Railway should have connected your Postgres database automatically
   - Look for variables that start with `PG` (these are from your Postgres service)
   - You should see:
     - `PGHOST`
     - `PGPORT`
     - `PGDATABASE`
     - `PGUSER`
     - `PGPASSWORD`
   
3. **Map Postgres Variables to Backend Variables**
   - Your backend code expects different variable names
   - Add these new variables (click "+ New Variable" for each):
   
   **Variable 1:**
   - **Name:** `DB_HOST`
   - **Value:** Copy the value from `PGHOST` variable (or use: `postgres.railway.internal`)
   - **Add Variable**
   
   **Variable 2:**
   - **Name:** `DB_PORT`
   - **Value:** `5432` (or copy from `PGPORT`)
   - **Add Variable**
   
   **Variable 3:**
   - **Name:** `DB_NAME`
   - **Value:** Copy the value from `PGDATABASE` variable (or use: `railway`)
   - **Add Variable**
   
   **Variable 4:**
   - **Name:** `DB_USER`
   - **Value:** Copy the value from `PGUSER` variable (or use: `postgres`)
   - **Add Variable**
   
   **Variable 5:**
   - **Name:** `DB_PASSWORD`
   - **Value:** Copy the value from `PGPASSWORD` variable
   - **Add Variable**
   
   **⚠️ IMPORTANT:** For `DB_PASSWORD`, click the eye icon to reveal the password, then copy it.

4. **Add Other Required Environment Variables**
   
   **Variable 6:**
   - **Name:** `FRONTEND_URL`
   - **Value:** `https://www.neighbri.com`
   - **Add Variable**
   
   **Variable 7:**
   - **Name:** `JWT_SECRET`
   - **Value:** Generate a long random string (see below for how to generate)
   - **Add Variable**
   
   **How to Generate JWT_SECRET:**
   - Open a new browser tab
   - Go to: https://www.random.org/strings/
   - Set:
     - Length: 64
     - Characters: All characters
   - Click "Generate"
   - Copy the string and paste it as `JWT_SECRET`
   
   **Variable 8:**
   - **Name:** `SENDGRID_API_KEY`
   - **Value:** Your SendGrid API key (from your `.env` file locally or from SendGrid dashboard)
   - **Add Variable**
   
   **Note:** Get your SendGrid API key from:
   - Your local `backend/.env` file (if you have it set up)
   - Or from SendGrid dashboard → Settings → API Keys
   
   **Variable 9:**
   - **Name:** `FROM_EMAIL`
   - **Value:** `NeighbriApp@gmail.com`
   - **Add Variable**
   
   **Variable 10:**
   - **Name:** `NODE_ENV`
   - **Value:** `production`
   - **Add Variable**
   
   **Variable 11:**
   - **Name:** `PORT`
   - **Value:** `5000` (Railway will override this automatically, but good to have)
   - **Add Variable**

5. **Verify All Variables Are Set**
   - Scroll through your variables list
   - Make sure you have all 11 variables listed above
   - Double-check that values are correct (especially `DB_PASSWORD`)

---

### **Step 4: Generate Public Domain for Railway Backend**

1. **Go to Backend Service Settings**
   - In your "hoa-amenities" service
   - Click **"Settings"** tab

2. **Find Networking Section**
   - Scroll down to find **"Networking"** or **"Generate Domain"** section

3. **Generate Public Domain**
   - Click **"Generate Domain"** button
   - Railway will create a URL like: `hoa-amenities-production.up.railway.app`
   - **COPY THIS URL** - you'll need it for Vercel

4. **Note the Full URL**
   - Make sure you copy the FULL URL including `https://`
   - Example: `https://hoa-amenities-production.up.railway.app`
   - Save this somewhere temporarily (notepad, notes app, etc.)

---

### **Step 5: Redeploy Railway Backend**

1. **Trigger a New Deployment**
   - In your "hoa-amenities" service
   - Click the **"Deployments"** tab
   - Look for the latest deployment (should show as "Crashed")
   - Click the three dots (⋯) or **"Redeploy"** button
   - Select **"Redeploy"** or **"Restart"**

2. **Watch the Deployment**
   - Click the **"Logs"** tab
   - Watch the logs in real-time
   - You should see:
     - Building the application
     - Installing dependencies
     - Starting the server
   
3. **Look for Success Messages**
   - You should see:
     - `✅ Database connection established.`
     - `✅ Database tables synced.`
     - `✅ Database seeded with initial data.`
     - `🚀 Server running on port XXXX`
   
4. **If It Still Crashes**
   - Check the error in logs
   - Common issues:
     - Missing environment variable → go back and add it
     - Wrong database credentials → double-check `DB_*` variables
     - Build error → check Root Directory is `backend`
     - Port issue → Railway handles this automatically, shouldn't be a problem

5. **Verify Backend Is Running**
   - In the **"Deployments"** tab
   - The latest deployment should show as **"Active"** (green checkmark)
   - Not "Crashed" (red X)

---

### **Step 6: Test Railway Backend**

1. **Get Your Backend URL**
   - Use the public domain you generated (e.g., `https://hoa-amenities-production.up.railway.app`)

2. **Test Health Endpoint**
   - Open a new browser tab
   - Go to: `https://your-backend-url.up.railway.app/health`
   - You should see JSON response like:
     ```json
     {
       "status": "OK",
       "message": "HOA Amenities API is running",
       "timestamp": "2025-01-XX..."
     }
     ```
   - If you see this, your backend is working! ✅

3. **Test API Endpoint**
   - Try: `https://your-backend-url.up.railway.app/api/amenities`
   - You should see a JSON array with amenities data
   - If you see this, your database is connected! ✅

4. **If You Get Errors**
   - Connection refused → backend might not be fully deployed, wait a minute and try again
   - 404 error → check the URL is correct
   - 500 error → check Railway logs for specific error

---

## **PART 2: Configure Vercel Frontend**

### **Step 7: Add Environment Variable to Vercel**

1. **Go to Vercel Dashboard**
   - Open https://vercel.com in your browser
   - Log in if needed
   - Click on your project (should be "hoa-amenities" or similar)

2. **Navigate to Settings**
   - Click **"Settings"** in the top navigation bar

3. **Go to Environment Variables**
   - In the left sidebar, click **"Environment Variables"**

4. **Add REACT_APP_API_URL**
   - Click **"Add New"** button
   - In the **"Key"** field, enter: `REACT_APP_API_URL`
   - In the **"Value"** field, enter your Railway backend URL:
     - Example: `https://hoa-amenities-production.up.railway.app`
     - **Make sure it starts with `https://`**
     - **Do NOT include a trailing slash** (no `/` at the end)
   
5. **Select Environments**
   - Check the boxes for:
     - ✅ **Production** (for your live site)
     - ✅ **Preview** (for pull request previews - optional)
     - ✅ **Development** (optional, only if you want to test locally with this URL)
   
6. **Save**
   - Click **"Save"** button

7. **Verify Variable Is Added**
   - You should see `REACT_APP_API_URL` in the list
   - Make sure the value is correct

---

### **Step 8: Redeploy Vercel Frontend**

1. **Trigger Redeployment**
   - In your Vercel project
   - Click **"Deployments"** tab at the top
   - Find the latest deployment
   - Click the three dots (⋯) on the right
   - Select **"Redeploy"**
   - Choose **"Use existing Build Cache"** (optional, but faster)
   - Click **"Redeploy"**

2. **Watch the Deployment**
   - You'll see a build progress indicator
   - Wait for it to complete (usually 1-3 minutes)
   - Status should change to **"Ready"** (green)

3. **Alternative: Push to GitHub**
   - If the "Redeploy" option doesn't appear:
   - Make a small change to any file (or just add a space to README.md)
   - Commit and push:
     ```bash
     git add .
     git commit -m "Trigger Vercel redeploy"
     git push
     ```
   - Vercel will automatically detect the push and redeploy

---

### **Step 9: Verify Vercel Configuration**

1. **Check Build Settings**
   - In Vercel → **Settings** → **General**
   - Scroll to **"Build & Development Settings"**
   - Verify:
     - **Framework Preset:** Create React App (or Auto-detected)
     - **Root Directory:** `frontend` (should be set)
     - **Build Command:** `npm run build` (should be auto-detected)
     - **Output Directory:** `build` (should be auto-detected)
     - **Install Command:** `npm install` (should be auto-detected)

2. **If Root Directory Is Wrong**
   - Click **"Edit"**
   - Set **Root Directory** to: `frontend`
   - Click **"Save"**
   - This will trigger a new deployment

---

### **Step 10: Test the Complete Setup**

1. **Clear Browser Cache**
   - Open your browser's Developer Tools (F12)
   - Right-click the refresh button
   - Select **"Empty Cache and Hard Reload"**
   - Or press `Ctrl + Shift + R` (Windows) / `Cmd + Shift + R` (Mac)

2. **Visit Your Site**
   - Go to: https://www.neighbri.com
   - Open Developer Tools (F12) → **Network** tab

3. **Test Login**
   - Try to log in with demo credentials:
     - Email: `admin@hoa.com`
     - Password: `admin123`
   
4. **Check Network Requests**
   - In the **Network** tab, filter by **Fetch/XHR**
   - Look for API requests
   - Click on one (like `reservations` or `amenities`)
   - Check the **Request URL**:
     - ✅ Should show: `https://your-railway-url.up.railway.app/api/...`
     - ❌ Should NOT show: `http://localhost:5000/api/...`
   
5. **Check Response**
   - Click on an API request
   - Go to **Response** tab
   - You should see actual data (JSON), not an error

6. **Verify Everything Works**
   - Try creating a reservation
   - Try viewing calendar
   - Try accessing admin panel
   - All should work without errors

---

## **PART 3: Verify Database Has Data**

### **Step 11: Check Railway Database**

1. **Go to Railway Postgres Service**
   - In Railway dashboard
   - Click on your **Postgres** service (the one with the elephant icon)

2. **View Database Tables**
   - Click **"Database"** tab
   - Click **"Data"** sub-tab
   - You should now see tables:
     - `users`
     - `amenities`
     - `reservations`
     - `payments`
     - `cleaning_schedules`
   
3. **Check Data**
   - Click on a table (e.g., `amenities`)
   - You should see rows of data
   - `amenities` should have 2 rows (Clubroom and Pool)
   - `users` should have 3 rows (admin, janitorial, resident)

4. **If Tables Are Still Empty**
   - Check Railway backend logs
   - Look for database sync errors
   - Make sure backend service shows as "Active"
   - Try manually triggering a redeploy

---

## **TROUBLESHOOTING**

### **Issue: Vercel Frontend Still Shows localhost:5000**

**Solution:**
1. Double-check `REACT_APP_API_URL` is set in Vercel
2. Make sure you redeployed AFTER adding the variable
3. Clear browser cache completely
4. Try incognito/private browsing mode

---

### **Issue: Railway Backend Keeps Crashing**

**Solution:**
1. Check logs for specific error
2. Verify all environment variables are set
3. Make sure Root Directory is `backend`
4. Check that database variables match your Postgres service
5. Make sure `DB_PASSWORD` matches `PGPASSWORD`

---

### **Issue: CORS Errors in Browser**

**Solution:**
1. Check Railway backend logs for CORS errors
2. Verify `FRONTEND_URL` in Railway is set to `https://www.neighbri.com`
3. Make sure backend CORS configuration includes your domain

---

### **Issue: API Returns 404 or Connection Refused**

**Solution:**
1. Verify Railway backend is "Active" (not crashed)
2. Check the Railway backend URL is correct
3. Test the `/health` endpoint directly in browser
4. Make sure Railway public domain is generated

---

## **QUICK REFERENCE CHECKLIST**

**Railway Backend:**
- [ ] Root Directory set to `backend`
- [ ] Build Command: `npm ci && npm run build`
- [ ] Start Command: `npm start`
- [ ] All 11 environment variables added
- [ ] Public domain generated
- [ ] Service shows as "Active"
- [ ] `/health` endpoint works

**Vercel Frontend:**
- [ ] Root Directory set to `frontend`
- [ ] `REACT_APP_API_URL` environment variable added
- [ ] Value points to Railway backend URL
- [ ] Frontend redeployed after adding variable
- [ ] Network tab shows Railway URLs (not localhost)

**Database:**
- [ ] Tables created in Railway Postgres
- [ ] Initial data seeded (amenities, users)
- [ ] Can query data successfully

---

## **NEXT STEPS AFTER SETUP**

Once everything is working:

1. **Test All Features:**
   - User registration
   - Email verification
   - Login/logout
   - Create reservations
   - View calendar
   - Admin functions

2. **Monitor:**
   - Check Railway logs periodically
   - Check Vercel deployment status
   - Monitor error rates

3. **Optional Enhancements:**
   - Set up custom domain for backend (e.g., `api.neighbri.com`)
   - Add monitoring/alerting
   - Set up automated backups for database

---

**If you run into any issues at any step, stop and ask for help rather than continuing. Each step builds on the previous ones.**

