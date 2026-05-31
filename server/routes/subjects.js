// // import express  from 'express';
// // import multer   from 'multer';
// // import path     from 'path';
// // import fs       from 'fs';
// // import Subject  from '../models/Subject.js';
// // import Class    from '../models/Class.js';
// // import User     from '../models/User.js';
// // import Task     from '../models/Task.js';
// // import { protect, teacherOnly } from '../middleware/auth.js';

// // const router = express.Router();

// // // ── Multer — PYQ PDF uploads ──────────────────────────────────────────────
// // const pyqStorage = multer.diskStorage({
// //   destination(req, file, cb) {
// //     const dir = path.join('uploads', 'pyqs', req.params.id);
// //     fs.mkdirSync(dir, { recursive: true });
// //     cb(null, dir);
// //   },
// //   filename(req, file, cb) {
// //     cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
// //   },
// // });

// // const pyqUpload = multer({
// //   storage: pyqStorage,
// //   limits:  { fileSize: 20 * 1024 * 1024 },
// //   fileFilter(_req, file, cb) {
// //     file.mimetype === 'application/pdf'
// //       ? cb(null, true)
// //       : cb(new Error('Only PDF files are allowed'));
// //   },
// // });

// // // ── GET /api/subjects/teacher ─────────────────────────────────────────────
// // // MUST be before /:id so "teacher" isn't mistaken for a Mongo ObjectId.
// // router.get('/teacher', protect, teacherOnly, async (req, res) => {
// //   try {
// //     const classes  = await Class.find({ teacher: req.user.id }).select('_id name section');
// //     const classIds = classes.map(c => c._id);
// //     const subjects = await Subject.find({ classId: { $in: classIds } }).lean();

// //     const classMap = {};
// //     for (const c of classes) classMap[c._id.toString()] = { name: c.name, section: c.section };

// //     res.json(subjects.map(s => ({ ...s, classInfo: classMap[s.classId?.toString()] || null })));
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // // ── GET /api/subjects ─────────────────────────────────────────────────────
// // // Student: subjects for their enrolled class, with only their own progress row.
// // router.get('/', protect, async (req, res) => {
// //   try {
// //     const user = await User.findById(req.user.id).select('classId');
// //     if (!user?.classId) return res.json([]);

// //     const subjects = await Subject.find({ classId: user.classId }).lean();

// //     const result = subjects.map(s => ({
// //       ...s,
// //       myProgress: s.progress?.find(p => p.student?.toString() === req.user.id) || {
// //         completedChapters: 0,
// //         totalChapters:     s.chapters?.length || 0,
// //         pct:               0,
// //       },
// //       progress: undefined, // don't leak other students' data
// //     }));

// //     res.json(result);
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // // ── GET /api/subjects/class/:classId ─────────────────────────────────────
// // router.get('/class/:classId', protect, async (req, res) => {
// //   try {
// //     const subjects = await Subject.find({ classId: req.params.classId }).lean();
// //     res.json(subjects);
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // // ── POST /api/subjects/class/:classId ────────────────────────────────────
// // router.post('/class/:classId', protect, teacherOnly, async (req, res) => {
// //   try {
// //     const cls = await Class.findOne({ _id: req.params.classId, teacher: req.user.id });
// //     if (!cls) return res.status(403).json({ message: 'Not your class' });

// //     const { examDate, ...rest } = req.body;

// //     const duplicate = await Subject.findOne({ classId: req.params.classId, name: rest.name });
// //     if (duplicate) {
// //       return res.status(400).json({ message: `Subject "${rest.name}" already exists in this class` });
// //     }

// //     const subject = await Subject.create({
// //       ...rest,
// //       examDate:  examDate ? new Date(examDate) : undefined,
// //       classId:   req.params.classId,
// //       createdBy: req.user.id,
// //     });

// //     await Class.findByIdAndUpdate(req.params.classId, { $push: { subjects: subject._id } });
// //     res.status(201).json(subject);
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // // ── PUT /api/subjects/:id ─────────────────────────────────────────────────
// // router.put('/:id', protect, teacherOnly, async (req, res) => {
// //   try {
// //     const subject = await Subject.findById(req.params.id);
// //     if (!subject) return res.status(404).json({ message: 'Subject not found' });

// //     const cls = await Class.findOne({ _id: subject.classId, teacher: req.user.id });
// //     if (!cls) return res.status(403).json({ message: 'Not your subject' });

// //     // Strip badge — recalculated by pre-save hook
// //     const { examDate, badge: _ignored, ...rest } = req.body;
// //     Object.assign(subject, rest);
// //     if (examDate) subject.examDate = new Date(examDate);

// //     const updated = await subject.save();
// //     res.json(updated);
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // // ── DELETE /api/subjects/:id ──────────────────────────────────────────────
// // router.delete('/:id', protect, teacherOnly, async (req, res) => {
// //   try {
// //     const subject = await Subject.findById(req.params.id);
// //     if (!subject) return res.status(404).json({ message: 'Subject not found' });

// //     const cls = await Class.findOne({ _id: subject.classId, teacher: req.user.id });
// //     if (!cls) return res.status(403).json({ message: 'Not your subject' });

// //     await Class.findByIdAndUpdate(subject.classId, { $pull: { subjects: subject._id } });
// //     await Subject.findByIdAndDelete(req.params.id);

// //     res.json({ message: 'Subject deleted' });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // // ── POST /api/subjects/:id/pyqs ───────────────────────────────────────────
// // router.post(
// //   '/:id/pyqs',
// //   protect,
// //   teacherOnly,
// //   pyqUpload.single('file'),
// //   async (req, res) => {
// //     try {
// //       const { year, title } = req.body;
// //       if (!year || !title) {
// //         return res.status(400).json({ message: 'year and title are required' });
// //       }

// //       const fileUrl = req.file
// //         ? `/uploads/pyqs/${req.params.id}/${req.file.filename}`
// //         : '#';

// //       const subject = await Subject.findByIdAndUpdate(
// //         req.params.id,
// //         { $push: { pyqs: { year, title, fileUrl, uploadedAt: new Date() } } },
// //         { new: true }
// //       );

// //       if (!subject) return res.status(404).json({ message: 'Subject not found' });
// //       res.json(subject);
// //     } catch (err) {
// //       res.status(err.status || 500).json({ message: err.message });
// //     }
// //   }
// // );

// // // ── DELETE /api/subjects/:id/pyqs/:pyqId ─────────────────────────────────
// // router.delete('/:id/pyqs/:pyqId', protect, teacherOnly, async (req, res) => {
// //   try {
// //     const subject = await Subject.findByIdAndUpdate(
// //       req.params.id,
// //       { $pull: { pyqs: { _id: req.params.pyqId } } },
// //       { new: true }
// //     );
// //     if (!subject) return res.status(404).json({ message: 'Subject not found' });
// //     res.json(subject);
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // // ── POST /api/subjects/:id/badge ──────────────────────────────────────────
// // // On-demand badge recalculation.
// // router.post('/:id/badge', protect, teacherOnly, async (req, res) => {
// //   try {
// //     const subject = await Subject.findById(req.params.id);
// //     if (!subject) return res.status(404).json({ message: 'Subject not found' });

// //     const cls = await Class.findOne({ _id: subject.classId, teacher: req.user.id });
// //     if (!cls) return res.status(403).json({ message: 'Not your subject' });

// //     subject.markModified('chapters');
// //     subject.markModified('examDate');
// //     const updated = await subject.save();

// //     res.json({ badge: updated.badge, subject: updated });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // // ── GET /api/subjects/:id/progress ───────────────────────────────────────
// // router.get('/:id/progress', protect, async (req, res) => {
// //   try {
// //     const subject = await Subject.findById(req.params.id).lean();
// //     if (!subject) return res.status(404).json({ message: 'Subject not found' });

// //     const myRow = subject.progress?.find(p => p.student?.toString() === req.user.id);
// //     if (myRow) {
// //       return res.json({
// //         completedChapters: myRow.completedChapters,
// //         totalChapters:     myRow.totalChapters,
// //         pct:               myRow.pct,
// //       });
// //     }

// //     // No cached row — compute live
// //     const totalChapters = subject.chapters?.length || 0;
// //     const doneTasks     = await Task.find({
// //       student: req.user.id,
// //       subject: subject.name,
// //       status:  'done',
// //     }).select('chapter').lean();

// //     const doneSet = new Set(doneTasks.map(t => t.chapter));
// //     const pct     = totalChapters > 0 ? Math.round((doneSet.size / totalChapters) * 100) : 0;

// //     // Best-effort cache write (fire-and-forget)
// //     Subject.findByIdAndUpdate(req.params.id, { $pull: { progress: { student: req.user.id } } })
// //       .then(() => Subject.findByIdAndUpdate(req.params.id, {
// //         $push: { progress: { student: req.user.id, completedChapters: doneSet.size, totalChapters, pct } },
// //       }))
// //       .catch(() => {});

// //     res.json({ completedChapters: doneSet.size, totalChapters, pct });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // // ── PATCH /api/subjects/:id/progress ─────────────────────────────────────
// // router.patch('/:id/progress', protect, async (req, res) => {
// //   try {
// //     const subject = await Subject.findById(req.params.id).lean();
// //     if (!subject) return res.status(404).json({ message: 'Subject not found' });

// //     const totalChapters = subject.chapters?.length || 0;

// //     const doneTasks = await Task.find({
// //       student: req.user.id,
// //       subject: subject.name,
// //       status:  'done',
// //     }).select('chapter').lean();

// //     const doneSet           = new Set(doneTasks.map(t => t.chapter));
// //     const completedChapters = doneSet.size;
// //     const pct               = totalChapters > 0
// //       ? Math.round((completedChapters / totalChapters) * 100)
// //       : 0;

// //     await Subject.findByIdAndUpdate(req.params.id, {
// //       $pull: { progress: { student: req.user.id } },
// //     });
// //     const updated = await Subject.findByIdAndUpdate(
// //       req.params.id,
// //       { $push: { progress: { student: req.user.id, completedChapters, totalChapters, pct } } },
// //       { new: true }
// //     );

// //     res.json({
// //       completedChapters,
// //       totalChapters,
// //       pct,
// //       subject: {
// //         ...updated.toObject(),
// //         myProgress: { completedChapters, totalChapters, pct },
// //         progress:   undefined,
// //       },
// //     });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // export default router;
// import express  from 'express';
// import multer   from 'multer';
// import path     from 'path';
// import fs       from 'fs';
// import Subject  from '../models/Subject.js';
// import Class    from '../models/Class.js';
// import User     from '../models/User.js';
// import Task     from '../models/Task.js';
// import { protect, teacherOnly } from '../middleware/auth.js';

// const router = express.Router();

// // ── Multer — PYQ PDF uploads ──────────────────────────────────────────────
// const pyqStorage = multer.diskStorage({
//   destination(req, file, cb) {
//     const dir = path.join('uploads', 'pyqs', req.params.id);
//     fs.mkdirSync(dir, { recursive: true });
//     cb(null, dir);
//   },
//   filename(req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
//   },
// });

// const pyqUpload = multer({
//   storage: pyqStorage,
//   limits:  { fileSize: 20 * 1024 * 1024 },
//   fileFilter(_req, file, cb) {
//     file.mimetype === 'application/pdf'
//       ? cb(null, true)
//       : cb(new Error('Only PDF files are allowed'));
//   },
// });

// // ── GET /api/subjects/teacher ─────────────────────────────────────────────
// // MUST be before /:id so "teacher" isn't mistaken for a Mongo ObjectId.
// router.get('/teacher', protect, teacherOnly, async (req, res) => {
//   try {
//     const classes  = await Class.find({ teacher: req.user.id }).select('_id name section');
//     const classIds = classes.map(c => c._id);
//     const subjects = await Subject.find({ classId: { $in: classIds } }).lean();

//     const classMap = {};
//     for (const c of classes) classMap[c._id.toString()] = { name: c.name, section: c.section };

//     res.json(subjects.map(s => ({ ...s, classInfo: classMap[s.classId?.toString()] || null })));
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // ── GET /api/subjects ─────────────────────────────────────────────────────
// // Student: subjects for their enrolled class, with only their own progress row.
// router.get('/', protect, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('classId');
//     if (!user?.classId) return res.json([]);

//     const subjects = await Subject.find({ classId: user.classId }).lean();

//     const result = subjects.map(s => ({
//       ...s,
//       myProgress: s.progress?.find(p => p.student?.toString() === req.user.id) || {
//         completedChapters: 0,
//         totalChapters:     s.chapters?.length || 0,
//         pct:               0,
//       },
//       progress: undefined, // don't leak other students' data
//     }));

//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // ── GET /api/subjects/class/:classId ─────────────────────────────────────
// router.get('/class/:classId', protect, async (req, res) => {
//   try {
//     const subjects = await Subject.find({ classId: req.params.classId }).lean();
//     res.json(subjects);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // ── POST /api/subjects/class/:classId ────────────────────────────────────
// router.post('/class/:classId', protect, teacherOnly, async (req, res) => {
//   try {
//     const cls = await Class.findOne({ _id: req.params.classId, teacher: req.user.id });
//     if (!cls) return res.status(403).json({ message: 'Not your class' });

//     const { examDate, ...rest } = req.body;

//     // ✅ SERVER-SIDE companion fix for Bug 34
//     // Case-insensitive check to prevent duplicate subjects in the same class
//     const exists = await Subject.findOne({
//       classId: req.params.classId,
//       name: { $regex: new RegExp(`^${rest.name.trim()}$`, 'i') },
//     });
    
//     if (exists) {
//       return res.status(409).json({
//         message: `A subject named "${rest.name.trim()}" already exists in this class.`,
//       });
//     }

//     const subject = await Subject.create({
//       ...rest,
//       examDate:  examDate ? new Date(examDate) : undefined,
//       classId:   req.params.classId,
//       createdBy: req.user.id,
//     });

//     await Class.findByIdAndUpdate(req.params.classId, { $push: { subjects: subject._id } });
//     res.status(201).json(subject);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // ── PUT /api/subjects/:id ─────────────────────────────────────────────────
// router.put('/:id', protect, teacherOnly, async (req, res) => {
//   try {
//     const subject = await Subject.findById(req.params.id);
//     if (!subject) return res.status(404).json({ message: 'Subject not found' });

//     const cls = await Class.findOne({ _id: subject.classId, teacher: req.user.id });
//     if (!cls) return res.status(403).json({ message: 'Not your subject' });

//     // Strip badge — recalculated by pre-save hook
//     const { examDate, badge: _ignored, ...rest } = req.body;
//     Object.assign(subject, rest);
//     if (examDate) subject.examDate = new Date(examDate);

//     const updated = await subject.save();
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // ── DELETE /api/subjects/:id ──────────────────────────────────────────────
// router.delete('/:id', protect, teacherOnly, async (req, res) => {
//   try {
//     const subject = await Subject.findById(req.params.id);
//     if (!subject) return res.status(404).json({ message: 'Subject not found' });

//     const cls = await Class.findOne({ _id: subject.classId, teacher: req.user.id });
//     if (!cls) return res.status(403).json({ message: 'Not your subject' });

//     await Class.findByIdAndUpdate(subject.classId, { $pull: { subjects: subject._id } });
//     await Subject.findByIdAndDelete(req.params.id);

//     res.json({ message: 'Subject deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // ── POST /api/subjects/:id/pyqs ───────────────────────────────────────────
// router.post(
//   '/:id/pyqs',
//   protect,
//   teacherOnly,
//   pyqUpload.single('file'),
//   async (req, res) => {
//     try {
//       const { year, title } = req.body;
//       if (!year || !title) {
//         return res.status(400).json({ message: 'year and title are required' });
//       }

//       const fileUrl = req.file
//         ? `/uploads/pyqs/${req.params.id}/${req.file.filename}`
//         : '#';

//       const subject = await Subject.findByIdAndUpdate(
//         req.params.id,
//         { $push: { pyqs: { year, title, fileUrl, uploadedAt: new Date() } } },
//         { new: true }
//       );

//       if (!subject) return res.status(404).json({ message: 'Subject not found' });
//       res.json(subject);
//     } catch (err) {
//       res.status(err.status || 500).json({ message: err.message });
//     }
//   }
// );

// // ── DELETE /api/subjects/:id/pyqs/:pyqId ─────────────────────────────────
// router.delete('/:id/pyqs/:pyqId', protect, teacherOnly, async (req, res) => {
//   try {
//     const subject = await Subject.findByIdAndUpdate(
//       req.params.id,
//       { $pull: { pyqs: { _id: req.params.pyqId } } },
//       { new: true }
//     );
//     if (!subject) return res.status(404).json({ message: 'Subject not found' });
//     res.json(subject);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // ── POST /api/subjects/:id/badge ──────────────────────────────────────────
// // On-demand badge recalculation.
// router.post('/:id/badge', protect, teacherOnly, async (req, res) => {
//   try {
//     const subject = await Subject.findById(req.params.id);
//     if (!subject) return res.status(404).json({ message: 'Subject not found' });

//     const cls = await Class.findOne({ _id: subject.classId, teacher: req.user.id });
//     if (!cls) return res.status(403).json({ message: 'Not your subject' });

//     subject.markModified('chapters');
//     subject.markModified('examDate');
//     const updated = await subject.save();

//     res.json({ badge: updated.badge, subject: updated });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // ── GET /api/subjects/:id/progress ───────────────────────────────────────
// router.get('/:id/progress', protect, async (req, res) => {
//   try {
//     const subject = await Subject.findById(req.params.id).lean();
//     if (!subject) return res.status(404).json({ message: 'Subject not found' });

//     const myRow = subject.progress?.find(p => p.student?.toString() === req.user.id);
//     if (myRow) {
//       return res.json({
//         completedChapters: myRow.completedChapters,
//         totalChapters:     myRow.totalChapters,
//         pct:               myRow.pct,
//       });
//     }

//     // No cached row — compute live
//     const totalChapters = subject.chapters?.length || 0;
//     const doneTasks     = await Task.find({
//       student: req.user.id,
//       subject: subject.name,
//       status:  'done',
//     }).select('chapter').lean();

//     const doneSet = new Set(doneTasks.map(t => t.chapter));
//     const pct     = totalChapters > 0 ? Math.round((doneSet.size / totalChapters) * 100) : 0;

//     // Best-effort cache write (fire-and-forget)
//     Subject.findByIdAndUpdate(req.params.id, { $pull: { progress: { student: req.user.id } } })
//       .then(() => Subject.findByIdAndUpdate(req.params.id, {
//         $push: { progress: { student: req.user.id, completedChapters: doneSet.size, totalChapters, pct } },
//       }))
//       .catch(() => {});

//     res.json({ completedChapters: doneSet.size, totalChapters, pct });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // ── PATCH /api/subjects/:id/progress ─────────────────────────────────────
// router.patch('/:id/progress', protect, async (req, res) => {
//   try {
//     const subject = await Subject.findById(req.params.id).lean();
//     if (!subject) return res.status(404).json({ message: 'Subject not found' });

//     const totalChapters = subject.chapters?.length || 0;

//     const doneTasks = await Task.find({
//       student: req.user.id,
//       subject: subject.name,
//       status:  'done',
//     }).select('chapter').lean();

//     const doneSet           = new Set(doneTasks.map(t => t.chapter));
//     const completedChapters = doneSet.size;
//     const pct               = totalChapters > 0
//       ? Math.round((completedChapters / totalChapters) * 100)
//       : 0;

//     await Subject.findByIdAndUpdate(req.params.id, {
//       $pull: { progress: { student: req.user.id } },
//     });
//     const updated = await Subject.findByIdAndUpdate(
//       req.params.id,
//       { $push: { progress: { student: req.user.id, completedChapters, totalChapters, pct } } },
//       { new: true }
//     );

//     res.json({
//       completedChapters,
//       totalChapters,
//       pct,
//       subject: {
//         ...updated.toObject(),
//         myProgress: { completedChapters, totalChapters, pct },
//         progress:   undefined,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// export default router;
import express  from 'express';
import multer   from 'multer';
import path     from 'path';
import fs       from 'fs';
import Subject  from '../models/Subject.js';
import Class    from '../models/Class.js';
import User     from '../models/User.js';
import Task     from '../models/Task.js';
import { protect, teacherOnly } from '../middleware/auth.js';

const router = express.Router();

const pyqStorage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = path.join('uploads', 'pyqs', req.params.id);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
  },
});

const pyqUpload = multer({
  storage: pyqStorage,
  limits:  { fileSize: 20 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    file.mimetype === 'application/pdf' ? cb(null, true) : cb(new Error('Only PDF files are allowed'));
  },
});

router.get('/teacher', protect, teacherOnly, async (req, res) => {
  try {
    const classes  = await Class.find({ teacher: req.user.id }).select('_id name section');
    const classIds = classes.map(c => c._id);
    const subjects = await Subject.find({ classId: { $in: classIds } }).lean();

    const classMap = {};
    for (const c of classes) classMap[c._id.toString()] = { name: c.name, section: c.section };

    res.json(subjects.map(s => ({ ...s, classInfo: classMap[s.classId?.toString()] || null })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('classId');
    if (!user?.classId) return res.json([]);

    const subjects = await Subject.find({ classId: user.classId }).lean();

    const result = subjects.map(s => ({
      ...s,
      myProgress: s.progress?.find(p => p.student?.toString() === req.user.id) || {
        completedChapters: 0, totalChapters: s.chapters?.length || 0, pct: 0,
      },
      progress: undefined, 
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/class/:classId', protect, async (req, res) => {
  try {
    const subjects = await Subject.find({ classId: req.params.classId }).lean();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ SAFE POST ROUTE
router.post('/class/:classId', protect, teacherOnly, async (req, res) => {
  try {
    const cls = await Class.findOne({ _id: req.params.classId, teacher: req.user.id });
    if (!cls) return res.status(403).json({ message: 'Not your class' });

    const { examDate, ...rest } = req.body;
    const subjectName = (rest.name || '').trim();

    if (!subjectName) {
      return res.status(400).json({ message: 'Subject name is required' });
    }

    const escaped = subjectName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const exists = await Subject.findOne({
      classId: req.params.classId,
      name: { $regex: new RegExp(`^${escaped}$`, 'i') },
    });
    
    if (exists) {
      return res.status(409).json({
        message: `A subject named "${subjectName}" already exists in this class.`,
      });
    }

    const subject = await Subject.create({
      ...rest,
      name: subjectName,
      examDate:  examDate ? (typeof examDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(examDate)
        ? (() => { const [y, m, d] = examDate.split('-').map(Number); return new Date(y, m - 1, d); })()
        : new Date(examDate)) : undefined,
      classId:   req.params.classId,
      createdBy: req.user.id,
    });

    await Class.findByIdAndUpdate(req.params.classId, { $push: { subjects: subject._id } });
    res.status(201).json(subject);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: `A subject named "${req.body.name?.trim() || 'this name'}" already exists in this class.`,
      });
    }
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', protect, teacherOnly, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    const cls = await Class.findOne({ _id: subject.classId, teacher: req.user.id });
    if (!cls) return res.status(403).json({ message: 'Not your subject' });

    const { examDate, badge: _ignored, ...rest } = req.body;
    Object.assign(subject, rest);
    if (examDate) subject.examDate = new Date(examDate);

    const updated = await subject.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, teacherOnly, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    const cls = await Class.findOne({ _id: subject.classId, teacher: req.user.id });
    if (!cls) return res.status(403).json({ message: 'Not your subject' });

    await Class.findByIdAndUpdate(subject.classId, { $pull: { subjects: subject._id } });
    await Subject.findByIdAndDelete(req.params.id);

    res.json({ message: 'Subject deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/pyqs', protect, teacherOnly, pyqUpload.single('file'), async (req, res) => {
    try {
      const { year, title } = req.body;
      if (!year || !title) return res.status(400).json({ message: 'year and title are required' });

      const fileUrl = req.file ? `/uploads/pyqs/${req.params.id}/${req.file.filename}` : '#';

      const subject = await Subject.findByIdAndUpdate(
        req.params.id,
        { $push: { pyqs: { year, title, fileUrl, uploadedAt: new Date() } } },
        { new: true }
      );

      if (!subject) return res.status(404).json({ message: 'Subject not found' });
      res.json(subject);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }
);

router.delete('/:id/pyqs/:pyqId', protect, teacherOnly, async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { $pull: { pyqs: { _id: req.params.pyqId } } },
      { new: true }
    );
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/badge', protect, teacherOnly, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    const cls = await Class.findOne({ _id: subject.classId, teacher: req.user.id });
    if (!cls) return res.status(403).json({ message: 'Not your subject' });

    subject.markModified('chapters');
    subject.markModified('examDate');
    const updated = await subject.save();

    res.json({ badge: updated.badge, subject: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id/progress', protect, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).lean();
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    const myRow = subject.progress?.find(p => p.student?.toString() === req.user.id);
    if (myRow) {
      return res.json({ completedChapters: myRow.completedChapters, totalChapters: myRow.totalChapters, pct: myRow.pct });
    }

    const totalChapters = subject.chapters?.length || 0;
    const doneTasks = await Task.find({ student: req.user.id, subject: subject.name, status: 'done' }).select('chapter').lean();

    const doneSet = new Set(doneTasks.map(t => t.chapter));
    const pct = totalChapters > 0 ? Math.round((doneSet.size / totalChapters) * 100) : 0;

    Subject.findByIdAndUpdate(req.params.id, { $pull: { progress: { student: req.user.id } } })
      .then(() => Subject.findByIdAndUpdate(req.params.id, {
        $push: { progress: { student: req.user.id, completedChapters: doneSet.size, totalChapters, pct } },
      })).catch(() => {});

    res.json({ completedChapters: doneSet.size, totalChapters, pct });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/progress', protect, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).lean();
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    const totalChapters = subject.chapters?.length || 0;
    const doneTasks = await Task.find({ student: req.user.id, subject: subject.name, status: 'done' }).select('chapter').lean();

    const doneSet = new Set(doneTasks.map(t => t.chapter));
    const completedChapters = doneSet.size;
    const pct = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

    await Subject.findByIdAndUpdate(req.params.id, { $pull: { progress: { student: req.user.id } } });
    const updated = await Subject.findByIdAndUpdate(
      req.params.id,
      { $push: { progress: { student: req.user.id, completedChapters, totalChapters, pct } } },
      { new: true }
    );

    res.json({
      completedChapters, totalChapters, pct,
      subject: { ...updated.toObject(), myProgress: { completedChapters, totalChapters, pct }, progress: undefined },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;