-- Add status field to community_users table
-- Status values: 'pending', 'approved', 'banned'
-- Default: 'pending' for new memberships, 'approved' for existing ones

-- Add status column
ALTER TABLE community_users
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'approved';

-- Update existing records to 'approved' (they were already active)
UPDATE community_users
SET status = 'approved'
WHERE status IS NULL OR status = '';

-- Set NOT NULL constraint after updating existing records
-- Only if the column doesn't already have NOT NULL
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'community_users' 
        AND column_name = 'status' 
        AND is_nullable = 'YES'
    ) THEN
        ALTER TABLE community_users
        ALTER COLUMN status SET NOT NULL;
    END IF;
END $$;

-- Drop constraint if it exists, then add it
ALTER TABLE community_users
DROP CONSTRAINT IF EXISTS check_status_valid;

ALTER TABLE community_users
ADD CONSTRAINT check_status_valid 
CHECK (status IN ('pending', 'approved', 'banned'));

-- Create index for faster queries on status
CREATE INDEX IF NOT EXISTS idx_community_users_status ON community_users(status);

-- Create index for faster queries on community and status
CREATE INDEX IF NOT EXISTS idx_community_users_community_status ON community_users("communityId", status);

