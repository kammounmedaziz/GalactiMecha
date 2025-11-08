const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/galactimecha';
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret_in_prod';

let mongoClient;

// Middleware to parse JSON and enable CORS for local React dev
app.use(express.json());
app.use(cors());

// JWT middleware: if Authorization header is present, verify and attach user
app.use((req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return next();
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { sub, username, role }
  } catch (e) {
    // ignore invalid token
  }
  next();
});

// Mount auth and dashboard routers if present
try {
  const authRouter = require('./routes/auth');
  app.use('/auth', authRouter);
} catch (e) {
  console.warn('Auth router not found or failed to load:', e.message);
}

try {
  const dashboardRouter = require('./routes/dashboard');
  // Protect dashboard endpoints with the JWT middleware logic (routes themselves
  // may still check roles using req.user)
  app.use('/api', dashboardRouter);
} catch (e) {
  console.warn('Dashboard router not found or failed to load:', e.message);
}

// Mount faceauth proxy routes
try {
  const faceAuthRouter = require('./routes/faceauth');
  app.use('/faceauth', faceAuthRouter);
} catch (e) {
  console.warn('FaceAuth router not found or failed to load:', e.message);
}

// Health check endpoint (also checks DB connectivity)
app.get('/health', async (req, res) => {
  try {
    if (!mongoClient) {
      return res.status(200).json({ status: 'ok', db: 'not-connected' });
    }
    await mongoClient.db().command({ ping: 1 });
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    console.error('Health check DB ping failed:', err.message);
    res.status(200).json({ status: 'ok', db: 'unavailable' });
  }
});

// Example endpoint
app.get('/example', (req, res) => {
  res.json({ message: 'This is an example route for GalactiMecha API' });
});

// Simple DB test route: returns count of documents in `test_collection`
app.get('/db-test', async (req, res) => {
  try {
    if (!mongoClient) return res.status(500).json({ error: 'DB not connected' });
    const db = mongoClient.db();
    const count = await db.collection('test_collection').countDocuments({});
    res.json({ test_collection_count: count });
  } catch (err) {
    console.error('db-test error:', err);
    res.status(500).json({ error: 'db-test failed' });
  }
});

async function connectWithRetry() {
  const RETRY_MS = Number(process.env.MONGO_RETRY_MS || 5000);
  for (;;) {
    try {
      mongoClient = new MongoClient(MONGO_URI);
      await mongoClient.connect();
      app.locals.db = mongoClient.db();
      console.log('Connected to MongoDB');
      return; // stop retrying once connected
    } catch (err) {
      console.error(`MongoDB connection failed, retrying in ${RETRY_MS} ms...`, err.message);
      await new Promise(r => setTimeout(r, RETRY_MS));
    }
  }
}

// Start HTTP server immediately; connect to DB in background with retries
app.listen(PORT, () => {
  console.log(`GalactiMecha API server running on port ${PORT}`);
});

connectWithRetry();

process.on('SIGINT', async () => {
  console.log('Shutting down...');
  try {
    if (mongoClient) await mongoClient.close();
  } catch (e) {
    /* ignore */
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down...');
  try {
    if (mongoClient) await mongoClient.close();
  } catch (e) {}
  process.exit(0);
});