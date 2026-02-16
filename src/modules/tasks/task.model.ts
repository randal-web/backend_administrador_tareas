import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type TaskCategory = 'PERSONAL' | 'WORK' | 'PROJECT';

export interface TaskAttributes {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  start_date: Date | null;
  end_date: Date | null;
  category: TaskCategory;
  created_at?: Date;
  updated_at?: Date;
}

export interface TaskCreationAttributes extends Optional<TaskAttributes, 'id' | 'project_id' | 'description' | 'priority' | 'status' | 'start_date' | 'end_date' | 'category' | 'created_at' | 'updated_at'> {}

export class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  public id!: string;
  public user_id!: string;
  public project_id!: string | null;
  public title!: string;
  public description!: string | null;
  public priority!: TaskPriority;
  public status!: TaskStatus;
  public start_date!: Date | null;
  public end_date!: Date | null;
  public category!: TaskCategory;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Task.init(
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
    project_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'projects', key: 'id' },
      onDelete: 'SET NULL',
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    priority: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH'),
      allowNull: false,
      defaultValue: 'MEDIUM',
    },
    status: {
      type: DataTypes.ENUM('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'),
      allowNull: false,
      defaultValue: 'TODO',
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM('PERSONAL', 'WORK', 'PROJECT'),
      allowNull: false,
      defaultValue: 'PERSONAL',
    },
  },
  {
    sequelize,
    tableName: 'tasks',
    modelName: 'Task',
  }
);
