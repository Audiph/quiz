export const API_ENDPOINTS = {
  HEALTH: '/health',
  QUIZ: '/api/quiz',
  GRADE: '/api/grade',
} as const;

export const DEFAULT_REQUEST_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
  },
  cache: 'default' as RequestCache,
} as const;

export const QUIZ_DEFAULTS = {
  QUESTION_LIMIT: 10,
  TIME_LIMIT: 300,
  SHUFFLE_QUESTIONS: true,
  SHUFFLE_CHOICES: true,
} as const;
