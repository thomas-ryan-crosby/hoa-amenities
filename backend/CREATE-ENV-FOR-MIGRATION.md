# Creating .env File for Database Migration

## Quick Steps

1. **Get Railway Database Connection Details:**
   - Go to https://railway.app
   - Select your project
   - Click on your **PostgreSQL service**
   - Click the **"Variables"** tab
   - Look for these variables (you may see `PG*` or `DB*` versions):

2. **Create `.env` file in `backend/` directory:**

   Create a new file called `.env` in the `backend/` folder with these contents:
   ```
   DB_HOST=<value from Railway Variables - PGHOST or DB_HOST>
   DB_PORT=5432
   DB_NAME=<value from Railway Variables - PGDATABASE or DB_NAME>
   DB_USER=<value from Railway Variables - PGUSER or DB_USER>
   DB_PASSWORD=<value from Railway Variables - PGPASSWORD or DB_PASSWORD>
   ```

## Example `.env` file:

```
DB_HOST=containers-us-west-123.railway.app
DB_PORT=5432
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=your_actual_password_from_railway
```

## Important Notes:

⚠️ **Railway databases may require SSL connections**. The migration script handles this automatically.

⚠️ **Some Railway databases may not be accessible from external IPs**. If you get connection refused:
- Try running the migration through Railway's CLI or console
- Or use a VPN/proxy that Railway allows
- Or use Railway's built-in database viewer if available

## Alternative: Run Migration on Railway

If you can't connect from your local machine, you can run the migration script **directly on Railway**:

1. Go to Railway → Your Backend Service
2. Click **"Deployments"** tab
3. Click **"..."** (three dots) on latest deployment
4. Click **"View Logs"** or **"Shell"**
5. Run:
   ```bash
   node migrate-damage-assessment-fields.js
   ```

Or add it as a one-time deployment command in Railway.

