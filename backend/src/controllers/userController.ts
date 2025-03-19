import { Request, Response } from "express";
import { User, IUser } from "../models/userModel";
import { createUserValidator, updateUserValidator } from "../utils/validator";
import { asyncHandler } from "../middlewares/asyncHandler";

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

export const createUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const validatedData = createUserValidator.parse(req.body);
    const user = await User.create(validatedData);
    const token = user.generateToken();

    res.cookie("jwt", token, cookieOptions);
    res.status(201).json({
      success: true,
      data: user,
    });
  }
);

export const loginUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
      return;
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const token = user.generateToken();
    res.cookie("jwt", token, cookieOptions);

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  }
);

export const logoutUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    res.cookie("jwt", "", {
      ...cookieOptions,
      maxAge: 0,
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  }
);

export const getUsers = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const users = await User.find();
    res.status(200).json({
      success: true,
      data: users,
    });
  }
);

export const getUserById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  }
);

export const updateUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const validatedData = updateUserValidator.parse(req.body);
    const user = await User.findByIdAndUpdate(req.params.id, validatedData, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  }
);

export const deleteUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: {},
    });
  }
);
