import type { Answer, QuestionResult } from '../types/api';
import type { Question } from '../types/quiz';
import { isCheckboxQuestion, isRadioQuestion, isTextQuestion } from '../types/quiz';

export function gradeAnswers(
  answers: Answer[],
  questionsMap: Map<string, Question>,
): QuestionResult[] {
  return answers.map(answer => {
    const question = questionsMap.get(answer.id);

    if (!question) {
      return {
        id: answer.id,
        correct: false,
      };
    }

    const correct = gradeAnswer(answer, question);

    return {
      id: answer.id,
      correct,
    };
  });
}

function gradeAnswer(answer: Answer, question: Question): boolean {
  if (isTextQuestion(question)) {
    return gradeTextAnswer(answer.value, question.correctText, question.caseSensitive);
  }

  if (isRadioQuestion(question)) {
    return gradeRadioAnswer(answer.value, question.correctIndex);
  }

  if (isCheckboxQuestion(question)) {
    return gradeCheckboxAnswer(answer.value, question.correctIndexes);
  }

  return false;
}

function gradeTextAnswer(
  userAnswer: string | number | number[],
  correctAnswer: string,
  caseSensitive = false,
): boolean {
  if (typeof userAnswer !== 'string') {
    if (typeof userAnswer === 'number') {
      userAnswer = userAnswer.toString();
    } else {
      return false;
    }
  }

  const normalizedUser = caseSensitive ? userAnswer.trim() : userAnswer.trim().toLowerCase();
  const normalizedCorrect = caseSensitive
    ? correctAnswer.trim()
    : correctAnswer.trim().toLowerCase();

  return normalizedUser === normalizedCorrect;
}

function gradeRadioAnswer(userAnswer: string | number | number[], correctIndex: number): boolean {
  return userAnswer === correctIndex;
}

function gradeCheckboxAnswer(
  userAnswer: string | number | number[],
  correctIndexes: number[],
): boolean {
  if (!Array.isArray(userAnswer)) {
    return false;
  }

  const sortedUser = [...userAnswer].sort((a, b) => a - b);
  const sortedCorrect = [...correctIndexes].sort((a, b) => a - b);

  if (sortedUser.length !== sortedCorrect.length) {
    return false;
  }

  return sortedUser.every((val, index) => val === sortedCorrect[index]);
}

export function calculateScore(results: QuestionResult[]): {
  score: number;
  total: number;
  percentage: number;
} {
  const score = results.filter(r => r.correct).length;
  const total = results.length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  return { score, total, percentage };
}
