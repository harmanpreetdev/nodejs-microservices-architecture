import { body } from "express-validator";

export const validateCreatePage = [
  body("projectId")
    .notEmpty()
    .withMessage("Project ID is required.")
    .isMongoId()
    .withMessage("Project ID must be a valid MongoDB ObjectId."),
  body("projectName")
    .isString()
    .notEmpty()
    .withMessage("Project name is required.")
    .isLength({ max: 100 })
    .withMessage("Project name cannot exceed 100 characters."),
  body("pageName")
    .isString()
    .notEmpty()
    .withMessage("Page name is required.")
    .isLength({ min: 3, max: 50 })
    .withMessage("Page name must be between 3 and 50 characters."),
  body("route")
    .notEmpty()
    .withMessage("Route is required.")
    .matches(/^\/[a-zA-Z0-9-_\/]*$/)
    .withMessage("Route must be a valid URL path starting with '/'"),
  body("title")
    .isString()
    .notEmpty()
    .withMessage("Title is required.")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters."),
  body("description")
    .optional()
    .isString()
    .withMessage("Description should be a string.")
    .isLength({ max: 300 })
    .withMessage("Description cannot exceed 300 characters."),
  body("content")
    .optional()
    .isString()
    .withMessage("Content should be a string."),
];
