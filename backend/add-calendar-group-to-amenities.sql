-- Add calendarGroup field to amenities table
-- Run this in pgAdmin

BEGIN;

-- Add calendarGroup column
ALTER TABLE amenities
ADD COLUMN IF NOT EXISTS "calendarGroup" VARCHAR(255);

-- Add comment to explain the field
COMMENT ON COLUMN amenities."calendarGroup" IS 'Group name for calendar display. Amenities with the same calendarGroup will appear on the same calendar view. NULL means amenity appears on default calendar.';

COMMIT;

-- Verification query
-- SELECT id, name, "calendarGroup" FROM amenities;

