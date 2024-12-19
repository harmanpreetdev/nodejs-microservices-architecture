import express, { Request, Response } from "express";
import { connectRabbitMQ } from "./consumer/rabbitmq.consumer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || "5003";

app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "Email Service is running!" });
});

connectRabbitMQ();

app.listen(PORT, () => {
  console.log(`Project Service running on port ${PORT}`);
});
