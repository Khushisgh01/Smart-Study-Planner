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

const subjectSchema = new mongoose.Schema({
  name:     String,
  examDate: Date,
  color:    String,

  classId: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Class',
    required: true,
  },

  chapters: [chapterSchema],

  // PYQs stored inside the subject document
  pyqs: [pyqSchema],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'Teacher',
  },
}, { timestamps: true });

export default mongoose.model('Subject', subjectSchema);