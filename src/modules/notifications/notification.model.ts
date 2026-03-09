import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface NotificationAttributes {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'beta_invite' | 'success' | 'warning';
  is_read: boolean;
  action_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface NotificationCreationAttributes extends Optional<NotificationAttributes, 'id' | 'is_read' | 'created_at' | 'updated_at'> {}

class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  public id!: string;
  public user_id!: string;
  public title!: string;
  public message!: string;
  public type!: 'info' | 'beta_invite' | 'success' | 'warning';
  public is_read!: boolean;
  public action_url?: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Notification.init(
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
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(20),
      defaultValue: 'info',
      validate: {
        isIn: [['info', 'beta_invite', 'success', 'warning']]
      }
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    action_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'notifications',
    underscored: true,
    timestamps: true,
  }
);

export default Notification;