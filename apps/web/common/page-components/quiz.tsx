'use client';

import { QuizStartState, startQuizAction } from '@/app/actions/quiz.actions';
import { QuizForm } from '@/app/components/quiz-form';
import { QUIZ_DEFAULTS } from '@/common/config/api';
import { Button } from '@audiph/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@audiph/ui/components/card';
import { Checkbox } from '@audiph/ui/components/checkbox';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@audiph/ui/components/field';
import { Input } from '@audiph/ui/components/input';
import { Separator } from '@audiph/ui/components/separator';
import { useActionState, useEffect, useState } from 'react';

export default function Quiz() {
  const [showConfig, setShowConfig] = useState(true);
  const initialState: QuizStartState = {
    quiz: null,
    error: null,
    isLoading: false,
  };
  const [state, formAction, isPending] = useActionState(startQuizAction, initialState);

  useEffect(() => {
    if (state.quiz) {
      setShowConfig(false);
    }
  }, [state.quiz]);

  const handleReset = () => {
    setShowConfig(true);
    window.location.reload();
  };

  if (state.quiz && !showConfig) {
    return <QuizForm quiz={state.quiz} onReset={handleReset} />;
  }

  return (
    <>
      <div className="min-h-screen bg-linear-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 py-12 max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Interactive Quiz App</h1>
            <p className="text-lg text-muted-foreground">
              Test your knowledge with our engaging quiz
            </p>
          </div>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Configure Your Quiz</CardTitle>
              <CardDescription>
                Customize your quiz experience with the options below
              </CardDescription>
            </CardHeader>
            <form action={formAction}>
              <CardContent className="space-y-6 pb-6">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="questionLimit">Number of Questions</FieldLabel>
                    <FieldContent>
                      <Input
                        id="questionLimit"
                        name="questionLimit"
                        type="number"
                        min="8"
                        max="12"
                        defaultValue={QUIZ_DEFAULTS.QUESTION_LIMIT}
                        required
                      />
                      <FieldDescription>Choose between 8 and 12 questions</FieldDescription>
                    </FieldContent>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="timeLimit">Time Limit (seconds)</FieldLabel>
                    <FieldContent>
                      <Input
                        id="timeLimit"
                        name="timeLimit"
                        type="number"
                        min="60"
                        max="600"
                        step="30"
                        defaultValue={QUIZ_DEFAULTS.TIME_LIMIT}
                        required
                      />
                      <FieldDescription>Set between 60 and 600 seconds</FieldDescription>
                    </FieldContent>
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox
                      id="shuffleQuestions"
                      name="shuffleQuestions"
                      value="true"
                      defaultChecked={QUIZ_DEFAULTS.SHUFFLE_QUESTIONS}
                    />
                    <FieldLabel htmlFor="shuffleQuestions" className="cursor-pointer">
                      <FieldContent>
                        <div>
                          <div className="font-medium">Shuffle Questions</div>
                          <FieldDescription>Randomize the order of questions</FieldDescription>
                        </div>
                      </FieldContent>
                    </FieldLabel>
                  </Field>
                </FieldGroup>
                {state.error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive">
                    <p className="text-sm text-destructive">{state.error}</p>
                  </div>
                )}
              </CardContent>
              <Separator />
              <CardFooter className="flex justify-between items-center mt-6">
                <div className="text-sm text-muted-foreground">Ready to test your knowledge?</div>
                <Button type="submit" size="lg" disabled={isPending}>
                  {isPending ? 'Loading Quiz...' : 'Start Quiz'}
                </Button>
              </CardFooter>
            </form>
          </Card>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Multiple Question Types</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Text input, radio buttons, and checkboxes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Timed Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Complete the quiz before time runs out
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Instant Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get detailed feedback on your performance
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
