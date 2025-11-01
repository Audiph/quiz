import { z } from 'zod';

export const quizConfigSchema = z.object({
  limit: z.number().min(8).max(12).default(10),
  timeLimit: z.number().min(60).max(600).default(300),
  shuffle: z.boolean().default(true),
});

export const answerSchema = z.object({
  id: z.string().min(1, 'Question ID is required'),
  value: z.union([
    z.string().min(1, 'Answer cannot be empty'),
    z.number().int().min(0),
    z.array(z.number().int().min(0)).min(1, 'Select at least one option'),
  ]),
});

export const quizSubmissionSchema = z.object({
  quizId: z.string().min(1, 'Quiz ID is required'),
  answers: z.array(answerSchema).min(1, 'At least one answer is required'),
});

export const quizStartSchema = z.object({
  questionLimit: z.coerce.number().min(8).max(12).default(10),
  timeLimit: z.coerce.number().min(60).max(600).default(300),
  shuffleQuestions: z.boolean().default(true),
});

export type QuizConfig = z.infer<typeof quizConfigSchema>;
export type Answer = z.infer<typeof answerSchema>;
export type QuizSubmission = z.infer<typeof quizSubmissionSchema>;
export type QuizStart = z.infer<typeof quizStartSchema>;