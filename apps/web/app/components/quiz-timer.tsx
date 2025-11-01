'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@audiph/ui/components/card';

interface QuizTimerProps {
  timeLimit: number;
  onTimeUp?: () => void;
  isPaused?: boolean;
}

export function QuizTimer({ timeLimit, onTimeUp, isPaused = false }: QuizTimerProps) {
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onTimeUp?.();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, onTimeUp]);

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  const getTimeColor = useCallback((seconds: number, total: number) => {
    const percentage = (seconds / total) * 100;
    if (percentage > 50) return 'text-foreground';
    if (percentage > 25) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-destructive';
  }, []);

  const percentage = (timeLeft / timeLimit) * 100;

  return (
    <Card className="sticky top-4">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-muted-foreground">Time Remaining</span>
          <div className={`text-3xl font-mono font-bold ${getTimeColor(timeLeft, timeLimit)}`}>
            {formatTime(timeLeft)}
          </div>
          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ease-linear ${
                percentage > 50
                  ? 'bg-primary'
                  : percentage > 25
                    ? 'bg-yellow-600 dark:bg-yellow-400'
                    : 'bg-destructive'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}