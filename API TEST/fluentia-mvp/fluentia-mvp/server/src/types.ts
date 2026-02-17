import { z } from "zod";

export const evaluationSchema = z.object({
  grammar: z.number().int().min(0).max(5),
  vocabulary: z.number().int().min(0).max(5),
  fluency: z.number().int().min(0).max(5),
  taskCompletion: z.number().int().min(0).max(5),
  cefr: z.enum(["A1", "A2", "B1", "B2", "C1"]),
  feedbackBullets: z.array(z.string()).min(2).max(3),
  evidence: z.array(
    z.object({
      mistakeQuote: z.string(),
      correction: z.string()
    })
  ),
  wordBank: z.array(z.string()),
  nextExercise: z.string()
});

export type EvaluationJSON = z.infer<typeof evaluationSchema>;
