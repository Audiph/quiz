import { ErrorResponse, GradeResponse, isErrorResponse } from '../types/api';

export function calculatePercentage(gradeResponse: GradeResponse | ErrorResponse): number | null {
  if (isErrorResponse(gradeResponse)) {
    return null;
  }

  if (gradeResponse.total === 0) {
    return 0;
  }

  return Math.round((gradeResponse.score / gradeResponse.total) * 100);
}
