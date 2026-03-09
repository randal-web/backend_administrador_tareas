import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export interface ReportAttributes {
  id: string;
  user_id: string;
  title: string;
  content: string; // JSON or HTML string
  type: 'daily' | 'custom';
  created_at?: Date;
  updated_at?: Date;
}

class Report extends Model<ReportAttributes> implements ReportAttributes {
  public id!: string;
  public user_id!: string;
  public title!: string;
  public content!: string;
  public type!: 'daily' | 'custom';
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Report.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('daily', 'custom'),
      defaultValue: 'daily',
    },
  },
  {
    sequelize,
    tableName: 'reports',
    underscored: true,
    timestamps: true,
  }
);

export default Report;