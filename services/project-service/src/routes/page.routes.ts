import { Router } from "express";
import { pageController } from "../controllers";
import { validateCreatePage } from "../validations/page.validation";
import { validateRequest } from "../middlewares/validateRequest";

const router = Router();

router.post(
  "/create",
  validateCreatePage,
  validateRequest,
  pageController.createPage
);

export default router;
