const express = require('express');
const cors = require('cors');
const path = require('path');
const AppError = require('./utils/AppError');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
const routes = require('./routes');
app.use('/api', routes);

// Handle unhandled API routes
app.use('/api', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));

  app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, '../../client/dist/index.html'));
  });
} else {
  // Basic route
  app.get('/', (req, res) => {
    res.send('Server is running port :' + process.env.PORT);
  });
}

// Global Error Handler
app.use(errorHandler);

module.exports = app;