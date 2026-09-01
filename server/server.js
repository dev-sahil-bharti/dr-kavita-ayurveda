const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const app = require('./src/app');
const connectDB = require('./src/config/db');
const { startReminderCron } = require('./src/cron/reminderCron');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

// Connect Database
connectDB();

// Start reminder cron
startReminderCron();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🌿 Dr. Kavita Ayurveda Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful termination handler
const gracefulShutdown = (signal) => {
  console.log(`\n👋 ${signal} received. Closing HTTP server and database connections gracefully...`);
  server.close(async () => {
    console.log('💤 HTTP server closed.');
    try {
      await mongoose.connection.close(false);
      console.log('🍃 MongoDB connection closed.');
      process.exit(0);
    } catch (err) {
      console.error('Error closing MongoDB connection:', err);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));