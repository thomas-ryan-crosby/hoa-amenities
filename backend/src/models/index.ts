import sequelize from '../config/database';
import { User } from './User';
import { Community } from './Community';
import { CommunityUser } from './CommunityUser';
import { Amenity } from './Amenity';
import { Reservation } from './Reservation';
import { Payment } from './Payment';
import { CleaningSchedule } from './CleaningSchedule';
import { Prospect } from './Prospect';
import { Investor } from './Investor';

// Define associations
// Community associations
Community.hasMany(CommunityUser, { foreignKey: 'communityId', as: 'communityUsers' });
CommunityUser.belongsTo(Community, { foreignKey: 'communityId', as: 'community' });

User.hasMany(CommunityUser, { foreignKey: 'userId', as: 'communityUsers' });
CommunityUser.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Community has many amenities
Community.hasMany(Amenity, { foreignKey: 'communityId', as: 'amenities' });
Amenity.belongsTo(Community, { foreignKey: 'communityId', as: 'community' });

// Community has many reservations
Community.hasMany(Reservation, { foreignKey: 'communityId', as: 'reservations' });
Reservation.belongsTo(Community, { foreignKey: 'communityId', as: 'community' });

// User associations
User.hasMany(Reservation, { foreignKey: 'userId', as: 'reservations' });
Reservation.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Amenity associations
Amenity.hasMany(Reservation, { foreignKey: 'amenityId', as: 'reservations' });
Reservation.belongsTo(Amenity, { foreignKey: 'amenityId', as: 'amenity' });

// Payment associations
Reservation.hasMany(Payment, { foreignKey: 'reservationId', as: 'payments' });
Payment.belongsTo(Reservation, { foreignKey: 'reservationId', as: 'reservation' });

// CleaningSchedule associations
Reservation.hasOne(CleaningSchedule, { foreignKey: 'reservationId', as: 'cleaningSchedule' });
CleaningSchedule.belongsTo(Reservation, { foreignKey: 'reservationId', as: 'reservation' });

export {
  sequelize,
  User,
  Community,
  CommunityUser,
  Amenity,
  Reservation,
  Payment,
  CleaningSchedule,
  Prospect,
  Investor
};
