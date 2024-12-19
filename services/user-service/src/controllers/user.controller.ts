import { Request, Response } from "express";
import { rabbitMQ } from "../services/rabbitmq.service";

const register = async (req: Request, res: Response): Promise<any> => {
  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const queue = process.env.EMAIL_QUEUE || "emailQueue";

    await rabbitMQ.publishToQueue(queue, {
      to: email,
      subject: "Welcome!",
      text: `Hi ${name}, welcome to our platform!`,
    });

    res.status(201).send(`User registered and email request sent for ${email}`);
  } catch (error) {
    console.error("Error handling user registration:", error);
    res.status(500).send("Failed to process the request.");
  }
};

export default { register };
