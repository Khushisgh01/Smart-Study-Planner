import express from 'express';
import Task    from '../models/Task.js';
import Subject from '../models/Subject.js';
import User    from '../models/User.js';
import Class   from '../models/Class.js';
import { protect, teacherOnly } from '../middleware/auth.js';

// ── Helper: sync Subject.progress after task status changes ───────────────
async function refreshSubjectProgress(studentId, subjectName) {
  const user = await User.findById(studentId).select('classId');
  if (!user?.classId) return;

  const subject = await Subject.findOne({ name: subjectName, classId: user.classId }).lean();
  if (!subject) return;

  const totalChapters = subject.chapters?.length || 0;
  const doneTasks = await Task.find({
    student: studentId,
    subject: subjectName,
    status:  'done',
  }).select('chapter').lean();

  const doneSet           = new Set(doneTasks.map(t => t.chapter));
  const completedChapters = doneSet.size;
  const pct               = totalChapters > 0
    ? Math.round((completedChapters / totalChapters) * 100)
    : 0;

  await Subject.findByIdAndUpdate(subject._id, {
    $pull: { progress: { student: studentId } },
  });
  await Subject.findByIdAndUpdate(subject._id, {
    $push: { progress: { student: studentId, completedChapters, totalChapters, pct } },
  });
}

const router = express.Router();

// ── GET /api/tasks/today ──────────────────────────────────────────────────
// Returns plain array — AppContext does setTasks(data) directly.
router.get('/today', protect, async (req, res) => {
  try {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end   = new Date(); end.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      student:       req.user.id,
      scheduledDate: { $gte: start, $lte: end },
    })
      .sort({ priority: -1 })
      .lean();

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/tasks/tomorrow ───────────────────────────────────────────────
router.get('/tomorrow', protect, async (req, res) => {
  try {
    const start = new Date();
    start.setDate(start.getDate() + 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      student:       req.user.id,
      scheduledDate: { $gte: start, $lte: end },
    })
      .sort({ priority: -1 })
      .lean();

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/tasks/student/:studentId ─────────────────────────────────────
// Teacher: view all tasks for a student in their class.
// No role:'student' filter — User model has no role field.
router.get('/student/:studentId', protect, teacherOnly, async (req, res) => {
  try {
    const teacherClasses = await Class.find({ teacher: req.user.id }).select('_id');
    const classIds = teacherClasses.map(c => c._id);

    const student = await User.findOne({
      _id:     req.params.studentId,
      classId: { $in: classIds },
    }).select('name email classId');

    if (!student) {
      return res.status(404).json({ message: 'Student not found in your classes' });
    }

    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 50);
    const skip  = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      Task.find({ student: req.params.studentId })
        .sort({ scheduledDate: -1, priority: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Task.countDocuments({ student: req.params.studentId }),
    ]);

    res.json({ student, tasks, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PATCH /api/tasks/:id/status ───────────────────────────────────────────
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const allowed = ['pending', 'done', 'skipped', 'partial'];
    if (!allowed.includes(req.body.status)) {
      return res.status(400).json({ message: `status must be one of: ${allowed.join(', ')}` });
    }

    const task = await Task.findOne({ _id: req.params.id, student: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found or not yours' });

    task.status = req.body.status;
    await task.save();

    // Keep Subject.progress in sync — fire-and-forget
    refreshSubjectProgress(req.user.id, task.subject).catch(() => {});

    // Auto-reschedule skipped/partial to tomorrow at 08:00
    if (task.status === 'skipped' || task.status === 'partial') {
      const rescheduleDate = new Date();
      rescheduleDate.setDate(rescheduleDate.getDate() + 1);
      rescheduleDate.setHours(8, 0, 0, 0);

      await Task.create({
        student:       task.student,
        subject:       task.subject,
        chapter:       task.chapter,
        taskType:      task.taskType,
        scheduledDate: rescheduleDate,
        estimatedTime: task.estimatedTime,
        priority:      task.priority,
        status:        'pending',
      });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/tasks/generate/:classId ────────────────────────────────────
// No role:'student' filter — classId scoping is sufficient.
router.post('/generate/:classId', protect, teacherOnly, async (req, res) => {
  try {
    const cls = await Class.findOne({ _id: req.params.classId, teacher: req.user.id });
    if (!cls) return res.status(403).json({ message: 'Not your class' });

    const subjects = await Subject.find({ classId: req.params.classId });
    if (!subjects.length) {
      return res.status(400).json({ message: 'Add subjects before generating tasks' });
    }

    const students = await User.find({ classId: req.params.classId }).select('_id');
    if (!students.length) {
      return res.status(400).json({ message: 'No students enrolled in this class yet' });
    }

    const today    = new Date();
    const allTasks = [];

    for (const student of students) {
      for (const [si, sub] of subjects.entries()) {
        for (const [ci, ch] of sub.chapters.entries()) {
          for (const [ti, type] of ['Learn', 'Revise1', 'Revise2', 'PYQ'].entries()) {
            const d = new Date(today);
            d.setDate(today.getDate() + si * 2 + ci + ti);
            d.setHours(8, 0, 0, 0);

            const diffScore = ch.difficulty === 'hard' ? 3 : ch.difficulty === 'medium' ? 2 : 1;
            const pyqScore  = ch.pyqFrequency === 'high' ? 3 : ch.pyqFrequency === 'medium' ? 2 : 1;
            const typeMult  = type === 'PYQ' ? 2 : type === 'Learn' ? 1.5 : 1;
            const priority  = Math.round((ch.weightage || 5) * diffScore * pyqScore * typeMult);

            allTasks.push({
              student:       student._id,
              subject:       sub.name,
              chapter:       ch.name,
              taskType:      type,
              scheduledDate: d,
              estimatedTime: ch.estimatedTime || 45,
              priority,
              status:        'pending',
            });
          }
        }
      }
    }

    // Remove existing pending tasks before regenerating to avoid duplicates
    const studentIds = students.map(s => s._id);
    await Task.deleteMany({ student: { $in: studentIds }, status: 'pending' });
    await Task.insertMany(allTasks);

    res.json({
      message:         'Tasks generated for all enrolled students',
      students:        students.length,
      tasksPerStudent: Math.round(allTasks.length / students.length),
      total:           allTasks.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/tasks/student/:studentId ──────────────────────────────────
router.delete('/student/:studentId', protect, teacherOnly, async (req, res) => {
  try {
    const teacherClasses = await Class.find({ teacher: req.user.id }).select('_id');
    const classIds = teacherClasses.map(c => c._id);

    const student = await User.findOne({
      _id:     req.params.studentId,
      classId: { $in: classIds },
    });
    if (!student) return res.status(404).json({ message: 'Student not in your classes' });

    await Task.deleteMany({ student: req.params.studentId });
    res.json({ message: 'All tasks deleted for student' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;