import { describe, expect, it } from 'vitest';
import type { Answer, QuestionResult } from '../types/api';
import type { Question } from '../types/quiz';
import { calculateScore, gradeAnswers } from '../utils/grading';

describe('Grading Logic', () => {
  const mockQuestions = new Map<string, Question>([
    [
      'q1',
      {
        id: 'q1',
        type: 'text',
        question: 'Capital of France?',
        correctText: 'Paris',
        caseSensitive: false,
      },
    ],
    [
      'q2',
      {
        id: 'q2',
        type: 'text',
        question: 'Chemical symbol for gold?',
        correctText: 'Au',
        caseSensitive: true,
      },
    ],
    [
      'q3',
      {
        id: 'q3',
        type: 'radio',
        question: 'Largest planet?',
        choices: ['Earth', 'Jupiter', 'Saturn', 'Mars'],
        correctIndex: 1,
      },
    ],
    [
      'q4',
      {
        id: 'q4',
        type: 'checkbox',
        question: 'Primary colors?',
        choices: ['Red', 'Green', 'Blue', 'Yellow', 'Purple'],
        correctIndexes: [0, 2, 3],
      },
    ],
  ]);

  describe('Text Questions', () => {
    it('should grade case-insensitive text answers correctly', () => {
      const answers: Answer[] = [{ id: 'q1', value: 'paris' }];
      const results = gradeAnswers(answers, mockQuestions);
      expect(results[0].correct).toBe(true);
    });

    it('should grade case-sensitive text answers correctly', () => {
      const answers: Answer[] = [{ id: 'q2', value: 'au' }];
      const results = gradeAnswers(answers, mockQuestions);
      expect(results[0].correct).toBe(false);
    });

    it('should accept correct case-sensitive answer', () => {
      const answers: Answer[] = [{ id: 'q2', value: 'Au' }];
      const results = gradeAnswers(answers, mockQuestions);
      expect(results[0].correct).toBe(true);
    });

    it('should trim whitespace from text answers', () => {
      const answers: Answer[] = [{ id: 'q1', value: '  Paris  ' }];
      const results = gradeAnswers(answers, mockQuestions);
      expect(results[0].correct).toBe(true);
    });

    it('should convert number answers to string for text questions', () => {
      const answers: Answer[] = [{ id: 'q1', value: '1945' }];
      const results = gradeAnswers(answers, mockQuestions);
      expect(results[0].correct).toBe(false); // Wrong answer
    });
  });

  describe('Radio Questions', () => {
    it('should grade correct radio answers', () => {
      const answers: Answer[] = [{ id: 'q3', value: 1 }];
      const results = gradeAnswers(answers, mockQuestions);
      expect(results[0].correct).toBe(true);
    });

    it('should grade incorrect radio answers', () => {
      const answers: Answer[] = [{ id: 'q3', value: 0 }];
      const results = gradeAnswers(answers, mockQuestions);
      expect(results[0].correct).toBe(false);
    });

    it('should reject string values for radio questions', () => {
      const answers: Answer[] = [{ id: 'q3', value: '1' }];
      const results = gradeAnswers(answers, mockQuestions);
      expect(results[0].correct).toBe(false);
    });
  });

  describe('Checkbox Questions', () => {
    it('should grade correct checkbox answers', () => {
      const answers: Answer[] = [{ id: 'q4', value: [0, 2, 3] }];
      const results = gradeAnswers(answers, mockQuestions);
      expect(results[0].correct).toBe(true);
    });

    it('should accept checkbox answers in different order', () => {
      const answers: Answer[] = [{ id: 'q4', value: [3, 0, 2] }];
      const results = gradeAnswers(answers, mockQuestions);
      expect(results[0].correct).toBe(true);
    });

    it('should reject incomplete checkbox answers', () => {
      const answers: Answer[] = [{ id: 'q4', value: [0, 2] }];
      const results = gradeAnswers(answers, mockQuestions);
      expect(results[0].correct).toBe(false);
    });

    it('should reject checkbox answers with extra selections', () => {
      const answers: Answer[] = [{ id: 'q4', value: [0, 1, 2, 3] }];
      const results = gradeAnswers(answers, mockQuestions);
      expect(results[0].correct).toBe(false);
    });

    it('should reject non-array values for checkbox questions', () => {
      const answers: Answer[] = [{ id: 'q4', value: 0 }];
      const results = gradeAnswers(answers, mockQuestions);
      expect(results[0].correct).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing questions', () => {
      const answers: Answer[] = [{ id: 'q999', value: 'test' }];
      const results = gradeAnswers(answers, mockQuestions);
      expect(results[0].correct).toBe(false);
      expect(results[0].id).toBe('q999');
    });

    it('should handle empty answers array', () => {
      const answers: Answer[] = [];
      const results = gradeAnswers(answers, mockQuestions);
      expect(results).toHaveLength(0);
    });

    it('should handle multiple answers', () => {
      const answers: Answer[] = [
        { id: 'q1', value: 'Paris' },
        { id: 'q2', value: 'Au' },
        { id: 'q3', value: 1 },
        { id: 'q4', value: [0, 2, 3] },
      ];
      const results = gradeAnswers(answers, mockQuestions);
      expect(results).toHaveLength(4);
      expect(results.every(r => r.correct)).toBe(true);
    });

    it('should handle all incorrect answers', () => {
      const answers: Answer[] = [
        { id: 'q1', value: 'London' },
        { id: 'q2', value: 'AG' },
        { id: 'q3', value: 0 },
        { id: 'q4', value: [1, 4] },
      ];
      const results = gradeAnswers(answers, mockQuestions);
      expect(results).toHaveLength(4);
      expect(results.every(r => !r.correct)).toBe(true);
    });
  });

  describe('Score Calculation', () => {
    it('should calculate perfect score', () => {
      const results: QuestionResult[] = [
        { id: 'q1', correct: true },
        { id: 'q2', correct: true },
        { id: 'q3', correct: true },
      ];
      const { score, total, percentage } = calculateScore(results);
      expect(score).toBe(3);
      expect(total).toBe(3);
      expect(percentage).toBe(100);
    });

    it('should calculate partial score', () => {
      const results: QuestionResult[] = [
        { id: 'q1', correct: true },
        { id: 'q2', correct: false },
        { id: 'q3', correct: true },
        { id: 'q4', correct: false },
      ];
      const { score, total, percentage } = calculateScore(results);
      expect(score).toBe(2);
      expect(total).toBe(4);
      expect(percentage).toBe(50);
    });

    it('should calculate zero score', () => {
      const results: QuestionResult[] = [
        { id: 'q1', correct: false },
        { id: 'q2', correct: false },
      ];
      const { score, total, percentage } = calculateScore(results);
      expect(score).toBe(0);
      expect(total).toBe(2);
      expect(percentage).toBe(0);
    });

    it('should handle empty results', () => {
      const results: QuestionResult[] = [];
      const { score, total, percentage } = calculateScore(results);
      expect(score).toBe(0);
      expect(total).toBe(0);
      expect(percentage).toBe(0);
    });
  });
});
