import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface AmenityAttributes {
  id: number;
  name: string;
  description: string;
  reservationFee: number;
  deposit: number;
  capacity: number;
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
      unique: true,
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
