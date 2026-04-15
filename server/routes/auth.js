import express from "express";
import {
  loginUser,
  registerUser,
  loginTeacher,
  registerTeacher,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/user/login", loginUser);
router.post("/user/register", registerUser);
router.post("/teacher/login", loginTeacher);
router.post("/teacher/register", registerTeacher);

export default router;