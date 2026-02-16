import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface HabitAttributes {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  frequency: number[]; // Array of day numbers 0-6 (Sun-Sat)
  created_at?: Date;
  updated_at?: Date;
}

export interface HabitCreationAttributes extends Optional<HabitAttributes, 'id' | 'description' | 'frequency' | 'created_at' | 'updated_at'> {}

export class Habit extends Model<HabitAttributes, HabitCreationAttributes> implements HabitAttributes {
  public id!: string;
  public user_id!: string;
  public name!: string;
  public description!: string | null;
  public frequency!: number[];
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Habit.init(
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
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    frequency: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [0, 1, 2, 3, 4, 5, 6], // All days by default
    },
  },
  {
    sequelize,
    tableName: 'habits',
    modelName: 'Habit',
  }
);
