# Run Database Migration via API (Easiest Method!)

Since Railway doesn't provide a shell option, you can run the migration **directly through your backend API**.

## **Step-by-Step Instructions:**

### **Method 1: Using Browser (Easiest)**

1. **Go to your backend URL** (the Railway backend URL):
   - Your backend URL should be something like: `https://your-backend-name.up.railway.app`
   - Or check Railway → Your Backend Service → Settings → Domains

2. **Login to your admin account** first:
   - Go to: `https://www.neighbri.com/login` (or your Railway backend URL + `/login`)
   - Login with: `admin@hoa.com` / `admin123`

3. **Open browser developer console** (F12 or Right-click → Inspect)

4. **Get your auth token**:
   - In the Console tab, run:
   ```javascript
   localStorage.getItem('token')
   ```
   - Copy the token value

5. **Open a new tab** and navigate to:
   ```
   https://your-backend-url.up.railway.app/api/admin/migrate-damage-fields
   ```
   
   Replace `your-backend-url.up.railway.app` with your actual Railway backend URL.

6. **You'll get an unauthorized error** - that's expected. Now add your token.

7. **Use curl or Postman** (see Method 2 below) OR use the browser's fetch API:
   
   Open browser console (F12) and run:
   ```javascript
   fetch('https://your-backend-url.up.railway.app/api/admin/migrate-damage-fields', {
     method: 'POST',
     headers: {
       'Authorization': 'Bearer YOUR_TOKEN_HERE',
       'Content-Type': 'application/json'
     }
   })
   .then(r => r.json())
   .then(data => console.log(data))
   .catch(err => console.error(err));
   ```
   
   Replace `YOUR_TOKEN_HERE` with the token you copied from step 4.
   Replace `your-backend-url.up.railway.app` with your actual Railway backend URL.

---

### **Method 2: Using curl (Command Line)**

1. **Get your auth token** (same as step 4 above)

2. **Run this command** (replace values):
   ```bash
   curl -X POST https://your-backend-url.up.railway.app/api/admin/migrate-damage-fields \
     -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     -H "Content-Type: application/json"
   ```

   Replace:
   - `your-backend-url.up.railway.app` with your actual Railway backend URL
   - `YOUR_TOKEN_HERE` with your auth token

---

### **Method 3: Using Postman or Insomnia**

1. **Method:** POST
2. **URL:** `https://your-backend-url.up.railway.app/api/admin/migrate-damage-fields`
3. **Headers:**
   - `Authorization`: `Bearer YOUR_TOKEN_HERE`
   - `Content-Type`: `application/json`
4. **Send**

---

## **Success Response:**

You should see:
```json
{
  "success": true,
  "message": "Migration completed successfully. All damage assessment fields have been added to the reservations table.",
  "fieldsAdded": [...]
}
```

## **What This Does:**

This endpoint runs the migration directly on Railway's backend, which:
- ✅ Already has database connection configured
- ✅ Already has access to Railway's internal network
- ✅ No need for local `.env` file
- ✅ No SSL/connection issues

---

## **Finding Your Backend URL:**

1. Go to Railway → Your Project → **Backend Service** (not PostgreSQL)
2. Click **Settings** tab
3. Look at **Domains** section
4. Your backend URL will be listed there (something like `your-app-name.up.railway.app`)

Or check your Vercel frontend's `.env` file - it should have `REACT_APP_API_URL` pointing to your Railway backend.

---

**This is the recommended method since it runs on Railway itself where the database connection already works!**

