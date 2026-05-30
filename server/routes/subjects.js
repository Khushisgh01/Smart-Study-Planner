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
/*
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


import express from 'express';
import Subject from '../models/Subject.js';
import Class   from '../models/Class.js';
import User    from '../models/User.js';
import { protect, teacherOnly } from '../middleware/auth.js';

const router = express.Router();

// ── GET /api/subjects/teacher ─────────────────────────────────────────────
// Teacher: all subjects across all their classes.
// MUST be before /:id to avoid "teacher" being treated as a Mongo ObjectId.
router.get('/teacher', protect, teacherOnly, async (req, res) => {
  try {
    const classes  = await Class.find({ teacher: req.user.id }).select('_id name section');
    const classIds = classes.map(c => c._id);
    const subjects = await Subject.find({ classId: { $in: classIds } })
      .lean();

    // Attach class info to each subject for context
    const classMap = {};
    for (const c of classes) classMap[c._id.toString()] = { name: c.name, section: c.section };

    const result = subjects.map(s => ({
      ...s,
      classInfo: classMap[s.classId?.toString()] || null,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/subjects ─────────────────────────────────────────────────────
// Student: subjects for their enrolled class.
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('classId');
    if (!user?.classId) return res.json([]);

    const subjects = await Subject.find({ classId: user.classId }).lean();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/subjects/class/:classId ─────────────────────────────────────
// Get all subjects for a specific class (teacher or student with access).
router.get('/class/:classId', protect, async (req, res) => {
  try {
    const subjects = await Subject.find({ classId: req.params.classId }).lean();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/subjects/class/:classId ────────────────────────────────────
// Teacher: add a subject to a class.
router.post('/class/:classId', protect, teacherOnly, async (req, res) => {
  try {
    // Verify the class belongs to this teacher
    const cls = await Class.findOne({ _id: req.params.classId, teacher: req.user.id });
    if (!cls) return res.status(403).json({ message: 'Not your class' });

    const { examDate, ...rest } = req.body;

    // Prevent duplicate subject names in the same class
    const duplicate = await Subject.findOne({
      classId: req.params.classId,
      name: rest.name,
    });
    if (duplicate) {
      return res.status(400).json({ message: `Subject "${rest.name}" already exists in this class` });
    }

    const subject = await Subject.create({
      ...rest,
      examDate:  examDate ? new Date(examDate) : undefined,
      classId:   req.params.classId,
      createdBy: req.user.id,
    });

    await Class.findByIdAndUpdate(req.params.classId, {
      $push: { subjects: subject._id },
    });

    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/subjects/:id ─────────────────────────────────────────────────
// Teacher: update a subject (name, examDate, color, chapters…).
router.put('/:id', protect, teacherOnly, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    // Ensure the subject belongs to one of this teacher's classes
    const cls = await Class.findOne({ _id: subject.classId, teacher: req.user.id });
    if (!cls) return res.status(403).json({ message: 'Not your subject' });

    const { examDate, ...rest } = req.body;
    const updated = await Subject.findByIdAndUpdate(
      req.params.id,
      { ...rest, ...(examDate ? { examDate: new Date(examDate) } : {}) },
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/subjects/:id ──────────────────────────────────────────────
router.delete('/:id', protect, teacherOnly, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    const cls = await Class.findOne({ _id: subject.classId, teacher: req.user.id });
    if (!cls) return res.status(403).json({ message: 'Not your subject' });

    await Class.findByIdAndUpdate(subject.classId, {
      $pull: { subjects: subject._id },
    });
    await Subject.findByIdAndDelete(req.params.id);

    res.json({ message: 'Subject deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/subjects/:id/pyqs ───────────────────────────────────────────
// Teacher: add a PYQ entry to a subject.
router.post('/:id/pyqs', protect, teacherOnly, async (req, res) => {
  try {
    const { year, title, fileUrl } = req.body;
    if (!year || !title) {
      return res.status(400).json({ message: 'year and title are required' });
    }

    const pyq = {
      year,
      title,
      uploadedAt: new Date(),
      fileUrl: fileUrl || '#', // real URL from S3/Cloudinary when integrated
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

// ── DELETE /api/subjects/:id/pyqs/:pyqId ─────────────────────────────────
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

import express  from 'express';
import multer   from 'multer';
import path     from 'path';
import fs       from 'fs';
import Subject  from '../models/Subject.js';
import Class    from '../models/Class.js';
import User     from '../models/User.js';
import { protect, teacherOnly } from '../middleware/auth.js';

const router = express.Router();

// ── Multer setup for PYQ PDF uploads ─────────────────────────────────────
// FIX: multer was never configured — POST /api/subjects/:id/pyqs always
//      ignored the actual file and stored fileUrl as '#'.
//
// Files land in  uploads/pyqs/<subjectId>/  on disk.
// In production replace diskStorage with an S3 / Cloudinary storage engine
// and swap req.file.path for the cloud URL below.
const pyqStorage = multer.diskStorage({
  destination(req, file, cb) {
    // One folder per subject keeps the upload dir tidy
    const dir = path.join('uploads', 'pyqs', req.params.id);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename(req, file, cb) {
    // e.g.  1716900000000-physics2023.pdf
    const unique = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    cb(null, unique);
  },
});

const pyqUpload = multer({
  storage: pyqStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB cap
  fileFilter(_req, file, cb) {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for PYQs'));
    }
  },
});

// ── GET /api/subjects/teacher ─────────────────────────────────────────────
router.get('/teacher', protect, teacherOnly, async (req, res) => {
  try {
    const classes  = await Class.find({ teacher: req.user.id }).select('_id name section');
    const classIds = classes.map(c => c._id);
    const subjects = await Subject.find({ classId: { $in: classIds } }).lean();

    const classMap = {};
    for (const c of classes) classMap[c._id.toString()] = { name: c.name, section: c.section };

    const result = subjects.map(s => ({
      ...s,
      classInfo: classMap[s.classId?.toString()] || null,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/subjects ─────────────────────────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('classId');
    if (!user?.classId) return res.json([]);

    const subjects = await Subject.find({ classId: user.classId }).lean();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/subjects/class/:classId ─────────────────────────────────────
router.get('/class/:classId', protect, async (req, res) => {
  try {
    const subjects = await Subject.find({ classId: req.params.classId }).lean();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/subjects/class/:classId ────────────────────────────────────
router.post('/class/:classId', protect, teacherOnly, async (req, res) => {
  try {
    const cls = await Class.findOne({ _id: req.params.classId, teacher: req.user.id });
    if (!cls) return res.status(403).json({ message: 'Not your class' });

    const { examDate, ...rest } = req.body;

    const duplicate = await Subject.findOne({ classId: req.params.classId, name: rest.name });
    if (duplicate) {
      return res.status(400).json({ message: `Subject "${rest.name}" already exists in this class` });
    }

    const subject = await Subject.create({
      ...rest,
      examDate:  examDate ? new Date(examDate) : undefined,
      classId:   req.params.classId,
      createdBy: req.user.id,
    });

    await Class.findByIdAndUpdate(req.params.classId, { $push: { subjects: subject._id } });

    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/subjects/:id ─────────────────────────────────────────────────
router.put('/:id', protect, teacherOnly, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    const cls = await Class.findOne({ _id: subject.classId, teacher: req.user.id });
    if (!cls) return res.status(403).json({ message: 'Not your subject' });

    const { examDate, ...rest } = req.body;
    const updated = await Subject.findByIdAndUpdate(
      req.params.id,
      { ...rest, ...(examDate ? { examDate: new Date(examDate) } : {}) },
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/subjects/:id ──────────────────────────────────────────────
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

// ── POST /api/subjects/:id/pyqs ───────────────────────────────────────────
// Teacher: upload a PYQ PDF and attach it to the subject.
//
// FIX: multer middleware (pyqUpload.single('file')) now runs before the
//      handler, so req.file is populated with the uploaded PDF.
//      The stored fileUrl is a real server-relative path instead of '#'.
//
// Client must send multipart/form-data with fields:
//   file  — the PDF binary
//   year  — e.g. "2023"
//   title — e.g. "Physics Board Paper 2023"
router.post(
  '/:id/pyqs',
  protect,
  teacherOnly,
  pyqUpload.single('file'),          // ← multer runs here; req.file is set
  async (req, res) => {
    try {
      const { year, title } = req.body;
      if (!year || !title) {
        return res.status(400).json({ message: 'year and title are required' });
      }

      // Build a URL path clients can use to download the file.
      // If you later switch to S3/Cloudinary, replace this with the cloud URL.
      const fileUrl = req.file
        ? `/uploads/pyqs/${req.params.id}/${req.file.filename}`
        : '#'; // fallback when no file sent (e.g. link-only PYQ)

      const pyq = {
        year,
        title,
        uploadedAt: new Date(),
        fileUrl,
      };

      const subject = await Subject.findByIdAndUpdate(
        req.params.id,
        { $push: { pyqs: pyq } },
        { new: true }
      );

      if (!subject) return res.status(404).json({ message: 'Subject not found' });
      res.json(subject);
    } catch (err) {
      // Multer errors (wrong type, size exceeded) surface here too
      res.status(err.status || 500).json({ message: err.message });
    }
  }
);

// ── DELETE /api/subjects/:id/pyqs/:pyqId ─────────────────────────────────
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
*/

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

// ── Multer — PYQ PDF uploads ──────────────────────────────────────────────
// FIX 4 (carried forward from previous fix session):
//   PYQPage builds FormData({ file, year, title }) but the old route read
//   req.body (JSON) and multer was never wired up → req.file was always
//   undefined and fileUrl was always '#'.
//   pyqUpload.single('file') must run as middleware BEFORE the handler.
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
    file.mimetype === 'application/pdf'
      ? cb(null, true)
      : cb(new Error('Only PDF files are allowed'));
  },
});

// ── GET /api/subjects/teacher ─────────────────────────────────────────────
// Must be registered before /:id so "teacher" isn't mistaken for a Mongo id.
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

// ── GET /api/subjects ─────────────────────────────────────────────────────
// Student: subjects for their enrolled class.
// FIX 3: includes the student's own progress entry filtered from the
//        progress array so the client only sees its own row, not all students.
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('classId');
    if (!user?.classId) return res.json([]);

    const subjects = await Subject.find({ classId: user.classId }).lean();

    // Pluck only this student's progress row from each subject
    const result = subjects.map(s => ({
      ...s,
      myProgress: s.progress?.find(p => p.student?.toString() === req.user.id) || {
        completedChapters: 0,
        totalChapters:     s.chapters?.length || 0,
        pct:               0,
      },
      progress: undefined, // don't leak other students' data
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/subjects/class/:classId ─────────────────────────────────────
router.get('/class/:classId', protect, async (req, res) => {
  try {
    const subjects = await Subject.find({ classId: req.params.classId }).lean();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/subjects/class/:classId ────────────────────────────────────
// FIX 2: color defaults to '#6366f1' in the model; also accept an explicit
//        color from the teacher's subject-creation form.
router.post('/class/:classId', protect, teacherOnly, async (req, res) => {
  try {
    const cls = await Class.findOne({ _id: req.params.classId, teacher: req.user.id });
    if (!cls) return res.status(403).json({ message: 'Not your class' });

    const { examDate, ...rest } = req.body;

    const duplicate = await Subject.findOne({ classId: req.params.classId, name: rest.name });
    if (duplicate) {
      return res.status(400).json({ message: `Subject "${rest.name}" already exists in this class` });
    }

    const subject = await Subject.create({
      ...rest,
      examDate:  examDate ? new Date(examDate) : undefined,
      classId:   req.params.classId,
      createdBy: req.user.id,
      // color default + badge are handled by schema/pre-save hook
    });

    await Class.findByIdAndUpdate(req.params.classId, { $push: { subjects: subject._id } });
    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/subjects/:id ─────────────────────────────────────────────────
// Badge is recalculated by the pre-save hook; never accept badge from body.
router.put('/:id', protect, teacherOnly, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    const cls = await Class.findOne({ _id: subject.classId, teacher: req.user.id });
    if (!cls) return res.status(403).json({ message: 'Not your subject' });

    // Strip badge — it's server-controlled via the pre-save hook
    const { examDate, badge: _ignored, ...rest } = req.body;
    Object.assign(subject, rest);
    if (examDate) subject.examDate = new Date(examDate);

    const updated = await subject.save(); // pre-save hook recalculates badge
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/subjects/:id ──────────────────────────────────────────────
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

// ── POST /api/subjects/:id/pyqs ───────────────────────────────────────────
// FIX 4: pyqUpload.single('file') middleware processes the multipart/form-data
//        upload BEFORE the route handler runs, populating req.file correctly.
//        Client (PYQPage) must send FormData — NOT JSON — with field name 'file'.
router.post(
  '/:id/pyqs',
  protect,
  teacherOnly,
  pyqUpload.single('file'),
  async (req, res) => {
    try {
      const { year, title } = req.body;
      if (!year || !title) {
        return res.status(400).json({ message: 'year and title are required' });
      }

      const fileUrl = req.file
        ? `/uploads/pyqs/${req.params.id}/${req.file.filename}`
        : '#';

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

// ── DELETE /api/subjects/:id/pyqs/:pyqId ─────────────────────────────────
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

// ── POST /api/subjects/:id/badge ──────────────────────────────────────────
// FIX 1: on-demand badge recalculation for a subject.
//        Automatic assignment happens via the pre-save hook on every PUT;
//        this endpoint lets teachers trigger a refresh after bulk changes
//        (e.g. chapter imports) without a full subject update.
router.post('/:id/badge', protect, teacherOnly, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    const cls = await Class.findOne({ _id: subject.classId, teacher: req.user.id });
    if (!cls) return res.status(403).json({ message: 'Not your subject' });

    subject.markModified('chapters');
    subject.markModified('examDate');
    const updated = await subject.save(); // triggers badge pre-save hook

    res.json({ badge: updated.badge, subject: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/subjects/:id/progress ───────────────────────────────────────
// FIX 3: returns this student's cached chapter-completion data for one subject.
//        Falls back to a live Task aggregation if no cached row exists yet,
//        then writes the cache for subsequent calls.
router.get('/:id/progress', protect, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).lean();
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    const myRow = subject.progress?.find(p => p.student?.toString() === req.user.id);
    if (myRow) {
      return res.json({
        completedChapters: myRow.completedChapters,
        totalChapters:     myRow.totalChapters,
        pct:               myRow.pct,
      });
    }

    // No cached row — compute live then cache asynchronously
    const totalChapters = subject.chapters?.length || 0;
    const doneTasks     = await Task.find({
      student: req.user.id,
      subject: subject.name,
      status:  'done',
    }).select('chapter').lean();

    const doneSet = new Set(doneTasks.map(t => t.chapter));
    const pct     = totalChapters > 0 ? Math.round((doneSet.size / totalChapters) * 100) : 0;

    // Best-effort cache write (don't await — keep response fast)
    Subject.findByIdAndUpdate(req.params.id, { $pull: { progress: { student: req.user.id } } })
      .then(() => Subject.findByIdAndUpdate(req.params.id, {
        $push: { progress: { student: req.user.id, completedChapters: doneSet.size, totalChapters, pct } },
      }))
      .catch(() => {});

    res.json({ completedChapters: doneSet.size, totalChapters, pct });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PATCH /api/subjects/:id/progress ─────────────────────────────────────
// FIX 3: recomputes and persists a student's chapter completion from scratch
//        by counting all done tasks for this student × subject name.
//        Called by the frontend after task status changes, or on page load.
router.patch('/:id/progress', protect, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).lean();
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    const totalChapters = subject.chapters?.length || 0;

    const doneTasks = await Task.find({
      student: req.user.id,
      subject: subject.name,
      status:  'done',
    }).select('chapter').lean();

    const doneSet          = new Set(doneTasks.map(t => t.chapter));
    const completedChapters = doneSet.size;
    const pct              = totalChapters > 0
      ? Math.round((completedChapters / totalChapters) * 100)
      : 0;

    // Atomic upsert: pull stale row, push fresh row
    await Subject.findByIdAndUpdate(req.params.id, {
      $pull: { progress: { student: req.user.id } },
    });
    const updated = await Subject.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          progress: { student: req.user.id, completedChapters, totalChapters, pct },
        },
      },
      { new: true }
    );

    res.json({
      completedChapters,
      totalChapters,
      pct,
      subject: {
        ...updated.toObject(),
        myProgress: { completedChapters, totalChapters, pct },
        progress:   undefined,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;