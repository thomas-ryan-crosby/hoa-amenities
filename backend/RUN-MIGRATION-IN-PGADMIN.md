# Running Multi-Community Migration in pgAdmin

## Quick Steps

1. **Open pgAdmin**
2. **Connect to your Railway database**
3. **Open Query Tool** (Right-click on your database → Query Tool)
4. **Copy and paste the SQL from `migrate-multi-community.sql`**
5. **Execute the query** (Press F5 or click the Execute button)

## What the Migration Does

The SQL script will:
1. ✅ Create `communities` table
2. ✅ Create `community_users` table
3. ✅ Add `communityId` columns to `amenities` and `reservations`
4. ✅ Create indexes for performance
5. ✅ Create "The Sanctuary - Mandeville, LA" community
6. ✅ Create "DEMO COMMUNITY"
7. ✅ Assign all existing users to sanctuary community with their current roles
8. ✅ Assign all existing amenities to sanctuary community
9. ✅ Assign all existing reservations to sanctuary community
10. ✅ Make `communityId` NOT NULL after migration
11. ✅ Update unique constraint on amenities (name unique per community)

## Verification

After running the migration, run these queries to verify:

```sql
-- Check communities were created
SELECT * FROM communities;

-- Check users were assigned
SELECT cu."userId", u.email, cu.role, c.name as community_name
FROM community_users cu
JOIN users u ON cu."userId" = u.id
JOIN communities c ON cu."communityId" = c.id
WHERE c.name = 'The Sanctuary - Mandeville, LA';

-- Check amenities were assigned
SELECT a.id, a.name, c.name as community_name
FROM amenities a
JOIN communities c ON a."communityId" = c.id
WHERE c.name = 'The Sanctuary - Mandeville, LA';

-- Check reservations were assigned
SELECT COUNT(*) as reservation_count
FROM reservations r
JOIN communities c ON r."communityId" = c.id
WHERE c.name = 'The Sanctuary - Mandeville, LA';
```

## Troubleshooting

### Error: "relation already exists"
- Tables might already exist from a previous migration attempt
- The script uses `IF NOT EXISTS` so this should be safe to ignore

### Error: "column already exists"
- `communityId` columns might already exist
- The script uses `IF NOT EXISTS` so this should be safe to ignore

### Error: "duplicate key value"
- Communities might already exist
- The script uses `WHERE NOT EXISTS` to prevent duplicates

## After Migration

Once the migration completes successfully:
1. ✅ Database schema is ready for multi-community
2. ✅ All existing data is assigned to "The Sanctuary - Mandeville, LA"
3. ✅ "DEMO COMMUNITY" is ready for testing
4. ✅ You can proceed with Phase 2 (Backend API changes)

