import { API_ENDPOINTS } from '../config/api';
import {
  Answer,
  ErrorResponse,
  GetQuizResponse,
  GradeRequest,
  GradeResponse,
  HealthResponse,
} from '../types/api';
import { getApi, postApi } from './utils';

export async function fetchQuiz(options?: {
  limit?: number;
  seed?: string;
  shuffle?: boolean;
  timeLimit?: number;
}): Promise<GetQuizResponse | ErrorResponse> {
  const params: Record<string, string | number | boolean> = {};

  if (options?.limit) {
    params.limit = String(options.limit);
  }
  if (options?.seed) {
    params.seed = options.seed;
  }
  if (options?.shuffle) {
    params.shuffle = String(options.shuffle);
  }
  if (options?.timeLimit) {
    params.timeLimit = String(options.timeLimit);
  }

  return getApi<GetQuizResponse>({
    path: API_ENDPOINTS.QUIZ,
    params: Object.keys(params).length > 0 ? params : undefined,
  });
}

export async function submitQuizAnswers(
  request: GradeRequest,
): Promise<GradeResponse | ErrorResponse> {
  return postApi<GradeResponse>({
    path: API_ENDPOINTS.GRADE,
    body: request,
  });
}

export async function gradeQuiz(
  answers: Answer[],
  quizId?: string,
): Promise<GradeResponse | ErrorResponse> {
  return submitQuizAnswers({ answers, quizId });
}

export async function checkApiHealth(): Promise<HealthResponse | ErrorResponse> {
  return getApi<HealthResponse>({
    path: API_ENDPOINTS.HEALTH,
  });
}
