import type { Answer, GradeRequest } from '../types/api';
import { JsonValue, UnvalidatedInput, ValidationResult } from '../types/validation';

export function validateQuizRequest(params: { limit?: number; seed?: string }): ValidationResult {
  if (params.limit && (!Number.isInteger(params.limit) || params.limit < 1 || params.limit > 20)) {
    return { valid: false, error: 'Limit must be an integer between 1 and 20' };
  }

  return { valid: true };
}

export function validateGradeRequest(body: UnvalidatedInput): ValidationResult {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be an object' };
  }

  const request = body as Partial<GradeRequest>;

  if (!Array.isArray(request.answers)) {
    return { valid: false, error: 'Answers must be an array' };
  }

  if (request.answers.length === 0) {
    return { valid: false, error: 'Answers array cannot be empty' };
  }

  for (const answer of request.answers) {
    const untrustedAnswer = answer as object as UnvalidatedInput;
    const validation = validateAnswer(untrustedAnswer);
    if (!validation.valid) {
      return validation;
    }
  }

  return { valid: true };
}

function validateAnswer(answer: UnvalidatedInput): ValidationResult {
  if (!answer || typeof answer !== 'object') {
    return { valid: false, error: 'Each answer must be an object' };
  }

  const a = answer as Partial<Answer>;

  if (typeof a.id !== 'string' || !a.id) {
    return { valid: false, error: `Invalid or missing id in answer` };
  }

  const valueType = typeof a.value;

  if (valueType === 'string' || valueType === 'number') {
    return { valid: true };
  }

  if (Array.isArray(a.value)) {
    if (!a.value.every(v => typeof v === 'number')) {
      return {
        valid: false,
        error: `Answer for question ${a.id}: array values must be numbers`,
      };
    }
    return { valid: true };
  }

  return {
    valid: false,
    error: `Answer for question ${a.id}: value must be string, number, or number array`,
  };
}

export function isValidAnswer(answer: JsonValue | undefined): boolean {
  return validateAnswer(answer as UnvalidatedInput).valid;
}
