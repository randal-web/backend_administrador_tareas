import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export type NoteColor = 'yellow' | 'blue' | 'green' | 'purple' | 'pink';

export interface NoteAttributes {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  color: NoteColor;
  is_pinned: boolean;
  is_important: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface NoteCreationAttributes
  extends Optional<NoteAttributes, 'id' | 'content' | 'color' | 'is_pinned' | 'is_important' | 'created_at' | 'updated_at'> {}

export class Note extends Model<NoteAttributes, NoteCreationAttributes> implements NoteAttributes {
  public id!: string;
  public user_id!: string;
  public title!: string;
  public content!: string | null;
  public color!: NoteColor;
  public is_pinned!: boolean;
  public is_important!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Note.init(
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
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'yellow',
    },
    is_pinned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_important: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'notes',
    modelName: 'Note',
  }
);
