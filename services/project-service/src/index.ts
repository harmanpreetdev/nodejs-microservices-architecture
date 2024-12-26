import express, { Request, Response } from "express";
import dotenv from "dotenv";
import unifiedRoutes from "./routes";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT || "5002";
const MONGO_URI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mongodb:27017/?authSource=admin`;

app.use(express.json());

const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "Project Service is running!" });
});

app.use("/api", unifiedRoutes);

app.listen(PORT, async () => {
  console.log(`Project Service running on port ${PORT}`);
  await connectToDatabase();
});
