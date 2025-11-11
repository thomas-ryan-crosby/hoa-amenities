-- Add notificationPreferences field to users table
-- This field stores user email notification preferences as JSON

-- Check if column already exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND LOWER(column_name) = 'notificationpreferences'
    ) THEN
        -- Add notificationPreferences column as JSONB
        ALTER TABLE users 
        ADD COLUMN notificationPreferences JSONB DEFAULT '{}';
        
        -- Add comment to document the structure
        COMMENT ON COLUMN users.notificationPreferences IS 'JSON object storing user email notification preferences. Structure: {"reservationCreated": true, "reservationApproved": true, ...}';
        
        RAISE NOTICE 'Column notificationPreferences added successfully';
    ELSE
        RAISE NOTICE 'Column notificationPreferences already exists';
    END IF;
END $$;

