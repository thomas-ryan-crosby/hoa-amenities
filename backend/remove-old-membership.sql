-- Safely remove old membership for ryan@wetlandx.com
-- This will remove the community_users entry but keep the user account

-- First, let's see what we're working with
SELECT 
    u.id as user_id,
    u.email,
    u."firstName",
    u."lastName",
    cu.id as membership_id,
    cu."communityId",
    cu.role,
    cu.status,
    cu."isActive",
    c.name as community_name
FROM users u
LEFT JOIN community_users cu ON u.id = cu."userId"
LEFT JOIN communities c ON cu."communityId" = c.id
WHERE LOWER(u.email) = LOWER('ryan@wetlandx.com');

-- Remove the community_users entry (membership) for this user
-- This keeps the user account but removes their community association
DELETE FROM community_users
WHERE "userId" IN (
    SELECT id FROM users WHERE LOWER(email) = LOWER('ryan@wetlandx.com')
);

-- Optional: If you also want to remove the user account entirely, uncomment the following:
-- DELETE FROM users
-- WHERE LOWER(email) = LOWER('ryan@wetlandx.com');

-- Verify the deletion
SELECT 
    u.id as user_id,
    u.email,
    cu.id as membership_id
FROM users u
LEFT JOIN community_users cu ON u.id = cu."userId"
WHERE LOWER(u.email) = LOWER('ryan@wetlandx.com');

