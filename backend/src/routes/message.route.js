import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllUsers } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getAllUsers);

export default router;
