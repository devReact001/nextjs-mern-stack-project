import express from "express";
import { protect } from "../middleware/authMiddleware";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController";

const router = express.Router();

// Nested under project
router.post("/:projectId", protect, createTask);
router.get("/:projectId", protect, getTasks);

router.put("/task/:id", protect, updateTask);
router.delete("/task/:id", protect, deleteTask);

export default router;