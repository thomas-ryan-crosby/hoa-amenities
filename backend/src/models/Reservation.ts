import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface ReservationAttributes {
  id: number;
  userId: number;
  amenityId: number;
  communityId: number;
  date: Date;
  setupTimeStart: Date;
  setupTimeEnd: Date;
  partyTimeStart: Date;
  partyTimeEnd: Date;
  guestCount: number;
  eventName: string | null;
  isPrivate: boolean;
  specialRequirements: string;
  status: 'NEW' | 'JANITORIAL_APPROVED' | 'FULLY_APPROVED' | 'CANCELLED' | 'COMPLETED';
  totalFee: number;
  totalDeposit: number;
  cleaningTimeStart?: Date;
  cleaningTimeEnd?: Date;
  // Damage Assessment Fields
  damageAssessed?: boolean;
  damageAssessmentPending?: boolean;
  damageAssessmentStatus?: 'PENDING' | 'APPROVED' | 'ADJUSTED' | 'DENIED' | null;
  damageCharge?: number | null;
  damageChargeAmount?: number | null; // Amount assessed by janitorial
  damageChargeAdjusted?: number | null; // Amount adjusted by admin
  damageDescription?: string | null;
  damageNotes?: string | null;
  adminDamageNotes?: string | null;
  damageAssessedBy?: number | null; // User ID of janitorial staff
  damageReviewedBy?: number | null; // User ID of admin who reviewed
  damageAssessedAt?: Date | null;
  damageReviewedAt?: Date | null;
  // Modification Proposal Fields
  modificationStatus?: 'NONE' | 'PENDING' | 'ACCEPTED' | 'REJECTED' | null;
  proposedDate?: Date | null;
  proposedPartyTimeStart?: Date | null;
  proposedPartyTimeEnd?: Date | null;
  modificationReason?: string | null;
  modificationProposedBy?: number | null;
  modificationProposedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReservationCreationAttributes extends Optional<ReservationAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Reservation extends Model<ReservationAttributes, ReservationCreationAttributes> implements ReservationAttributes {
  public id!: number;
  public userId!: number;
  public amenityId!: number;
  public communityId!: number;
  public date!: Date;
  public setupTimeStart!: Date;
  public setupTimeEnd!: Date;
  public partyTimeStart!: Date;
  public partyTimeEnd!: Date;
  public guestCount!: number;
  public eventName!: string | null;
  public isPrivate!: boolean;
  public specialRequirements!: string;
  public status!: 'NEW' | 'JANITORIAL_APPROVED' | 'FULLY_APPROVED' | 'CANCELLED' | 'COMPLETED';
  public totalFee!: number;
  public totalDeposit!: number;
  public cleaningTimeStart?: Date;
  public cleaningTimeEnd?: Date;
  // Damage Assessment Fields
  public damageAssessed?: boolean;
  public damageAssessmentPending?: boolean;
  public damageAssessmentStatus?: 'PENDING' | 'APPROVED' | 'ADJUSTED' | 'DENIED' | null;
  public damageCharge?: number | null;
  public damageChargeAmount?: number | null;
  public damageChargeAdjusted?: number | null;
  public damageDescription?: string | null;
  public damageNotes?: string | null;
  public adminDamageNotes?: string | null;
  public damageAssessedBy?: number | null;
  public damageReviewedBy?: number | null;
  public damageAssessedAt?: Date | null;
  public damageReviewedAt?: Date | null;
  // Modification Proposal Fields
  public modificationStatus?: 'NONE' | 'PENDING' | 'ACCEPTED' | 'REJECTED' | null;
  public proposedDate?: Date | null;
  public proposedPartyTimeStart?: Date | null;
  public proposedPartyTimeEnd?: Date | null;
  public modificationReason?: string | null;
  public modificationProposedBy?: number | null;
  public modificationProposedAt?: Date | null;
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
    communityId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Will be set to NOT NULL after migration
      references: {
        model: 'communities',
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
    eventName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isPrivate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    // Damage Assessment Fields
    damageAssessed: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    damageAssessmentPending: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    damageAssessmentStatus: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'ADJUSTED', 'DENIED'),
      allowNull: true,
    },
    damageCharge: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    damageChargeAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    damageChargeAdjusted: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    damageDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    damageNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    adminDamageNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    damageAssessedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    damageReviewedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    damageAssessedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    damageReviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Modification Proposal Fields
    modificationStatus: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: 'NONE',
      validate: {
        isIn: [['NONE', 'PENDING', 'ACCEPTED', 'REJECTED']]
      }
    },
    proposedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    proposedPartyTimeStart: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    proposedPartyTimeEnd: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    modificationReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    modificationProposedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    modificationProposedAt: {
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
