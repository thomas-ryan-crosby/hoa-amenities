-- Add approvalRequired field to amenities table
-- Run this in pgAdmin

BEGIN;

ALTER TABLE amenities
ADD COLUMN IF NOT EXISTS "approvalRequired" BOOLEAN NOT NULL DEFAULT TRUE;

COMMIT;

-- Verification query
-- SELECT id, name, "approvalRequired", "janitorialRequired" FROM amenities;

