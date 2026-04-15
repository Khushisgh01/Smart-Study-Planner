import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Teacher from "../models/Teacher.js";
import generateToken from "../config/generateToken.js";

/* ================= USER REGISTER ================= */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, level, dailyHours, target } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    level,
    dailyHours,
    target,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

/* ================= USER LOGIN ================= */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (!existingUser || !(await existingUser.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }

  res.json({
    _id: existingUser._id,
    name: existingUser.name,
    email: existingUser.email,
    token: generateToken(existingUser._id),
  });
});

/* ================= TEACHER REGISTER ================= */
export const registerTeacher = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const teacherExists = await Teacher.findOne({ email });

  if (teacherExists) {
    res.status(400);
    throw new Error("Teacher already exists");
  }

  const teacher = await Teacher.create({
    name,
    email,
    password,
  });

  res.status(201).json({
    _id: teacher._id,
    name: teacher.name,
    email: teacher.email,
    token: generateToken(teacher._id),
  });
});

/* ================= TEACHER LOGIN ================= */
export const loginTeacher = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingTeacher = await Teacher.findOne({ email });

  if (
    !existingTeacher ||
    !(await existingTeacher.matchPassword(password))
  ) {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }

  res.json({
    _id: existingTeacher._id,
    name: existingTeacher.name,
    email: existingTeacher.email,
    token: generateToken(existingTeacher._id),
  });
});
