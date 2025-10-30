const { sequelize, User, Amenity, Reservation, Payment, CleaningSchedule } = require('./dist/models');
const { seedDatabase } = require('./dist/seeders/seedData');

async function setupDatabase() {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    console.log('🔄 Creating database tables...');
    await sequelize.sync({ force: true }); // This will drop and recreate all tables
    console.log('✅ Database tables created successfully.');

    console.log('🔄 Seeding database with initial data...');
    await seedDatabase();
    console.log('✅ Database seeded successfully.');

    console.log('\n🎉 Database setup completed!');
    console.log('You can now start the backend server with: npm run dev');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

setupDatabase();
