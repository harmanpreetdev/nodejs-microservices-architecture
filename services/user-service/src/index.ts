import express, { Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/user.routes";
import { rabbitMQ } from "./services/rabbitmq.service";

dotenv.config();

const app = express();
const PORT = process.env.PORT || "5001";
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
  res.status(200).json({ message: "User Service is running!" });
});

app.use("/api/users", userRoutes);

app.listen(PORT, async () => {
  console.log(`User Service running on port ${PORT}`);
  await rabbitMQ.connect();
  await connectToDatabase();
});

process.on("SIGINT", async () => {
  console.log("Shutting down User Service...");
  await rabbitMQ.closeConnection();
  process.exit(0);
});
