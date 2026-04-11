import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subject: String,
  chapter: String,
  taskType: { type: String, enum: ['Learn', 'Revise1', 'Revise2', 'PYQ'] },
  scheduledDate: Date,
  status: { type: String, enum: ['pending', 'done', 'partial', 'skipped'], default: 'pending' },
  estimatedTime: Number,
  priority: Number,
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);