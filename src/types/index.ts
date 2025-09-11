// User Types
export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  lastLoginAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'hi';
  notifications: boolean;
  soundEffects: boolean;
  preferredSubjects: string[];
}

// Test Types
export interface Test {
  id: string;
  title: string;
  description: string;
  subject: string;
  type: 'prelims' | 'mains' | 'mock' | 'custom';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // in minutes
  totalQuestions: number;
  questions: Question[];
  createdBy: string;
  createdAt: Date;
  isPublic: boolean;
  tags: string[];
}

export interface Question {
  id: string;
  type: 'mcq' | 'descriptive' | 'boolean';
  question: string;
  options?: string[]; // for MCQ
  correctAnswer: string | number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
  topic: string;
  marks: number;
  timeLimit?: number; // in seconds
  references?: string[];
}

// Test Attempt Types
export interface TestAttempt {
  id: string;
  testId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  status: 'in_progress' | 'completed' | 'paused' | 'abandoned';
  responses: TestResponse[];
  score: number;
  percentage: number;
  timeTaken: number; // in minutes
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
  analysis: TestAnalysis;
}

export interface TestResponse {
  questionId: string;
  selectedAnswer: string | number | null;
  timeTaken: number; // in seconds
  isCorrect: boolean;
  marks: number;
}

export interface TestAnalysis {
  subjectWise: Record<string, {
    correct: number;
    total: number;
    percentage: number;
    timeSpent: number;
  }>;
  difficultyWise: Record<string, {
    correct: number;
    total: number;
    percentage: number;
  }>;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

// Flashcard Types
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdBy: string;
  createdAt: Date;
  lastReviewed?: Date;
  reviewCount: number;
  confidence: number; // 1-5 scale
  tags: string[];
}

export interface FlashcardDeck {
  id: string;
  title: string;
  description: string;
  subject: string;
  cardIds: string[];
  createdBy: string;
  createdAt: Date;
  isPublic: boolean;
  totalCards: number;
}

// Mind Map Types
export interface MindMapNode {
  id: string;
  label: string;
  type: 'central' | 'branch' | 'leaf';
  x: number;
  y: number;
  color: string;
  children: string[];
  parent?: string;
  content?: string;
  level: number;
}

export interface MindMap {
  id: string;
  title: string;
  subject: string;
  topic: string;
  nodes: Record<string, MindMapNode>;
  rootNodeId: string;
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
  isPublic: boolean;
}

// Analytics Types
export interface UserAnalytics {
  userId: string;
  totalTests: number;
  averageScore: number;
  totalTimeLearning: number; // in minutes
  streakDays: number;
  lastActiveDate: Date;
  subjectWisePerformance: Record<string, SubjectPerformance>;
  monthlyProgress: MonthlyProgress[];
  achievements: Achievement[];
}

export interface SubjectPerformance {
  subject: string;
  testsAttempted: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpent: number;
  strengths: string[];
  weaknesses: string[];
  improvement: number; // percentage change
}

export interface MonthlyProgress {
  month: string; // YYYY-MM
  testsAttempted: number;
  averageScore: number;
  timeSpent: number;
  topicsLearned: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  type: 'test' | 'study' | 'streak' | 'improvement';
  progress?: number; // for ongoing achievements
  target?: number;
}

// API Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Gemini API Types
export interface GeminiQuestionRequest {
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'mcq' | 'descriptive';
  count: number;
  previousQuestions?: string[];
}

export interface GeminiFlashcardRequest {
  subject: string;
  topic: string;
  content: string;
  count: number;
}

export interface GeminiMindMapRequest {
  subject: string;
  topic: string;
  depth: number;
  includeExamples: boolean;
}

// Firebase Types
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface TestCardProps extends BaseComponentProps {
  test: Test;
  onStart: (testId: string) => void;
  onView: (testId: string) => void;
  showActions?: boolean;
}

export interface QuestionCardProps extends BaseComponentProps {
  question: Question;
  selectedAnswer?: string | number | null;
  onAnswerSelect: (answer: string | number) => void;
  showResult?: boolean;
  showExplanation?: boolean;
  disabled?: boolean;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  agreeToTerms: boolean;
}

export interface TestCreationFormData {
  title: string;
  description: string;
  subject: string;
  type: 'prelims' | 'mains' | 'mock' | 'custom';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  totalQuestions: number;
  isPublic: boolean;
  tags: string[];
}

// Constants
export const SUBJECTS = [
  'History',
  'Geography',
  'Polity',
  'Economics',
  'Environment',
  'Science & Technology',
  'Current Affairs',
  'International Relations',
  'Public Administration',
  'Sociology',
  'Philosophy',
  'Literature',
  'Optional Subject'
] as const;

export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'] as const;
export const TEST_TYPES = ['prelims', 'mains', 'mock', 'custom'] as const;
export const QUESTION_TYPES = ['mcq', 'descriptive', 'boolean'] as const;