import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface CleaningScheduleAttributes {
  id: number;
  reservationId: number;
  scheduledTime: Date;
  completedAt: Date;
  status: 'scheduled' | 'in_progress' | 'completed';
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CleaningScheduleCreationAttributes extends Optional<CleaningScheduleAttributes, 'id' | 'completedAt' | 'createdAt' | 'updatedAt'> {}

export class CleaningSchedule extends Model<CleaningScheduleAttributes, CleaningScheduleCreationAttributes> implements CleaningScheduleAttributes {
  public id!: number;
  public reservationId!: number;
  public scheduledTime!: Date;
  public completedAt!: Date;
  public status!: 'scheduled' | 'in_progress' | 'completed';
  public notes!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CleaningSchedule.init(
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
    scheduledTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'in_progress', 'completed'),
      allowNull: false,
      defaultValue: 'scheduled',
    },
    notes: {
      type: DataTypes.TEXT,
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
    tableName: 'cleaning_schedules',
    timestamps: true,
  }
);
