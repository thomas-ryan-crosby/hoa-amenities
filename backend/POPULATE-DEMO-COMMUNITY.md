# Populating DEMO COMMUNITY

## Quick Steps

1. **Open pgAdmin**
2. **Connect to your Railway database**
3. **Open Query Tool** (Right-click on your database → Query Tool)
4. **Copy and paste the SQL from `populate-demo-community.sql`**
5. **Execute the script** (Press F5 or click the Execute button)

## What the Script Does

1. ✅ Finds the DEMO COMMUNITY
2. ✅ Finds the user ryan@kellby.com
3. ✅ Adds ryan@kellby.com as admin to DEMO COMMUNITY
4. ✅ Creates 3 demo amenities:
   - Demo Pool
   - Demo Clubroom
   - Demo Pool + Clubroom

## Verification

After running the script, verify with these queries:

```sql
-- Check admin assignment
SELECT cu."userId", u.email, cu.role, c.name as community_name
FROM community_users cu
JOIN users u ON cu."userId" = u.id
JOIN communities c ON cu."communityId" = c.id
WHERE c.name = 'DEMO COMMUNITY';

-- Check amenities
SELECT a.id, a.name, a.description, a."reservationFee", a.deposit, a.capacity
FROM amenities a
JOIN communities c ON a."communityId" = c.id
WHERE c.name = 'DEMO COMMUNITY';
```

## Next Steps

After populating DEMO COMMUNITY:
1. Log in with ryan@kellby.com / admin123
2. Switch to DEMO COMMUNITY using the community selector
3. You should see the demo amenities available for booking

