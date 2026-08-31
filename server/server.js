// server.js
const dotenv = require('dotenv');
dotenv.config();

const app = require('./src/app');
const connectDB = require('./src/config/db');
const { startReminderCron } = require('./src/cron/reminderCron');

// Connect Database
connectDB();

// Start reminder cron
try {
  startReminderCron();
} catch (cronErr) {
  console.warn('Reminder cron initialization warning:', cronErr.message);
}

// Render provides PORT automatically in environment variables
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Dr. Kavita Ayurveda Server running on port ${PORT}`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated.');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated.');
  });
});

module.exports = server;