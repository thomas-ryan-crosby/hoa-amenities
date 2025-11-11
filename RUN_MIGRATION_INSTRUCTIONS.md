# How to Run the Modification Fields Migration

## ✅ Confirmed Issue
The database is missing all 7 modification columns. You need to run the migration SQL file.

## 🚀 Quickest Method: Railway Web Console

### Step 1: Access Railway Database
1. Go to https://railway.app
2. Select your **hoa-amenities** project
3. Click on your **PostgreSQL service** (the database)
4. Click the **"Data"** tab
5. Click **"Query"** or **"SQL Editor"** (if available)

### Step 2: Run the Migration
1. Open the file `backend/add-modification-fields.sql` in your editor
2. **Copy the entire contents** of the file
3. **Paste it into the Railway SQL editor**
4. Click **"Run"** or **"Execute"**

### Step 3: Verify Success
You should see a success message. The migration is idempotent (safe to run multiple times), so if columns already exist, it won't error.

---

## 🔧 Alternative Method: Using psql (Command Line)

### Step 1: Get Connection Details from Railway
1. Go to Railway → Your Project → PostgreSQL Service
2. Click **"Variables"** tab
3. Note these values:
   - `PGHOST` (or `DB_HOST`)
   - `PGPORT` (or `DB_PORT`) - usually `5432`
   - `PGDATABASE` (or `DB_NAME`) - usually `railway`
   - `PGUSER` (or `DB_USER`) - usually `postgres`
   - `PGPASSWORD` (or `DB_PASSWORD`)

### Step 2: Connect via psql
```bash
psql -h <PGHOST> -p <PGPORT> -U <PGUSER> -d <PGDATABASE>
```

It will prompt for the password (use `PGPASSWORD` value).

### Step 3: Run the Migration
Once connected, paste the contents of `backend/add-modification-fields.sql` and press Enter.

Or run it directly:
```bash
psql -h <PGHOST> -p <PGPORT> -U <PGUSER> -d <PGDATABASE> -f backend/add-modification-fields.sql
```

---

## ✅ Verify Migration Worked

After running the migration, test the feature again. The error should be gone.

You can also verify by checking the diagnostic endpoint:
1. Log in to your app
2. Open browser console
3. Run:
```javascript
fetch('https://hoa-amenities-production.up.railway.app/api/reservations/diagnostic/columns', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(r => r.json())
.then(console.log)
```

You should see `columnsFound: 7` and all 7 columns listed.

---

## 📝 What the Migration Does

The migration adds these 7 columns to the `reservations` table:
1. `modificationStatus` - VARCHAR(20) - Status of modification proposal
2. `proposedDate` - DATE - Proposed new date
3. `proposedPartyTimeStart` - TIMESTAMP - Proposed new start time
4. `proposedPartyTimeEnd` - TIMESTAMP - Proposed new end time
5. `modificationReason` - TEXT - Reason for modification
6. `modificationProposedBy` - INT - User ID who proposed the modification
7. `modificationProposedAt` - TIMESTAMP - When modification was proposed

It also:
- Adds a foreign key constraint linking `modificationProposedBy` to `users(id)`
- Creates an index on `modificationStatus` for efficient querying

---

## ⚠️ Important Notes

- The migration is **idempotent** - safe to run multiple times
- It uses `IF NOT EXISTS` checks, so it won't error if columns already exist
- All columns are nullable, so existing reservations won't be affected
- The migration includes proper schema checks (`table_schema = 'public'`)

---

## 🆘 Troubleshooting

**If you get a permission error:**
- Make sure you're using the correct database user (usually `postgres`)
- Check that the user has ALTER TABLE permissions

**If you get a syntax error:**
- Make sure you copied the entire SQL file
- Check that you're using PostgreSQL (not MySQL or other database)

**If columns still don't exist after running:**
- Check Railway logs for any errors
- Verify you ran the migration on the correct database
- Try running the diagnostic endpoint to see what columns exist


