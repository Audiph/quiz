import { Hono } from 'hono';
import { getQuestions } from '../data/questions';
import type { ClientQuestion, GetQuizResponse } from '../types/api';
import type { Question } from '../types/quiz';
import { isCheckboxQuestion, isRadioQuestion } from '../types/quiz';
import { shuffleArray } from '../utils/shuffle';
import { validateQuizRequest } from '../utils/validation';

const quiz = new Hono();

quiz.get('/', c => {
  try {
    const limitParam = c.req.query('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 10;
    const seed = c.req.query('seed') || Date.now().toString();
    const shuffleQuestions = c.req.query('shuffle') !== 'false';
    const timeLimitParam = c.req.query('timeLimit');
    const timeLimit = timeLimitParam ? parseInt(timeLimitParam, 10) : 300;

    const validation = validateQuizRequest({ limit, seed });
    if (!validation.valid) {
      return c.json({ error: 'Invalid parameters', message: validation.error }, 400);
    }

    const allQuestions = getQuestions();

    const shuffledQuestions = shuffleQuestions
      ? (shuffleArray(allQuestions, seed) as Question[])
      : allQuestions;

    const finalLimit = Math.min(Math.max(limit, 8), 12);
    const questions = shuffledQuestions.slice(0, finalLimit);

    const clientQuestions: ClientQuestion[] = questions.map((q: Question) => {
      const clientQuestion: ClientQuestion = {
        id: q.id,
        type: q.type,
        question: q.question,
      };

      if (isRadioQuestion(q) || isCheckboxQuestion(q)) {
        const shuffledChoices = shuffleArray(q.choices, `${seed}-${q.id}`) as typeof q.choices;
        clientQuestion.choices = shuffledChoices;
      }

      return clientQuestion;
    });

    const quizId = generateQuizId(seed);

    const response: GetQuizResponse = {
      questions: clientQuestions,
      config: {
        timeLimit,
        shuffleQuestions,
        shuffleChoices: true,
        seed,
      },
      quizId,
    };

    return c.json(response);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return c.json(
      {
        error: 'Failed to fetch quiz',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500,
    );
  }
});

function generateQuizId(seed: string): string {
  const timestamp = Date.now();
  const combined = `${seed}-${timestamp}`;
  return btoa(combined).replace(/[+/=]/g, char => {
    switch (char) {
      case '+':
        return '-';
      case '/':
        return '_';
      case '=':
        return '';
      default:
        return char;
    }
  });
}

export default quiz;
