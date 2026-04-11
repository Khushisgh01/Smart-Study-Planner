import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema({
  name: String,
  weightage: Number,
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
  pyqFrequency: { type: String, enum: ['low', 'medium', 'high'] },
  estimatedTime: Number,
  isWeak: { type: Boolean, default: false },
});

const subjectSchema = new mongoose.Schema({
  name: String,
  examDate: Date,
  color: String,
  chapters: [chapterSchema],
  progress: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Subject', subjectSchema);