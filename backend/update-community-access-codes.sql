-- Update communities with access codes and zip codes
-- Run this in pgAdmin to add access codes and zip codes to existing communities

BEGIN;

-- Update The Sanctuary - Mandeville, LA
UPDATE communities
SET 
  "zipCode" = '70471',
  "accessCode" = 'SANCTUARY2024',
  address = '1 Sanctuary Blvd, Mandeville, LA 70471'
WHERE name = 'The Sanctuary - Mandeville, LA';

-- Update DEMO COMMUNITY (make up an address)
UPDATE communities
SET 
  "zipCode" = '90210',
  "accessCode" = 'DEMO2024',
  address = '123 Demo Street, Beverly Hills, CA 90210'
WHERE name = 'DEMO COMMUNITY';

COMMIT;

-- Verification queries (run these separately to verify)
-- SELECT id, name, "zipCode", "accessCode", address
-- FROM communities
-- WHERE name IN ('The Sanctuary - Mandeville, LA', 'DEMO COMMUNITY');

