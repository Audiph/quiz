'use client';

import { Progress } from '@audiph/ui/components/progress';
import { Card, CardContent } from '@audiph/ui/components/card';

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: number;
}

export function QuizProgress({ currentQuestion: _currentQuestion, totalQuestions, answeredQuestions }: QuizProgressProps) {
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="text-2xl font-semibold">
                {answeredQuestions} / {totalQuestions}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-semibold">{Math.round(progressPercentage)}%</p>
            </div>
          </div>

          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}