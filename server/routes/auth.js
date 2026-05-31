import express  from 'express';
import crypto   from 'crypto';
import bcrypt   from 'bcryptjs';
import User     from '../models/User.js';
import Teacher  from '../models/Teacher.js';
import Token    from '../models/Token.js';
import { protect } from '../middleware/auth.js';
import {
  loginUser,
  registerUser,
  loginTeacher,
  registerTeacher,
} from '../controllers/authController.js';

const router = express.Router();

// ── Auth routes ──────────────────────────────────────────────────────────
router.post('/user/login',       loginUser);
router.post('/user/register',    registerUser);
router.post('/teacher/login',    loginTeacher);
router.post('/teacher/register', registerTeacher);

// ── PATCH /api/auth/user/preferences ────────────────────────────────────
router.patch('/user/preferences', protect, async (req, res) => {
  try {
    const { level, target, dailyHours } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        ...(level      !== undefined && { level }),
        ...(target     !== undefined && { target }),
        ...(dailyHours !== undefined && { dailyHours: Number(dailyHours) }),
      },
      { new: true, select: '-password' }
    );

    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Preferences saved', user: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/auth/me ─────────────────────────────────────────────────────
router.get('/me', protect, async (req, res) => {
  try {
    const Model = req.user.role === 'teacher' ? Teacher : User;
    const account = await Model.findById(req.user.id).select('-password');
    if (!account) return res.status(404).json({ message: 'Account not found' });
    res.json({ ...account.toObject(), role: req.user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Helper: resolve model by role string ────────────────────────────────
function modelFor(role) {
  if (role === 'teacher') return Teacher;
  if (role === 'student') return User;
  return null;
}

// ── POST /api/auth/forgot-password ──────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  try {
    const { email, role = 'student' } = req.body;
    if (!email) return res.status(400).json({ message: 'email is required' });

    const Model = modelFor(role);
    if (!Model) return res.status(400).json({ message: 'role must be student or teacher' });

    const account = await Model.findOne({ email: email.toLowerCase() });
    if (!account) return res.json({ message: 'If that email exists, a reset link has been sent.' });

    await Token.deleteMany({ userId: account._id, type: 'reset' });

    const rawToken    = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    await Token.create({
      userId:    account._id,
      userModel: role === 'teacher' ? 'Teacher' : 'User',
      token:     hashedToken,
      type:      'reset',
    });

    const isDev = process.env.NODE_ENV !== 'production';
    res.json({
      message: 'If that email exists, a reset link has been sent.',
      ...(isDev && { devToken: rawToken }),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/auth/reset-password ────────────────────────────────────────
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'token and newPassword are required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const tokenDoc = await Token.findOne({
      token:     hashedToken,
      type:      'reset',
      expiresAt: { $gt: new Date() },
    });

    if (!tokenDoc) {
      return res.status(400).json({ message: 'Token is invalid or has expired' });
    }

    const Model   = tokenDoc.userModel === 'Teacher' ? Teacher : User;
    const account = await Model.findById(tokenDoc.userId);
    if (!account) return res.status(404).json({ message: 'Account not found' });

    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash(newPassword, salt);

    // Use findByIdAndUpdate to bypass pre-save hook double-hashing
    await Model.findByIdAndUpdate(tokenDoc.userId, { password: hashedPw });

    await tokenDoc.deleteOne();
    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/auth/send-verification ─────────────────────────────────────
router.post('/send-verification', async (req, res) => {
  try {
    const { email, role = 'student' } = req.body;
    if (!email) return res.status(400).json({ message: 'email is required' });

    const Model = modelFor(role);
    if (!Model) return res.status(400).json({ message: 'role must be student or teacher' });

    const account = await Model.findOne({ email: email.toLowerCase() });
    if (!account) return res.json({ message: 'If that email exists, a verification link has been sent.' });
    if (account.isVerified) return res.json({ message: 'Email is already verified.' });

    await Token.deleteMany({ userId: account._id, type: 'verify' });

    const rawToken    = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    await Token.create({
      userId:    account._id,
      userModel: role === 'teacher' ? 'Teacher' : 'User',
      token:     hashedToken,
      type:      'verify',
    });

    const isDev = process.env.NODE_ENV !== 'production';
    res.json({
      message: 'If that email exists, a verification link has been sent.',
      ...(isDev && { devToken: rawToken }),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/auth/verify-email ────────────────────────────────────────────
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: 'token query param is required' });

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const tokenDoc = await Token.findOne({
      token:     hashedToken,
      type:      'verify',
      expiresAt: { $gt: new Date() },
    });

    if (!tokenDoc) {
      return res.status(400).json({ message: 'Token is invalid or has expired' });
    }

    const Model = tokenDoc.userModel === 'Teacher' ? Teacher : User;
    await Model.findByIdAndUpdate(tokenDoc.userId, { isVerified: true });
    await tokenDoc.deleteOne();

    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;