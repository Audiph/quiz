'use client';

import type { Answer } from '@/app/schemas/quiz.schema';
import {
  type ClientQuestion,
  isCheckboxQuestion,
  isRadioQuestion,
  isTextQuestion,
} from '@/common/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@audiph/ui/components/card';
import { Checkbox } from '@audiph/ui/components/checkbox';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@audiph/ui/components/field';
import { Input } from '@audiph/ui/components/input';
import { RadioGroup, RadioGroupItem } from '@audiph/ui/components/radio-group';
import { useEffect, useState } from 'react';

interface QuestionCardProps {
  question: ClientQuestion;
  index: number;
  value?: Answer['value'];
  onChange: (value: Answer['value']) => void;
  error?: string;
}

export function QuestionCard({ question, index, value, onChange, error }: QuestionCardProps) {
  const [checkboxValues, setCheckboxValues] = useState<number[]>(() => {
    if (isCheckboxQuestion(question) && Array.isArray(value)) {
      return value as number[];
    }
    return [];
  });

  useEffect(() => {
    if (isCheckboxQuestion(question)) {
      onChange(checkboxValues);
    }
  }, [checkboxValues]);

  const handleCheckboxChange = (choiceIndex: number, checked: boolean) => {
    setCheckboxValues(prev => {
      if (checked) {
        return [...prev, choiceIndex].sort((a, b) => a - b);
      }
      return prev.filter(v => v !== choiceIndex);
    });
  };

  const renderQuestion = () => {
    if (isTextQuestion(question)) {
      return (
        <Field>
          <FieldContent>
            <Input
              id={question.id}
              name={`question-${question.id}`}
              value={(value as string) || ''}
              onChange={e => onChange(e.target.value)}
              placeholder="Type your answer..."
              aria-invalid={!!error}
              aria-describedby={error ? `${question.id}-error` : undefined}
            />
            {error && <FieldError id={`${question.id}-error`}>{error}</FieldError>}
          </FieldContent>
        </Field>
      );
    }

    if (isRadioQuestion(question)) {
      return (
        <FieldSet>
          <RadioGroup
            value={value !== undefined ? String(value) : undefined}
            onValueChange={val => onChange(Number(val))}
            name={`question-${question.id}`}
          >
            <FieldGroup>
              {question.choices.map((choice: string, choiceIndex: number) => (
                <Field orientation="horizontal" key={choiceIndex}>
                  <RadioGroupItem
                    value={String(choiceIndex)}
                    id={`${question.id}-${choiceIndex}`}
                  />
                  <FieldLabel
                    htmlFor={`${question.id}-${choiceIndex}`}
                    className="flex-1 cursor-pointer"
                  >
                    <FieldContent>{choice}</FieldContent>
                  </FieldLabel>
                </Field>
              ))}
            </FieldGroup>
          </RadioGroup>
          {error && <FieldError>{error}</FieldError>}
        </FieldSet>
      );
    }

    if (isCheckboxQuestion(question)) {
      return (
        <FieldSet>
          <FieldDescription className="text-sm text-muted-foreground mb-3">
            Select all that apply
          </FieldDescription>
          <FieldGroup>
            {question.choices.map((choice, choiceIndex) => (
              <Field orientation="horizontal" key={choiceIndex}>
                <Checkbox
                  id={`${question.id}-${choiceIndex}`}
                  checked={checkboxValues.includes(choiceIndex)}
                  onCheckedChange={checked => handleCheckboxChange(choiceIndex, checked as boolean)}
                />
                <FieldLabel
                  htmlFor={`${question.id}-${choiceIndex}`}
                  className="flex-1 cursor-pointer"
                >
                  <FieldContent>{choice}</FieldContent>
                </FieldLabel>
              </Field>
            ))}
          </FieldGroup>
          {error && <FieldError>{error}</FieldError>}
        </FieldSet>
      );
    }

    return null;
  };

  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0">
            {index + 1}
          </span>
          <span className="flex-1">{question.question}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>{renderQuestion()}</CardContent>
    </Card>
  );
}
