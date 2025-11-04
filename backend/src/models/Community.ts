import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface CommunityAttributes {
  id: number;
  name: string;
  description?: string;
  address?: string;
  zipCode?: string;
  contactEmail?: string;
  accessCode?: string;
  isActive: boolean;
  onboardingCompleted?: boolean;
  authorizationCertified?: boolean;
  paymentSetup?: boolean;
  memberListUploaded?: boolean;
  settings?: any; // JSON field for community-specific configurations
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityCreationAttributes extends Optional<CommunityAttributes, 'id' | 'createdAt' | 'updatedAt' | 'settings'> {}

export class Community extends Model<CommunityAttributes, CommunityCreationAttributes> implements CommunityAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public address?: string;
  public zipCode?: string;
  public contactEmail?: string;
  public accessCode?: string;
  public isActive!: boolean;
  public onboardingCompleted?: boolean;
  public authorizationCertified?: boolean;
  public paymentSetup?: boolean;
  public memberListUploaded?: boolean;
  public settings?: any;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Community.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    accessCode: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'isActive'
    },
    onboardingCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'onboardingCompleted'
    },
    authorizationCertified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'authorizationCertified'
    },
    paymentSetup: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'paymentSetup'
    },
    memberListUploaded: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'memberListUploaded'
    },
    settings: {
      type: DataTypes.JSONB,
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
    tableName: 'communities',
    timestamps: true,
  }
);

