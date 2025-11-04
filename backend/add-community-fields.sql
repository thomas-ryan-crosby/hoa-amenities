-- Add zipCode and accessCode fields to communities table

BEGIN;

-- Add zipCode column if it doesn't exist
ALTER TABLE communities 
ADD COLUMN IF NOT EXISTS "zipCode" VARCHAR(255);

-- Add accessCode column if it doesn't exist
ALTER TABLE communities 
ADD COLUMN IF NOT EXISTS "accessCode" VARCHAR(255);

-- Create unique index on accessCode (only for non-null values)
CREATE UNIQUE INDEX IF NOT EXISTS "communities_accessCode_unique" 
ON communities("accessCode") 
WHERE "accessCode" IS NOT NULL;

COMMIT;

