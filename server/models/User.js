import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['student', 'teacher'], default: 'student' },
  level: { type: String, enum: ['topper', 'average', 'last-minute'] },
  dailyHours: Number,
  target: String,
  examReadiness: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('User', userSchema);