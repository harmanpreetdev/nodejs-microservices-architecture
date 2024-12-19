import express, { Request, Response } from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes";
import { rabbitMQ } from "./services/rabbitmq.service";

dotenv.config();

const app = express();
const PORT = process.env.PORT || "5001";

app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "User Service is running!" });
});

app.use("/api/users", userRoutes);

app.listen(PORT, async () => {
  console.log(`User Service running on port ${PORT}`);
  await rabbitMQ.connect();
});

process.on("SIGINT", async () => {
  console.log("Shutting down User Service...");
  await rabbitMQ.closeConnection();
  process.exit(0);
});
