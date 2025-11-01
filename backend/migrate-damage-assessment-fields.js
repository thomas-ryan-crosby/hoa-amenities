/**
 * Migration script to add damage assessment fields to reservations table
 * 
 * Run this from the backend directory:
 * node migrate-damage-assessment-fields.js
 */

const { Client } = require('pg');
require('dotenv').config();

async function migrate() {
  // Support both Railway (PG*) and custom (DB*) variable names
  const host = process.env.DB_HOST || process.env.PGHOST;
  const port = parseInt(process.env.DB_PORT || process.env.PGPORT || '5432');
  const database = process.env.DB_NAME || process.env.PGDATABASE;
  const user = process.env.DB_USER || process.env.PGUSER;
  const password = process.env.DB_PASSWORD || process.env.PGPASSWORD;

  // Validate required variables
  if (!host || !database || !user || !password) {
    console.error('❌ Missing required database connection variables!');
    console.error('\nRequired variables:');
    console.error('  DB_HOST (or PGHOST)');
    console.error('  DB_PORT (or PGPORT) - optional, defaults to 5432');
    console.error('  DB_NAME (or PGDATABASE)');
    console.error('  DB_USER (or PGUSER)');
    console.error('  DB_PASSWORD (or PGPASSWORD)');
    console.error('\n💡 Get these values from Railway → Your Project → PostgreSQL Service → Variables tab');
    process.exit(1);
  }

  console.log('📋 Using connection details:');
  console.log(`   Host: ${host}`);
  console.log(`   Port: ${port}`);
  console.log(`   Database: ${database}`);
  console.log(`   User: ${user}`);
  console.log('   Password: [hidden]');

  const client = new Client({
    host: host,
    port: port,
    database: database,
    user: user,
    password: password,
    connectionTimeoutMillis: 10000, // 10 second timeout
    ssl: host !== 'localhost' && !host.includes('127.0.0.1') ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('\n🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database');

    console.log('📝 Adding damage assessment columns...');
    
    // Add columns one by one
    await client.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS "damageAssessed" BOOLEAN DEFAULT false;
    `);
    console.log('  ✅ Added damageAssessed');

    await client.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS "damageAssessmentPending" BOOLEAN DEFAULT false;
    `);
    console.log('  ✅ Added damageAssessmentPending');

    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'damage_assessment_status_enum'
        ) THEN
          CREATE TYPE damage_assessment_status_enum AS ENUM ('PENDING', 'APPROVED', 'ADJUSTED', 'DENIED');
        END IF;
      END $$;
    `);
    console.log('  ✅ Created/enumerated damage_assessment_status_enum');

    await client.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS "damageAssessmentStatus" damage_assessment_status_enum;
    `);
    console.log('  ✅ Added damageAssessmentStatus');

    await client.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS "damageCharge" DECIMAL(10,2);
    `);
    console.log('  ✅ Added damageCharge');

    await client.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS "damageChargeAmount" DECIMAL(10,2);
    `);
    console.log('  ✅ Added damageChargeAmount');

    await client.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS "damageChargeAdjusted" DECIMAL(10,2);
    `);
    console.log('  ✅ Added damageChargeAdjusted');

    await client.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS "damageDescription" TEXT;
    `);
    console.log('  ✅ Added damageDescription');

    await client.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS "damageNotes" TEXT;
    `);
    console.log('  ✅ Added damageNotes');

    await client.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS "adminDamageNotes" TEXT;
    `);
    console.log('  ✅ Added adminDamageNotes');

    await client.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS "damageAssessedBy" INTEGER REFERENCES users(id);
    `);
    console.log('  ✅ Added damageAssessedBy');

    await client.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS "damageReviewedBy" INTEGER REFERENCES users(id);
    `);
    console.log('  ✅ Added damageReviewedBy');

    await client.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS "damageAssessedAt" TIMESTAMP;
    `);
    console.log('  ✅ Added damageAssessedAt');

    await client.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS "damageReviewedAt" TIMESTAMP;
    `);
    console.log('  ✅ Added damageReviewedAt');

    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('\n❌ Migration failed!');
    console.error('Error details:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Connection refused. Check:');
      console.error('   1. Database host and port are correct');
      console.error('   2. Your IP is allowed to connect (Railway databases may require VPN/whitelist)');
      console.error('   3. Database service is running on Railway');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('\n💡 Connection timeout. Check:');
      console.error('   1. Database host is correct');
      console.error('   2. Network connectivity');
      console.error('   3. Firewall settings');
    } else if (error.message.includes('password authentication failed')) {
      console.error('\n💡 Authentication failed. Check:');
      console.error('   1. Username is correct');
      console.error('   2. Password is correct (copy directly from Railway Variables)');
    } else if (error.message.includes('does not exist')) {
      console.error('\n💡 Database not found. Check:');
      console.error('   1. Database name is correct');
      console.error('   2. Database exists on Railway');
    }
    
    process.exit(1);
  } finally {
    if (client && !client._ended) {
      await client.end();
      console.log('🔌 Disconnected from database');
    }
  }
}

migrate();

