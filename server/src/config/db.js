const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoURI) {
    console.error('CRITICAL WARNING: MONGODB_URI is not defined in environment variables.');
    return;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // In production environments, log error and retry instead of instant hard crash
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
