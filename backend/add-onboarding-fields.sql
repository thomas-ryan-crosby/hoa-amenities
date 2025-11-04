-- Add onboarding status fields to communities table
-- Run this in pgAdmin

BEGIN;

-- Add onboarding status fields
ALTER TABLE communities
ADD COLUMN IF NOT EXISTS "onboardingCompleted" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "authorizationCertified" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "paymentSetup" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "memberListUploaded" BOOLEAN DEFAULT false;

-- Update existing active communities to have onboarding completed
UPDATE communities
SET "onboardingCompleted" = true
WHERE "isActive" = true;

COMMIT;

-- Verification query
-- SELECT id, name, "isActive", "onboardingCompleted", "authorizationCertified", "paymentSetup" FROM communities;

