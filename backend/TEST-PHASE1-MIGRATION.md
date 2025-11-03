# Testing Phase 1 - Multi-Community Migration

## Pre-Flight Checklist

Before running the migration:

- [ ] **Backup your database** (especially if running on production)
- [ ] **Review the migration script** (`migrate-to-multi-community.js`)
- [ ] **Ensure you have database connection details** in `.env` file
- [ ] **Test on staging/development database first** (recommended)

## Running the Migration

### Option 1: Run Locally (Recommended for Testing)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Ensure `.env` file exists with database connection details:**
   ```
   DB_HOST=<your-db-host>
   DB_PORT=5432
   DB_NAME=<your-db-name>
   DB_USER=<your-db-user>
   DB_PASSWORD=<your-db-password>
   ```

3. **Install dependencies if needed:**
   ```bash
   npm install
   ```

4. **Run the migration script:**
   ```bash
   node migrate-to-multi-community.js
   ```

### Option 2: Run via API Endpoint (Like Previous Migrations)

You can create an API endpoint similar to the damage-assessment migration. However, this is a large migration, so running locally might be safer.

### Option 3: Run on Railway (If Local Connection Fails)

1. Go to Railway → Your Backend Service
2. Click "Deployments" → Latest deployment → "Shell"
3. Navigate to backend directory
4. Run: `node migrate-to-multi-community.js`

## What the Migration Does

The migration script will:

1. ✅ Create `communities` table
2. ✅ Create `community_users` table
3. ✅ Add `communityId` column to `amenities` table
4. ✅ Add `communityId` column to `reservations` table
5. ✅ Create indexes for performance
6. ✅ Create "The Sanctuary - Mandeville, LA" community
7. ✅ Create "DEMO COMMUNITY"
8. ✅ Assign all existing users to sanctuary community with their current roles
9. ✅ Assign all existing amenities to sanctuary community
10. ✅ Assign all existing reservations to sanctuary community
11. ✅ Make `communityId` NOT NULL after migration
12. ✅ Update unique constraint on amenities (name unique per community)

## Expected Output

You should see output like:

```
📋 Using connection details:
   Host: ...
   Port: 5432
   Database: ...
   User: ...

🔌 Connecting to database...
✅ Connected to database

🚀 Starting multi-community migration...
📦 Creating communities table...
📦 Creating community_users table...
📊 Creating indexes...
🏘️ Creating "The Sanctuary - Mandeville, LA" community...
✅ Created sanctuary community with id: 1
🏘️ Creating "DEMO COMMUNITY"...
✅ Created demo community with id: 2
👥 Assigning users to sanctuary community...
✅ Assigned X users to sanctuary community
🏊 Assigning amenities to sanctuary community...
✅ Assigned X amenities to sanctuary community
📅 Assigning reservations to sanctuary community...
✅ Assigned X reservations to sanctuary community
🔒 Making community_id required...
✅ Migration completed successfully!

📊 Migration Summary:
   Communities: 2
   Community-User relationships: X
   Amenities with community: X
   Reservations with community: X

🎉 All done!
```

## Verification Steps

After migration, verify:

1. **Check communities were created:**
   ```sql
   SELECT id, name, "isActive" FROM communities;
   ```
   Should show:
   - "The Sanctuary - Mandeville, LA"
   - "DEMO COMMUNITY"

2. **Check users were assigned:**
   ```sql
   SELECT cu."userId", u.email, cu.role, c.name 
   FROM community_users cu
   JOIN users u ON cu."userId" = u.id
   JOIN communities c ON cu."communityId" = c.id
   WHERE c.name = 'The Sanctuary - Mandeville, LA';
   ```

3. **Check amenities were assigned:**
   ```sql
   SELECT a.id, a.name, c.name as community_name
   FROM amenities a
   JOIN communities c ON a."communityId" = c.id
   WHERE c.name = 'The Sanctuary - Mandeville, LA';
   ```

4. **Check reservations were assigned:**
   ```sql
   SELECT COUNT(*) as reservation_count
   FROM reservations r
   JOIN communities c ON r."communityId" = c.id
   WHERE c.name = 'The Sanctuary - Mandeville, LA';
   ```

## Troubleshooting

### Error: "Missing required database connection variables"
- Ensure `.env` file exists in `backend/` directory
- Check that all required variables are set (DB_HOST, DB_NAME, DB_USER, DB_PASSWORD)

### Error: "Connection refused" or "Connection timeout"
- Railway databases may not allow external connections
- Try Option 3 (run on Railway) instead
- Or use a VPN/proxy that Railway allows

### Error: "relation already exists"
- Tables might already exist from a previous migration attempt
- The script uses `IF NOT EXISTS` so this should be safe to ignore
- Or the migration was already run - check the database

### Error: "column already exists"
- `communityId` columns might already exist
- The script should handle this with `IF NOT EXISTS` - check if there's an issue

## Rollback Plan

If something goes wrong, the migration runs in a transaction, so you can:

1. Check the error message
2. The transaction will be rolled back automatically
3. Check your database state - it should be unchanged

**Note:** If you need to manually rollback after a successful migration, you would need to:
- Drop the new columns
- Drop the new tables
- Remove the communities
- This is complex, so make sure to backup first!

## Next Steps After Successful Migration

Once the migration completes successfully:

1. ✅ Phase 1 is complete
2. ➡️ Move to Phase 2: Backend API changes
3. ➡️ Move to Phase 3: Frontend changes

The database schema is now ready for multi-community support!

