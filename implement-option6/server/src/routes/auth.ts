import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.js";
import { registerSchema, loginSchema } from "../validators/auth.js";
import { registerUser, loginUser, getCurrentUser } from "../services/auth.js";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await registerUser(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/login",
  validate(loginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await loginUser(req.body);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/me",
  authenticate,
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = getCurrentUser(req.user!.userId);
      res.json({ user });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
