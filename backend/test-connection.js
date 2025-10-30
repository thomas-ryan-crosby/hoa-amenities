const { Client } = require('pg');
require('dotenv').config();

async function testConnection() {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'hoa_amenities',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 5432,
  });

  try {
    console.log('🔄 Attempting to connect to database...');
    await client.connect();
    console.log('✅ Successfully connected to PostgreSQL!');
    
    // Test a simple query
    const result = await client.query('SELECT NOW() as current_time');
    console.log('📅 Current database time:', result.rows[0].current_time);
    
    // Test database name
    const dbResult = await client.query('SELECT current_database() as db_name');
    console.log('🗄️  Connected to database:', dbResult.rows[0].db_name);
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('password authentication failed')) {
      console.log('\n💡 Tip: Check your password in the .env file');
    } else if (error.message.includes('database "hoa_amenities" does not exist')) {
      console.log('\n💡 Tip: Create the database first using pgAdmin');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Tip: Make sure PostgreSQL is running');
    }
  } finally {
    await client.end();
  }
}

testConnection();
