import { Router } from "express";
import projectRoutes from "./project.routes";
import pageRoutes from "./page.routes";

const router = Router();

router.use("/projects", projectRoutes);
router.use("/pages", pageRoutes);

export default router;
