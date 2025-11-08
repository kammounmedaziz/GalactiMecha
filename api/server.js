/**
 * GalactiMecha API Server
 * Express.js backend for AI-Powered Mars Navigation System
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

// Import routes
import navigationRoutes from './routes/navigation.js';
import simulationRoutes from './routes/simulation.js';
import attackRoutes from './routes/attack.js';
import analyticsRoutes from './routes/analytics.js';
import driftRoutes from './routes/drift.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('dev')); // Logging
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'operational',
    message: 'GalactiMecha API is running',
    timestamp: new Date().toISOString(),
    services: {
      navigation: 'online',
      simulation: 'online',
      attack_scenarios: 'online',
      analytics: 'online',
      drift_detection: 'online'
    }
  });
});

// API Routes
app.use('/api/navigation', navigationRoutes);
app.use('/api/simulation', simulationRoutes);
app.use('/api/attack', attackRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/drift', driftRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.path}`,
    availableRoutes: [
      '/api/health',
      '/api/navigation',
      '/api/simulation',
      '/api/attack',
      '/api/analytics',
      '/api/drift'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 GalactiMecha API Server`);
  console.log(`================================`);
  console.log(`🌌 Status: Operational`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`🤖 AI Backend: ${process.env.PYTHON_API_URL}`);
  console.log(`================================\n`);
});

export default app;
