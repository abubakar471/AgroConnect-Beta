const express = require('express');
const { requireAuth } = require('@clerk/express');
const User = require('../models/User');

const router = express.Router();

// Ensure a user record exists for the signed-in Clerk user
router.get('/me', requireAuth(), async (req, res) => {
  try {
    const { userId } = req.auth;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    let user = await User.findOne({ clerkId: userId });
    if (!user) {
      // Create a basic user record
      user = await User.create({ clerkId: userId, role: null, verified: false });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Set/Update role and name for current user (first-time role selection)
router.post('/role', requireAuth(), async (req, res) => {
  try {
    const { userId } = req.auth;
    const { role, name } = req.body;

    if (!['farmer', 'buyer', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { $set: { role, name } },
      { new: true, upsert: true }
    );

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
