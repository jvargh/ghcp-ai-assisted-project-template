import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { submitResponseSchema } from "../validators/response.js";
import { submitResponse, getSurveyResults } from "../services/response.js";

const router = Router({ mergeParams: true });

router.post(
  "/",
  authenticate,
  validate(submitResponseSchema),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const surveyId = parseInt(String(req.params["id"]), 10);
      const result = submitResponse(surveyId, req.user!.userId, req.body);
      res.status(201).json({ response: result });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/results",
  authenticate,
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const surveyId = parseInt(String(req.params["id"]), 10);
      const results = getSurveyResults(surveyId);
      res.json(results);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
