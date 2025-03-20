import express from "express";
import { protect } from "../middlewares/authMiddleware";
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/noteController";

const router = express.Router();

// Protect all routes
router.use(protect);

router.route("/").get(getNotes).post(createNote);
router.route("/:id").get(getNoteById).post(updateNote).delete(deleteNote);

export default router;
