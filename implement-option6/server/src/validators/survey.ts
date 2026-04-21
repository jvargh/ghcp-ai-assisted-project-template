import { z } from "zod";

const optionSchema = z.object({
  text: z.string().min(1, "Option text is required").max(200),
});

const questionSchema = z.object({
  text: z.string().min(1, "Question text is required").max(500),
  options: z
    .array(optionSchema)
    .min(1, "Each question must have at least 1 option")
    .max(5, "Each question can have at most 5 options"),
});

export const createSurveySchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  questions: z
    .array(questionSchema)
    .min(1, "Survey must have at least 1 question")
    .max(10, "Survey can have at most 10 questions"),
});

export const updateStatusSchema = z.object({
  status: z.enum(["open", "closed"]),
});

export type CreateSurveyInput = z.infer<typeof createSurveySchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
