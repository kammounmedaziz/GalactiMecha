const express = require('express');
const router = express.Router();

// Simple in-memory experiment store for demo
const experiments = {};
let nextExpId = 1;

// Helper: require auth middleware will be attached in server.js via req.user
function requireRole(roles) {
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'unauthenticated' });
    if (!roles.includes(user.role)) return res.status(403).json({ error: 'forbidden' });
    next();
  };
}

// /metrics - return sample metrics and drift info
router.get('/metrics', (req, res) => {
  const sample = {
    model: 'base-model-v1',
    accuracy: 0.92,
    auc: 0.96,
    drift: [{ feature: 'age', score: 0.12 }, { feature: 'income', score: 0.03 }]
  };
  res.json(sample);
});

// /predictions - return last N predictions (sample)
router.get('/predictions', (req, res) => {
  const items = Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    input: { x: Math.random() },
    prediction: Math.random() > 0.5 ? 'positive' : 'negative',
    score: Math.random(),
    suspicious: Math.random() < 0.05,
    ts: Date.now() - i * 1000
  }));
  res.json({ items });
});

// /experiments - list
router.get('/experiments', (req, res) => {
  res.json(Object.values(experiments));
});

// Start an experiment (POST /experiments/start)
router.post('/experiments/start', requireRole(['admin', 'researcher']), (req, res) => {
  const id = nextExpId++;
  const exp = { id, name: req.body.name || `exp-${id}`, status: 'running', startedAt: Date.now() };
  experiments[id] = exp;

  // Simulate background work
  setTimeout(() => {
    exp.status = Math.random() > 0.1 ? 'completed' : 'failed';
    exp.finishedAt = Date.now();
  }, 3000 + Math.random() * 4000);

  res.status(202).json(exp);
});

// Stop an experiment
router.post('/experiments/:id/stop', requireRole(['admin', 'researcher']), (req, res) => {
  const id = Number(req.params.id);
  const exp = experiments[id];
  if (!exp) return res.status(404).json({ error: 'not found' });
  exp.status = 'stopped';
  exp.stoppedAt = Date.now();
  res.json(exp);
});

module.exports = router;
