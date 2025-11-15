-- Create investors table
-- This table stores investor information collected from the pitch deck gate

CREATE TABLE IF NOT EXISTS investors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_investors_email ON investors(email);

-- Add comment to table
COMMENT ON TABLE investors IS 'Stores investor contact information collected from pitch deck access gate';


