-- Create prospects table to store community registration interest
-- Run this in pgAdmin

BEGIN;

CREATE TABLE IF NOT EXISTS prospects (
  id SERIAL PRIMARY KEY,
  "firstName" VARCHAR(255) NOT NULL,
  "lastName" VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  "street" VARCHAR(255),
  "zipCode" VARCHAR(10),
  city VARCHAR(255),
  state VARCHAR(50),
  "communityName" VARCHAR(255) NOT NULL,
  "communityStreet" VARCHAR(255) NOT NULL,
  "communityZipCode" VARCHAR(10) NOT NULL,
  "communityCity" VARCHAR(255),
  "communityState" VARCHAR(50),
  "approximateHouseholds" INTEGER,
  "primaryContactName" VARCHAR(255) NOT NULL,
  "primaryContactTitle" VARCHAR(255) NOT NULL,
  "primaryContactInfo" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prospects_email ON prospects(email);
CREATE INDEX IF NOT EXISTS idx_prospects_created_at ON prospects("createdAt");

COMMIT;

-- Verification query
-- SELECT * FROM prospects ORDER BY "createdAt" DESC;

