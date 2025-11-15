import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface InvestorAttributes {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvestorCreationAttributes extends Optional<InvestorAttributes, 'id' | 'phone' | 'createdAt' | 'updatedAt'> {}

export class Investor extends Model<InvestorAttributes, InvestorCreationAttributes> implements InvestorAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public phone?: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Investor.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'investors',
    timestamps: true
  }
);

export default Investor;

