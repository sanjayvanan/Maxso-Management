const express = require('express');
const rateLimit = require('express-rate-limit');

// Controller functions
const { loginUser, signupUser, getMe, logoutUser, getAllUsers, getReferralHistory } = require('../controllers/userController');
const { requireAuth, requireAdmin } = require('../middleware/requireAuth');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 20, 
  message: { error: 'Too many attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public Auth routes
router.post('/login', authLimiter, loginUser);
router.post('/signup', authLimiter, signupUser);
router.post('/logout', logoutUser);

// Protected route to verify session on refresh
router.get('/me', requireAuth, getMe);

// Admin routes
router.get('/admin/users', requireAuth, requireAdmin, getAllUsers);
router.get('/admin/referrals', requireAuth, requireAdmin, getReferralHistory);

module.exports = router;