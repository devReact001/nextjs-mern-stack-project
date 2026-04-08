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
  },
);

// Get All Projects
export const getProjects = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 3 } = req.query;

    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    };

    const skip = (page - 1) * limit;

    const projects = await Project.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Project.countDocuments(query);

    res.json({
      data: projects,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
  },
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
  },
);
