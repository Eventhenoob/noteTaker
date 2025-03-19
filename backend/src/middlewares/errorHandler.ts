import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { MongoError } from "mongodb";

type MongoServerError = MongoError & {
  code?: number;
  keyValue?: Record<string, any>;
};

interface CustomError extends Error {
  statusCode?: number;
  code?: number | string;
  keyValue?: Record<string, any>;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    statusCode = 400;
    message = err.errors.map((error) => error.message).join(", ");
  }

  // Handle MongoDB Errors
  if (err instanceof MongoError) {
    const mongoError = err as MongoServerError;
    if (mongoError.code === 11000) {
      statusCode = 409;
      const field = Object.keys(mongoError.keyValue || {})[0];
      message = `Duplicate value for ${field}. This ${field} already exists.`;
    }
  }

  // Handle Mongoose Validation Errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err as any)
      .map((val: any) => val.message)
      .join(", ");
  }

  // Handle Cast Errors (Invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
