import { describe, expect, it } from 'vitest';
import { ShuffleResult } from '../types/shuffle';
import { reverseMapping, shuffleArray } from '../utils/shuffle';

describe('Shuffling Algorithm', () => {
  describe('Basic Functionality', () => {
    it('should return shuffled array with same length', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(original, 'test-seed');
      expect(shuffled).toHaveLength(original.length);
    });

    it('should contain all original elements', () => {
      const original = ['a', 'b', 'c', 'd', 'e'];
      const shuffled = shuffleArray(original, 'test-seed') as readonly string[];
      expect([...shuffled].sort()).toEqual([...original].sort());
    });

    it('should not modify original array', () => {
      const original = [1, 2, 3, 4, 5];
      const originalCopy = [...original];
      shuffleArray(original, 'test-seed');
      expect(original).toEqual(originalCopy);
    });
  });

  describe('Deterministic Behavior', () => {
    it('should produce same result with same seed', () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const seed = 'deterministic-seed';

      const shuffled1 = shuffleArray(array, seed);
      const shuffled2 = shuffleArray(array, seed);

      expect(shuffled1).toEqual(shuffled2);
    });

    it('should produce different results with different seeds', () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      const shuffled1 = shuffleArray(array, 'seed-1');
      const shuffled2 = shuffleArray(array, 'seed-2');

      expect(shuffled1).not.toEqual(shuffled2);
    });

    it('should consistently shuffle complex objects', () => {
      const questions = [
        { id: 'q1', text: 'Question 1' },
        { id: 'q2', text: 'Question 2' },
        { id: 'q3', text: 'Question 3' },
        { id: 'q4', text: 'Question 4' },
        { id: 'q5', text: 'Question 5' },
      ];

      const seed = 'quiz-seed';
      const shuffled1 = shuffleArray(questions, seed) as typeof questions;
      const shuffled2 = shuffleArray(questions, seed) as typeof questions;

      expect(shuffled1).toEqual(shuffled2);
      expect(shuffled1.map(q => q.id).sort()).toEqual(['q1', 'q2', 'q3', 'q4', 'q5']);
    });
  });

  describe('Mapping Functionality', () => {
    it('should return mapping when requested', () => {
      const original = ['a', 'b', 'c', 'd', 'e'];
      const result = shuffleArray(original, 'test-seed', {
        returnMapping: true,
      }) as ShuffleResult<string>;

      expect(result).toHaveProperty('shuffled');
      expect(result).toHaveProperty('mapping');
      expect(result.shuffled).toHaveLength(original.length);
      expect(result.mapping).toHaveLength(original.length);
    });

    it('should produce valid mapping', () => {
      const original = [10, 20, 30, 40, 50];
      const { shuffled, mapping } = shuffleArray(original, 'test-seed', {
        returnMapping: true,
      }) as ShuffleResult<number>;

      // Verify mapping is correct
      for (let i = 0; i < original.length; i++) {
        const originalIndex = mapping[i];
        expect(shuffled[i]).toBe(original[originalIndex]);
      }
    });

    it('should allow reverse mapping', () => {
      const original = ['a', 'b', 'c', 'd', 'e'];
      const { shuffled, mapping } = shuffleArray(original, 'test-seed', {
        returnMapping: true,
      }) as ShuffleResult<string>;

      // For each position in shuffled array, find original position
      for (let shuffledIdx = 0; shuffledIdx < shuffled.length; shuffledIdx++) {
        const originalIdx = reverseMapping(shuffledIdx, mapping);
        expect(original[originalIdx]).toBe(shuffled[shuffledIdx]);
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty array', () => {
      const result = shuffleArray([], 'test-seed');
      expect(result).toEqual([]);
    });

    it('should handle single element array', () => {
      const result = shuffleArray([42], 'test-seed');
      expect(result).toEqual([42]);
    });

    it('should handle two element array', () => {
      const original = [1, 2];
      const shuffled = shuffleArray(original, 'test-seed');
      expect(shuffled).toHaveLength(2);
      expect(shuffled).toContain(1);
      expect(shuffled).toContain(2);
    });

    it('should handle different seed formats', () => {
      const array = [1, 2, 3, 4, 5];

      const result1 = shuffleArray(array, '');
      const result2 = shuffleArray(array, '123');
      const result3 = shuffleArray(array, 'very-long-seed-with-special-chars!@#$%');

      expect(result1).toHaveLength(5);
      expect(result2).toHaveLength(5);
      expect(result3).toHaveLength(5);
    });

    it('should handle arrays with duplicate values', () => {
      const original = [1, 2, 2, 3, 3, 3];
      const shuffled = shuffleArray(original, 'test-seed') as readonly number[];

      expect([...shuffled].sort()).toEqual([...original].sort());
      expect(shuffled.filter(x => x === 1)).toHaveLength(1);
      expect(shuffled.filter(x => x === 2)).toHaveLength(2);
      expect(shuffled.filter(x => x === 3)).toHaveLength(3);
    });
  });

  describe('Performance', () => {
    it('should efficiently handle large arrays', () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => i);
      const startTime = performance.now();
      const shuffled = shuffleArray(largeArray, 'perf-test');
      const endTime = performance.now();

      expect(shuffled).toHaveLength(1000);
      expect(endTime - startTime).toBeLessThan(100);

      const shuffledArray = shuffled as readonly number[];
      const sorted = [...shuffledArray].sort((a, b) => a - b);
      expect(sorted).toEqual(largeArray);
    });

    it('should maintain determinism with large arrays', () => {
      const largeArray = Array.from({ length: 100 }, (_, i) => i);
      const seed = 'large-array-seed';

      const shuffled1 = shuffleArray(largeArray, seed);
      const shuffled2 = shuffleArray(largeArray, seed);

      expect(shuffled1).toEqual(shuffled2);
    });
  });

  describe('Real-world Scenarios', () => {
    it('should shuffle quiz questions consistently', () => {
      const questions = [
        { id: 'q1', type: 'text' },
        { id: 'q2', type: 'radio' },
        { id: 'q3', type: 'checkbox' },
        { id: 'q4', type: 'text' },
      ];

      const userSeed = 'user-123-quiz-456';
      const shuffled = shuffleArray(questions, userSeed);

      // Same user, same quiz should get same order
      const shuffledAgain = shuffleArray(questions, userSeed);
      expect(shuffled).toEqual(shuffledAgain);
    });

    it('should shuffle answer choices independently', () => {
      const choices = ['Option A', 'Option B', 'Option C', 'Option D'];
      const questionSeed = 'q1-choices';

      const shuffled1 = shuffleArray(choices, questionSeed) as readonly string[];
      const shuffled2 = shuffleArray(choices, questionSeed) as readonly string[];

      expect(shuffled1).toEqual(shuffled2);
      expect([...shuffled1].sort()).toEqual([...choices].sort());
    });
  });
});
