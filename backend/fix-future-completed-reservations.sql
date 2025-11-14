-- Fix Future Reservations Incorrectly Marked as COMPLETED
-- This script updates reservations that are marked as COMPLETED but haven't occurred yet
-- It restores them to FULLY_APPROVED status (the most common pre-completion status)
--
-- IMPORTANT: Review the preview query results before running the UPDATE statement
-- Run this script in a transaction so you can rollback if needed

BEGIN;

-- Step 1: Preview what will be changed
-- This shows all COMPLETED reservations and identifies which ones are in the future
SELECT 
    id,
    date,
    status,
    "eventName",
    "amenityId",
    "userId",
    CASE 
        WHEN date > CURRENT_DATE THEN '⚠️ FUTURE - WILL BE FIXED'
        WHEN date = CURRENT_DATE THEN '⚠️ TODAY - REVIEW MANUALLY'
        ELSE '✓ PAST - OK (no change)'
    END as action_status,
    "damageAssessmentPending",
    "damageAssessmentStatus"
FROM reservations
WHERE status = 'COMPLETED'
ORDER BY date DESC;

-- Step 2: Count how many will be affected
SELECT 
    COUNT(*) as reservations_to_fix,
    MIN(date) as earliest_future_date,
    MAX(date) as latest_future_date
FROM reservations
WHERE 
    status = 'COMPLETED'
    AND date > CURRENT_DATE;

-- Step 3: Update future COMPLETED reservations back to FULLY_APPROVED
-- This restores them to the most common pre-completion status
-- Also clears any damage assessment flags since they haven't actually occurred yet
UPDATE reservations
SET 
    status = 'FULLY_APPROVED',
    "damageAssessed" = false,
    "damageAssessmentPending" = false,
    "damageAssessmentStatus" = NULL,
    "damageCharge" = NULL,
    "damageChargeAmount" = NULL,
    "damageChargeAdjusted" = NULL,
    "damageDescription" = NULL,
    "damageNotes" = NULL,
    "adminDamageNotes" = NULL,
    "damageAssessedBy" = NULL,
    "damageReviewedBy" = NULL,
    "damageAssessedAt" = NULL,
    "damageReviewedAt" = NULL,
    "updatedAt" = NOW()
WHERE 
    status = 'COMPLETED'
    AND date > CURRENT_DATE;

-- Step 4: Verify the update - should return 0 rows
SELECT 
    id,
    date,
    status,
    "eventName",
    "amenityId"
FROM reservations
WHERE 
    date > CURRENT_DATE
    AND status = 'COMPLETED';

-- If the above query returns any rows, those reservations still need attention

-- Step 5: Summary of fixed reservations
SELECT 
    COUNT(*) as fixed_reservations_count,
    MIN(date) as earliest_fixed_date,
    MAX(date) as latest_fixed_date,
    STRING_AGG(DISTINCT "eventName", ', ') as sample_event_names
FROM reservations
WHERE 
    date > CURRENT_DATE
    AND status = 'FULLY_APPROVED'
    AND "updatedAt" >= NOW() - INTERVAL '1 minute'; -- Only count recently updated ones

-- Review the results above, then either:
-- COMMIT;  -- to save the changes
-- ROLLBACK;  -- to undo the changes

