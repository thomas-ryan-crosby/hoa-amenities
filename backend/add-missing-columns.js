const { Client } = require('pg');
require('dotenv').config();

async function addMissingColumns() {
  console.log('🔄 Adding missing columns to database...');
  
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
    
    // Add missing columns to users table
    console.log('📝 Adding phone and address columns to users table...');
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS "phone" VARCHAR(255);
    `);
    
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS "address" TEXT;
    `);
    
    console.log('✅ Added phone and address columns to users table');
    
    // Add missing columns to reservations table
    console.log('📝 Adding cleaning time columns to reservations table...');
    await client.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS "cleaningTimeStart" TIMESTAMP WITH TIME ZONE;
    `);
    
    await client.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS "cleaningTimeEnd" TIMESTAMP WITH TIME ZONE;
    `);
    
    console.log('✅ Added cleaning time columns to reservations table');
    
    // Verify columns were added
    console.log('🔍 Verifying columns were added...');
    const result = await client.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name IN ('users', 'reservations') 
      AND column_name IN ('phone', 'address', 'cleaningTimeStart', 'cleaningTimeEnd')
      ORDER BY table_name, column_name;
    `);
    
    console.log('📋 Added columns:');
    result.rows.forEach(row => {
      console.log(`  - ${row.table_name}.${row.column_name} (${row.data_type})`);
    });
    
    console.log('🎉 All missing columns added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding columns:', error);
  } finally {
    await client.end();
  }
}

addMissingColumns();
