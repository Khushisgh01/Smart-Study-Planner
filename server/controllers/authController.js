import User from '../models/User.js';
import Teacher from '../models/Teacher.js';
import generateToken from '../config/generateToken.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, level, dailyHours, target } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, email, password, level, dailyHours, target });
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      role: 'student', token: generateToken(user._id, 'student'),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser || !(await existingUser.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid Email or Password' });
    res.json({
      _id: existingUser._id, name: existingUser.name, email: existingUser.email,
      role: 'student', token: generateToken(existingUser._id, 'student'),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const registerTeacher = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const teacherExists = await Teacher.findOne({ email });
    if (teacherExists) return res.status(400).json({ message: 'Teacher already exists' });
    const teacher = await Teacher.create({ name, email, password });
    res.status(201).json({
      _id: teacher._id, name: teacher.name, email: teacher.email,
      role: 'teacher', token: generateToken(teacher._id, 'teacher'),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingTeacher = await Teacher.findOne({ email });
    if (!existingTeacher || !(await existingTeacher.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid Email or Password' });
    res.json({
      _id: existingTeacher._id, name: existingTeacher.name, email: existingTeacher.email,
      role: 'teacher', token: generateToken(existingTeacher._id, 'teacher'),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};