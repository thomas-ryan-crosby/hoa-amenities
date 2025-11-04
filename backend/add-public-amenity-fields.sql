-- Add public amenity fields to amenities table
-- Run this in pgAdmin

BEGIN;

-- Add public amenity fields
ALTER TABLE amenities
ADD COLUMN IF NOT EXISTS "isPublic" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "publicReservationFee" DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS "publicDeposit" DECIMAL(10, 2);

-- Add comment to explain the fields
COMMENT ON COLUMN amenities."isPublic" IS 'Whether amenity can be booked by non-community members';
COMMENT ON COLUMN amenities."publicReservationFee" IS 'Different reservation fee for public users (NULL = same as reservationFee)';
COMMENT ON COLUMN amenities."publicDeposit" IS 'Different deposit for public users (NULL = same as deposit)';

COMMIT;

-- Verification query
-- SELECT id, name, "isPublic", "publicReservationFee", "publicDeposit" FROM amenities;

