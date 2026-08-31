// server.js

const dotenv = require("dotenv");
dotenv.config();

const app = require("./src/app");
const connectDB = require("./src/config/db");
const { startReminderCron } = require("./src/cron/reminderCron");

// Connect Database
connectDB();

// Start reminder cron
startReminderCron();

// Render provides PORT automatically
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});