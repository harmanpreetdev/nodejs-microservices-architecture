import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || "5001";

app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "User Service is running!" });
});

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
