import { Amenity, Community } from '../models';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Get or create the sanctuary community (for seed data)
    let sanctuaryCommunity = await Community.findOne({ 
      where: { name: 'The Sanctuary - Mandeville, LA' } 
    });
    
    if (!sanctuaryCommunity) {
      // If sanctuary doesn't exist yet, create it
      sanctuaryCommunity = await Community.create({
        name: 'The Sanctuary - Mandeville, LA',
        description: 'Production community containing all existing data',
        address: 'Mandeville, LA',
        isActive: true
      });
      console.log('✅ Created sanctuary community for seeding');
    }

    // Create amenities (or find existing) - include communityId
    const [clubroom, clubroomCreated] = await Amenity.findOrCreate({
      where: { name: 'Clubroom', communityId: sanctuaryCommunity.id },
      defaults: {
        name: 'Clubroom',
        description: 'Community clubroom for events and gatherings',
        reservationFee: 125.00,
        deposit: 75.00,
        capacity: 50,
        communityId: sanctuaryCommunity.id,
        isPublic: false,
        publicReservationFee: null,
        publicDeposit: null,
        daysOfOperation: null,
        hoursOfOperation: null,
        displayColor: '#355B45',
        janitorialRequired: true,
        isActive: true
      }
    });

    const [pool, poolCreated] = await Amenity.findOrCreate({
      where: { name: 'Pool', communityId: sanctuaryCommunity.id },
      defaults: {
        name: 'Pool',
        description: 'Community swimming pool',
        reservationFee: 25.00,
        deposit: 50.00,
        capacity: 30,
        communityId: sanctuaryCommunity.id,
        isPublic: false,
        publicReservationFee: null,
        publicDeposit: null,
        daysOfOperation: null,
        hoursOfOperation: null,
        displayColor: '#355B45',
        janitorialRequired: true,
        isActive: true
      }
    });

    const [poolAndClubroom, poolAndClubroomCreated] = await Amenity.findOrCreate({
      where: { name: 'Pool + Clubroom', communityId: sanctuaryCommunity.id },
      defaults: {
        name: 'Pool + Clubroom',
        description: 'Combined reservation for both pool and clubroom',
        reservationFee: 150.00, // 125 + 25
        deposit: 125.00, // 75 + 50
        capacity: 50, // Max capacity
        communityId: sanctuaryCommunity.id,
        isPublic: false,
        publicReservationFee: null,
        publicDeposit: null,
        daysOfOperation: null,
        hoursOfOperation: null,
        displayColor: '#355B45',
        janitorialRequired: true,
        isActive: true
      }
    });

    console.log('✅ Amenities checked:', { 
      clubroom: clubroom.name + (clubroomCreated ? ' (created)' : ' (exists)'),
      pool: pool.name + (poolCreated ? ' (created)' : ' (exists)'),
      poolAndClubroom: poolAndClubroom.name + (poolAndClubroomCreated ? ' (created)' : ' (exists)')
    });

    // Create demo users (or find existing)
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const [adminUser, adminCreated] = await User.findOrCreate({
      where: { email: 'ryan@kellby.com' },
      defaults: {
        email: 'ryan@kellby.com',
        password: hashedPassword,
        firstName: 'Ryan',
        lastName: 'Kellby',
        role: 'admin',
        isActive: true,
        emailVerified: true
      }
    });

    const [janitorialUser, janitorialCreated] = await User.findOrCreate({
      where: { email: 'thomas.ryan.crosby@gmail.com' },
      defaults: {
        email: 'thomas.ryan.crosby@gmail.com',
        password: hashedPassword,
        firstName: 'Thomas',
        lastName: 'Crosby',
        role: 'janitorial',
        isActive: true,
        emailVerified: true
      }
    });

    const [residentUser, residentCreated] = await User.findOrCreate({
      where: { email: 'ryan@wetlandx.com' },
      defaults: {
        email: 'ryan@wetlandx.com',
        password: hashedPassword,
        firstName: 'Ryan',
        lastName: 'Wetlandx',
        role: 'resident',
        isActive: true,
        emailVerified: true
      }
    });

    console.log('✅ Users checked:', { 
      admin: adminUser.email + (adminCreated ? ' (created)' : ' (exists)'),
      janitorial: janitorialUser.email + (janitorialCreated ? ' (created)' : ' (exists)'),
      resident: residentUser.email + (residentCreated ? ' (created)' : ' (exists)')
    });

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Default login credentials:');
    console.log('Admin: ryan@kellby.com / admin123');
    console.log('Janitorial: thomas.ryan.crosby@gmail.com / admin123');
    console.log('Resident: ryan@wetlandx.com / admin123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}
