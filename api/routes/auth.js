const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

// In-memory demo users. Replace with DB-backed users in production.
const users = [
  { id: 1, username: 'admin', passwordHash: bcrypt.hashSync('adminpass', 8), role: 'admin' },
  { id: 2, username: 'researcher', passwordHash: bcrypt.hashSync('research', 8), role: 'researcher' },
  { id: 3, username: 'viewer', passwordHash: bcrypt.hashSync('viewer', 8), role: 'viewer' }
];

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret_in_prod';
const JWT_EXPIRES_IN = '8h';

// Login route: accepts { username, password } and returns { token }
router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });

  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'invalid credentials' });

  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });

  const token = jwt.sign({ sub: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

// Helper for other modules: find user by username
router.findUserByName = (username) => users.find(u => u.username === username);

// Export the in-memory users for integration tests or inspection
router._users = users;

module.exports = router;
