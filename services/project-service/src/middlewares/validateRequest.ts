import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

// Middleware to handle validation errors
export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};