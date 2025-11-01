import { describe, expect, it } from 'vitest';
import { isValidAnswer, validateGradeRequest, validateQuizRequest } from '../utils/validation';

describe('Validation', () => {
  describe('Quiz Request Validation', () => {
    it('should accept valid quiz parameters', () => {
      const result = validateQuizRequest({ limit: 10, seed: 'abc123' });
      expect(result.valid).toBe(true);
    });

    it('should accept missing optional parameters', () => {
      const result = validateQuizRequest({});
      expect(result.valid).toBe(true);
    });

    it('should reject limit below 1', () => {
      const result = validateQuizRequest({ limit: 0 });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('between 1 and 20');
    });

    it('should reject limit above 20', () => {
      const result = validateQuizRequest({ limit: 21 });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('between 1 and 20');
    });

    it('should reject non-integer limit', () => {
      const result = validateQuizRequest({ limit: 10.5 });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('integer');
    });

    it('should accept valid seed', () => {
      const result = validateQuizRequest({ seed: 'test-seed-123' });
      expect(result.valid).toBe(true);
    });
  });

  describe('Grade Request Validation', () => {
    it('should accept valid grade request', () => {
      const result = validateGradeRequest({
        answers: [
          { id: 'q1', value: 'Paris' },
          { id: 'q2', value: 1 },
          { id: 'q3', value: [0, 2] },
        ],
      });
      expect(result.valid).toBe(true);
    });

    it('should reject non-object body', () => {
      const result = validateGradeRequest('invalid');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('must be an object');
    });

    it('should reject null body', () => {
      const result = validateGradeRequest(null);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('must be an object');
    });

    it('should reject missing answers field', () => {
      const result = validateGradeRequest({});
      expect(result.valid).toBe(false);
      expect(result.error).toContain('must be an array');
    });

    it('should reject non-array answers', () => {
      const result = validateGradeRequest({ answers: 'invalid' });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('must be an array');
    });

    it('should reject empty answers array', () => {
      const result = validateGradeRequest({ answers: [] });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('cannot be empty');
    });

    it('should accept optional quizId', () => {
      const result = validateGradeRequest({
        answers: [{ id: 'q1', value: 'test' }],
        quizId: 'abc123',
      });
      expect(result.valid).toBe(true);
    });
  });

  describe('Answer Validation', () => {
    it('should accept text answer', () => {
      const result = isValidAnswer({ id: 'q1', value: 'Paris' });
      expect(result).toBe(true);
    });

    it('should accept number answer', () => {
      const result = isValidAnswer({ id: 'q1', value: 1 });
      expect(result).toBe(true);
    });

    it('should accept array answer', () => {
      const result = isValidAnswer({ id: 'q1', value: [0, 1, 2] });
      expect(result).toBe(true);
    });

    it('should reject answer without id', () => {
      const result = isValidAnswer({ value: 'test' });
      expect(result).toBe(false);
    });

    it('should reject answer with empty id', () => {
      const result = isValidAnswer({ id: '', value: 'test' });
      expect(result).toBe(false);
    });

    it('should reject answer without value', () => {
      const result = isValidAnswer({ id: 'q1' });
      expect(result).toBe(false);
    });

    it('should reject answer with invalid value type', () => {
      const result = isValidAnswer({ id: 'q1', value: true });
      expect(result).toBe(false);
    });

    it('should reject array with non-number values', () => {
      const result = isValidAnswer({ id: 'q1', value: ['a', 'b'] });
      expect(result).toBe(false);
    });

    it('should reject non-object answer', () => {
      const result = isValidAnswer('invalid');
      expect(result).toBe(false);
    });

    it('should reject null answer', () => {
      const result = isValidAnswer(null);
      expect(result).toBe(false);
    });
  });

  describe('Complex Validation Scenarios', () => {
    it('should validate multiple valid answers', () => {
      const result = validateGradeRequest({
        answers: [
          { id: 'q1', value: 'text answer' },
          { id: 'q2', value: 0 },
          { id: 'q3', value: [1, 2, 3] },
          { id: 'q4', value: 'another text' },
          { id: 'q5', value: 42 },
        ],
      });
      expect(result.valid).toBe(true);
    });

    it('should reject if any answer is invalid', () => {
      const result = validateGradeRequest({
        answers: [
          { id: 'q1', value: 'valid' },
          { id: 'q2', value: true },
          { id: 'q3', value: 'valid' },
        ],
      });
      expect(result.valid).toBe(false);
    });

    it('should provide specific error for invalid answer', () => {
      const result = validateGradeRequest({
        answers: [
          { id: 'q1', value: 'valid' },
          { id: 'q2', value: { nested: 'object' } },
        ],
      });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('q2');
    });

    it('should handle mixed valid answer types', () => {
      const result = validateGradeRequest({
        answers: [
          { id: 'text-q', value: 'Some text answer' },
          { id: 'radio-q', value: 3 },
          { id: 'checkbox-q', value: [0, 1, 4, 7] },
          { id: 'number-as-string', value: '42' },
          { id: 'empty-checkbox', value: [] },
        ],
      });
      expect(result.valid).toBe(true);
    });
  });
});
