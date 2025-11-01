import type { Question } from '../types/quiz';

const questions: Question[] = [
  {
    id: 'q1',
    type: 'text',
    question: 'What is the capital city of France?',
    correctText: 'Paris',
    caseSensitive: false,
  },
  {
    id: 'q2',
    type: 'text',
    question: 'What year did World War II end?',
    correctText: '1945',
    caseSensitive: false,
  },
  {
    id: 'q3',
    type: 'text',
    question: 'What is the chemical symbol for gold?',
    correctText: 'Au',
    caseSensitive: true,
  },
  {
    id: 'q4',
    type: 'radio',
    question: 'What is the largest planet in our solar system?',
    choices: ['Earth', 'Jupiter', 'Saturn', 'Mars'],
    correctIndex: 1,
  },
  {
    id: 'q5',
    type: 'radio',
    question: 'Who painted the Mona Lisa?',
    choices: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo'],
    correctIndex: 2,
  },
  {
    id: 'q6',
    type: 'radio',
    question: 'What is the speed of light in vacuum?',
    choices: ['300,000 km/s', '150,000 km/s', '450,000 km/s', '600,000 km/s'],
    correctIndex: 0,
  },
  {
    id: 'q7',
    type: 'radio',
    question: "Which programming language is known as the 'language of the web'?",
    choices: ['Python', 'Java', 'JavaScript', 'C++'],
    correctIndex: 2,
  },
  {
    id: 'q8',
    type: 'checkbox',
    question: 'Which of the following are primary colors?',
    choices: ['Red', 'Green', 'Blue', 'Yellow', 'Purple'],
    correctIndexes: [0, 2, 3],
  },
  {
    id: 'q9',
    type: 'checkbox',
    question: 'Select all JavaScript frameworks:',
    choices: ['React', 'Django', 'Vue', 'Flask', 'Angular'],
    correctIndexes: [0, 2, 4],
  },
  {
    id: 'q10',
    type: 'checkbox',
    question: 'Which of these are valid HTTP methods?',
    choices: ['GET', 'POST', 'FETCH', 'PUT', 'SEND'],
    correctIndexes: [0, 1, 3],
  },
  {
    id: 'q11',
    type: 'checkbox',
    question: 'Which continents are in the Southern Hemisphere?',
    choices: ['Africa', 'Europe', 'Antarctica', 'Australia', 'North America', 'South America'],
    correctIndexes: [0, 2, 3, 5],
  },
  {
    id: 'q12',
    type: 'radio',
    question: 'What is the smallest prime number?',
    choices: ['0', '1', '2', '3'],
    correctIndex: 2,
  },
];

export function getQuestions(): Question[] {
  return [...questions];
}

export function getQuestionById(id: string): Question | undefined {
  return questions.find(q => q.id === id);
}

export function getQuestionsMap(): Map<string, Question> {
  return new Map(questions.map(q => [q.id, q]));
}
