import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, lowercase: true, unique: true },
  password: { type: String, required: true },
  level: { type: String, enum: ['topper', 'average', 'last-minute'] },
  dailyHours: Number,
  target: String,
  examReadiness: { type: Number, default: 0 },

  // Bug 7 & 15: classId links a student to their enrolled class
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    default: null,
  },
}, { timestamps: true });

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model('User', userSchema);