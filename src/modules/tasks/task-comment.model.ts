import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface TaskCommentAttributes {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface TaskCommentCreationAttributes extends Optional<TaskCommentAttributes, 'id' | 'created_at' | 'updated_at'> {}

export class TaskComment extends Model<TaskCommentAttributes, TaskCommentCreationAttributes> implements TaskCommentAttributes {
  public id!: string;
  public task_id!: string;
  public user_id!: string;
  public content!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

TaskComment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    task_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'tasks', key: 'id' },
      onDelete: 'CASCADE',
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'task_comments',
    modelName: 'TaskComment',
  }
);
