import sequelize from '../config/database';
import { User } from './User';
import { Amenity } from './Amenity';
import { Reservation } from './Reservation';
import { Payment } from './Payment';
import { CleaningSchedule } from './CleaningSchedule';

// Define associations
User.hasMany(Reservation, { foreignKey: 'userId', as: 'reservations' });
Reservation.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Amenity.hasMany(Reservation, { foreignKey: 'amenityId', as: 'reservations' });
Reservation.belongsTo(Amenity, { foreignKey: 'amenityId', as: 'amenity' });

Reservation.hasMany(Payment, { foreignKey: 'reservationId', as: 'payments' });
Payment.belongsTo(Reservation, { foreignKey: 'reservationId', as: 'reservation' });

Reservation.hasOne(CleaningSchedule, { foreignKey: 'reservationId', as: 'cleaningSchedule' });
CleaningSchedule.belongsTo(Reservation, { foreignKey: 'reservationId', as: 'reservation' });

export {
  sequelize,
  User,
  Amenity,
  Reservation,
  Payment,
  CleaningSchedule
};
