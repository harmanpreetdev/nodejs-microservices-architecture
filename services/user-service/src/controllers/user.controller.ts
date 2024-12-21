import { Request, Response } from "express";
import { rabbitMQ } from "../services/rabbitmq.service";
import User from "../models/user.model";

const register = async (req: Request, res: Response): Promise<any> => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already in use." });
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();
    const queue = process.env.EMAIL_QUEUE || "emailQueue";
    await rabbitMQ.publishToQueue(queue, {
      to: email,
      subject: "Welcome!",
      text: `Hi ${name}, welcome to our platform!`,
    });
    res.status(201).json({
      msg: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error handling user registration:", error);
    res.status(500).send("Failed to process the request.");
  }
};

export default { register };
