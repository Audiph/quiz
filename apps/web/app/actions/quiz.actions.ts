'use server';

import { fetchQuiz, gradeQuiz } from '@/common/api-handlers/quiz';
import { isErrorResponse } from '@/common/types/api';
import type { GetQuizResponse, GradeResponse } from '@/common/types/api';
import { quizStartSchema, quizSubmissionSchema } from '@/app/schemas/quiz.schema';
import { revalidatePath } from 'next/cache';

export type QuizStartState = {
  quiz: GetQuizResponse | null;
  error: string | null;
  isLoading?: boolean;
};

export type QuizSubmitState = {
  result: GradeResponse | null;
  error: string | null;
  isLoading?: boolean;
};

export async function startQuizAction(
  _prevState: QuizStartState,
  formData: FormData
): Promise<QuizStartState> {
  try {
    const rawData = {
      questionLimit: formData.get('questionLimit'),
      timeLimit: formData.get('timeLimit'),
      shuffleQuestions: formData.get('shuffleQuestions') === 'true',
    };

    const validatedData = quizStartSchema.parse(rawData);

    const quiz = await fetchQuiz({
      limit: validatedData.questionLimit,
      timeLimit: validatedData.timeLimit,
      shuffle: validatedData.shuffleQuestions,
    });

    if (isErrorResponse(quiz)) {
      return {
        quiz: null,
        error: quiz.message || 'Failed to fetch quiz',
      };
    }

    revalidatePath('/');

    return {
      quiz,
      error: null,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        quiz: null,
        error: error.message,
      };
    }
    return {
      quiz: null,
      error: 'An unexpected error occurred',
    };
  }
}

export async function submitQuizAction(
  _prevState: QuizSubmitState,
  formData: FormData
): Promise<QuizSubmitState> {
  try {
    const answersJson = formData.get('answers') as string;
    const quizId = formData.get('quizId') as string;

    if (!answersJson || !quizId) {
      return {
        result: null,
        error: 'Missing required data',
      };
    }

    const answers = JSON.parse(answersJson);

    const validatedData = quizSubmissionSchema.parse({
      quizId,
      answers,
    });

    const result = await gradeQuiz(validatedData.answers, validatedData.quizId);

    if (isErrorResponse(result)) {
      return {
        result: null,
        error: result.message || 'Failed to grade quiz',
      };
    }

    revalidatePath('/');

    return {
      result,
      error: null,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        result: null,
        error: error.message,
      };
    }
    return {
      result: null,
      error: 'An unexpected error occurred',
    };
  }
}