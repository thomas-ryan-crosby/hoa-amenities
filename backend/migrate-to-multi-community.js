/**
 * Migration script to add multi-community support
 * 
 * Run this from the backend directory:
 * node migrate-to-multi-community.js
 */

const { Client } = require('pg');
require('dotenv').config();

async function migrateToMultiCommunity() {
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
    
    console.log('\n🚀 Starting multi-community migration...');
    
    // Begin transaction
    await client.query('BEGIN');

    // Step 1: Create communities table
    console.log('📦 Creating communities table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS communities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        address TEXT,
        "contactEmail" VARCHAR(255),
        "isActive" BOOLEAN DEFAULT true,
        settings JSONB,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      )
    `);

    // Step 2: Create community_users table
    console.log('📦 Creating community_users table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS community_users (
        id SERIAL PRIMARY KEY,
        "communityId" INTEGER NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
        "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(50) NOT NULL CHECK (role IN ('resident', 'janitorial', 'admin')),
        "isActive" BOOLEAN DEFAULT true,
        "joinedAt" TIMESTAMP DEFAULT NOW(),
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW(),
        UNIQUE("communityId", "userId")
      )
    `);

    // Step 3: Create indexes for community_users
    console.log('📊 Creating indexes for community_users...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS "community_users_community_id_idx" 
      ON community_users("communityId")
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS "community_users_user_id_idx" 
      ON community_users("userId")
    `);

    // Step 4: Add community_id to amenities table
    console.log('📦 Adding community_id to amenities table...');
    await client.query(`
      ALTER TABLE amenities 
      ADD COLUMN IF NOT EXISTS "communityId" INTEGER REFERENCES communities(id) ON DELETE CASCADE
    `);

    // Step 5: Add community_id to reservations table
    console.log('📦 Adding community_id to reservations table...');
    await client.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS "communityId" INTEGER REFERENCES communities(id) ON DELETE CASCADE
    `);

    // Step 6: Create indexes for performance
    console.log('📊 Creating indexes for community_id columns...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS "idx_amenities_community_id" 
      ON amenities("communityId")
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS "idx_reservations_community_id" 
      ON reservations("communityId")
    `);

    // Step 7: Create production community for existing data
    console.log('🏘️ Creating "The Sanctuary - Mandeville, LA" community...');
    const sanctuaryResult = await client.query(`
      INSERT INTO communities (name, description, address, "isActive")
      VALUES ('The Sanctuary - Mandeville, LA', 
              'Production community containing all existing data migrated from single-community system', 
              'Mandeville, LA',
              true)
      ON CONFLICT DO NOTHING
      RETURNING id
    `);

    let sanctuaryId;
    if (sanctuaryResult.rows.length > 0) {
      sanctuaryId = sanctuaryResult.rows[0].id;
      console.log(`✅ Created sanctuary community with id: ${sanctuaryId}`);
    } else {
      // Community already exists, get its id
      const existingSanctuary = await client.query(`
        SELECT id FROM communities WHERE name = 'The Sanctuary - Mandeville, LA'
      `);
      sanctuaryId = existingSanctuary.rows[0].id;
      console.log(`✅ Sanctuary community already exists with id: ${sanctuaryId}`);
    }

    // Step 8: Create demo community
    console.log('🏘️ Creating "DEMO COMMUNITY"...');
    const demoResult = await client.query(`
      INSERT INTO communities (name, description, "isActive")
      VALUES ('DEMO COMMUNITY', 
              'Demo community for testing and demonstration purposes', 
              true)
      ON CONFLICT DO NOTHING
      RETURNING id
    `);

    let demoId;
    if (demoResult.rows.length > 0) {
      demoId = demoResult.rows[0].id;
      console.log(`✅ Created demo community with id: ${demoId}`);
    } else {
      // Community already exists, get its id
      const existingDemo = await client.query(`
        SELECT id FROM communities WHERE name = 'DEMO COMMUNITY'
      `);
      demoId = existingDemo.rows[0].id;
      console.log(`✅ Demo community already exists with id: ${demoId}`);
    }

    // Step 9: Assign all existing users to "The Sanctuary - Mandeville, LA" with their current role
    console.log('👥 Assigning users to sanctuary community...');
    const userAssignmentResult = await client.query(`
      INSERT INTO community_users ("communityId", "userId", role, "isActive", "joinedAt")
      SELECT 
        $1,
        id,
        role,
        "isActive",
        NOW()
      FROM users
      WHERE id NOT IN (
        SELECT "userId" FROM community_users WHERE "communityId" = $1
      )
    `, [sanctuaryId]);
    
    console.log(`✅ Assigned ${userAssignmentResult.rowCount} users to sanctuary community`);

    // Step 10: Assign all existing amenities to "The Sanctuary - Mandeville, LA"
    console.log('🏊 Assigning amenities to sanctuary community...');
    const amenityAssignmentResult = await client.query(`
      UPDATE amenities 
      SET "communityId" = $1
      WHERE "communityId" IS NULL
    `, [sanctuaryId]);
    
    console.log(`✅ Assigned ${amenityAssignmentResult.rowCount} amenities to sanctuary community`);

    // Step 11: Assign all existing reservations to "The Sanctuary - Mandeville, LA"
    console.log('📅 Assigning reservations to sanctuary community...');
    const reservationAssignmentResult = await client.query(`
      UPDATE reservations 
      SET "communityId" = $1
      WHERE "communityId" IS NULL
    `, [sanctuaryId]);
    
    console.log(`✅ Assigned ${reservationAssignmentResult.rowCount} reservations to sanctuary community`);

    // Step 12: Make community_id NOT NULL (after data migration)
    console.log('🔒 Making community_id required...');
    await client.query(`
      ALTER TABLE amenities 
      ALTER COLUMN "communityId" SET NOT NULL
    `);
    
    await client.query(`
      ALTER TABLE reservations 
      ALTER COLUMN "communityId" SET NOT NULL
    `);

    // Step 13: Update unique constraint on amenities name to be per-community
    console.log('🔒 Updating unique constraint on amenities name...');
    try {
      // Drop existing unique constraint if it exists
      await client.query(`
        ALTER TABLE amenities 
        DROP CONSTRAINT IF EXISTS amenities_name_key
      `);
      
      // Create unique index on (name, communityId)
      await client.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS amenities_name_community_unique 
        ON amenities(name, "communityId")
      `);
      
      console.log('✅ Updated amenities name unique constraint');
    } catch (error) {
      console.log('⚠️ Could not update amenities unique constraint (might not exist):', error.message);
    }

    // Commit transaction
    await client.query('COMMIT');
    console.log('✅ Migration completed successfully!');
    
    // Summary
    const summary = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM communities) as communities_count,
        (SELECT COUNT(*) FROM community_users) as community_users_count,
        (SELECT COUNT(*) FROM amenities WHERE "communityId" IS NOT NULL) as amenities_with_community,
        (SELECT COUNT(*) FROM reservations WHERE "communityId" IS NOT NULL) as reservations_with_community
    `);
    
    console.log('\n📊 Migration Summary:');
    console.log(`   Communities: ${summary.rows[0].communities_count}`);
    console.log(`   Community-User relationships: ${summary.rows[0].community_users_count}`);
    console.log(`   Amenities with community: ${summary.rows[0].amenities_with_community}`);
    console.log(`   Reservations with community: ${summary.rows[0].reservations_with_community}`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run migration
migrateToMultiCommunity()
  .then(() => {
    console.log('\n🎉 All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration error:', error);
    process.exit(1);
  });

