import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || "5002";

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Project Service is running!' });
});


app.listen(PORT, () => {
  console.log(`Project Service running on port ${PORT}`);
});
