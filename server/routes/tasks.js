import express from 'express';
import Task from '../models/Task.js';
import { protect } from '../middleware/auth.js';
import Subject from '../models/Subject.js';

const router = express.Router();

router.get('/today', protect, async (req, res) => {
  const start = new Date(); start.setHours(0,0,0,0);
  const end = new Date(); end.setHours(23,59,59,999);
  const tasks = await Task.find({ student: req.user.id, scheduledDate: { $gte: start, $lte: end } });
  res.json(tasks);
});

router.get('/tomorrow', protect, async (req, res) => {
  const start = new Date(); start.setDate(start.getDate()+1); start.setHours(0,0,0,0);
  const end = new Date(start); end.setHours(23,59,59,999);
  const tasks = await Task.find({ student: req.user.id, scheduledDate: { $gte: start, $lte: end } });
  res.json(tasks);
});

router.patch('/:id/status', protect, async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  if (task.status === 'skipped' || task.status === 'partial') {
    const rescheduleDate = new Date(); rescheduleDate.setDate(rescheduleDate.getDate()+1);
    await Task.create({ ...task.toObject(), _id: undefined, status: 'pending', scheduledDate: rescheduleDate });
  }
  res.json(task);
});

// ✅ Wrap every route like this:
router.post('/generate/:classId', protect, async (req, res) => {
  try {
    const subjects = await Subject.find({ classId: req.params.classId });

    if (!subjects.length) {
      return res.status(404).json({ message: 'No subjects found for this class' });
    }

    const tasks = [];
    const today = new Date();

    subjects.forEach((sub, si) => {
      sub.chapters.forEach((ch, ci) => {
        ['Learn', 'Revise1', 'Revise2', 'PYQ'].forEach((type, ti) => {
          const d = new Date(today);
          d.setDate(today.getDate() + si * 2 + ci + ti);
          tasks.push({
            student: req.user.id,
            subject: sub.name,
            chapter: ch.name,
            taskType: type,
            scheduledDate: d,
            estimatedTime: ch.estimatedTime || 45,
            priority: (ch.weightage || 5) * (type === 'PYQ' ? 2 : 1)
          });
        });
      });
    });

    await Task.insertMany(tasks);
    res.json({ message: 'Tasks generated for class', count: tasks.length });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;