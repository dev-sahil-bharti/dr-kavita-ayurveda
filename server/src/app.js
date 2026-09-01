const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const AppError = require('./utils/AppError');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Set security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Collect allowed origins
const envOrigins = [
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
]
  .filter(Boolean)
  .flatMap((url) => url.split(',').map((u) => u.trim().replace(/\/+$/, '')));

const defaultAllowedOrigins = [
  'https://dr-kavita-ayurveda.onrender.com',
  'https://dr-kavita-ayurveda-server.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
];

const allowedOrigins = Array.from(new Set([...envOrigins, ...defaultAllowedOrigins]));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman, server-to-server)
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.trim().replace(/\/+$/, '');

      if (
        allowedOrigins.includes(normalizedOrigin) ||
        normalizedOrigin.endsWith('.onrender.com') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }

      console.warn(`Blocked origin by CORS: ${origin}`);
      return callback(new AppError('Blocked by CORS policy', 403));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-razorpay-signature'],
  })
);

// Global Rate Limiting on API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again in 15 minutes',
  },
});
app.use('/api', apiLimiter);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
const routes = require('./routes');
app.use('/api', routes);

// Handle unhandled API routes (Express 5 safe)
app.use('/api', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Serve frontend in production SPA fallback
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));

  app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, '../../client/dist/index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'Dr. Kavita Ayurveda API Server is running',
      health: '/api/health',
    });
  });
}

// Global Error Handler
app.use(errorHandler);

module.exports = app;