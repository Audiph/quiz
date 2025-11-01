import { Question, QuizConfig } from './quiz';

export interface GetQuizResponse {
  questions: Omit<Question, 'correctText' | 'correctIndex' | 'correctIndexes'>[];
  config: QuizConfig;
  quizId: string;
}

export interface GradeRequest {
  answers: Answer[];
  quizId?: string;
}

export interface Answer {
  id: string;
  value: string | number | number[];
}

export interface GradeResponse {
  score: number;
  total: number;
  results: QuestionResult[];
}

export interface QuestionResult {
  id: string;
  correct: boolean;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: string | Record<string, string | number | boolean>;
}

export type ClientQuestion = Omit<Question, 'correctText' | 'correctIndex' | 'correctIndexes'> & {
  choices?: string[];
};
