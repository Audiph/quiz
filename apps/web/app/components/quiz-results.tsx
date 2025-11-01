'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@audiph/ui/components/card';
import { Button } from '@audiph/ui/components/button';
import { Progress } from '@audiph/ui/components/progress';
import { Separator } from '@audiph/ui/components/separator';
import { calculatePercentage } from '@/common/utils/calculate-percentage';
import type { GradeResponse, QuestionResult } from '@/common/types/api';

interface QuizResultsProps {
  result: GradeResponse;
  onRetry?: () => void;
}

export function QuizResults({ result, onRetry }: QuizResultsProps) {
  const percentage = calculatePercentage(result) || 0;
  const isPassing = percentage >= 70;

  const getGradeEmoji = (percent: number) => {
    if (percent >= 90) return '🏆';
    if (percent >= 80) return '⭐';
    if (percent >= 70) return '✅';
    if (percent >= 60) return '📚';
    return '💪';
  };

  const getGradeMessage = (percent: number) => {
    if (percent >= 90) return 'Outstanding! You aced it!';
    if (percent >= 80) return 'Great job! Very impressive!';
    if (percent >= 70) return 'Well done! You passed!';
    if (percent >= 60) return 'Good effort! Keep practicing!';
    return 'Keep trying! You can do better!';
  };

  const getResultColor = (isCorrect: boolean) => {
    return isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      <Card className="border-2">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">{getGradeEmoji(percentage)}</div>
          <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
          <CardDescription className="text-lg mt-2">
            {getGradeMessage(percentage)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">
                {percentage}%
              </div>
              <p className="text-muted-foreground">
                You got {result.score} out of {result.total} questions correct
              </p>
            </div>
            <div className="space-y-2">
              <Progress
                value={percentage}
                className={`h-3 ${
                  isPassing ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
                }`}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0%</span>
                <span className="font-medium">
                  {isPassing ? 'PASSED' : 'FAILED'} (70% required)
                </span>
                <span>100%</span>
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Question Breakdown</h3>
              <div className="space-y-2">
                {result.results.map((questionResult: QuestionResult, index: number) => (
                  <div
                    key={questionResult.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-sm">
                        Question {index + 1}
                      </span>
                    </div>
                    <span className={`font-medium ${getResultColor(questionResult.correct)}`}>
                      {questionResult.correct ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-3 justify-center">
          {onRetry && (
            <Button onClick={onRetry} size="lg">
              Try Another Quiz
            </Button>
          )}
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Correct Answers</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {result.score}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Incorrect Answers</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {result.total - result.score}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Accuracy Rate</p>
              <p className="text-2xl font-bold">{percentage}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className={`text-2xl font-bold ${isPassing ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {isPassing ? 'PASSED' : 'FAILED'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}