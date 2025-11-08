import express from 'express';
import messageRoutes from './routes/messages.js';
import encryptionRoutes from './routes/encryption.js';
import telemetryRoutes from './routes/telemetry.js';
import { authMiddleware } from './middleware/auth.js';
import { rateLimitMiddleware } from './middleware/rateLimit.js';

const app = express();

// Middleware
app.use(express.json());
app.use(authMiddleware);
app.use(rateLimitMiddleware);

// Routes
app.use('/api/messages', messageRoutes);
app.use('/api/encryption', encryptionRoutes);
app.use('/api/telemetry', telemetryRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});