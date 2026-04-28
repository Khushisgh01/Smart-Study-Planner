// import express from "express";
// import {
//   loginUser,
//   registerUser,
//   loginTeacher,
//   registerTeacher,
// } from "../controllers/authController.js";

// const router = express.Router();

// router.post("/user/login", loginUser);
// router.post("/user/register", registerUser);
// router.post("/teacher/login", loginTeacher);
// router.post("/teacher/register", registerTeacher);

// export default router;
import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import {
  loginUser,
  registerUser,
  loginTeacher,
  registerTeacher,
} from "../controllers/authController.js";

const router = express.Router();

// ── Auth routes ──────────────────────────────────────────────────────────
router.post("/user/login",      loginUser);
router.post("/user/register",   registerUser);
router.post("/teacher/login",   loginTeacher);
router.post("/teacher/register",registerTeacher);

// ── PATCH /api/auth/user/preferences ────────────────────────────────────
// Called from Onboarding.jsx after the user sets level / target / dailyHours.
// Previously this endpoint didn't exist → Onboarding silently failed.
router.patch("/user/preferences", protect, async (req, res) => {
  try {
    const { level, target, dailyHours } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        ...(level      !== undefined && { level }),
        ...(target     !== undefined && { target }),
        ...(dailyHours !== undefined && { dailyHours: Number(dailyHours) }),
      },
      { new: true, select: "-password" }
    );

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Preferences saved", user: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;