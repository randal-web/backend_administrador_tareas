import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface SubtaskAttributes {
  id: string;
  task_id: string;
  title: string;
  is_completed: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface SubtaskCreationAttributes extends Optional<SubtaskAttributes, 'id' | 'is_completed' | 'created_at' | 'updated_at'> {}

export class Subtask extends Model<SubtaskAttributes, SubtaskCreationAttributes> implements SubtaskAttributes {
  public id!: string;
  public task_id!: string;
  public title!: string;
  public is_completed!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Subtask.init(
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
    title: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    is_completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'subtasks',
    modelName: 'Subtask',
  }
);
