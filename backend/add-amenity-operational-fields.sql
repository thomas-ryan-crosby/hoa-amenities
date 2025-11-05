-- Add operational fields to amenities table
-- Run this in pgAdmin

BEGIN;

-- Add operational fields
ALTER TABLE amenities
ADD COLUMN IF NOT EXISTS "daysOfOperation" TEXT,
ADD COLUMN IF NOT EXISTS "hoursOfOperation" TEXT,
ADD COLUMN IF NOT EXISTS "displayColor" VARCHAR(7) DEFAULT '#355B45',
ADD COLUMN IF NOT EXISTS "janitorialRequired" BOOLEAN DEFAULT true;

-- Add comments to explain the fields
COMMENT ON COLUMN amenities."daysOfOperation" IS 'JSON string of days of operation (e.g., ["monday", "tuesday", "wednesday"])';
COMMENT ON COLUMN amenities."hoursOfOperation" IS 'JSON string of hours (e.g., {"open": "09:00", "close": "17:00"} or {"open24Hours": true})';
COMMENT ON COLUMN amenities."displayColor" IS 'Hex color code for calendar display (e.g., "#355B45")';
COMMENT ON COLUMN amenities."janitorialRequired" IS 'Whether janitorial approval is required for reservations';

COMMIT;

-- Verification query
-- SELECT id, name, "daysOfOperation", "hoursOfOperation", "displayColor", "janitorialRequired" FROM amenities;

