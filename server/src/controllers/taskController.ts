import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Task from "../models/Task";
import Project from "../models/Project";

interface AuthRequest extends Request {
  user?: any;
}

// Create Task
export const createTask = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { title } = req.body;
    const { projectId } = req.params;

    if (!title) {
      res.status(400);
      throw new Error("Task title is required");
    }

    const project = await Project.findOne({
      _id: projectId,
      user: req.user._id,
    });

    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    const task = await Task.create({
      title,
      project: projectId,
      user: req.user._id,
    });

    res.status(201).json(task);
  }
);

// Get Tasks
export const getTasks = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { projectId } = req.params;

    const tasks = await Task.find({
      project: projectId,
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(tasks);
  }
);

// Update Task
export const updateTask = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    task.title = req.body.title || task.title;
    task.status = req.body.status || task.status;

    const updated = await task.save();
    res.json(updated);
  }
);

// Delete Task
export const deleteTask = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    res.json({ message: "Task deleted" });
  }
);