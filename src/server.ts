import app from './app';
import { config } from './config';
import { connectDB, sequelize } from './config/database';
import { setupAssociations } from './config/associations';

async function main() {
  // Setup model associations
  setupAssociations();

  // Connect to database
  await connectDB();

  // Sync database
  if (config.nodeEnv === 'development') {
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced (alter mode)');
  } else {
    // In production, only create tables if they don't exist (no alter)
    await sequelize.sync();
    console.log('✅ Database synced (safe mode)');
  }

  // Start server
  const server = app.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port}`);
    console.log(`📋 Environment: ${config.nodeEnv}`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await sequelize.close();
      console.log('✅ Database connection closed');
      process.exit(0);
    });
    setTimeout(() => {
      console.error('⚠️ Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
