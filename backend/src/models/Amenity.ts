import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface AmenityAttributes {
  id: number;
  name: string;
  description: string;
  reservationFee: number;
  deposit: number;
  capacity: number;
  communityId: number;
  calendarGroup: string | null; // Group name for calendar display (e.g., "Pool + Clubroom", "Tennis Courts")
  isPublic: boolean; // Whether amenity can be booked by non-community members
  publicReservationFee: number | null; // Different price for public users (null = same as reservationFee)
  publicDeposit: number | null; // Different deposit for public users (null = same as deposit)
  daysOfOperation: string | null; // JSON string of days (e.g., ["monday", "tuesday", "wednesday"])
  hoursOfOperation: string | null; // JSON string of {open: "09:00", close: "17:00"} or {open24Hours: true}
  displayColor: string; // Hex color code for calendar display (e.g., "#355B45")
  janitorialRequired: boolean; // Whether janitorial approval is required
  approvalRequired: boolean; // Whether admin approval is required
  // Fee Structure Fields
  cancellationFeeEnabled: boolean; // Whether cancellation fees are enabled
  cancellationFeeStructure: string | null; // JSON string of cancellation fee rules
  modificationFeeEnabled: boolean; // Whether modification fees are enabled
  modificationFeeStructure: string | null; // JSON string of modification fee rules
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AmenityCreationAttributes extends Optional<AmenityAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Amenity extends Model<AmenityAttributes, AmenityCreationAttributes> implements AmenityAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public reservationFee!: number;
  public deposit!: number;
  public capacity!: number;
  public communityId!: number;
  public calendarGroup!: string | null;
  public isPublic!: boolean;
  public publicReservationFee!: number | null;
  public publicDeposit!: number | null;
  public daysOfOperation!: string | null;
  public hoursOfOperation!: string | null;
  public displayColor!: string;
  public janitorialRequired!: boolean;
  public approvalRequired!: boolean;
  // Fee Structure Fields
  public cancellationFeeEnabled!: boolean;
  public cancellationFeeStructure!: string | null;
  public modificationFeeEnabled!: boolean;
  public modificationFeeStructure!: string | null;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Amenity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    communityId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Will be set to NOT NULL after migration
      references: {
        model: 'communities',
        key: 'id',
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reservationFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    deposit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 50,
    },
    calendarGroup: {
      type: DataTypes.STRING,
      allowNull: true, // Null means amenity appears on default calendar
      defaultValue: null,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    publicReservationFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true, // Null means use reservationFee for public users
      defaultValue: null,
    },
    publicDeposit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true, // Null means use deposit for public users
      defaultValue: null,
    },
    daysOfOperation: {
      type: DataTypes.TEXT,
      allowNull: true, // JSON string of days
      defaultValue: null,
    },
    hoursOfOperation: {
      type: DataTypes.TEXT,
      allowNull: true, // JSON string of hours
      defaultValue: null,
    },
    displayColor: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '#355B45', // Default green color
    },
    janitorialRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    approvalRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    // Fee Structure Fields
    cancellationFeeEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    cancellationFeeStructure: {
      type: DataTypes.TEXT,
      allowNull: true, // JSON string of cancellation fee rules
      defaultValue: null,
    },
    modificationFeeEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    modificationFeeStructure: {
      type: DataTypes.TEXT,
      allowNull: true, // JSON string of modification fee rules
      defaultValue: null,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    tableName: 'amenities',
    timestamps: true,
  }
);
