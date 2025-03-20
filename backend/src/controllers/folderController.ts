import { Request, Response } from "express";
import { Folder } from "../models/folderModel";
import { Note } from "../models/noteModel";
import { asyncHandler } from "../middlewares/asyncHandler";

// Get all folders for the authenticated user
export const getRootFolders = asyncHandler(
  async (req: Request, res: Response) => {
    const folders = await Folder.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });
    res.json(folders);
  }
);

// Get folder by ID
export const getFolderById = asyncHandler(
  async (req: Request, res: Response) => {
    const folder = await Folder.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!folder) {
      res.status(404);
      throw new Error("Folder not found");
    }

    res.json(folder);
  }
);

// Create a new folder
export const createFolder = asyncHandler(
  async (req: Request, res: Response) => {
    const { name } = req.body;

    // Check if folder with same name already exists for this user
    const existingFolder = await Folder.findOne({
      user: req.user._id,
      name,
    });

    if (existingFolder) {
      res.status(400);
      throw new Error("A folder with this name already exists");
    }

    const folder = await Folder.create({
      user: req.user._id,
      name,
    });

    res.status(201).json(folder);
  }
);

// Update a folder
export const updateFolder = asyncHandler(
  async (req: Request, res: Response) => {
    const { name } = req.body;

    const folder = await Folder.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!folder) {
      res.status(404);
      throw new Error("Folder not found");
    }

    // Check if new name conflicts with existing folder
    if (name && name !== folder.name) {
      const existingFolder = await Folder.findOne({
        user: req.user._id,
        name,
        _id: { $ne: folder._id },
      });

      if (existingFolder) {
        res.status(400);
        throw new Error("A folder with this name already exists");
      }

      folder.name = name;
    }

    const updatedFolder = await folder.save();
    res.json(updatedFolder);
  }
);

// Delete a folder
export const deleteFolder = asyncHandler(
  async (req: Request, res: Response) => {
    const folder = await Folder.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!folder) {
      res.status(404);
      throw new Error("Folder not found");
    }

    // Delete all notes in this folder first
    await Note.deleteMany({
      parentFolder: folder._id,
      user: req.user._id,
    });

    await folder.deleteOne();
    res.json({ message: "Folder and associated notes deleted successfully" });
  }
);
