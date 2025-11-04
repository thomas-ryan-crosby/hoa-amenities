import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface ProspectAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  street?: string;
  zipCode?: string;
  city?: string;
  state?: string;
  communityName: string;
  communityStreet: string;
  communityZipCode: string;
  communityCity?: string;
  communityState?: string;
  approximateHouseholds?: number;
  primaryContactName: string;
  primaryContactTitle: string;
  primaryContactInfo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProspectCreationAttributes extends Optional<ProspectAttributes, 'id' | 'phone' | 'street' | 'zipCode' | 'city' | 'state' | 'communityCity' | 'communityState' | 'approximateHouseholds' | 'primaryContactInfo'> {}

export class Prospect extends Model<ProspectAttributes, ProspectCreationAttributes> implements ProspectAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phone?: string;
  public street?: string;
  public zipCode?: string;
  public city?: string;
  public state?: string;
  public communityName!: string;
  public communityStreet!: string;
  public communityZipCode!: string;
  public communityCity?: string;
  public communityState?: string;
  public approximateHouseholds?: number;
  public primaryContactName!: string;
  public primaryContactTitle!: string;
  public primaryContactInfo?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Prospect.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'firstName'
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'lastName'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    street: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'street'
    },
    zipCode: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'zipCode'
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    state: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    communityName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'communityName'
    },
    communityStreet: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'communityStreet'
    },
    communityZipCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'communityZipCode'
    },
    communityCity: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'communityCity'
    },
    communityState: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'communityState'
    },
    approximateHouseholds: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'approximateHouseholds'
    },
    primaryContactName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'primaryContactName'
    },
    primaryContactTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'primaryContactTitle'
    },
    primaryContactInfo: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'primaryContactInfo'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'createdAt'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updatedAt'
    }
  },
  {
    sequelize,
    tableName: 'prospects',
    timestamps: true,
    underscored: false,
    freezeTableName: true
  }
);

export default Prospect;

