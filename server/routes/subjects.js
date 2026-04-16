import express from 'express';
import Subject from '../models/Subject.js';
import Class from '../models/Class.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET subjects of a class
router.get('/class/:classId', protect, async (req, res) => {
  const subjects = await Subject.find({
    classId: req.params.classId
  });

  res.json(subjects);
});

// CREATE subject inside class
router.post('/class/:classId', protect, async (req, res) => {
  const subject = await Subject.create({
    ...req.body,
    classId: req.params.classId,
    createdBy: req.user.id
  });

  // push into class
  await Class.findByIdAndUpdate(req.params.classId, {
    $push: { subjects: subject._id }
  });

  res.json(subject);
});

// UPDATE subject
router.put('/:id', protect, async (req, res) => {
  const updated = await Subject.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updated);
});

// DELETE subject
router.delete('/:id', protect, async (req, res) => {
  await Subject.findByIdAndDelete(req.params.id);
  res.json({ message: 'Subject deleted' });
});

export default router;