# Connect to Railway PostgreSQL using pgAdmin

## **Step 1: Get Connection Details from Railway**

1. Go to https://railway.app
2. Select your project (hoa-amenities)
3. Click on your **PostgreSQL service** (the database)
4. Click the **"Variables"** tab
5. Copy these values:
   - **Host:** `PGHOST` value (or `DB_HOST` if you have it)
   - **Port:** `PGPORT` value (usually `5432`)
   - **Database:** `PGDATABASE` value (usually `railway`)
   - **Username:** `PGUSER` value (usually `postgres`)
   - **Password:** `PGPASSWORD` value (click the eye icon to reveal it)

## **Step 2: Open pgAdmin**

1. Open pgAdmin on your computer
2. If you don't have pgAdmin installed, download it from: https://www.pgadmin.org/download/

## **Step 3: Create a New Server Connection**

1. In pgAdmin, right-click on **"Servers"** in the left sidebar
2. Select **"Create"** → **"Server..."**

## **Step 4: General Tab**

1. **Name:** Enter a friendly name (e.g., "Railway HOA Amenities")
2. Click **"Connection"** tab

## **Step 5: Connection Tab** (IMPORTANT)

Fill in the connection details you copied from Railway:

1. **Host name/address:** Paste your `PGHOST` value from Railway
   - Example: `containers-us-west-123.railway.app`
   
2. **Port:** Paste your `PGPORT` value (usually `5432`)

3. **Maintenance database:** Paste your `PGDATABASE` value (usually `railway`)

4. **Username:** Paste your `PGUSER` value (usually `postgres`)

5. **Password:** Paste your `PGPASSWORD` value from Railway
   - **Note:** You'll need to enter this each time you connect, or you can save it (see below)

6. **Save password?** Check this box if you want pgAdmin to remember the password

## **Step 6: SSL Tab** (IMPORTANT for Railway)

1. Click the **"SSL"** tab
2. Set **"SSL Mode"** to: **"Require"** or **"Prefer"**
   - Railway databases typically require SSL connections
3. Leave other SSL settings as default

## **Step 7: Connect**

1. Click **"Save"** button
2. pgAdmin will attempt to connect
3. If successful, you'll see your database expand in the left sidebar

## **Step 8: View Your Database**

1. Expand **"Servers"** → **"Railway HOA Amenities"** (or whatever you named it)
2. Expand **"Databases"** → **"railway"** (or your database name)
3. Expand **"Schemas"** → **"public"**
4. Expand **"Tables"** to see all your tables:
   - `users`
   - `amenities`
   - `reservations`
   - `payments` (if you have it)

## **Troubleshooting**

### **Connection Refused / Timeout**

**Possible causes:**
- Railway databases may not be accessible from external IPs
- Firewall blocking the connection
- Wrong host/port

**Solutions:**
- Try using Railway's connection URL instead of individual components
- Check if Railway has IP whitelisting enabled
- Verify the host/port are correct

### **SSL Connection Error**

**Error:** "SSL connection required"

**Solution:**
- Make sure SSL Mode is set to "Require" or "Prefer" in the SSL tab
- Railway databases require SSL connections

### **Authentication Failed**

**Error:** "password authentication failed"

**Solution:**
- Double-check the username and password from Railway Variables
- Make sure you're copying the password exactly (no extra spaces)
- Click the eye icon in Railway to reveal the actual password

### **Database Not Found**

**Error:** "database does not exist"

**Solution:**
- Check that you're using the correct `PGDATABASE` value from Railway
- It's usually `railway`, but verify in Railway Variables

## **Alternative: Use Connection String**

If pgAdmin supports connection strings, you can use:

```
postgresql://PGUSER:PGPASSWORD@PGHOST:PGPORT/PGDATABASE?sslmode=require
```

Replace the placeholders with your actual values from Railway Variables.

Example:
```
postgresql://postgres:your_password@containers-us-west-123.railway.app:5432/railway?sslmode=require
```

---

**Note:** If Railway's PostgreSQL service has restrictions on external connections, you may need to:
- Use Railway's CLI to connect
- Or use the API endpoints we created to view/modify data
- Or check Railway's documentation for any IP whitelisting requirements

