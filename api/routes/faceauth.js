const express = require('express');
const axios = require('axios');

const router = express.Router();

// Proxy to the Python face-auth service. In docker-compose the service name is 'faceauth'.
const FACEAUTH_HOST = process.env.FACEAUTH_HOST || 'http://localhost:5000';
const jwt = require('jsonwebtoken');
const authRouter = require('./auth');
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret_in_prod';

router.post('/register', async (req, res) => {
  try {
    const resp = await axios.post(`${FACEAUTH_HOST}/register`, req.body, { timeout: 20000 });
    res.status(resp.status).json(resp.data);
  } catch (err) {
    console.error('faceauth/register error', err.message);
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

router.post('/authenticate', async (req, res) => {
  try {
    const resp = await axios.post(`${FACEAUTH_HOST}/authenticate`, req.body, { timeout: 20000 });
    const data = resp.data || {};
    // If python service recognized a user, map to local user and return JWT
    if (data.user) {
      const found = authRouter.findUserByName(data.user);
      if (found) {
        const token = jwt.sign({ sub: found.id, username: found.username, role: found.role }, JWT_SECRET, { expiresIn: '8h' });
        return res.json({ token, user: { id: found.id, username: found.username, role: found.role }, score: data.score });
      }
      // user recognized by face DB but not present in API users
      return res.status(404).json({ error: 'user recognized by face-auth not found in API users', user: data.user });
    }
    res.status(resp.status).json(data);
  } catch (err) {
    console.error('faceauth/authenticate error', err.message);
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

module.exports = router;
