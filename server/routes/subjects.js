import express from 'express';
import Subject from '../models/Subject.js';
import Class from '../models/Class.js';
import { protect, teacherOnly } from '../middleware/auth.js';

const router = express.Router();

// GET subjects of a class
router.get('/class/:classId', protect, async (req, res) => {
  try {
    const subjects = await Subject.find({ classId: req.params.classId });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message }); // Bug 13
  }
});

// CREATE subject inside class
router.post('/class/:classId', protect, teacherOnly, async (req, res) => {
  try {
    const { examDate, ...rest } = req.body;

    const subject = await Subject.create({
      ...rest,
      // Bug 17: always store examDate as a proper Date object
      examDate: examDate ? new Date(examDate) : undefined,
      classId: req.params.classId,
      createdBy: req.user.id,
    });

    await Class.findByIdAndUpdate(req.params.classId, {
      $push: { subjects: subject._id },
    });

    res.json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message }); // Bug 13
  }
});

// UPDATE subject
router.put('/:id', protect, teacherOnly, async (req, res) => {
  try {
    const { examDate, ...rest } = req.body;

    const updated = await Subject.findByIdAndUpdate(
      req.params.id,
      {
        ...rest,
        // Bug 17: coerce to Date on update too
        ...(examDate ? { examDate: new Date(examDate) } : {}),
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Subject not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message }); // Bug 13
  }
});

// DELETE subject — also remove from Class.subjects array (Bug 22)
router.delete('/:id', protect, teacherOnly, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    // Bug 22: pull the ObjectId reference out of Class.subjects
    await Class.findByIdAndUpdate(subject.classId, {
      $pull: { subjects: subject._id },
    });

    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subject deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message }); // Bug 13
  }
});

export default router;