import { z } from "zod";

const answerSchema = z.object({
  questionId: z.number().int().positive(),
  optionId: z.number().int().positive(),
});

export const submitResponseSchema = z.object({
  answers: z.array(answerSchema).min(1, "At least one answer is required"),
});

export type SubmitResponseInput = z.infer<typeof submitResponseSchema>;
