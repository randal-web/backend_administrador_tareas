import { Sequelize } from 'sequelize';
import { config } from './index';

const sequelizeOptions = {
  dialect: 'postgres' as const,
  logging: config.nodeEnv === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
  },
  ...(config.nodeEnv === 'production' && {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }),
};

// Railway provides DATABASE_URL; fallback to individual DB_* vars for local dev
export const sequelize = config.databaseUrl
  ? new Sequelize(config.databaseUrl, sequelizeOptions)
  : new Sequelize(
      config.db.name,
      config.db.user,
      config.db.password,
      {
        host: config.db.host,
        port: config.db.port,
        ...sequelizeOptions,
      }
    );

export async function connectDB(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}
