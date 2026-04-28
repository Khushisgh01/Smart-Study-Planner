// import express from 'express';
// import Subject from '../models/Subject.js';
// import Class from '../models/Class.js';
// import { protect, teacherOnly } from '../middleware/auth.js';

// const router = express.Router();

// // GET subjects of a class
// router.get('/class/:classId', protect, async (req, res) => {
//   try {
//     const subjects = await Subject.find({ classId: req.params.classId });
//     res.json(subjects);
//   } catch (err) {
//     res.status(500).json({ message: err.message }); // Bug 13
//   }
// });

// // CREATE subject inside class
// router.post('/class/:classId', protect, teacherOnly, async (req, res) => {
//   try {
//     const { examDate, ...rest } = req.body;

//     const subject = await Subject.create({
//       ...rest,
//       // Bug 17: always store examDate as a proper Date object
//       examDate: examDate ? new Date(examDate) : undefined,
//       classId: req.params.classId,
//       createdBy: req.user.id,
//     });

//     await Class.findByIdAndUpdate(req.params.classId, {
//       $push: { subjects: subject._id },
//     });

//     res.json(subject);
//   } catch (err) {
//     res.status(500).json({ message: err.message }); // Bug 13
//   }
// });

// // UPDATE subject
// router.put('/:id', protect, teacherOnly, async (req, res) => {
//   try {
//     const { examDate, ...rest } = req.body;

//     const updated = await Subject.findByIdAndUpdate(
//       req.params.id,
//       {
//         ...rest,
//         // Bug 17: coerce to Date on update too
//         ...(examDate ? { examDate: new Date(examDate) } : {}),
//       },
//       { new: true }
//     );

//     if (!updated) return res.status(404).json({ message: 'Subject not found' });
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ message: err.message }); // Bug 13
//   }
// });

// // DELETE subject — also remove from Class.subjects array (Bug 22)
// router.delete('/:id', protect, teacherOnly, async (req, res) => {
//   try {
//     const subject = await Subject.findById(req.params.id);
//     if (!subject) return res.status(404).json({ message: 'Subject not found' });

//     // Bug 22: pull the ObjectId reference out of Class.subjects
//     await Class.findByIdAndUpdate(subject.classId, {
//       $pull: { subjects: subject._id },
//     });

//     await Subject.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Subject deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message }); // Bug 13
//   }
// });

// export default router;
import express from 'express';
import Subject from '../models/Subject.js';
import Class   from '../models/Class.js';
import User    from '../models/User.js';
import { protect, teacherOnly } from '../middleware/auth.js';

const router = express.Router();

// ── GET /api/subjects/teacher ─────────────────────────────────────────────
// PYQPage.jsx calls this for teachers to see all their subjects.
// Must be defined BEFORE /:id routes to avoid "teacher" being treated as an id.
router.get('/teacher', protect, teacherOnly, async (req, res) => {
  try {
    const classes    = await Class.find({ teacher: req.user.id }).select('_id');
    const classIds   = classes.map(c => c._id);
    const subjects   = await Subject.find({ classId: { $in: classIds } });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/subjects ─────────────────────────────────────────────────────
// AppContext.fetchSubjects() calls this for students.
// Returns subjects for the class the student is enrolled in.
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('classId');
    if (!user?.classId) {
      return res.json([]); // not enrolled yet — return empty array gracefully
    }
    const subjects = await Subject.find({ classId: user.classId });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/subjects/class/:classId ─────────────────────────────────────
router.get('/class/:classId', protect, async (req, res) => {
  try {
    const subjects = await Subject.find({ classId: req.params.classId });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/subjects/class/:classId ────────────────────────────────────
router.post('/class/:classId', protect, teacherOnly, async (req, res) => {
  try {
    const { examDate, ...rest } = req.body;

    const subject = await Subject.create({
      ...rest,
      examDate: examDate ? new Date(examDate) : undefined,
      classId: req.params.classId,
      createdBy: req.user.id,
    });

    await Class.findByIdAndUpdate(req.params.classId, {
      $push: { subjects: subject._id },
    });

    res.json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/subjects/:id ────────────────────────────────────────────────
router.put('/:id', protect, teacherOnly, async (req, res) => {
  try {
    const { examDate, ...rest } = req.body;

    const updated = await Subject.findByIdAndUpdate(
      req.params.id,
      { ...rest, ...(examDate ? { examDate: new Date(examDate) } : {}) },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Subject not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/subjects/:id ─────────────────────────────────────────────
router.delete('/:id', protect, teacherOnly, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    await Class.findByIdAndUpdate(subject.classId, {
      $pull: { subjects: subject._id },
    });

    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subject deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/subjects/:id/pyqs ──────────────────────────────────────────
// PYQPage teacher upload — basic implementation (extend with file storage as needed)
router.post('/:id/pyqs', protect, teacherOnly, async (req, res) => {
  try {
    const { year, title } = req.body;
    const pyq = {
      year,
      title,
      uploadedAt: new Date(),
      fileUrl: '#', // extend with real S3/Cloudinary URL if needed
    };

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { $push: { pyqs: pyq } },
      { new: true }
    );

    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/subjects/:id/pyqs/:pyqId ────────────────────────────────
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

export default router;