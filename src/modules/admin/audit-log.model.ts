import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface AuditLogAttributes {
  id: string;
  user_id: string;
  action: string;       // e.g., 'CREATE_TASK', 'DELETE_PROJECT', 'LOGIN'
  module: string;       // e.g., 'TASKS', 'AUTH', 'HABITS'
  details: string | null; // JSON string with extra info
  ip_address: string | null;
  user_agent: string | null;
  created_at?: Date;
}

export interface AuditLogCreationAttributes extends Optional<AuditLogAttributes, 'id' | 'created_at'> {}

export class AuditLog extends Model<AuditLogAttributes, AuditLogCreationAttributes> implements AuditLogAttributes {
  public id!: string;
  public user_id!: string;
  public action!: string;
  public module!: string;
  public details!: string | null;
  public ip_address!: string | null;
  public user_agent!: string | null;
  public readonly created_at!: Date;
}

AuditLog.init(
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
    action: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    module: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'audit_logs',
    modelName: 'AuditLog',
    timestamps: true,
    createdAt: 'created_at', // Explicitly name the property created_at
    updatedAt: false,
  }
);
