import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export type ReminderType = 'reminder' | 'meeting' | 'event' | 'review';
export type ReminderPriority = 'high' | 'medium' | 'low';

export interface ReminderAttributes {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  type: ReminderType;
  priority: ReminderPriority;
  due_date: string;
  due_time: string | null;
  project_name: string | null;
  is_completed: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface ReminderCreationAttributes
  extends Optional<ReminderAttributes, 'id' | 'description' | 'type' | 'priority' | 'due_time' | 'project_name' | 'is_completed' | 'created_at' | 'updated_at'> {}

export class Reminder extends Model<ReminderAttributes, ReminderCreationAttributes> implements ReminderAttributes {
  public id!: string;
  public user_id!: string;
  public title!: string;
  public description!: string | null;
  public type!: ReminderType;
  public priority!: ReminderPriority;
  public due_date!: string;
  public due_time!: string | null;
  public project_name!: string | null;
  public is_completed!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Reminder.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'reminder',
    },
    priority: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'medium',
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    due_time: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    project_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'reminders',
    modelName: 'Reminder',
  }
);
