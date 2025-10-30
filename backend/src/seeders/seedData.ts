import { Amenity } from '../models/Amenity';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create amenities
    const clubroom = await Amenity.create({
      name: 'Clubroom',
      description: 'Community clubroom for events and gatherings',
      reservationFee: 125.00,
      deposit: 75.00,
      capacity: 50,
      isActive: true
    });

    const pool = await Amenity.create({
      name: 'Pool',
      description: 'Community swimming pool',
      reservationFee: 25.00,
      deposit: 50.00,
      capacity: 30,
      isActive: true
    });

    console.log('✅ Amenities created:', { clubroom: clubroom.name, pool: pool.name });

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      email: 'admin@hoa.com',
      password: hashedPassword,
      firstName: 'HOA',
      lastName: 'Administrator',
      role: 'admin',
      isActive: true
    });

    // Create janitorial user
    const janitorialUser = await User.create({
      email: 'janitorial@hoa.com',
      password: hashedPassword,
      firstName: 'Janitorial',
      lastName: 'Staff',
      role: 'janitorial',
      isActive: true
    });

    // Create sample resident
    const residentUser = await User.create({
      email: 'resident@hoa.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'resident',
      isActive: true
    });

    console.log('✅ Users created:', { 
      admin: adminUser.email, 
      janitorial: janitorialUser.email, 
      resident: residentUser.email 
    });

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Default login credentials:');
    console.log('Admin: admin@hoa.com / admin123');
    console.log('Janitorial: janitorial@hoa.com / admin123');
    console.log('Resident: resident@hoa.com / admin123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}
