import { Hono } from 'hono';
import { getQuestionsMap } from '../data/questions';
import type { GradeRequest, GradeResponse } from '../types/api';
import { calculateScore, gradeAnswers } from '../utils/grading';
import { validateGradeRequest } from '../utils/validation';

const grade = new Hono();

grade.post('/', async c => {
  try {
    const body = await c.req.json().catch(() => null);

    if (!body) {
      return c.json({ error: 'Invalid JSON', message: 'Request body must be valid JSON' }, 400);
    }

    const validation = validateGradeRequest(body);
    if (!validation.valid) {
      return c.json({ error: 'Invalid request', message: validation.error }, 400);
    }

    const gradeRequest = body as GradeRequest;
    const questionsMap = getQuestionsMap();
    const results = gradeAnswers(gradeRequest.answers, questionsMap);
    const { score, total } = calculateScore(results);
    const response: GradeResponse = {
      score,
      total,
      results,
    };

    return c.json(response);
  } catch (error) {
    console.error('Error grading quiz:', error);
    return c.json(
      {
        error: 'Failed to grade quiz',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500,
    );
  }
});

export default grade;
