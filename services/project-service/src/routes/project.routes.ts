import { Router } from "express";
import { projectController } from "../controllers";
import {
  validateCreateProject,
  validateDownloadProject,
} from "../validations/project.validation";
import { validateRequest } from "../middlewares/validateRequest";

const router = Router();

router.post(
  "/create",
  validateCreateProject,
  validateRequest,
  projectController.createProject
);
router.get(
  "/download/:projectName",
  validateDownloadProject,
  validateRequest,
  projectController.downloadProject
);

export default router;
