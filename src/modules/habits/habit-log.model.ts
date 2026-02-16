import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface HabitLogAttributes {
  id: string;
  habit_id: string;
  date: string; // YYYY-MM-DD
  is_completed: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface HabitLogCreationAttributes extends Optional<HabitLogAttributes, 'id' | 'is_completed' | 'created_at' | 'updated_at'> {}

export class HabitLog extends Model<HabitLogAttributes, HabitLogCreationAttributes> implements HabitLogAttributes {
  public id!: string;
  public habit_id!: string;
  public date!: string;
  public is_completed!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

HabitLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    habit_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'habits', key: 'id' },
      onDelete: 'CASCADE',
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    is_completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'habit_logs',
    modelName: 'HabitLog',
    indexes: [
      {
        unique: true,
        fields: ['habit_id', 'date'],
      },
    ],
  }
);
