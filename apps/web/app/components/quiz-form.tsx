'use client';

import { submitQuizAction, type QuizSubmitState } from '@/app/actions/quiz.actions';
import type { Answer } from '@/app/schemas/quiz.schema';
import type { GetQuizResponse } from '@/common/types/api';
import { Button } from '@audiph/ui/components/button';
import { Card, CardContent, CardFooter } from '@audiph/ui/components/card';
import { Separator } from '@audiph/ui/components/separator';
import { toast } from '@audiph/ui/components/sonner';
import { startTransition, useActionState, useCallback, useEffect, useRef, useState } from 'react';
import { QuestionCard } from './question-card';
import { QuizProgress } from './quiz-progress';
import { QuizResults } from './quiz-results';
import { QuizTimer } from './quiz-timer';

interface QuizFormProps {
  quiz: GetQuizResponse;
  onReset?: () => void;
}

export function QuizForm({ quiz, onReset }: QuizFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [answers, setAnswers] = useState<Record<string, Answer['value']>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const initialState: QuizSubmitState = {
    result: null,
    error: null,
    isLoading: false,
  };
  const [state, formAction, isPending] = useActionState(submitQuizAction, initialState);

  const answeredQuestions = Object.keys(answers).filter(key => {
    const value = answers[key];
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== undefined && value !== '';
  }).length;

  const handleAnswerChange = useCallback((questionId: string, value: Answer['value']) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));

    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[questionId];
      return newErrors;
    });
  }, []);

  const validateAnswers = useCallback(() => {
    const errors: Record<string, string> = {};

    quiz.questions.forEach(question => {
      const answer = answers[question.id];

      if (answer === undefined || answer === '' || (Array.isArray(answer) && answer.length === 0)) {
        errors[question.id] = 'Please provide an answer for this question';
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [answers, quiz.questions]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!validateAnswers()) {
        toast.error('Please answer all questions before submitting');
        return;
      }

      const formData = new FormData();

      const formattedAnswers: Answer[] = quiz.questions.map(question => ({
        id: question.id,
        value: answers[question.id] ?? '',
      }));

      formData.append('answers', JSON.stringify(formattedAnswers));
      formData.append('quizId', quiz.quizId);

      setHasSubmitted(true);
      startTransition(() => {
        formAction(formData);
      });
    },
    [answers, quiz, validateAnswers, formAction],
  );

  const handleTimeUp = useCallback(() => {
    toast.warning('Time is up! Submitting your answers...');

    if (formRef.current && !hasSubmitted) {
      const formData = new FormData();
      const formattedAnswers: Answer[] = quiz.questions.map(question => ({
        id: question.id,
        value: answers[question.id] || (Array.isArray(answers[question.id]) ? [] : ''),
      }));

      formData.append('answers', JSON.stringify(formattedAnswers));
      formData.append('quizId', quiz.quizId);

      setHasSubmitted(true);
      startTransition(() => {
        formAction(formData);
      });
    }
  }, [answers, quiz, hasSubmitted, formAction]);

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
  }, [state.error]);

  useEffect(() => {
    if (state.result) {
      toast.success('Quiz submitted successfully!');
    }
  }, [state.result]);

  if (state.result) {
    return <QuizResults result={state.result} onRetry={onReset} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          {quiz.questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              index={index}
              value={answers[question.id]}
              onChange={value => handleAnswerChange(question.id, value)}
              error={validationErrors[question.id]}
            />
          ))}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {answeredQuestions === quiz.questions.length
                      ? 'All questions answered!'
                      : `${quiz.questions.length - answeredQuestions} questions remaining`}
                  </p>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isPending || hasSubmitted}
                  className="min-w-[150px]"
                >
                  {isPending ? 'Submitting...' : 'Submit Quiz'}
                </Button>
              </div>
            </CardContent>
            <Separator />
            <CardFooter className="justify-center pt-4">
              <p className="text-xs text-muted-foreground">
                Make sure to review your answers before submitting
              </p>
            </CardFooter>
          </Card>
        </form>
        <div className="space-y-6 lg:sticky lg:top-6 h-fit">
          <QuizTimer
            timeLimit={quiz.config.timeLimit ?? 300}
            onTimeUp={handleTimeUp}
            isPaused={hasSubmitted || !!state.result}
          />
          <QuizProgress
            currentQuestion={1}
            totalQuestions={quiz.questions.length}
            answeredQuestions={answeredQuestions}
          />
        </div>
      </div>
    </div>
  );
}
