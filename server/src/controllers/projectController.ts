import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Project from "../models/Project";

interface AuthRequest extends Request {
  user?: any;
}

// Create Project
export const createProject = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name, description } = req.body;

    if (!name) {
      res.status(400);
      throw new Error("Project name is required");
    }

    const project = await Project.create({
      name,
      description,
      user: req.user._id,
    });

    res.status(201).json(project);
  }
);

// Get All Projects
export const getProjects = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const projects = await Project.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(projects);
  }
);

// Update Project
export const updateProject = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    project.name = req.body.name || project.name;
    project.description = req.body.description || project.description;

    const updated = await project.save();
    res.json(updated);
  }
);

// Delete Project
export const deleteProject = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    res.json({ message: "Project deleted" });
  }
);