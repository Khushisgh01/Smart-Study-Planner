import express from 'express';
import Class from '../models/Class.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET all classes of teacher
router.get('/', protect, async (req, res) => {
  const classes = await Class.find({ teacher: req.user.id })
    .populate('subjects');

  res.json(classes);
});

// CREATE class
router.post('/', protect, async (req, res) => {
  const newClass = await Class.create({
    name: req.body.name,
    section: req.body.section,
    teacher: req.user.id
  });

  res.json(newClass);
});

// DELETE class
router.delete('/:id', protect, async (req, res) => {
  await Class.findByIdAndDelete(req.params.id);
  res.json({ message: 'Class deleted' });
});

export default router;