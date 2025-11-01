export enum ApiMethod {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
}

export type QuestionType = 'text' | 'checkbox' | 'radio';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  question: string;
}

export interface ClientTextQuestion extends BaseQuestion {
  type: 'text';
}

export interface ClientRadioQuestion extends BaseQuestion {
  type: 'radio';
  choices: string[];
}

export interface ClientCheckboxQuestion extends BaseQuestion {
  type: 'checkbox';
  choices: string[];
}

export type ClientQuestion = ClientTextQuestion | ClientRadioQuestion | ClientCheckboxQuestion;

export interface QuizConfig {
  timeLimit?: number;
  shuffleQuestions?: boolean;
  shuffleChoices?: boolean;
  seed?: string;
}

export interface GetQuizResponse {
  questions: ClientQuestion[];
  config: QuizConfig;
  quizId: string;
}

export interface Answer {
  id: string;
  value: string | number | number[];
}

export interface GradeRequest {
  answers: Answer[];
  quizId?: string;
}

export interface QuestionResult {
  id: string;
  correct: boolean;
}

export interface GradeResponse {
  score: number;
  total: number;
  results: QuestionResult[];
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: string | Record<string, string | number | boolean>;
}

export interface HealthResponse {
  status: string;
  timestamp: number;
}

export function isErrorResponse(response: object | null | undefined): response is ErrorResponse {
  return (
    response !== null &&
    response !== undefined &&
    typeof response === 'object' &&
    'error' in response &&
    'message' in response
  );
}

export function isTextQuestion(question: ClientQuestion): question is ClientTextQuestion {
  return question.type === 'text';
}

export function isRadioQuestion(question: ClientQuestion): question is ClientRadioQuestion {
  return question.type === 'radio';
}

export function isCheckboxQuestion(question: ClientQuestion): question is ClientCheckboxQuestion {
  return question.type === 'checkbox';
}
