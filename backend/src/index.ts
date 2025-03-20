import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/connectDb";
import userRoutes from "./routes/userRoute";
import folderRoutes from "./routes/folderRoutes";
import noteRoutes from "./routes/noteRoute";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/notes", noteRoutes);

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// Global error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
