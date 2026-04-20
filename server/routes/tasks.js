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