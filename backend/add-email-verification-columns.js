const { Client } = require('pg');
require('dotenv').config();

async function addEmailVerificationColumns() {
  console.log('🔄 Adding email verification and reset columns to users table...');

  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'hoa_amenities',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN DEFAULT false NOT NULL,
      ADD COLUMN IF NOT EXISTS "emailVerificationToken" VARCHAR(255) UNIQUE,
      ADD COLUMN IF NOT EXISTS "emailVerificationTokenExpires" TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS "passwordResetToken" VARCHAR(255) UNIQUE,
      ADD COLUMN IF NOT EXISTS "passwordResetTokenExpires" TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS "passwordResetRequestedAt" TIMESTAMPTZ;
    `);

    console.log('✅ Columns added (if missing).');

  } catch (err) {
    console.error('❌ Error updating users table:', err);
  } finally {
    await client.end();
  }
}

addEmailVerificationColumns();


