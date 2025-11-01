export type QuestionType = 'text' | 'checkbox' | 'radio';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  question: string;
}

export interface TextQuestion extends BaseQuestion {
  type: 'text';
  correctText: string;
  caseSensitive?: boolean;
}

export interface RadioQuestion extends BaseQuestion {
  type: 'radio';
  choices: string[];
  correctIndex: number;
}

export interface CheckboxQuestion extends BaseQuestion {
  type: 'checkbox';
  choices: string[];
  correctIndexes: number[];
}

export type Question = TextQuestion | RadioQuestion | CheckboxQuestion;

export interface QuizConfig {
  timeLimit?: number;
  shuffleQuestions?: boolean;
  shuffleChoices?: boolean;
  seed?: string;
}

export function isTextQuestion(question: Question): question is TextQuestion {
  return question.type === 'text';
}

export function isRadioQuestion(question: Question): question is RadioQuestion {
  return question.type === 'radio';
}

export function isCheckboxQuestion(question: Question): question is CheckboxQuestion {
  return question.type === 'checkbox';
}
