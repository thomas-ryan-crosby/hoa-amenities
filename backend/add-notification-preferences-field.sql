-- Add notification_preferences field to users table
-- This field stores user email notification preferences as JSON

-- Check if column already exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND LOWER(column_name) = 'notification_preferences'
    ) THEN
        -- Add notification_preferences column as JSONB (lowercase, snake_case for PostgreSQL)
        ALTER TABLE users 
        ADD COLUMN notification_preferences JSONB DEFAULT '{}';
        
        -- Add comment to document the structure
        COMMENT ON COLUMN users.notification_preferences IS 'JSON object storing user email notification preferences. Structure: {"reservationCreated": true, "reservationApproved": true, ...}';
        
        RAISE NOTICE 'Column notification_preferences added successfully';
    ELSE
        RAISE NOTICE 'Column notification_preferences already exists';
    END IF;
END $$;

