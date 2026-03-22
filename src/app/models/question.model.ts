export type QuestionType = 'MULTIPLE_CHOICE' | 'OPEN_QUESTION' | 'CONNECT_DOTS';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  text: string;
  course?: string;
  topic?: string;
  imageUrl?: string;
  markdownContent?: string;
  createdByName?: string;
  updatedByName?: string;
}

export interface ChoiceOption {
  id: string;
  text: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'MULTIPLE_CHOICE';
  options: ChoiceOption[];
}

export interface OpenQuestion extends BaseQuestion {
  type: 'OPEN_QUESTION';
}

export interface ConnectItem {
  id: string;
  text: string;
}

export interface ConnectDotsQuestion extends BaseQuestion {
  type: 'CONNECT_DOTS';
  leftItems: ConnectItem[];
  rightItems: ConnectItem[];
}

export type Question = MultipleChoiceQuestion | OpenQuestion | ConnectDotsQuestion;

export interface TestResponse {
  applicationId: string;
  studentId: string;
  testId: string;
  title: string;
  description: string;
  timeLimitSeconds: number;
  questions: Question[];
}

export interface AnswerConnection {
  leftItemId: string;
  rightItemId: string;
}

export interface BaseAnswer {
  questionId: string;
  type: QuestionType;
}

export interface MultipleChoiceAnswer extends BaseAnswer {
  type: 'MULTIPLE_CHOICE';
  selectedOptionId: string;
}

export interface OpenQuestionAnswer extends BaseAnswer {
  type: 'OPEN_QUESTION';
  textResponse: string;
}

export interface ConnectDotsAnswer extends BaseAnswer {
  type: 'CONNECT_DOTS';
  connections: AnswerConnection[];
}

export type Answer = MultipleChoiceAnswer | OpenQuestionAnswer | ConnectDotsAnswer;

export interface TestSubmission {
  applicationId: string;
  studentId: string;
  answers: Answer[];
}

export interface TestBlueprintRule {
  id: string;
  course?: string;
  topic?: string;
  questionType?: QuestionType | 'ANY';
  count: number;
}

export interface TestBlueprint {
  id: string;
  title: string;
  description: string;
  timeLimitSeconds?: number;
  rules: TestBlueprintRule[];
  fixedQuestionIds?: string[];
  createdByName?: string;
  updatedByName?: string;
}
