import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
import { createSurveySchema, updateStatusSchema } from "../validators/survey.js";
import {
  listSurveys,
  getSurvey,
  createSurvey,
  updateSurveyStatus,
} from "../services/survey.js";

const router = Router();

router.get(
  "/",
  authenticate,
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const status = req.query["status"] as string | undefined;
      const surveyList = listSurveys(status, req.user!.role);
      res.json({ surveys: surveyList });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/",
  authenticate,
  authorize("coordinator"),
  validate(createSurveySchema),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const survey = createSurvey(req.body, req.user!.userId);
      res.status(201).json({ survey });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/:id",
  authenticate,
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const surveyId = parseInt(String(req.params["id"]), 10);
      const survey = getSurvey(surveyId, req.user!.role);
      res.json({ survey });
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("coordinator"),
  validate(updateStatusSchema),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const surveyId = parseInt(String(req.params["id"]), 10);
      const survey = updateSurveyStatus(surveyId, req.body);
      res.json({ survey });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
