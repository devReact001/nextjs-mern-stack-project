import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Project from "../models/Project";

interface AuthRequest extends Request {
  user?: any;
}

// Create Project — any logged-in user can create
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
  },
);

// Get All Projects — return all projects (no user filter)
export const getProjects = async (req: Request, res: Response) => {
  try {
    const { search = "", page = 1, limit = 3 } = req.query;

    const query: Record<string, any> = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    };

    const skip = (Number(page) - 1) * Number(limit);

    const projects = await Project.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Project.countDocuments(query);

    res.json({
      data: projects,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Project by ID
export const getProjectById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    res.json(project);
  },
);

// Update Project — any logged-in user can update
export const updateProject = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    project.name = req.body.name || project.name;
    project.description = req.body.description || project.description;

    const updated = await project.save();
    res.json(updated);
  },
);

// Delete Project — any logged-in user can delete
export const deleteProject = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    res.json({ message: "Project deleted" });
  },
);