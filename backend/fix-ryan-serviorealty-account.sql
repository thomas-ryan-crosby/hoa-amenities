-- Fix issues for ryan@serviorealty.com account
-- 1. Verify the email address
-- 2. Approve the community membership (should be auto-approved for community creator)
-- 3. Check SendGrid configuration

-- First, let's see the current state
SELECT 
    u.id as user_id,
    u.email,
    u."firstName",
    u."lastName",
    u."emailVerified",
    cu.id as membership_id,
    cu."communityId",
    cu.role,
    cu.status,
    cu."isActive",
    c.name as community_name,
    c."isActive" as community_is_active
FROM users u
LEFT JOIN community_users cu ON u.id = cu."userId"
LEFT JOIN communities c ON cu."communityId" = c.id
WHERE LOWER(u.email) = LOWER('ryan@serviorealty.com');

-- Fix 1: Verify the email address
UPDATE users
SET 
    "emailVerified" = true,
    "emailVerificationToken" = NULL,
    "emailVerificationTokenExpires" = NULL
WHERE LOWER(email) = LOWER('ryan@serviorealty.com');

-- Fix 2: Approve the community membership (community creator should be auto-approved)
UPDATE community_users
SET status = 'approved'
WHERE "userId" IN (
    SELECT id FROM users WHERE LOWER(email) = LOWER('ryan@serviorealty.com')
)
AND status = 'pending';

-- Verify the fixes
SELECT 
    u.id as user_id,
    u.email,
    u."emailVerified",
    cu.id as membership_id,
    cu."communityId",
    cu.role,
    cu.status,
    cu."isActive",
    c.name as community_name
FROM users u
LEFT JOIN community_users cu ON u.id = cu."userId"
LEFT JOIN communities c ON cu."communityId" = c.id
WHERE LOWER(u.email) = LOWER('ryan@serviorealty.com');

