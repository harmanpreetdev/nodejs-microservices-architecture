import { body, param } from "express-validator";

export const validateCreateProject = [
  body("name")
    .notEmpty()
    .withMessage("Project name is required.")
    .isLength({ min: 3 })
    .withMessage("Project name should be at least 3 characters long."),
  body("description")
    .notEmpty()
    .withMessage("Description is required.")
    .isLength({ min: 5 })
    .withMessage("Description should be at least 5 characters long."),
  body("userId").notEmpty().withMessage("User ID is required."),
  body("config")
    .optional()
    .isObject()
    .withMessage("Config should be an object."),
];

export const validateDownloadProject = [
  param("projectName")
    .notEmpty()
    .withMessage("Project name is required.")
    .isAlphanumeric()
    .withMessage("Project name should be alphanumeric."),
];
