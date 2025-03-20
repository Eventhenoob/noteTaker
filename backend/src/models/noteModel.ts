import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./userModel";
import { IFolder } from "./folderModel";

export interface INote extends Document {
  user: IUser["_id"];
  title: string;
  content: string;
  parentFolder: IFolder["_id"] | null;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    parentFolder: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
  },
  { timestamps: true }
);

// Index for faster queries
noteSchema.index({ user: 1, title: 1 });

// Ensure unique note titles for each user
noteSchema.index({ user: 1, title: 1 }, { unique: true });

export const Note = mongoose.model<INote>("Note", noteSchema);
