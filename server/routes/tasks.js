/*
import express from 'express';
import Task from '../models/Task.js';
import Subject from '../models/Subject.js';
import User from '../models/User.js';
import { protect, teacherOnly } from '../middleware/auth.js';

const router = express.Router();

// GET today's tasks for the logged-in student (Bug 16: queries by student id)
router.get('/today', protect, async (req, res) => {
  try {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(); end.setHours(23, 59, 59, 999);

    // Bug 19: add limit/skip pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const tasks = await Task.find({
      student: req.user.id,
      scheduledDate: { $gte: start, $lte: end },
    })
      .sort({ priority: -1 })
      .skip(skip)
      .limit(limit);

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET tomorrow's tasks
router.get('/tomorrow', protect, async (req, res) => {
  try {
    const start = new Date();
    start.setDate(start.getDate() + 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const tasks = await Task.find({
      student: req.user.id,
      scheduledDate: { $gte: start, $lte: end },
    })
      .sort({ priority: -1 })
      .skip(skip)
      .limit(limit);

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH task status — ownership check + clean reschedule object (Bugs 9, 21)
router.patch('/:id/status', protect, async (req, res) => {
  try {
    // Bug 21: only allow the task owner to update
    const task = await Task.findOne({ _id: req.params.id, student: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found or not yours' });

    task.status = req.body.status;
    await task.save();

    if (task.status === 'skipped' || task.status === 'partial') {
      const rescheduleDate = new Date();
      rescheduleDate.setDate(rescheduleDate.getDate() + 1);

      // Bug 9: build a clean object — no spread of Mongoose internals
      await Task.create({
        student: task.student,
        subject: task.subject,
        chapter: task.chapter,
        taskType: task.taskType,
        scheduledDate: rescheduleDate,
        estimatedTime: task.estimatedTime,
        priority: task.priority,
        status: 'pending',
      });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /generate/:classId — generate tasks per ENROLLED STUDENT, not teacher (Bug 1)
router.post('/generate/:classId', protect, teacherOnly, async (req, res) => {
  try {
    const subjects = await Subject.find({ classId: req.params.classId });
    if (!subjects.length) {
      return res.status(404).json({ message: 'No subjects found for this class' });
    }

    // Bug 1: find all students enrolled in this class
    const students = await User.find({ classId: req.params.classId });
    if (!students.length) {
      return res.status(400).json({ message: 'No students enrolled in this class yet' });
    }

    const today = new Date();
    const allTasks = [];

    students.forEach((student) => {
      subjects.forEach((sub, si) => {
        sub.chapters.forEach((ch, ci) => {
          ['Learn', 'Revise1', 'Revise2', 'PYQ'].forEach((type, ti) => {
            const d = new Date(today);
            d.setDate(today.getDate() + si * 2 + ci + ti);

            // Bug 20: real priority formula matching priorityEngine.js
            const difficultyScore = ch.difficulty === 'hard' ? 3 : ch.difficulty === 'medium' ? 2 : 1;
            const pyqScore = ch.pyqFrequency === 'high' ? 3 : ch.pyqFrequency === 'medium' ? 2 : 1;
            const typeMultiplier = type === 'PYQ' ? 2 : type === 'Learn' ? 1.5 : 1;
            const priority = Math.round(
              (ch.weightage || 5) * difficultyScore * pyqScore * typeMultiplier
            );

            allTasks.push({
              student: student._id,   // Bug 1: use student._id, not teacher
              subject: sub.name,
              chapter: ch.name,
              taskType: type,
              scheduledDate: d,
              estimatedTime: ch.estimatedTime || 45,
              priority,
            });
          });
        });
      });
    });

    await Task.insertMany(allTasks);
    res.json({
      message: 'Tasks generated for all enrolled students',
      students: students.length,
      tasksPerStudent: allTasks.length / students.length,
      total: allTasks.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

import express from 'express';
import Task    from '../models/Task.js';
import Subject from '../models/Subject.js';
import User    from '../models/User.js';
import Class   from '../models/Class.js';
import { protect, teacherOnly } from '../middleware/auth.js';

const router = express.Router();

// ── GET /api/tasks/today ──────────────────────────────────────────────────
// Student: fetch today's tasks (paginated).
router.get('/today', protect, async (req, res) => {
  try {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end   = new Date(); end.setHours(23, 59, 59, 999);

    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 50);
    const skip  = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      Task.find({
        student:       req.user.id,
        scheduledDate: { $gte: start, $lte: end },
      })
        .sort({ priority: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Task.countDocuments({
        student:       req.user.id,
        scheduledDate: { $gte: start, $lte: end },
      }),
    ]);

    res.json({ tasks, total, page, pages: Math.ceil(total / limit) });
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

    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 50);
    const skip  = (page - 1) * limit;

    const tasks = await Task.find({
      student:       req.user.id,
      scheduledDate: { $gte: start, $lte: end },
    })
      .sort({ priority: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/tasks/student/:studentId ─────────────────────────────────────
// Teacher: view all tasks for a specific student (must be in teacher's class).
router.get('/student/:studentId', protect, teacherOnly, async (req, res) => {
  try {
    // Make sure this student is in one of the teacher's classes
    const teacherClasses = await Class.find({ teacher: req.user.id }).select('_id');
    const classIds = teacherClasses.map(c => c._id);

    const student = await User.findOne({
      _id:     req.params.studentId,
      classId: { $in: classIds },
      role:    'student',
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
// Student: update task status. Ownership-checked. Auto-reschedules on skip/partial.
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const allowed = ['pending', 'done', 'skipped', 'partial'];
    if (!allowed.includes(req.body.status)) {
      return res.status(400).json({ message: `status must be one of: ${allowed.join(', ')}` });
    }

    // Only the task owner can update it
    const task = await Task.findOne({ _id: req.params.id, student: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found or not yours' });

    task.status = req.body.status;
    await task.save();

    // Auto-reschedule skipped/partial tasks to tomorrow
    if (task.status === 'skipped' || task.status === 'partial') {
      const rescheduleDate = new Date();
      rescheduleDate.setDate(rescheduleDate.getDate() + 1);
      rescheduleDate.setHours(8, 0, 0, 0); // schedule at 8 AM

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
// Teacher: generate study tasks for all students enrolled in a class.
router.post('/generate/:classId', protect, teacherOnly, async (req, res) => {
  try {
    // Verify the class belongs to this teacher
    const cls = await Class.findOne({ _id: req.params.classId, teacher: req.user.id });
    if (!cls) return res.status(403).json({ message: 'Not your class' });

    const subjects = await Subject.find({ classId: req.params.classId });
    if (!subjects.length) {
      return res.status(400).json({ message: 'Add subjects before generating tasks' });
    }

    const students = await User.find({ classId: req.params.classId, role: 'student' }).select('_id');
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

            // Priority formula: matches priorityEngine.js
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

    // Remove existing pending tasks for these students before regenerating
    // (avoids duplicate task accumulation on repeated "Generate" clicks)
    const studentIds = students.map(s => s._id);
    await Task.deleteMany({ student: { $in: studentIds }, status: 'pending' });

    await Task.insertMany(allTasks);

    res.json({
      message:          'Tasks generated for all enrolled students',
      students:         students.length,
      tasksPerStudent:  Math.round(allTasks.length / students.length),
      total:            allTasks.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/tasks/student/:studentId ──────────────────────────────────
// Teacher: remove all tasks for a student (e.g. before re-generating).
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


import express from 'express';
import Task    from '../models/Task.js';
import Subject from '../models/Subject.js';
import User    from '../models/User.js';
import Class   from '../models/Class.js';
import { protect, teacherOnly } from '../middleware/auth.js';

const router = express.Router();

// ── GET /api/tasks/today ──────────────────────────────────────────────────
// Student: fetch today's tasks (paginated).
// FIX: was returning { tasks, total, page, pages } but /tomorrow returned a
//      plain array — AppContext.fetchTodayTasks does setTasks(data) so it
//      needs a plain array. Both endpoints now return a plain array.
//      Pagination params are still accepted but the full matched set is
//      returned so the client never has to deal with pages for day-views.
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

    // Return a plain array — matches AppContext.fetchTodayTasks expectation:
    //   const data = await res.json();  →  setTasks(data)
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/tasks/tomorrow ───────────────────────────────────────────────
// FIX: now consistent with /today — plain array, same sort order.
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
// Teacher: view all tasks for a specific student (must be in teacher's class).
// FIX: removed { role: 'student' } from User.findOne — User model has no
//      role field. Role lives only in the JWT. Membership is verified via
//      classId belonging to one of the teacher's classes instead.
router.get('/student/:studentId', protect, teacherOnly, async (req, res) => {
  try {
    const teacherClasses = await Class.find({ teacher: req.user.id }).select('_id');
    const classIds = teacherClasses.map(c => c._id);

    // Role check removed — classId scope is sufficient proof of enrollment
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
// Student: update task status. Ownership-checked. Auto-reschedules on skip/partial.
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

    // Auto-reschedule skipped/partial tasks to tomorrow at 08:00
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
// Teacher: generate study tasks for all students enrolled in a class.
// FIX: removed { role: 'student' } — User model has no role field.
//      Uses classId scoping alone (all users with classId = this class).
router.post('/generate/:classId', protect, teacherOnly, async (req, res) => {
  try {
    const cls = await Class.findOne({ _id: req.params.classId, teacher: req.user.id });
    if (!cls) return res.status(403).json({ message: 'Not your class' });

    const subjects = await Subject.find({ classId: req.params.classId });
    if (!subjects.length) {
      return res.status(400).json({ message: 'Add subjects before generating tasks' });
    }

    // FIX: query by classId only — no role filter
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
// Teacher: remove all tasks for a student (e.g. before re-generating).
router.delete('/student/:studentId', protect, teacherOnly, async (req, res) => {
  try {
    const teacherClasses = await Class.find({ teacher: req.user.id }).select('_id');
    const classIds = teacherClasses.map(c => c._id);

    // FIX: no role filter — classId membership is the only check needed
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

*/

import express from 'express';
import Task    from '../models/Task.js';
import Subject from '../models/Subject.js';
import User    from '../models/User.js';
import Class   from '../models/Class.js';
import { protect, teacherOnly } from '../middleware/auth.js';

// ── Helpers ───────────────────────────────────────────────────────────────
// FIX 3 (progress tracking): after a task status change we need to keep the
// denormalised Subject.progress[student] row in sync so SubjectCard / Sidebar
// always show current completion without a separate fetch.
async function refreshSubjectProgress(studentId, subjectName) {
  const subject = await Subject.findOne({ name: subjectName }).lean();
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
// Student: fetch today's tasks (paginated).
// FIX: was returning { tasks, total, page, pages } but /tomorrow returned a
//      plain array — AppContext.fetchTodayTasks does setTasks(data) so it
//      needs a plain array. Both endpoints now return a plain array.
//      Pagination params are still accepted but the full matched set is
//      returned so the client never has to deal with pages for day-views.
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

    // Return a plain array — matches AppContext.fetchTodayTasks expectation:
    //   const data = await res.json();  →  setTasks(data)
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/tasks/tomorrow ───────────────────────────────────────────────
// FIX: now consistent with /today — plain array, same sort order.
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
// Teacher: view all tasks for a specific student (must be in teacher's class).
// FIX: removed { role: 'student' } from User.findOne — User model has no
//      role field. Role lives only in the JWT. Membership is verified via
//      classId belonging to one of the teacher's classes instead.
router.get('/student/:studentId', protect, teacherOnly, async (req, res) => {
  try {
    const teacherClasses = await Class.find({ teacher: req.user.id }).select('_id');
    const classIds = teacherClasses.map(c => c._id);

    // Role check removed — classId scope is sufficient proof of enrollment
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
// Student: update task status. Ownership-checked. Auto-reschedules on skip/partial.
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

    // FIX 3: keep Subject.progress in sync whenever a task is marked done,
    //        skipped, or partial.  Fire-and-forget — don't block the response.
    refreshSubjectProgress(req.user.id, task.subject).catch(() => {});

    // Auto-reschedule skipped/partial tasks to tomorrow at 08:00
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
// Teacher: generate study tasks for all students enrolled in a class.
// FIX: removed { role: 'student' } — User model has no role field.
//      Uses classId scoping alone (all users with classId = this class).
router.post('/generate/:classId', protect, teacherOnly, async (req, res) => {
  try {
    const cls = await Class.findOne({ _id: req.params.classId, teacher: req.user.id });
    if (!cls) return res.status(403).json({ message: 'Not your class' });

    const subjects = await Subject.find({ classId: req.params.classId });
    if (!subjects.length) {
      return res.status(400).json({ message: 'Add subjects before generating tasks' });
    }

    // FIX: query by classId only — no role filter
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
// Teacher: remove all tasks for a student (e.g. before re-generating).
router.delete('/student/:studentId', protect, teacherOnly, async (req, res) => {
  try {
    const teacherClasses = await Class.find({ teacher: req.user.id }).select('_id');
    const classIds = teacherClasses.map(c => c._id);

    // FIX: no role filter — classId membership is the only check needed
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