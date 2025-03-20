import express from "express";
import { protect } from "../middlewares/authMiddleware";
import {
  getRootFolders,
  getFolderById,
  createFolder,
  updateFolder,
  deleteFolder,
} from "../controllers/folderController";

const router = express.Router();

router.use(protect);

router.route("/").get(getRootFolders).post(createFolder);
router.route("/:id").get(getFolderById).put(updateFolder).delete(deleteFolder);

export default router;
