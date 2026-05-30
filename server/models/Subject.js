// import mongoose from 'mongoose';

// const chapterSchema = new mongoose.Schema({
//   name: String,
//   weightage: Number,
//   difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
//   pyqFrequency: { type: String, enum: ['low', 'medium', 'high'] },
//   estimatedTime: Number,
//   isWeak: { type: Boolean, default: false },
// });

// const subjectSchema = new mongoose.Schema({
//   name: String,
//   examDate: Date,
//   color: String,

//   classId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Class',
//     required: true
//   },

//   chapters: [chapterSchema],

//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Teacher'
//   }

// }, { timestamps: true });

// export default mongoose.model('Subject', subjectSchema);
import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema({
  name:          String,
  weightage:     Number,
  difficulty:    { type: String, enum: ['easy', 'medium', 'hard'] },
  pyqFrequency:  { type: String, enum: ['low', 'medium', 'high'] },
  estimatedTime: Number,
  isWeak:        { type: Boolean, default: false },
});

// PYQ sub-document — referenced by PYQPage
const pyqSchema = new mongoose.Schema({
  year:       String,
  title:      String,
  fileUrl:    { type: String, default: '#' },
  uploadedAt: { type: Date, default: Date.now },
});

const studentProgressSchema = new mongoose.Schema({
  student: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },
  completedChapters: { type: Number, default: 0 },
  totalChapters:     { type: Number, default: 0 },
  // Derived field — kept denormalised so reads are O(1)
  pct:               { type: Number, default: 0, min: 0, max: 100 },
}, { _id: false });

const subjectSchema = new mongoose.Schema({
  name:     String,
  examDate: Date,
  color: { type: String, default: '#6366f1' },

  badge: {
    type:    String,
    enum:    ['High Weight', 'Urgent', 'Weak Area', null],
    default: null,
  },

  classId: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Class',
    required: true,
  },

  chapters: [chapterSchema],

  // PYQs stored inside the subject document
  pyqs: [pyqSchema],
  progress: [studentProgressSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'Teacher',
  },
}, { timestamps: true });

subjectSchema.pre('save', function (next) {
  // Only recompute when relevant fields changed
  if (
    !this.isModified('examDate') &&
    !this.isModified('chapters') &&
    !this.isModified('badge')
  ) return next();
 
  const now      = Date.now();
  const sevenDay = 7 * 24 * 60 * 60 * 1000;
 
  if (this.examDate && (this.examDate - now) <= sevenDay && this.examDate > now) {
    this.badge = 'Urgent';
  } else if (this.chapters.some(c => (c.weightage || 0) >= 8)) {
    this.badge = 'High Weight';
  } else if (this.chapters.some(c => c.isWeak)) {
    this.badge = 'Weak Area';
  } else {
    this.badge = null;
  }
 
  next();
});

export default mongoose.model('Subject', subjectSchema);