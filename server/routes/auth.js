// import express from "express";
// import {
//   loginUser,
//   registerUser,
//   loginTeacher,
//   registerTeacher,
// } from "../controllers/authController.js";

// const router = express.Router();

// router.post("/user/login", loginUser);
// router.post("/user/register", registerUser);
// router.post("/teacher/login", loginTeacher);
// router.post("/teacher/register", registerTeacher);

// export default router;
/*
import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import {
  loginUser,
  registerUser,
  loginTeacher,
  registerTeacher,
} from "../controllers/authController.js";

const router = express.Router();

// ── Auth routes ──────────────────────────────────────────────────────────
router.post("/user/login",      loginUser);
router.post("/user/register",   registerUser);
router.post("/teacher/login",   loginTeacher);
router.post("/teacher/register",registerTeacher);

// ── PATCH /api/auth/user/preferences ────────────────────────────────────
// Called from Onboarding.jsx after the user sets level / target / dailyHours.
// Previously this endpoint didn't exist → Onboarding silently failed.
router.patch("/user/preferences", protect, async (req, res) => {
  try {
    const { level, target, dailyHours } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        ...(level      !== undefined && { level }),
        ...(target     !== undefined && { target }),
        ...(dailyHours !== undefined && { dailyHours: Number(dailyHours) }),
      },
      { new: true, select: "-password" }
    );

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Preferences saved", user: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
*/
/**
 * routes/auth.js
 *
 * FIX 5: adds password-reset and email-verification endpoints.
 *
 * Password reset flow
 * ───────────────────
 *  1. POST /api/auth/forgot-password   { email, role: 'student'|'teacher' }
 *       → creates a Token doc and would email the link in production.
 *         Returns the raw token in dev so you can test without an SMTP server.
 *  2. POST /api/auth/reset-password    { token, newPassword }
 *       → validates token, hashes new password, deletes token.
 *
 * Email verification flow
 * ───────────────────────
 *  1. POST /api/auth/send-verification { email, role }
 *       → creates a 'verify' Token and would send the link.
 *  2. GET  /api/auth/verify-email?token=<raw>
 *       → marks the user/teacher as verified, deletes the token.
 *
 * The User and Teacher models need an `isVerified` Boolean field for the
 * verification flow to persist.  Add `isVerified: { type: Boolean, default: false }`
 * to both schemas if email gating is required.
 *
 * In production, replace the console.log calls with your mailer
 * (e.g. nodemailer + SendGrid / Resend / SES).
 */

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

// ── Helper: resolve model by role string ────────────────────────────────
function modelFor(role) {
  if (role === 'teacher') return Teacher;
  if (role === 'student') return User;
  return null;
}

// ── POST /api/auth/forgot-password ───────────────────────────────────────
// Body: { email: string, role: 'student' | 'teacher' }
// Creates a password-reset token and (in production) emails it.
router.post('/forgot-password', async (req, res) => {
  try {
    const { email, role = 'student' } = req.body;
    if (!email) return res.status(400).json({ message: 'email is required' });

    const Model = modelFor(role);
    if (!Model) return res.status(400).json({ message: 'role must be student or teacher' });

    const account = await Model.findOne({ email: email.toLowerCase() });
    // Always 200 — don't reveal whether the email exists
    if (!account) return res.json({ message: 'If that email exists, a reset link has been sent.' });

    // Delete any existing reset tokens for this user so there's only ever one
    await Token.deleteMany({ userId: account._id, type: 'reset' });

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    await Token.create({
      userId:    account._id,
      userModel: role === 'teacher' ? 'Teacher' : 'User',
      token:     hashedToken,
      type:      'reset',
    });

    // ── Production: send email here ──────────────────────────────────────
    // const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}&role=${role}`;
    // await sendEmail({ to: email, subject: 'Reset your password', html: `<a href="${resetUrl}">Reset</a>` });
    //
    // ── Development: return raw token so you can test without SMTP ───────
    const isDev = process.env.NODE_ENV !== 'production';
    res.json({
      message: 'If that email exists, a reset link has been sent.',
      ...(isDev && { devToken: rawToken }), // remove in prod
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/auth/reset-password ────────────────────────────────────────
// Body: { token: string, newPassword: string }
// Validates the token, updates the password, deletes the token.
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

    // Hash manually here so we can call save() to trigger the pre-save hook
    // (which would double-hash if we set the raw password directly)
    const salt = await bcrypt.genSalt(10);
    account.password = await bcrypt.hash(newPassword, salt);
    // Mark password as NOT modified so the pre-save hook skips re-hashing
    account.$__.activePaths.states.modify = new Set(
      [...(account.$__.activePaths.states.modify || [])].filter(k => k !== 'password')
    );
    await account.save({ validateModifiedOnly: true });

    // Simpler alternative that avoids the hook issue entirely:
    // await Model.findByIdAndUpdate(tokenDoc.userId, { password: hashedPw });

    await tokenDoc.deleteOne();

    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/auth/send-verification ─────────────────────────────────────
// Body: { email: string, role: 'student' | 'teacher' }
// Sends (or resends) an email verification link.
// Requires User/Teacher models to have `isVerified: Boolean` field.
router.post('/send-verification', async (req, res) => {
  try {
    const { email, role = 'student' } = req.body;
    if (!email) return res.status(400).json({ message: 'email is required' });

    const Model   = modelFor(role);
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

    // ── Production: send email here ──────────────────────────────────────
    // const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${rawToken}&role=${role}`;
    // await sendEmail({ to: email, subject: 'Verify your email', html: `<a href="${verifyUrl}">Verify</a>` });

    const isDev = process.env.NODE_ENV !== 'production';
    res.json({
      message: 'If that email exists, a verification link has been sent.',
      ...(isDev && { devToken: rawToken }),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/auth/verify-email?token=<raw>&role=student|teacher ──────────
// Query params: token, role
// Marks the account as verified and deletes the token.
router.get('/verify-email', async (req, res) => {
  try {
    const { token, role = 'student' } = req.query;
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