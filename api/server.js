const express = require('express');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware to parse JSON
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Example endpoint
app.get('/example', (req, res) => {
  res.json({ message: 'This is an example route for GalactiMecha API' });
});

app.listen(PORT, () => {
  console.log(`GalactiMecha API server running on port ${PORT}`);
});