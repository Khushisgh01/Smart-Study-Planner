// import express from 'express';
// import Class from '../models/Class.js';
// import Subject from '../models/Subject.js';
// import Task from '../models/Task.js';
// import { protect, teacherOnly } from '../middleware/auth.js';

// const router = express.Router();

// // GET all classes of teacher — lean + select only needed fields (Bug 18)
// router.get('/', protect, teacherOnly, async (req, res) => {
//   try {
//     const classes = await Class.find({ teacher: req.user.id })
//       .populate({
//         path: 'subjects',
//         select: 'name color examDate chapters',  // Bug 18: don't load full heavy docs
//       })
//       .lean();

//     res.json(classes);
//   } catch (err) {
//     res.status(500).json({ message: err.message }); // Bug 13: proper error response
//   }
// });

// // CREATE class
// router.post('/', protect, teacherOnly, async (req, res) => {
//   try {
//     const newClass = await Class.create({
//       name: req.body.name,
//       section: req.body.section,
//       teacher: req.user.id,
//     });
//     res.json(newClass);
//   } catch (err) {
//     res.status(500).json({ message: err.message }); // Bug 13
//   }
// });

// // DELETE class — cascade delete subjects + tasks (Bug 2)
// router.delete('/:id', protect, teacherOnly, async (req, res) => {
//   try {
//     const cls = await Class.findOne({ _id: req.params.id, teacher: req.user.id });
//     if (!cls) return res.status(404).json({ message: 'Class not found' });

//     // Bug 2: cascade-delete all subjects belonging to this class
//     await Subject.deleteMany({ classId: cls._id });

//     // Also remove tasks linked to those subjects' chapters
//     // Tasks store subject name as string; delete by classId on Task if you add that field,
//     // or here we remove tasks whose student was generated for this class.
//     // Best-effort: delete tasks referencing any subject of this class by joining on subject name.
//     const subjectNames = (cls.subjects || []).map(s => s.toString());
//     if (subjectNames.length) {
//       await Task.deleteMany({ subject: { $in: subjectNames } });
//     }

//     await Class.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Class and all related subjects deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message }); // Bug 13
//   }
// });

// // POST /api/class/:id/enroll — Student enrollment (Bug 15)
// router.post('/:id/enroll', protect, async (req, res) => {
//   try {
//     const User = (await import('../models/User.js')).default;
//     const cls = await Class.findById(req.params.id);
//     if (!cls) return res.status(404).json({ message: 'Class not found' });

//     // Add classId to user
//     await User.findByIdAndUpdate(req.user.id, { classId: cls._id });
//     res.json({ message: 'Enrolled successfully', classId: cls._id });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// export default router;
import express from 'express';
import Class   from '../models/Class.js';
import Subject from '../models/Subject.js';
import Task    from '../models/Task.js';
import User    from '../models/User.js';
import { protect, teacherOnly } from '../middleware/auth.js';

const router = express.Router();

// ── GET /api/class/all ────────────────────────────────────────────────────
// Students use this to browse all available classes before enrolling.
// Must come BEFORE /:id routes to avoid "all" being treated as an ObjectId.
router.get('/all', protect, async (req, res) => {
  try {
    const classes = await Class.find({})
      .populate({ path: 'subjects', select: 'name color' })
      .select('name section subjects')
      .lean();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/class (teacher's own classes) ────────────────────────────────
router.get('/', protect, teacherOnly, async (req, res) => {
  try {
    const classes = await Class.find({ teacher: req.user.id })
      .populate({ path: 'subjects', select: 'name color examDate chapters' })
      .lean();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/class ───────────────────────────────────────────────────────
router.post('/', protect, teacherOnly, async (req, res) => {
  try {
    const newClass = await Class.create({
      name:    req.body.name,
      section: req.body.section,
      teacher: req.user.id,
    });
    res.json(newClass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/class/:id ────────────────────────────────────────────────
router.delete('/:id', protect, teacherOnly, async (req, res) => {
  try {
    const cls = await Class.findOne({ _id: req.params.id, teacher: req.user.id });
    if (!cls) return res.status(404).json({ message: 'Class not found' });

    await Subject.deleteMany({ classId: cls._id });

    const subjectNames = (cls.subjects || []).map(s => s.toString());
    if (subjectNames.length) {
      await Task.deleteMany({ subject: { $in: subjectNames } });
    }

    await Class.findByIdAndDelete(req.params.id);
    res.json({ message: 'Class and all related subjects deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/class/:id/enroll ────────────────────────────────────────────
// Student enrolls in a class. Sets their classId so tasks/subjects load correctly.
router.post('/:id/enroll', protect, async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (!cls) return res.status(404).json({ message: 'Class not found' });

    await User.findByIdAndUpdate(req.user.id, { classId: cls._id });
    res.json({ message: 'Enrolled successfully', classId: cls._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;