import { z } from "zod";

export const selectionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1, "Selection text is required"),
});

export const questionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1, "Question text is required"),
  selections: z
    .array(selectionSchema)
    .min(1, "Each question must have at least 1 selection")
    .max(5, "Each question can have at most 5 selections"),
});

export const createSurveySchema = z.object({
  title: z.string().min(1, "Survey title is required"),
  questions: z
    .array(questionSchema)
    .min(1, "Survey must have at least 1 question")
    .max(10, "Survey can have at most 10 questions"),
});

export const submitResponseSchema = z.object({
  surveyId: z.string().min(1),
  answers: z.record(z.string(), z.string()),
});

export type CreateSurveyInput = z.infer<typeof createSurveySchema>;
export type SubmitResponseInput = z.infer<typeof submitResponseSchema>;
