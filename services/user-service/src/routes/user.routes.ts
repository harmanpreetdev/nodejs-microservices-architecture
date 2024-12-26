import { Router, Request, Response } from "express";
import { userController } from "../controllers";
import {
  validateLogin,
  validateRegistration,
} from "../validations/user.validation";
import { validateRequest } from "../middlewares/validateRequest";

const router = Router();

router.post(
  "/register",
  validateRegistration,
  validateRequest,
  userController.register
);

router.post("/login", validateLogin, validateRequest, userController.login);

export default router;
