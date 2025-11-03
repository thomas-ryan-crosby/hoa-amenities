-- Multi-Community Migration SQL Script
-- Run this in pgAdmin or any PostgreSQL client
-- This script creates the necessary tables and migrates existing data

-- First, clear any aborted transaction
ROLLBACK;

-- Start fresh transaction
BEGIN;

-- Step 1: Create communities table
CREATE TABLE IF NOT EXISTS communities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  address TEXT,
  "contactEmail" VARCHAR(255),
  "isActive" BOOLEAN DEFAULT true,
  settings JSONB,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Step 2: Create community_users table
CREATE TABLE IF NOT EXISTS community_users (
  id SERIAL PRIMARY KEY,
  "communityId" INTEGER NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('resident', 'janitorial', 'admin')),
  "isActive" BOOLEAN DEFAULT true,
  "joinedAt" TIMESTAMP DEFAULT NOW(),
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  UNIQUE("communityId", "userId")
);

-- Step 3: Create indexes for community_users
CREATE INDEX IF NOT EXISTS "community_users_community_id_idx" 
ON community_users("communityId");

CREATE INDEX IF NOT EXISTS "community_users_user_id_idx" 
ON community_users("userId");

-- Step 4: Add community_id to amenities table
ALTER TABLE amenities 
ADD COLUMN IF NOT EXISTS "communityId" INTEGER REFERENCES communities(id) ON DELETE CASCADE;

-- Step 5: Add community_id to reservations table
ALTER TABLE reservations 
ADD COLUMN IF NOT EXISTS "communityId" INTEGER REFERENCES communities(id) ON DELETE CASCADE;

-- Step 6: Create indexes for performance
CREATE INDEX IF NOT EXISTS "idx_amenities_community_id" 
ON amenities("communityId");

CREATE INDEX IF NOT EXISTS "idx_reservations_community_id" 
ON reservations("communityId");

-- Step 7: Fix any existing communities with null timestamps
UPDATE communities 
SET "createdAt" = COALESCE("createdAt", NOW()), 
    "updatedAt" = COALESCE("updatedAt", NOW())
WHERE "createdAt" IS NULL OR "updatedAt" IS NULL;

-- Step 7b: Create production community for existing data
INSERT INTO communities (name, description, address, "isActive", "createdAt", "updatedAt")
SELECT 'The Sanctuary - Mandeville, LA', 
       'Production community containing all existing data migrated from single-community system', 
       'Mandeville, LA',
       true,
       NOW(),
       NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM communities WHERE name = 'The Sanctuary - Mandeville, LA'
);

-- Step 8: Create demo community
INSERT INTO communities (name, description, "isActive", "createdAt", "updatedAt")
SELECT 'DEMO COMMUNITY', 
       'Demo community for testing and demonstration purposes', 
       true,
       NOW(),
       NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM communities WHERE name = 'DEMO COMMUNITY'
);

-- Step 9: Get sanctuary community ID and assign users
DO $$
DECLARE
  sanctuary_id INTEGER;
BEGIN
  -- Get sanctuary community ID
  SELECT id INTO sanctuary_id FROM communities WHERE name = 'The Sanctuary - Mandeville, LA';
  
  IF sanctuary_id IS NULL THEN
    RAISE EXCEPTION 'Sanctuary community not found. Please ensure it was created.';
  END IF;
  
  -- Step 10: Assign all existing users to sanctuary community with their current role
  -- Cast the role enum from users table to community_users enum type via text
  INSERT INTO community_users ("communityId", "userId", role, "isActive", "joinedAt", "createdAt", "updatedAt")
  SELECT 
    sanctuary_id,
    id,
    role::text::enum_community_users_role,
    "isActive",
    NOW(),
    NOW(),
    NOW()
  FROM users
  WHERE id NOT IN (
    SELECT "userId" FROM community_users WHERE "communityId" = sanctuary_id
  );
  
  -- Step 11: Assign all existing amenities to sanctuary community
  UPDATE amenities 
  SET "communityId" = sanctuary_id
  WHERE "communityId" IS NULL;
  
  -- Step 12: Assign all existing reservations to sanctuary community
  UPDATE reservations 
  SET "communityId" = sanctuary_id
  WHERE "communityId" IS NULL;
END $$;

-- Step 13: Make community_id NOT NULL (after data migration)
-- Check if there are any NULL values first
DO $$
DECLARE
  null_amenities INTEGER;
  null_reservations INTEGER;
BEGIN
  SELECT COUNT(*) INTO null_amenities FROM amenities WHERE "communityId" IS NULL;
  SELECT COUNT(*) INTO null_reservations FROM reservations WHERE "communityId" IS NULL;
  
  IF null_amenities = 0 AND null_reservations = 0 THEN
    -- Only set NOT NULL if no NULL values exist
    BEGIN
      ALTER TABLE amenities ALTER COLUMN "communityId" SET NOT NULL;
      ALTER TABLE reservations ALTER COLUMN "communityId" SET NOT NULL;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Could not set NOT NULL constraint: %', SQLERRM;
    END;
  ELSE
    RAISE NOTICE 'Skipping NOT NULL constraint - found % amenities and % reservations with NULL communityId', 
      null_amenities, null_reservations;
  END IF;
END $$;

-- Step 14: Update unique constraint on amenities name to be per-community
-- Drop existing unique constraint if it exists
ALTER TABLE amenities 
DROP CONSTRAINT IF EXISTS amenities_name_key;

-- Create unique index on (name, communityId)
CREATE UNIQUE INDEX IF NOT EXISTS amenities_name_community_unique 
ON amenities(name, "communityId");

COMMIT;

-- Verification queries (run these separately to verify)
-- SELECT COUNT(*) as communities_count FROM communities;
-- SELECT COUNT(*) as community_users_count FROM community_users;
-- SELECT COUNT(*) as amenities_with_community FROM amenities WHERE "communityId" IS NOT NULL;
-- SELECT COUNT(*) as reservations_with_community FROM reservations WHERE "communityId" IS NOT NULL;
-- SELECT * FROM communities;

