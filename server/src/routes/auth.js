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

// Onboard: update user profile (name, phone, location, farmSize, specialization)
router.post('/onboard', requireAuth(), async (req, res) => {
  try {
    const { userId } = req.auth;
    const { name, phone, location, farmSize, specialization } = req.body;

    const update = {};
    if (name) update.name = name;
    if (phone) update.phone = phone;
    if (location) update.location = location;
    if (farmSize) update.farmSize = farmSize;
    if (specialization) update.specialization = specialization;

    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { $set: update },
      { new: true, upsert: true }
    );

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

const VerificationRequest = require('../models/VerificationRequest');

// Submit verification request (expects nidFrontUrl, nidBackUrl, farmVideoUrl)
router.post('/verification', requireAuth(), async (req, res) => {
  try {
    const { userId } = req.auth;
    const { nidFrontUrl, nidBackUrl, farmVideoUrl } = req.body;

    if (!nidFrontUrl || !nidBackUrl || !farmVideoUrl) {
      return res.status(400).json({ error: 'Missing media URLs' });
    }

    // Ensure user exists
    let user = await User.findOne({ clerkId: userId });
    if (!user) {
      user = await User.create({ clerkId: userId, role: null, verified: false });
    }

    const vr = await VerificationRequest.create({
      user: user._id,
      nidFrontUrl,
      nidBackUrl,
      farmVideoUrl,
      status: 'pending'
    });

    // Optionally: mark user as verificationPending (we can store a flag)
    await User.findByIdAndUpdate(user._id, { $set: { verificationRequestedAt: new Date() } });

    res.json({ ok: true, verificationRequest: vr });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user's verification request(s)
router.get('/verification', requireAuth(), async (req, res) => {
  try {
    const { userId } = req.auth;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // return latest verification request(s) for this user
    const list = await VerificationRequest.find({ user: user._id }).sort({ createdAt: -1 }).lean();
    res.json({ ok: true, verifications: list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update an existing verification request (farmer can update their pending request)
router.put('/verification/:id', requireAuth(), async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params;
    const { nidFrontUrl, nidBackUrl, farmVideoUrl } = req.body;

    

    const vr = await VerificationRequest.findById(id);
    if (!vr) return res.status(404).json({ error: 'Verification request not found' });

    // ensure the requesting clerk user owns this verification
    const user = await User.findOne({ clerkId: userId });
    if (!user || vr.user.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }

  // Update provided fields — use hasOwnProperty checks so we honor explicit
  // updates even when a value might be an empty string or other falsy value.
  if (Object.prototype.hasOwnProperty.call(req.body, 'nidFrontUrl')) vr.nidFrontUrl = nidFrontUrl;
  if (Object.prototype.hasOwnProperty.call(req.body, 'nidBackUrl')) vr.nidBackUrl = nidBackUrl;
  if (Object.prototype.hasOwnProperty.call(req.body, 'farmVideoUrl')) vr.farmVideoUrl = farmVideoUrl;
  // Reset status to pending on any update
  vr.status = 'pending';
    await vr.save();

    

    // update user's verificationRequestedAt
    await User.findByIdAndUpdate(user._id, { $set: { verificationRequestedAt: new Date() } });

    res.json({ ok: true, verificationRequest: vr });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin-only routes: list verification requests, approve, reject, ban user
async function ensureAdmin(req, res, next) {
  try {
    const { userId } = req.auth;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const adminUser = await User.findOne({ clerkId: userId });
    if (!adminUser || adminUser.role !== 'admin') return res.status(403).json({ error: 'Forbidden: admin only' });
    req.admin = adminUser;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

// List all verification requests (admin)
router.get('/verifications', requireAuth(), ensureAdmin, async (req, res) => {
  try {
    const list = await VerificationRequest.find().populate('user').sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Approve a verification request and mark user verified
router.post('/verifications/:id/approve', requireAuth(), ensureAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const vr = await VerificationRequest.findById(id);
    if (!vr) return res.status(404).json({ error: 'Not found' });

    vr.status = 'approved';
    vr.reviewedAt = new Date();
    vr.reviewedBy = req.admin.name || req.admin.clerkId;
    await vr.save();

    // mark related user verified
    await User.findByIdAndUpdate(vr.user, { $set: { verified: true } });

    res.json({ ok: true, verificationRequest: vr });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reject a verification request with optional notes
router.post('/verifications/:id/reject', requireAuth(), ensureAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const vr = await VerificationRequest.findById(id);
    if (!vr) return res.status(404).json({ error: 'Not found' });

    vr.status = 'rejected';
    vr.reviewedAt = new Date();
    vr.reviewedBy = req.admin.name || req.admin.clerkId;
    vr.notes = notes || '';
    await vr.save();

    // optionally mark user verified false (ensure)
    await User.findByIdAndUpdate(vr.user, { $set: { verified: false } });

    res.json({ ok: true, verificationRequest: vr });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Ban a user (admin)
router.post('/users/:id/ban', requireAuth(), ensureAdmin, async (req, res) => {
  try {
    const { id } = req.params; // this is user._id
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.banned = true;
    await user.save();

    res.json({ ok: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
