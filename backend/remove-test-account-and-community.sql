-- Remove ryan@serviorealty.com account and Tchefuncte Club Estates community
-- This will remove all associated data including memberships, reservations, amenities, etc.

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
    c.id as community_id,
    c.name as community_name,
    c."isActive" as community_is_active
FROM users u
LEFT JOIN community_users cu ON u.id = cu."userId"
LEFT JOIN communities c ON cu."communityId" = c.id
WHERE LOWER(u.email) = LOWER('ryan@serviorealty.com')
   OR LOWER(c.name) LIKE LOWER('%Tchefunct%');

-- Get community ID for Tchefuncte Club Estates
DO $$
DECLARE
    community_id_to_delete INTEGER;
    user_id_to_delete INTEGER;
BEGIN
    -- Find the community ID
    SELECT id INTO community_id_to_delete
    FROM communities
    WHERE LOWER(name) LIKE LOWER('%Tchefunct%');
    
    -- Find the user ID
    SELECT id INTO user_id_to_delete
    FROM users
    WHERE LOWER(email) = LOWER('ryan@serviorealty.com');
    
    -- Show what will be deleted
    RAISE NOTICE 'Community ID to delete: %', community_id_to_delete;
    RAISE NOTICE 'User ID to delete: %', user_id_to_delete;
    
    -- Delete reservations for this community
    IF community_id_to_delete IS NOT NULL THEN
        DELETE FROM reservations WHERE "communityId" = community_id_to_delete;
        RAISE NOTICE 'Deleted reservations for community %', community_id_to_delete;
    END IF;
    
    -- Delete amenities for this community
    IF community_id_to_delete IS NOT NULL THEN
        DELETE FROM amenities WHERE "communityId" = community_id_to_delete;
        RAISE NOTICE 'Deleted amenities for community %', community_id_to_delete;
    END IF;
    
    -- Delete community_users entries (memberships) for this community
    IF community_id_to_delete IS NOT NULL THEN
        DELETE FROM community_users WHERE "communityId" = community_id_to_delete;
        RAISE NOTICE 'Deleted memberships for community %', community_id_to_delete;
    END IF;
    
    -- Delete community_users entries for this user (in case they're in other communities)
    IF user_id_to_delete IS NOT NULL THEN
        DELETE FROM community_users WHERE "userId" = user_id_to_delete;
        RAISE NOTICE 'Deleted memberships for user %', user_id_to_delete;
    END IF;
    
    -- Delete the community
    IF community_id_to_delete IS NOT NULL THEN
        DELETE FROM communities WHERE id = community_id_to_delete;
        RAISE NOTICE 'Deleted community %', community_id_to_delete;
    END IF;
    
    -- Delete the user account
    IF user_id_to_delete IS NOT NULL THEN
        DELETE FROM users WHERE id = user_id_to_delete;
        RAISE NOTICE 'Deleted user %', user_id_to_delete;
    END IF;
END $$;

-- Verify the deletion
SELECT 
    u.id as user_id,
    u.email,
    cu.id as membership_id,
    c.id as community_id,
    c.name as community_name
FROM users u
LEFT JOIN community_users cu ON u.id = cu."userId"
LEFT JOIN communities c ON cu."communityId" = c.id
WHERE LOWER(u.email) = LOWER('ryan@serviorealty.com')
   OR LOWER(c.name) LIKE LOWER('%Tchefunct%');

-- If the above returns no rows, the deletion was successful

