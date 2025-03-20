import { Request, Response } from "express";
import { Note } from "../models/noteModel";
import { asyncHandler } from "../middlewares/asyncHandler";
import { Folder } from "../models/folderModel";

// Get all notes for the authenticated user
export const getNotes = asyncHandler(async (req: Request, res: Response) => {
  const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(notes);
});

// Get a single note by ID
export const getNoteById = asyncHandler(async (req: Request, res: Response) => {
  const note = await Note.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }

  res.json(note);
});

// Create a new note
export const createNote = asyncHandler(async (req: Request, res: Response) => {
  const { title, content, parentFolder } = req.body;

  // If parentFolder is provided, verify it exists and belongs to the user
  if (parentFolder) {
    const folder = await Folder.findOne({
      _id: parentFolder,
      user: req.user._id,
    });

    if (!folder) {
      res.status(404);
      throw new Error("Parent folder not found or access denied");
    }
  }

  const note = await Note.create({
    user: req.user._id,
    title,
    content,
    parentFolder,
  });

  // If note has a parent folder, add note to folder's files array
  if (parentFolder) {
    await Folder.findByIdAndUpdate(parentFolder, {
      $push: { files: note._id },
    });
  }

  res.status(201).json(note);
});

// Update a note
export const updateNote = asyncHandler(async (req: Request, res: Response) => {
  const { title, content, parentFolder } = req.body;

  const note = await Note.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }

  // If parentFolder is provided and different from current, verify it exists
  if (parentFolder && parentFolder !== note.parentFolder?.toString()) {
    const folder = await Folder.findOne({
      _id: parentFolder,
      user: req.user._id,
    });

    if (!folder) {
      res.status(404);
      throw new Error("Parent folder not found or access denied");
    }

    // Remove note from old folder's files array if it had a parent
    if (note.parentFolder) {
      await Folder.findByIdAndUpdate(note.parentFolder, {
        $pull: { files: note._id },
      });
    }

    // Add note to new folder's files array
    await Folder.findByIdAndUpdate(parentFolder, {
      $push: { files: note._id },
    });
  } else if (!parentFolder) {
    if (note.parentFolder) {
      await Folder.findByIdAndUpdate(note.parentFolder, {
        $pull: { files: note._id },
      });
    }
  }
  note.title = title || note.title;
  note.content = content || note.content;
  note.parentFolder = parentFolder;

  const updatedNote = await note.save();
  res.json(updatedNote);
});

// Delete a note
export const deleteNote = asyncHandler(async (req: Request, res: Response) => {
  const note = await Note.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }

  // If note has a parent folder, remove note from folder's files array
  if (note.parentFolder) {
    await Folder.findByIdAndUpdate(note.parentFolder, {
      $pull: { files: note._id },
    });
  }

  // Delete the note
  await note.deleteOne();

  res.json({ message: "Note deleted successfully" });
});
