import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface PaymentAttributes {
  id: number;
  reservationId: number;
  amount: number;
  type: 'reservation_fee' | 'deposit' | 'refund';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  squarePaymentId: string;
  squareOrderId: string;
  processedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id' | 'processedAt' | 'createdAt' | 'updatedAt'> {}

export class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: number;
  public reservationId!: number;
  public amount!: number;
  public type!: 'reservation_fee' | 'deposit' | 'refund';
  public status!: 'pending' | 'completed' | 'failed' | 'refunded';
  public squarePaymentId!: string;
  public squareOrderId!: string;
  public processedAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    reservationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'reservations',
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('reservation_fee', 'deposit', 'refund'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'pending',
    },
    squarePaymentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    squareOrderId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    processedAt: {
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
    tableName: 'payments',
    timestamps: true,
  }
);
