const { Client } = require('pg');
require('dotenv').config();

async function migrate() {
  const host = process.env.DB_HOST || process.env.PGHOST;
  const port = parseInt(process.env.DB_PORT || process.env.PGPORT || '5432');
  const database = process.env.DB_NAME || process.env.PGDATABASE;
  const user = process.env.DB_USER || process.env.PGUSER;
  const password = process.env.DB_PASSWORD || process.env.PGPASSWORD;

  if (!host || !database || !user || !password) {
    console.error('❌ Missing required database connection variables!');
    console.error('Please ensure DB_HOST (or PGHOST), DB_NAME (or PGDATABASE), DB_USER (or PGUSER), and DB_PASSWORD (or PGPASSWORD) are set in your .env file or environment variables.');
    process.exit(1);
  }

  console.log('🔧 Starting event name fields migration...');
  console.log(`📊 Connecting to database: ${database}@${host}:${port}`);

  const client = new Client({
    host: host,
    port: port,
    database: database,
    user: user,
    password: password,
    connectionTimeoutMillis: 10000,
    ssl: host !== 'localhost' && !host.includes('127.0.0.1') ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Check if columns already exist
    const checkColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'reservations' 
      AND column_name IN ('eventName', 'isPrivate')
    `);

    const existingColumns = checkColumns.rows.map(row => row.column_name);

    if (existingColumns.includes('eventName') && existingColumns.includes('isPrivate')) {
      console.log('✅ Columns "eventName" and "isPrivate" already exist. Migration skipped.');
      await client.end();
      return;
    }

    // Add eventName column if it doesn't exist
    if (!existingColumns.includes('eventName')) {
      console.log('📝 Adding "eventName" column...');
      await client.query(`
        ALTER TABLE reservations 
        ADD COLUMN IF NOT EXISTS "eventName" VARCHAR(255) NULL;
      `);
      console.log('✅ Column "eventName" added successfully');
    }

    // Add isPrivate column if it doesn't exist
    if (!existingColumns.includes('isPrivate')) {
      console.log('📝 Adding "isPrivate" column...');
      await client.query(`
        ALTER TABLE reservations 
        ADD COLUMN IF NOT EXISTS "isPrivate" BOOLEAN NOT NULL DEFAULT false;
      `);
      console.log('✅ Column "isPrivate" added successfully');
    }

    console.log('🎉 Migration completed successfully!');
    console.log('✅ All event name fields have been added to the reservations table.');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Connection refused. Please check:');
      console.error('   1. Database server is running');
      console.error('   2. Host and port are correct');
      console.error('   3. Firewall/security group allows connections');
    } else if (error.code === '28P01') {
      console.error('💡 Authentication failed. Please check username and password.');
    } else if (error.code === '3D000') {
      console.error('💡 Database does not exist. Please create it first.');
    } else {
      console.error('💡 Error details:', error);
    }
    process.exit(1);
  } finally {
    if (client && !client._ended) {
      await client.end();
    }
  }
}

migrate();

