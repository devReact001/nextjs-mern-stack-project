import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Task from "../models/Task";
import Project from "../models/Project";

interface AuthRequest extends Request {
  user?: any;
}

// Create Task — any logged-in user can create task in any project
export const createTask = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { title } = req.body;
    const { projectId } = req.params;

    if (!title) {
      res.status(400);
      throw new Error("Task title is required");
    }

    const project = await Project.findById(projectId);

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

// Get Tasks — return all tasks for a project (no user filter)
export const getTasks = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { projectId } = req.params;

    const tasks = await Task.find({
      project: projectId,
    }).sort({ createdAt: -1 });

    res.json(tasks);
  }
);

// Update Task — any logged-in user can update
export const updateTask = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const task = await Task.findById(req.params.id);

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

// Delete Task — any logged-in user can delete
export const deleteTask = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    res.json({ message: "Task deleted" });
  }
);
