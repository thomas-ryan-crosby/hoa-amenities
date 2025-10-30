const { Client } = require('pg');

async function setupDatabase() {
  // Connect to default postgres database first
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres', // Connect to default database
    password: process.env.DB_PASSWORD || '', // You'll need to set this
    port: 5432,
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Create the database
    await client.query('CREATE DATABASE hoa_amenities');
    console.log('Database "hoa_amenities" created successfully');

  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('Database "hoa_amenities" already exists');
    } else {
      console.error('Error creating database:', error.message);
    }
  } finally {
    await client.end();
  }
}

setupDatabase();
