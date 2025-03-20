import { Request, Response } from "express";
import { Note } from "../models/noteModel";
import { asyncHandler } from "../middlewares/asyncHandler";

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
  const { title, content } = req.body;

  const note = await Note.create({
    user: req.user._id,
    title,
    content,
  });

  res.status(201).json(note);
});

// Update a note
export const updateNote = asyncHandler(async (req: Request, res: Response) => {
  const { title, content } = req.body;

  const note = await Note.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }

  note.title = title || note.title;
  note.content = content || note.content;

  const updatedNote = await note.save();
  res.json(updatedNote);
});

// Delete a note
export const deleteNote = asyncHandler(async (req: Request, res: Response) => {
  const note = await Note.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }

  res.json({ message: "Note deleted successfully" });
});
