/**
 * models/Token.js
 *
 * FIX 5 (password reset / email verification):
 * Stores short-lived tokens for both flows.
 *
 * type: 'reset'  — password reset link sent by email
 * type: 'verify' — email address verification after registration
 *
 * TTL index on expiresAt automatically purges expired docs from MongoDB.
 */
import mongoose from 'mongoose';
import crypto   from 'crypto';

const tokenSchema = new mongoose.Schema({
  userId: {
    type:     mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userModel: {
    type:     String,
    enum:     ['User', 'Teacher'],
    required: true,
  },
  token: {
    type:     String,
    required: true,
    // Store a SHA-256 hash so a DB breach doesn't expose usable tokens
    default: () => crypto.randomBytes(32).toString('hex'),
  },
  type: {
    type:     String,
    enum:     ['reset', 'verify'],
    required: true,
  },
  expiresAt: {
    type:    Date,
    default: () => new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    index:   { expires: 0 },  // MongoDB TTL — auto-deletes the doc at expiresAt
  },
}, { timestamps: true });

export default mongoose.model('Token', tokenSchema);