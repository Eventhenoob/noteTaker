import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./userModel";

export interface INote extends Document {
  user: IUser["_id"];
  title: string;
  content: string;
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
  },
  { timestamps: true }
);

// Index for faster queries
noteSchema.index({ user: 1, title: 1 });

export const Note = mongoose.model<INote>("Note", noteSchema);
