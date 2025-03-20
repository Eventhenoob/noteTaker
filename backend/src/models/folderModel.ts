import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./userModel";

export interface IFolder extends Document {
  user: IUser["_id"];
  name: string;
  files: string[];
  createdAt: Date;
  updatedAt: Date;
}

const folderSchema = new Schema<IFolder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    name: {
      type: String,
      required: [true, "Folder name is required"],
      trim: true,
    },
    files: [
      {
        type: String,
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Ensure unique folder names for each user
folderSchema.index({ user: 1, name: 1 }, { unique: true });

export const Folder = mongoose.model<IFolder>("Folder", folderSchema);
