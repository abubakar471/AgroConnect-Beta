require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./lib/db');
const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');

const app = express();
const PORT = process.env.PORT || 5001;

// CORS
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
app.use(cors({ origin: CLIENT_URL, credentials: true }));

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Health
app.get('/health', (req, res) => res.json({ ok: true }));

// Temporary debug route to verify server routing for verification endpoints (no auth)
// Remove once troubleshooting is complete.
app.get('/api/debug/verification', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});
 

// Routes
app.use('/api/users', authRoutes);
app.use('/api', dataRoutes);

// Start
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect DB', err);
    process.exit(1);
  });
