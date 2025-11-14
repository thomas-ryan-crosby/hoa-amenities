-- Remove All Data Associated with Test/Development Email Addresses
-- This script removes users, their reservations, communities they created, and all related data
--
-- WARNING: This is a destructive operation. Review the preview queries before executing.
-- Run this script in a transaction so you can rollback if needed.

BEGIN;

-- List of emails to remove
-- Update this list as needed
DO $$
DECLARE
    emails_to_remove TEXT[] := ARRAY[
        'clairelcrosby@gmail.com',
        'Thomas.ryan.crosby@gmail.com',
        'ryan@wetlandx.com',
        'ryan@serviorealty.com',
        'tommy@crosbydevelopment.com',
        'warren297@yahoo.com',
        'warren.jt.96@gmail.com',
        'christianmaloney27@gmail.com',
        'c.maloney10254030@gmail.com'
    ];
BEGIN
    -- Step 1: Preview - Find all users matching these emails
    RAISE NOTICE '=== STEP 1: Users to be deleted ===';
    PERFORM 1; -- Placeholder for preview query
END $$;

-- Step 1: Preview - Find all users matching these emails
SELECT 
    id,
    email,
    "firstName",
    "lastName",
    role,
    "isActive",
    "createdAt"
FROM users
WHERE LOWER(email) IN (
    LOWER('clairelcrosby@gmail.com'),
    LOWER('Thomas.ryan.crosby@gmail.com'),
    LOWER('ryan@wetlandx.com'),
    LOWER('ryan@serviorealty.com'),
    LOWER('tommy@crosbydevelopment.com'),
    LOWER('warren297@yahoo.com'),
    LOWER('warren.jt.96@gmail.com'),
    LOWER('christianmaloney27@gmail.com'),
    LOWER('c.maloney10254030@gmail.com')
)
ORDER BY email;

-- Step 2: Preview - Find all reservations for these users
SELECT 
    r.id,
    r."userId",
    u.email,
    r."amenityId",
    r.date,
    r."eventName",
    r.status,
    r."createdAt"
FROM reservations r
INNER JOIN users u ON r."userId" = u.id
WHERE LOWER(u.email) IN (
    LOWER('clairelcrosby@gmail.com'),
    LOWER('Thomas.ryan.crosby@gmail.com'),
    LOWER('ryan@wetlandx.com'),
    LOWER('ryan@serviorealty.com'),
    LOWER('tommy@crosbydevelopment.com'),
    LOWER('warren297@yahoo.com'),
    LOWER('warren.jt.96@gmail.com'),
    LOWER('christianmaloney27@gmail.com'),
    LOWER('c.maloney10254030@gmail.com')
)
ORDER BY r."createdAt" DESC;

-- Step 3: Preview - Find all communities where these users are members (as admins)
-- Note: Communities may not have a createdBy field, so we check for admin memberships
SELECT 
    c.id,
    c.name,
    c."accessCode",
    u.email as "adminEmail",
    cu.role,
    c."createdAt"
FROM communities c
INNER JOIN community_users cu ON c.id = cu."communityId"
INNER JOIN users u ON cu."userId" = u.id
WHERE LOWER(u.email) IN (
    LOWER('clairelcrosby@gmail.com'),
    LOWER('Thomas.ryan.crosby@gmail.com'),
    LOWER('ryan@wetlandx.com'),
    LOWER('ryan@serviorealty.com'),
    LOWER('tommy@crosbydevelopment.com'),
    LOWER('warren297@yahoo.com'),
    LOWER('warren.jt.96@gmail.com'),
    LOWER('christianmaloney27@gmail.com'),
    LOWER('c.maloney10254030@gmail.com')
)
AND cu.role = 'admin'
ORDER BY c."createdAt" DESC;

-- Step 4: Preview - Find all community memberships for these users
SELECT 
    cu.id as "membershipId",
    cu."userId",
    u.email,
    cu."communityId",
    c.name as "communityName",
    cu.role,
    cu.status,
    cu."joinedAt"
FROM community_users cu
INNER JOIN users u ON cu."userId" = u.id
INNER JOIN communities c ON cu."communityId" = c.id
WHERE LOWER(u.email) IN (
    LOWER('clairelcrosby@gmail.com'),
    LOWER('Thomas.ryan.crosby@gmail.com'),
    LOWER('ryan@wetlandx.com'),
    LOWER('ryan@serviorealty.com'),
    LOWER('tommy@crosbydevelopment.com'),
    LOWER('warren297@yahoo.com'),
    LOWER('warren.jt.96@gmail.com'),
    LOWER('christianmaloney27@gmail.com'),
    LOWER('c.maloney10254030@gmail.com')
)
ORDER BY cu."joinedAt" DESC;

-- Step 5: Count summary
SELECT 
    'Users' as "Entity",
    COUNT(*) as "Count"
FROM users
WHERE LOWER(email) IN (
    LOWER('clairelcrosby@gmail.com'),
    LOWER('Thomas.ryan.crosby@gmail.com'),
    LOWER('ryan@wetlandx.com'),
    LOWER('ryan@serviorealty.com'),
    LOWER('tommy@crosbydevelopment.com'),
    LOWER('warren297@yahoo.com'),
    LOWER('warren.jt.96@gmail.com'),
    LOWER('christianmaloney27@gmail.com'),
    LOWER('c.maloney10254030@gmail.com')
)
UNION ALL
SELECT 
    'Reservations' as "Entity",
    COUNT(*) as "Count"
FROM reservations r
INNER JOIN users u ON r."userId" = u.id
WHERE LOWER(u.email) IN (
    LOWER('clairelcrosby@gmail.com'),
    LOWER('Thomas.ryan.crosby@gmail.com'),
    LOWER('ryan@wetlandx.com'),
    LOWER('ryan@serviorealty.com'),
    LOWER('tommy@crosbydevelopment.com'),
    LOWER('warren297@yahoo.com'),
    LOWER('warren.jt.96@gmail.com'),
    LOWER('christianmaloney27@gmail.com'),
    LOWER('c.maloney10254030@gmail.com')
)
UNION ALL
SELECT 
    'Communities (Admin Members)' as "Entity",
    COUNT(DISTINCT c.id) as "Count"
FROM communities c
INNER JOIN community_users cu ON c.id = cu."communityId"
INNER JOIN users u ON cu."userId" = u.id
WHERE LOWER(u.email) IN (
    LOWER('clairelcrosby@gmail.com'),
    LOWER('Thomas.ryan.crosby@gmail.com'),
    LOWER('ryan@wetlandx.com'),
    LOWER('ryan@serviorealty.com'),
    LOWER('tommy@crosbydevelopment.com'),
    LOWER('warren297@yahoo.com'),
    LOWER('warren.jt.96@gmail.com'),
    LOWER('christianmaloney27@gmail.com'),
    LOWER('c.maloney10254030@gmail.com')
)
AND cu.role = 'admin'
UNION ALL
SELECT 
    'Community Memberships' as "Entity",
    COUNT(*) as "Count"
FROM community_users cu
INNER JOIN users u ON cu."userId" = u.id
WHERE LOWER(u.email) IN (
    LOWER('clairelcrosby@gmail.com'),
    LOWER('Thomas.ryan.crosby@gmail.com'),
    LOWER('ryan@wetlandx.com'),
    LOWER('ryan@serviorealty.com'),
    LOWER('tommy@crosbydevelopment.com'),
    LOWER('warren297@yahoo.com'),
    LOWER('warren.jt.96@gmail.com'),
    LOWER('christianmaloney27@gmail.com'),
    LOWER('c.maloney10254030@gmail.com')
);

-- ============================================
-- DELETION OPERATIONS
-- ============================================
-- Review the preview queries above before proceeding
-- Uncomment the sections below to execute deletions

-- Step 1: Delete all reservations for these users
DELETE FROM reservations
WHERE "userId" IN (
    SELECT id FROM users
    WHERE LOWER(email) IN (
        LOWER('clairelcrosby@gmail.com'),
        LOWER('Thomas.ryan.crosby@gmail.com'),
        LOWER('ryan@wetlandx.com'),
        LOWER('ryan@serviorealty.com'),
        LOWER('tommy@crosbydevelopment.com'),
        LOWER('warren297@yahoo.com'),
        LOWER('warren.jt.96@gmail.com'),
        LOWER('christianmaloney27@gmail.com'),
        LOWER('c.maloney10254030@gmail.com')
    )
);

-- Step 2: Delete all community memberships for these users
DELETE FROM community_users
WHERE "userId" IN (
    SELECT id FROM users
    WHERE LOWER(email) IN (
        LOWER('clairelcrosby@gmail.com'),
        LOWER('Thomas.ryan.crosby@gmail.com'),
        LOWER('ryan@wetlandx.com'),
        LOWER('ryan@serviorealty.com'),
        LOWER('tommy@crosbydevelopment.com'),
        LOWER('warren297@yahoo.com'),
        LOWER('warren.jt.96@gmail.com'),
        LOWER('christianmaloney27@gmail.com'),
        LOWER('c.maloney10254030@gmail.com')
    )
);

-- Step 3: Delete communities where these users are the only admin
-- WARNING: This will delete entire communities if these users are the only admins
-- Only uncomment if you want to delete communities where these users are admins
-- NOTE: This is a complex operation - communities will only be deleted if:
-- 1. The user is an admin of the community
-- 2. There are no other admin members in that community
-- 
-- DELETE FROM communities
-- WHERE id IN (
--     SELECT c.id
--     FROM communities c
--     INNER JOIN community_users cu ON c.id = cu."communityId"
--     INNER JOIN users u ON cu."userId" = u.id
--     WHERE LOWER(u.email) IN (
--         LOWER('clairelcrosby@gmail.com'),
--         LOWER('Thomas.ryan.crosby@gmail.com'),
--         LOWER('ryan@wetlandx.com'),
--         LOWER('ryan@serviorealty.com'),
--         LOWER('tommy@crosbydevelopment.com'),
--         LOWER('warren297@yahoo.com'),
--         LOWER('warren.jt.96@gmail.com'),
--         LOWER('christianmaloney27@gmail.com'),
--         LOWER('c.maloney10254030@gmail.com')
--     )
--     AND cu.role = 'admin'
--     AND NOT EXISTS (
--         SELECT 1
--         FROM community_users cu2
--         WHERE cu2."communityId" = c.id
--         AND cu2.role = 'admin'
--         AND cu2."userId" NOT IN (
--             SELECT id FROM users
--             WHERE LOWER(email) IN (
--                 LOWER('clairelcrosby@gmail.com'),
--                 LOWER('Thomas.ryan.crosby@gmail.com'),
--                 LOWER('ryan@wetlandx.com'),
--                 LOWER('ryan@serviorealty.com'),
--                 LOWER('tommy@crosbydevelopment.com'),
--                 LOWER('warren297@yahoo.com'),
--                 LOWER('warren.jt.96@gmail.com'),
--                 LOWER('christianmaloney27@gmail.com'),
--                 LOWER('c.maloney10254030@gmail.com')
--             )
--         )
--     )
-- );

-- Step 4: Delete the users themselves
DELETE FROM users
WHERE LOWER(email) IN (
    LOWER('clairelcrosby@gmail.com'),
    LOWER('Thomas.ryan.crosby@gmail.com'),
    LOWER('ryan@wetlandx.com'),
    LOWER('ryan@serviorealty.com'),
    LOWER('tommy@crosbydevelopment.com'),
    LOWER('warren297@yahoo.com'),
    LOWER('warren.jt.96@gmail.com'),
    LOWER('christianmaloney27@gmail.com'),
    LOWER('c.maloney10254030@gmail.com')
);

-- ============================================
-- VERIFICATION QUERIES (Run after deletion)
-- ============================================
-- Verify no users remain
SELECT COUNT(*) as "Remaining Users"
FROM users
WHERE LOWER(email) IN (
    LOWER('clairelcrosby@gmail.com'),
    LOWER('Thomas.ryan.crosby@gmail.com'),
    LOWER('ryan@wetlandx.com'),
    LOWER('ryan@serviorealty.com'),
    LOWER('tommy@crosbydevelopment.com'),
    LOWER('warren297@yahoo.com'),
    LOWER('warren.jt.96@gmail.com'),
    LOWER('christianmaloney27@gmail.com'),
    LOWER('c.maloney10254030@gmail.com')
);

-- Verify no reservations remain
SELECT COUNT(*) as "Remaining Reservations"
FROM reservations r
INNER JOIN users u ON r."userId" = u.id
WHERE LOWER(u.email) IN (
    LOWER('clairelcrosby@gmail.com'),
    LOWER('Thomas.ryan.crosby@gmail.com'),
    LOWER('ryan@wetlandx.com'),
    LOWER('ryan@serviorealty.com'),
    LOWER('tommy@crosbydevelopment.com'),
    LOWER('warren297@yahoo.com'),
    LOWER('warren.jt.96@gmail.com'),
    LOWER('christianmaloney27@gmail.com'),
    LOWER('c.maloney10254030@gmail.com')
);

-- Verify no community memberships remain
SELECT COUNT(*) as "Remaining Memberships"
FROM community_users cu
INNER JOIN users u ON cu."userId" = u.id
WHERE LOWER(u.email) IN (
    LOWER('clairelcrosby@gmail.com'),
    LOWER('Thomas.ryan.crosby@gmail.com'),
    LOWER('ryan@wetlandx.com'),
    LOWER('ryan@serviorealty.com'),
    LOWER('tommy@crosbydevelopment.com'),
    LOWER('warren297@yahoo.com'),
    LOWER('warren.jt.96@gmail.com'),
    LOWER('christianmaloney27@gmail.com'),
    LOWER('c.maloney10254030@gmail.com')
);

-- Review the results above, then either:
-- COMMIT;  -- to save the changes
-- ROLLBACK;  -- to undo the changes

