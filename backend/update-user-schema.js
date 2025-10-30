const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Create Sequelize instance
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'hoa_amenities',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin123',
  logging: console.log
});

async function updateUserSchema() {
  try {
    console.log('🔄 Updating user schema...');
    
    // Add phone column if it doesn't exist
    await sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS phone VARCHAR(255);
    `);
    
    // Add address column if it doesn't exist
    await sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS address TEXT;
    `);
    
    console.log('✅ User schema updated successfully');
    
  } catch (error) {
    console.error('❌ Error updating user schema:', error);
  } finally {
    await sequelize.close();
  }
}

updateUserSchema();
