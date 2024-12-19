import { Router, Request, Response } from "express";
import { userController } from "../controllers";

const router = Router();

router.post("/register", userController.register);

export default router;
