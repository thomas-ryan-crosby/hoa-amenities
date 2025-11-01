# How to Access Railway PostgreSQL Database

## Option 1: Use Railway's Web Console (Recommended)

1. **Go to your Railway dashboard**: https://railway.app
2. **Select your project** (hoa-amenities)
3. **Click on your PostgreSQL service** (the database service)
4. **Go to the "Data" tab**
5. **Click "Query"** or **"SQL Editor"** (if available)
6. **Paste the SQL commands** and run them

---

## Option 2: Use psql Command Line (if you have PostgreSQL installed)

### Get Connection Details:
1. Go to Railway → Your Project → PostgreSQL Service
2. Click on the **"Variables"** tab
3. You'll see connection details like:
   - `PGHOST` (or `DB_HOST`)
   - `PGPORT` (or `DB_PORT`)
   - `PGDATABASE` (or `DB_NAME`)
   - `PGUSER` (or `DB_USER`)
   - `PGPASSWORD` (or `DB_PASSWORD`)

### Connect via psql:
```bash
psql -h <PGHOST> -p <PGPORT> -U <PGUSER> -d <PGDATABASE>
```

It will prompt for the password (from `PGPASSWORD`).

Then run:
```sql
ALTER TABLE reservations 
ADD COLUMN IF NOT EXISTS "damageAssessed" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "damageAssessmentPending" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "damageAssessmentStatus" VARCHAR(20),
ADD COLUMN IF NOT EXISTS "damageCharge" DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS "damageChargeAmount" DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS "damageChargeAdjusted" DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS "damageDescription" TEXT,
ADD COLUMN IF NOT EXISTS "damageNotes" TEXT,
ADD COLUMN IF NOT EXISTS "adminDamageNotes" TEXT,
ADD COLUMN IF NOT EXISTS "damageAssessedBy" INTEGER REFERENCES users(id),
ADD COLUMN IF NOT EXISTS "damageReviewedBy" INTEGER REFERENCES users(id),
ADD COLUMN IF NOT EXISTS "damageAssessedAt" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "damageReviewedAt" TIMESTAMP;
```

---

## Option 3: Use the Migration Script (Easiest)

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Make sure your `.env` file has the Railway database connection details**:
   ```
   DB_HOST=<from Railway Variables>
   DB_PORT=<from Railway Variables>
   DB_NAME=<from Railway Variables>
   DB_USER=<from Railway Variables>
   DB_PASSWORD=<from Railway Variables>
   ```

3. **Install pg if needed**:
   ```bash
   npm install pg
   ```

4. **Run the migration script**:
   ```bash
   node migrate-damage-assessment-fields.js
   ```

This script will:
- Connect to your Railway database
- Add all the required columns safely (using `IF NOT EXISTS`)
- Handle the enum type creation
- Show progress for each column

---

## Option 4: Use a GUI Tool (DBeaver, pgAdmin, etc.)

1. **Get connection details** from Railway Variables tab
2. **Create a new PostgreSQL connection** in your tool:
   - Host: `PGHOST` value
   - Port: `PGPORT` value
   - Database: `PGDATABASE` value
   - Username: `PGUSER` value
   - Password: `PGPASSWORD` value
3. **Connect** and run the SQL in the query editor

---

## Finding Railway Database Connection Details

### Step-by-Step:
1. Go to https://railway.app
2. Select your project
3. Click on your **PostgreSQL service** (the database)
4. Click the **"Variables"** tab
5. Look for these variables (or similar):
   - `PGHOST` or `DB_HOST`
   - `PGPORT` or `DB_PORT`
   - `PGDATABASE` or `DB_NAME`
   - `PGUSER` or `DB_USER`
   - `PGPASSWORD` or `DB_PASSWORD`

**Note:** Railway might also show a connection URL like:
```
postgresql://postgres:password@hostname:5432/railway
```

You can extract the details from this URL if needed.

---

## Recommended: Use the Migration Script

The migration script (`migrate-damage-assessment-fields.js`) is the easiest and safest option because it:
- ✅ Uses your existing `.env` configuration
- ✅ Handles errors gracefully
- ✅ Shows progress for each step
- ✅ Uses `IF NOT EXISTS` to avoid errors if columns already exist

Just make sure your `.env` file in the `backend/` directory has the Railway database connection details, then run:

```bash
cd backend
node migrate-damage-assessment-fields.js
```

