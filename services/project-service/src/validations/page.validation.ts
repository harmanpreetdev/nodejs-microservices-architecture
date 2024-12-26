import { body } from "express-validator";

export const validateCreatePage = [
  body("projectName")
    .isString()
    .notEmpty()
    .withMessage("Project name is required."),
  body("pageName").isString().notEmpty().withMessage("Page name is required."),
  body("content")
    .optional()
    .isString()
    .withMessage("Content should be a string."),
];
