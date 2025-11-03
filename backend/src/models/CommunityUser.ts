import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface CommunityUserAttributes {
  id: number;
  communityId: number;
  userId: number;
  role: 'resident' | 'janitorial' | 'admin';
  isActive: boolean;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityUserCreationAttributes extends Optional<CommunityUserAttributes, 'id' | 'createdAt' | 'updatedAt' | 'joinedAt' | 'isActive'> {}

export class CommunityUser extends Model<CommunityUserAttributes, CommunityUserCreationAttributes> implements CommunityUserAttributes {
  public id!: number;
  public communityId!: number;
  public userId!: number;
  public role!: 'resident' | 'janitorial' | 'admin';
  public isActive!: boolean;
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
      references: {
        model: 'communities',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    indexes: [
      {
        unique: true,
        fields: ['community_id', 'user_id'],
        name: 'community_users_unique',
      },
      {
        fields: ['community_id'],
        name: 'community_users_community_id_idx',
      },
      {
        fields: ['user_id'],
        name: 'community_users_user_id_idx',
      },
    ],
  }
);

