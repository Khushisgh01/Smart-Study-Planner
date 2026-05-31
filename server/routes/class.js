import express from 'express';
import Class   from '../models/Class.js';
import Subject from '../models/Subject.js';
import Task    from '../models/Task.js';
import User    from '../models/User.js';
import { protect, teacherOnly } from '../middleware/auth.js';

const router = express.Router();

const SUBJECT_FIELDS = 'name color examDate chapters badge';

/** Load subjects by classId (source of truth) and enrolled students. */
async function enrichClasses(classes, { includeStudents = false } = {}) {
  return Promise.all(classes.map(async (cls) => {
    const subjects = await Subject.find({ classId: cls._id })
      .select(SUBJECT_FIELDS)
      .sort({ name: 1 })
      .lean();

    // Keep Class.subjects array in sync when it drifts
    const subjectIds = subjects.map(s => s._id);
    const storedIds  = (cls.subjects || []).map(id => id.toString()).sort().join(',');
    const actualIds  = subjectIds.map(id => id.toString()).sort().join(',');
    if (storedIds !== actualIds) {
      await Class.findByIdAndUpdate(cls._id, { subjects: subjectIds });
    }

    const studentCount = await User.countDocuments({ classId: cls._id });

    const enriched = {
      ...cls,
      subjects,
      studentCount,
    };

    if (includeStudents) {
      enriched.students = await User.find({ classId: cls._id })
        .select('name email createdAt')
        .sort({ name: 1 })
        .lean();
    }

    return enriched;
  }));
}

async function enrichSingleClass(cls, options) {
  const [enriched] = await enrichClasses([cls], options);
  return enriched;
}

// ── GET /api/class/all ────────────────────────────────────────────────────
// Students browse all classes before enrolling.
// MUST be before /:id routes — "all" would be parsed as an ObjectId otherwise.
router.get('/all', protect, async (req, res) => {
  try {
    const classes = await Class.find({})
      .select('name section teacher')
      .lean();
    res.json(await enrichClasses(classes));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/class ────────────────────────────────────────────────────────
// Teacher: get their own classes (with subjects + enrolled students).
router.get('/', protect, teacherOnly, async (req, res) => {
  try {
    const classes = await Class.find({ teacher: req.user.id }).lean();
    res.json(await enrichClasses(classes, { includeStudents: true }));
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
      name:    req.body.name,
      section: req.body.section,
    });
    if (exists) {
      return res.status(400).json({
        message: `Class ${req.body.name}-${req.body.section} already exists`,
      });
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

// ── GET /api/class/:id ────────────────────────────────────────────────────
// Accessible by the owning teacher OR any enrolled student.
router.get('/:id', protect, async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id).lean();
    if (!cls) return res.status(404).json({ message: 'Class not found' });

    const isTeacher = req.user.role === 'teacher' && cls.teacher.toString() === req.user.id;

    if (!isTeacher) {
      const user = await User.findById(req.user.id).select('classId');
      if (!user?.classId || user.classId.toString() !== req.params.id) {
        return res.status(403).json({ message: 'You are not enrolled in this class' });
      }
    }

    res.json(await enrichSingleClass(cls));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/class/:id/students ───────────────────────────────────────────
// Teacher: list all students enrolled in a class, with their task progress.
// NOTE: no role:'student' filter — User model has no role field.
router.get('/:id/students', protect, teacherOnly, async (req, res) => {
  try {
    const cls = await Class.findOne({ _id: req.params.id, teacher: req.user.id });
    if (!cls) return res.status(404).json({ message: 'Class not found' });

    const students = await User.find({ classId: req.params.id })
      .select('name email createdAt')
      .lean();

    if (students.length === 0) return res.json([]);

    const studentIds = students.map(s => s._id);

    const taskStats = await Task.aggregate([
      { $match: { student: { $in: studentIds } } },
      {
        $group: {
          _id:      '$student',
          total:    { $sum: 1 },
          done:     { $sum: { $cond: [{ $eq: ['$status', 'done'] },    1, 0] } },
          skipped:  { $sum: { $cond: [{ $eq: ['$status', 'skipped'] }, 1, 0] } },
          partial:  { $sum: { $cond: [{ $eq: ['$status', 'partial'] }, 1, 0] } },
          subjects: { $addToSet: '$subject' },
        },
      },
    ]);

    const statsMap = {};
    for (const stat of taskStats) statsMap[stat._id.toString()] = stat;

    const result = students.map(student => {
      const stats = statsMap[student._id.toString()] || {
        total: 0, done: 0, skipped: 0, partial: 0, subjects: [],
      };
      const completionPct = stats.total > 0
        ? Math.round((stats.done / stats.total) * 100)
        : 0;

      return {
        _id:        student._id,
        name:       student.name,
        email:      student.email,
        enrolledAt: student.createdAt,
        progress: {
          total:           stats.total,
          done:            stats.done,
          skipped:         stats.skipped,
          partial:         stats.partial,
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
router.get('/:id/students/:studentId/progress', protect, teacherOnly, async (req, res) => {
  try {
    const cls = await Class.findOne({ _id: req.params.id, teacher: req.user.id });
    if (!cls) return res.status(404).json({ message: 'Class not found' });

    const student = await User.findOne({
      _id:     req.params.studentId,
      classId: req.params.id,
    }).select('name email');
    if (!student) return res.status(404).json({ message: 'Student not in this class' });

    const tasks = await Task.find({ student: req.params.studentId })
      .select('subject chapter taskType status scheduledDate estimatedTime priority')
      .sort({ scheduledDate: 1 })
      .lean();

    const grouped = {};
    for (const task of tasks) {
      if (!grouped[task.subject]) grouped[task.subject] = {};
      if (!grouped[task.subject][task.chapter]) {
        grouped[task.subject][task.chapter] = { tasks: [], summary: {} };
      }
      grouped[task.subject][task.chapter].tasks.push(task);
    }

    for (const subject of Object.keys(grouped)) {
      for (const chapter of Object.keys(grouped[subject])) {
        const chTasks = grouped[subject][chapter].tasks;
        const done    = chTasks.filter(t => t.status === 'done').length;
        grouped[subject][chapter].summary = {
          total:         chTasks.length,
          done,
          completionPct: Math.round((done / chTasks.length) * 100),
          types:         chTasks.map(t => ({ type: t.taskType, status: t.status })),
        };
      }
    }

    res.json({ student, subjects: grouped });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/class/:id ────────────────────────────────────────────────
router.delete('/:id', protect, teacherOnly, async (req, res) => {
  try {
    const cls = await Class.findOne({ _id: req.params.id, teacher: req.user.id });
    if (!cls) return res.status(404).json({ message: 'Class not found' });

    const enrolledStudents   = await User.find({ classId: cls._id }).select('_id').lean();
    const enrolledStudentIds = enrolledStudents.map(u => u._id);

    await User.updateMany({ classId: cls._id }, { $unset: { classId: '' } });
    await Subject.deleteMany({ classId: cls._id });

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
router.post('/:id/enroll', protect, async (req, res) => {
  try {
    if (req.user.role === 'teacher') {
      return res.status(403).json({ message: 'Teachers cannot enroll in classes' });
    }

    const cls = await Class.findById(req.params.id);
    if (!cls) return res.status(404).json({ message: 'Class not found' });

    const user = await User.findById(req.user.id).select('classId');

    // If switching classes, purge old tasks to avoid stale data
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