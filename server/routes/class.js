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
/*
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
*/

import express from 'express';
import Class   from '../models/Class.js';
import Subject from '../models/Subject.js';
import Task    from '../models/Task.js';
import User    from '../models/User.js';
import { protect, teacherOnly } from '../middleware/auth.js';

const router = express.Router();

// ── GET /api/class/all ────────────────────────────────────────────────────
// Students browse all classes before enrolling.
// MUST be before /:id routes — "all" would be parsed as an ObjectId otherwise.
router.get('/all', protect, async (req, res) => {
  try {
    const classes = await Class.find({})
      .populate({ path: 'subjects', select: 'name color examDate' })
      .select('name section subjects')
      .lean();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/class ────────────────────────────────────────────────────────
// Teacher: get their own classes (with subjects populated).
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
// Teacher: create a new class section.
router.post('/', protect, teacherOnly, async (req, res) => {
  try {
    const exists = await Class.findOne({
      teacher: req.user.id,
      name: req.body.name,
      section: req.body.section,
    });
    if (exists) {
      return res.status(400).json({ message: `Class ${req.body.name}-${req.body.section} already exists` });
    }

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

// ── GET /api/class/:id/students ───────────────────────────────────────────
// Teacher: list all students enrolled in a class, with their task progress.
router.get('/:id/students', protect, teacherOnly, async (req, res) => {
  try {
    // Verify this class belongs to the requesting teacher
    const cls = await Class.findOne({ _id: req.params.id, teacher: req.user.id });
    if (!cls) return res.status(404).json({ message: 'Class not found' });

    // Fetch all students enrolled in this class
    const students = await User.find({ classId: req.params.id, role: 'student' })
      .select('name email createdAt')
      .lean();

    if (students.length === 0) return res.json([]);

    const studentIds = students.map(s => s._id);

    // Aggregate task stats per student in one DB round-trip
    const taskStats = await Task.aggregate([
      { $match: { student: { $in: studentIds } } },
      {
        $group: {
          _id: '$student',
          total:   { $sum: 1 },
          done:    { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } },
          skipped: { $sum: { $cond: [{ $eq: ['$status', 'skipped'] }, 1, 0] } },
          partial: { $sum: { $cond: [{ $eq: ['$status', 'partial'] }, 1, 0] } },
          // Subjects covered (unique set)
          subjects: { $addToSet: '$subject' },
        },
      },
    ]);

    // Build a map for O(1) lookup
    const statsMap = {};
    for (const stat of taskStats) {
      statsMap[stat._id.toString()] = stat;
    }

    // Merge student records with their progress stats
    const result = students.map(student => {
      const stats = statsMap[student._id.toString()] || {
        total: 0, done: 0, skipped: 0, partial: 0, subjects: [],
      };

      const completionPct = stats.total > 0
        ? Math.round((stats.done / stats.total) * 100)
        : 0;

      return {
        _id:          student._id,
        name:         student.name,
        email:        student.email,
        enrolledAt:   student.createdAt,
        progress: {
          total:         stats.total,
          done:          stats.done,
          skipped:       stats.skipped,
          partial:       stats.partial,
          completionPct,
          subjectsCovered: stats.subjects.length,
        },
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/class/:id/students/:studentId/progress ───────────────────────
// Teacher: detailed chapter-level progress for a specific student.
router.get('/:id/students/:studentId/progress', protect, teacherOnly, async (req, res) => {
  try {
    const cls = await Class.findOne({ _id: req.params.id, teacher: req.user.id });
    if (!cls) return res.status(404).json({ message: 'Class not found' });

    const student = await User.findOne({
      _id:     req.params.studentId,
      classId: req.params.id,
      role:    'student',
    }).select('name email');
    if (!student) return res.status(404).json({ message: 'Student not in this class' });

    // All tasks for this student, grouped by subject then chapter
    const tasks = await Task.find({ student: req.params.studentId })
      .select('subject chapter taskType status scheduledDate estimatedTime priority')
      .sort({ scheduledDate: 1 })
      .lean();

    // Group by subject → chapter
    const grouped = {};
    for (const task of tasks) {
      if (!grouped[task.subject]) grouped[task.subject] = {};
      if (!grouped[task.subject][task.chapter]) {
        grouped[task.subject][task.chapter] = { tasks: [], summary: {} };
      }
      grouped[task.subject][task.chapter].tasks.push(task);
    }

    // Build summary per chapter
    for (const subject of Object.keys(grouped)) {
      for (const chapter of Object.keys(grouped[subject])) {
        const chTasks = grouped[subject][chapter].tasks;
        const done    = chTasks.filter(t => t.status === 'done').length;
        grouped[subject][chapter].summary = {
          total:   chTasks.length,
          done,
          completionPct: Math.round((done / chTasks.length) * 100),
          types: chTasks.map(t => ({ type: t.taskType, status: t.status })),
        };
      }
    }

    res.json({ student, subjects: grouped });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/class/:id ────────────────────────────────────────────────
// Teacher: delete a class, its subjects, unenroll students, and purge tasks.
router.delete('/:id', protect, teacherOnly, async (req, res) => {
  try {
    const cls = await Class.findOne({ _id: req.params.id, teacher: req.user.id });
    if (!cls) return res.status(404).json({ message: 'Class not found' });

    // Unenroll all students in this class
    await User.updateMany({ classId: cls._id }, { $unset: { classId: '' } });

    // Delete all subjects belonging to this class
    await Subject.deleteMany({ classId: cls._id });

    // Delete all tasks for students who were in this class
    // (students already unenrolled, so we cascade by classId reference on tasks)
    // Tasks store student ID — fetch them first
    const enrolledStudentIds = (
      await User.find({ classId: cls._id }).select('_id').lean()
    ).map(u => u._id);

    if (enrolledStudentIds.length) {
      await Task.deleteMany({ student: { $in: enrolledStudentIds } });
    }

    await Class.findByIdAndDelete(req.params.id);
    res.json({ message: 'Class deleted and students unenrolled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/class/:id/enroll ────────────────────────────────────────────
// Student enrolls in a class. Unenrolls from previous class first.
router.post('/:id/enroll', protect, async (req, res) => {
  try {
    if (req.user.role === 'teacher') {
      return res.status(403).json({ message: 'Teachers cannot enroll in classes' });
    }

    const cls = await Class.findById(req.params.id);
    if (!cls) return res.status(404).json({ message: 'Class not found' });

    const user = await User.findById(req.user.id).select('classId');

    // If already enrolled in a DIFFERENT class, remove old tasks to avoid stale data
    if (user.classId && user.classId.toString() !== req.params.id) {
      await Task.deleteMany({ student: req.user.id });
    }

    await User.findByIdAndUpdate(req.user.id, { classId: cls._id });
    res.json({ message: 'Enrolled successfully', classId: cls._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/class/:id/unenroll ─────────────────────────────────────────
// Student unenrolls from their current class.
router.post('/:id/unenroll', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('classId');
    if (!user?.classId || user.classId.toString() !== req.params.id) {
      return res.status(400).json({ message: 'You are not enrolled in this class' });
    }

    await User.findByIdAndUpdate(req.user.id, { $unset: { classId: '' } });
    await Task.deleteMany({ student: req.user.id });

    res.json({ message: 'Unenrolled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;