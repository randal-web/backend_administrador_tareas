import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface GoalAttributes {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  target_date: Date | null;
  is_completed: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface GoalCreationAttributes extends Optional<GoalAttributes, 'id' | 'description' | 'target_date' | 'is_completed' | 'created_at' | 'updated_at'> {}

export class Goal extends Model<GoalAttributes, GoalCreationAttributes> implements GoalAttributes {
  public id!: string;
  public user_id!: string;
  public title!: string;
  public description!: string | null;
  public target_date!: Date | null;
  public is_completed!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Goal.init(
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
    target_date: {
      type: DataTypes.DATE,
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
    tableName: 'goals',
    modelName: 'Goal',
  }
);
