import express from "express";
import {
  Login,
  Logout,
  SignUp,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signup", SignUp);
router.post("/login", Login);
router.post("/logout", Logout);
router.post("/updateProfile", protectRoute, updateProfile);
export default router;
