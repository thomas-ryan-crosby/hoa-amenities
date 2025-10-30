import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface ReservationAttributes {
  id: number;
  userId: number;
  amenityId: number;
  date: Date;
  setupTimeStart: Date;
  setupTimeEnd: Date;
  partyTimeStart: Date;
  partyTimeEnd: Date;
  guestCount: number;
  specialRequirements: string;
  status: 'NEW' | 'JANITORIAL_APPROVED' | 'FULLY_APPROVED' | 'CANCELLED' | 'COMPLETED';
  totalFee: number;
  totalDeposit: number;
  cleaningTimeStart?: Date;
  cleaningTimeEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReservationCreationAttributes extends Optional<ReservationAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Reservation extends Model<ReservationAttributes, ReservationCreationAttributes> implements ReservationAttributes {
  public id!: number;
  public userId!: number;
  public amenityId!: number;
  public date!: Date;
  public setupTimeStart!: Date;
  public setupTimeEnd!: Date;
  public partyTimeStart!: Date;
  public partyTimeEnd!: Date;
  public guestCount!: number;
  public specialRequirements!: string;
  public status!: 'NEW' | 'JANITORIAL_APPROVED' | 'FULLY_APPROVED' | 'CANCELLED' | 'COMPLETED';
  public totalFee!: number;
  public totalDeposit!: number;
  public cleaningTimeStart?: Date;
  public cleaningTimeEnd?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Reservation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    amenityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'amenities',
        key: 'id',
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    setupTimeStart: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    setupTimeEnd: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    partyTimeStart: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    partyTimeEnd: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    guestCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    specialRequirements: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('NEW', 'JANITORIAL_APPROVED', 'FULLY_APPROVED', 'CANCELLED', 'COMPLETED'),
      allowNull: false,
      defaultValue: 'NEW',
    },
    totalFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalDeposit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    cleaningTimeStart: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cleaningTimeEnd: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'reservations',
    timestamps: true,
  }
);
