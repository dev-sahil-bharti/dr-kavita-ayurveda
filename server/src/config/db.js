const mongoose = require('mongoose');
const dns = require('node:dns');

// Use reliable public DNS resolvers for MongoDB Atlas SRV lookups if possible
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore in restricted sandboxes
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI or MONGO_URI is not defined in environment variables!');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`🍃 MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Do not crash immediately in dev to allow nodemon retry, but log clearly
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
