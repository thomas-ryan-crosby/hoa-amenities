import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface CommunityUserAttributes {
  id: number;
  communityId: number;
  userId: number;
  role: 'resident' | 'janitorial' | 'admin';
  isActive: boolean;
  status: 'pending' | 'approved' | 'banned';
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityUserCreationAttributes extends Optional<CommunityUserAttributes, 'id' | 'createdAt' | 'updatedAt' | 'joinedAt' | 'isActive' | 'status'> {}

export class CommunityUser extends Model<CommunityUserAttributes, CommunityUserCreationAttributes> implements CommunityUserAttributes {
  public id!: number;
  public communityId!: number;
  public userId!: number;
  public role!: 'resident' | 'janitorial' | 'admin';
  public isActive!: boolean;
  public status!: 'pending' | 'approved' | 'banned';
  public joinedAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CommunityUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    communityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'communityId', // Map to actual database column name (camelCase with quotes)
      references: {
        model: 'communities',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'userId', // Map to actual database column name (camelCase with quotes)
      references: {
        model: 'users',
        key: 'id',
      },
    },
    role: {
      type: DataTypes.ENUM('resident', 'janitorial', 'admin'),
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'banned'),
      allowNull: false,
      defaultValue: 'pending',
    },
    joinedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
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
    tableName: 'community_users',
    timestamps: true,
    // Indexes already exist in database from migration script
    // Removing from model to prevent Sequelize from trying to recreate them
    indexes: [],
  }
);

