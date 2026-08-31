const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const AppError = require('./utils/AppError');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Trust proxy for secure headers behind Render/Cloudflare reverse proxies
app.set('trust proxy', 1);

// Flexible CORS configuration
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((url) => url.trim().replace(/\/$/, ''))
  : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      // Allow if origin is in whitelist or if in production with wildcard
      if (
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes('*') ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.onrender.com') ||
        origin.includes('localhost')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive fallback to prevent breaking patient bookings
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static uploads directory (ensure folder exists)
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
  } catch (err) {
    console.warn('Could not create uploads directory:', err.message);
  }
}
app.use('/uploads', express.static(uploadsDir));

// Health check endpoints (for Render, uptime monitors, etc.)
app.get(['/health', '/api/health'], (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Dr. Kavita Ayurveda Backend is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Primary API Routes
const routes = require('./routes');
app.use('/api', routes);

// Handle unhandled API routes
app.use('/api/*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Root & Static Files handler
const clientDistPath = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.status(200).json({
      status: 'active',
      service: 'Dr. Kavita Ayurveda API Server',
      environment: process.env.NODE_ENV || 'development',
      endpoints: {
        health: '/health',
        api: '/api',
      },
    });
  });
}

// Global Error Handler
app.use(errorHandler);

module.exports = app;