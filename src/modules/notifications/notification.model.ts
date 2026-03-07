import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export type NotificationType = 'morning_tasks' | 'morning_reminders' | 'evening_pending' | 'task_due' | 'reminder_due';

export interface NotificationAttributes {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  reference_id: string | null;
  reference_type: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface NotificationCreationAttributes
  extends Optional<NotificationAttributes, 'id' | 'is_read' | 'reference_id' | 'reference_type' | 'created_at' | 'updated_at'> {}

export class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  public id!: string;
  public user_id!: string;
  public title!: string;
  public message!: string;
  public type!: NotificationType;
  public is_read!: boolean;
  public reference_id!: string | null;
  public reference_type!: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Notification.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    reference_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    reference_type: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'notifications',
    underscored: true,
    timestamps: true,
  }
);
