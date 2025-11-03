-- Populate DEMO COMMUNITY with data
-- This script adds ryan@kellby.com as admin to DEMO COMMUNITY and creates sample amenities

BEGIN;

-- Step 1: Get DEMO COMMUNITY ID
DO $$
DECLARE
  demo_community_id INTEGER;
  admin_user_id INTEGER;
BEGIN
  -- Get DEMO COMMUNITY ID
  SELECT id INTO demo_community_id FROM communities WHERE name = 'DEMO COMMUNITY';
  
  IF demo_community_id IS NULL THEN
    RAISE EXCEPTION 'DEMO COMMUNITY not found. Please run the multi-community migration first.';
  END IF;

  -- Get admin user ID (ryan@kellby.com)
  SELECT id INTO admin_user_id FROM users WHERE email = 'ryan@kellby.com';
  
  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION 'User ryan@kellby.com not found.';
  END IF;

  -- Step 2: Add ryan@kellby.com as admin to DEMO COMMUNITY (if not already added)
  INSERT INTO community_users ("communityId", "userId", role, "isActive", "joinedAt", "createdAt", "updatedAt")
  SELECT 
    demo_community_id,
    admin_user_id,
    'admin'::enum_community_users_role,
    true,
    NOW(),
    NOW(),
    NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM community_users 
    WHERE "communityId" = demo_community_id 
    AND "userId" = admin_user_id
  );

  RAISE NOTICE 'Added ryan@kellby.com as admin to DEMO COMMUNITY';

  -- Step 3: Create amenities for DEMO COMMUNITY
  INSERT INTO amenities (name, description, "reservationFee", deposit, capacity, "communityId", "isActive", "createdAt", "updatedAt")
  VALUES
    ('Demo Pool', 'Demo community swimming pool', 50.00, 25.00, 30, demo_community_id, true, NOW(), NOW()),
    ('Demo Clubroom', 'Demo community clubroom for events', 75.00, 50.00, 40, demo_community_id, true, NOW(), NOW()),
    ('Demo Pool + Clubroom', 'Combined pool and clubroom reservation', 100.00, 75.00, 50, demo_community_id, true, NOW(), NOW())
  ON CONFLICT (name, "communityId") DO NOTHING;

  RAISE NOTICE 'Created demo amenities';

END $$;

COMMIT;

-- Verification queries (run these separately to verify)
-- SELECT cu."userId", u.email, cu.role, c.name as community_name
-- FROM community_users cu
-- JOIN users u ON cu."userId" = u.id
-- JOIN communities c ON cu."communityId" = c.id
-- WHERE c.name = 'DEMO COMMUNITY';

-- SELECT a.id, a.name, c.name as community_name
-- FROM amenities a
-- JOIN communities c ON a."communityId" = c.id
-- WHERE c.name = 'DEMO COMMUNITY';

