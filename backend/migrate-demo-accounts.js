/**
 * Migration script to update demo account emails
 * 
 * Run this from the backend directory:
 * node migrate-demo-accounts.js
 * 
 * OR call via API:
 * POST /api/admin/migrate-demo-accounts
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
    console.error('💡 Get these values from Railway → Your Project → PostgreSQL Service → Variables tab');
    process.exit(1);
  }

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
    console.log('\n🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database');

    console.log('📝 Updating demo account emails...');

    // Update admin account
    const adminResult = await client.query(`
      UPDATE users 
      SET email = 'ryan@kellby.com', 
          "firstName" = 'Ryan', 
          "lastName" = 'Kellby'
      WHERE email = 'admin@hoa.com' AND role = 'admin';
    `);
    console.log(`  ✅ Updated admin account: ${adminResult.rowCount} row(s)`);

    // Update janitorial account
    const janitorialResult = await client.query(`
      UPDATE users 
      SET email = 'thomas.ryan.crosby@gmail.com', 
          "firstName" = 'Thomas', 
          "lastName" = 'Crosby'
      WHERE email = 'janitorial@hoa.com' AND role = 'janitorial';
    `);
    console.log(`  ✅ Updated janitorial account: ${janitorialResult.rowCount} row(s)`);

    // Update resident account
    const residentResult = await client.query(`
      UPDATE users 
      SET email = 'ryan@wetlandx.com', 
          "firstName" = 'Ryan', 
          "lastName" = 'Wetlandx'
      WHERE email = 'resident@hoa.com' AND role = 'resident';
    `);
    console.log(`  ✅ Updated resident account: ${residentResult.rowCount} row(s)`);

    console.log('\n✅ Demo account migration completed successfully!');
    console.log('\n📋 New login credentials:');
    console.log('Admin: ryan@kellby.com / admin123');
    console.log('Janitorial: thomas.ryan.crosby@gmail.com / admin123');
    console.log('Resident: ryan@wetlandx.com / admin123');

  } catch (error) {
    console.error('\n❌ Migration failed!');
    console.error('Error details:', error.message);
    process.exit(1);
  } finally {
    if (client && !client._ended) {
      await client.end();
      console.log('🔌 Disconnected from database');
    }
  }
}

// If running directly, execute migration
if (require.main === module) {
  migrate();
}

module.exports = { migrate };

