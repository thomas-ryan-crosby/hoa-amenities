-- Add modificationCount field to reservations table
-- This field tracks how many times a reservation has been modified by the user
-- Used to determine if modification fees apply (first change vs additional changes)

DO $$ 
BEGIN
    -- Add modificationCount column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'reservations' AND LOWER(column_name) = 'modificationcount') THEN
        ALTER TABLE reservations
        ADD COLUMN modificationCount INTEGER DEFAULT 0 NOT NULL;
    END IF;
END $$;

-- Update existing reservations to have modificationCount = 0
UPDATE reservations
SET modificationCount = 0
WHERE modificationCount IS NULL;

