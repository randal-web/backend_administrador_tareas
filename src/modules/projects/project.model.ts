import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface ProjectAttributes {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  color_hex: string;
  status: 'active' | 'archived';
  created_at?: Date;
  updated_at?: Date;
}

export interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'id' | 'description' | 'color_hex' | 'status' | 'created_at' | 'updated_at'> {}

export class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
  public id!: string;
  public user_id!: string;
  public name!: string;
  public description!: string | null;
  public color_hex!: string;
  public status!: 'active' | 'archived';
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Project.init(
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
    color_hex: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: '#6366f1',
    },
    status: {
      type: DataTypes.ENUM('active', 'archived'),
      allowNull: false,
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    tableName: 'projects',
    modelName: 'Project',
  }
);
