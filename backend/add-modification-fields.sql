-- Add modification proposal fields to reservations table
-- This migration adds fields to track proposed modifications to unconfirmed reservations

-- Add columns (check if they exist first for PostgreSQL)
DO $$ 
BEGIN
    -- Add modificationStatus column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'reservations' AND column_name = 'modificationStatus') THEN
        ALTER TABLE reservations
        ADD COLUMN modificationStatus VARCHAR(20) DEFAULT 'NONE' CHECK (modificationStatus IN ('NONE', 'PENDING', 'ACCEPTED', 'REJECTED'));
    END IF;
    
    -- Add proposedDate column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'reservations' AND column_name = 'proposedDate') THEN
        ALTER TABLE reservations ADD COLUMN proposedDate DATE NULL;
    END IF;
    
    -- Add proposedPartyTimeStart column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'reservations' AND column_name = 'proposedPartyTimeStart') THEN
        ALTER TABLE reservations ADD COLUMN proposedPartyTimeStart TIMESTAMP NULL;
    END IF;
    
    -- Add proposedPartyTimeEnd column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'reservations' AND column_name = 'proposedPartyTimeEnd') THEN
        ALTER TABLE reservations ADD COLUMN proposedPartyTimeEnd TIMESTAMP NULL;
    END IF;
    
    -- Add modificationReason column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'reservations' AND column_name = 'modificationReason') THEN
        ALTER TABLE reservations ADD COLUMN modificationReason TEXT NULL;
    END IF;
    
    -- Add modificationProposedBy column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'reservations' AND column_name = 'modificationProposedBy') THEN
        ALTER TABLE reservations ADD COLUMN modificationProposedBy INT NULL;
    END IF;
    
    -- Add modificationProposedAt column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'reservations' AND column_name = 'modificationProposedAt') THEN
        ALTER TABLE reservations ADD COLUMN modificationProposedAt TIMESTAMP NULL;
    END IF;
END $$;

-- Add foreign key constraint for modificationProposedBy (check if it exists first)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_schema = 'public'
        AND constraint_name = 'fk_modification_proposed_by' 
        AND table_name = 'reservations'
    ) THEN
        ALTER TABLE reservations
        ADD CONSTRAINT fk_modification_proposed_by
        FOREIGN KEY (modificationProposedBy) REFERENCES users(id)
        ON DELETE SET NULL;
    END IF;
END $$;

-- Add index for efficient querying of pending modifications
CREATE INDEX IF NOT EXISTS idx_reservations_modification_status 
ON reservations(modificationStatus);

