const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Initialize Cron Jobs
require('./services/cronService');

const app = express();

// ── Security & Basic Middleware ───────────────────────────
app.use(helmet()); // Security headers
app.use(cors());   // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Logger
}

// ── Routes ──────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to BabyeyiPro API' });
});

// Import routes here
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/v1', require('./routes/genericRoutes')); // The massive CRUD factory

// Static Files (Serve uploaded documents securely)
app.use('/uploads', express.static('uploads'));

// Specialized Domain Routes
app.use('/api/hardware', require('./routes/hardwareRoutes'));
app.use('/api/finance', require('./routes/financeRoutes'));
app.use('/api/academic', require('./routes/academicRoutes'));
app.use('/api/communication', require('./routes/communicationRoutes'));
app.use('/api/webhooks', require('./routes/webhookRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/import', require('./routes/importRoutes'));

// Global Platform & Agency Routes
app.use('/api/platform', require('./routes/globalRoutes'));

// ── Error Handling ──────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
