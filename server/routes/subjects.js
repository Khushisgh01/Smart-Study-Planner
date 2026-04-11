import express from 'express';
import Subject from '../models/Subject.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const subjects = await Subject.find();
  res.json(subjects);
});

router.post('/', protect, async (req, res) => {
  const subject = await Subject.create({ ...req.body, createdBy: req.user.id });
  res.json(subject);
});

router.put('/:id', protect, async (req, res) => {
  const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(subject);
});

export default router;