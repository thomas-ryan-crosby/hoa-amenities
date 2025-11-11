# Run Migration in pgAdmin - Quick Guide

## ✅ Yes, pgAdmin is Perfect!

Running the migration in pgAdmin is a great choice - it's visual, easy to use, and you can see the results immediately.

## Step-by-Step Instructions

### Step 1: Connect to Railway Database in pgAdmin
1. Open pgAdmin
2. Connect to your Railway database (if you haven't already, see `PGADMIN-CONNECTION-GUIDE.md` for connection details)
3. Navigate to: **Servers** → **Your Railway Server** → **Databases** → **railway** (or your database name) → **Schemas** → **public** → **Tables** → **reservations**

### Step 2: Open Query Tool
1. Right-click on the **reservations** table
2. Select **"Query Tool"** (or press `Alt+Shift+Q`)
3. A query editor window will open

### Step 3: Run the Migration
1. Open the file `backend/add-modification-fields.sql` in your text editor
2. **Copy the entire contents** of the file (all 71 lines)
3. **Paste it into the pgAdmin Query Tool**
4. Click the **"Execute"** button (or press `F5`)

### Step 4: Verify Success
You should see:
- A success message in the "Messages" tab at the bottom
- Something like: `Query returned successfully with no result in X ms`

### Step 5: Verify Columns Were Added
1. In pgAdmin, right-click on the **reservations** table
2. Select **"Properties"** → **"Columns"** tab
3. You should now see these new columns:
   - `modificationStatus`
   - `proposedDate`
   - `proposedPartyTimeStart`
   - `proposedPartyTimeEnd`
   - `modificationReason`
   - `modificationProposedBy`
   - `modificationProposedAt`

## ✅ That's It!

After running the migration, go back to your app and try the propose modification feature again. It should work now!

## 🆘 Troubleshooting

**If you get an error:**
- Make sure you're connected to the correct database (Railway production database)
- Check that you copied the entire SQL file
- Look at the error message - it will tell you what went wrong

**If you're not sure which database:**
- Check your Railway project → PostgreSQL service → Variables tab
- The database name is usually `railway` or `postgres`


