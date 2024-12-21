import { Router, Request, Response } from "express";
import { userController } from "../controllers";
import { validateRegistration } from "../validations/user.validation";
import { validateRequest } from "../middlewares/validateRequest";

const router = Router();

router.post(
  "/register",
  validateRegistration,
  validateRequest,
  userController.register
);

export default router;
    