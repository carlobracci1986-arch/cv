import { CVData } from './cv.types';

export interface OptimizationChange {
  section: string;
  itemId?: string;
  field: string;
  before: string;
  after: string;
  reason: string;
  accepted: boolean;
}

export interface OptimizationResult {
  optimizedCV: CVData;
  matchScore: number;
  keywordsFound: string[];
  keywordsMissing: string[];
  changes: OptimizationChange[];
  suggestions: string[];
}

export interface CoverLetterOptions {
  tone: 'formal' | 'professional' | 'creative' | 'technical';
  length?: 'brief' | 'full';
  additionalInstructions?: string;
}

export type InterviewQuestionType = 'behavioral' | 'technical' | 'motivational' | 'situational' | 'weakness';
export type InterviewDifficulty = 'low' | 'medium' | 'high';
export type InterviewProbability = 'low' | 'medium' | 'high';

export interface InterviewQuestion {
  id: string;
  question: string;
  type: InterviewQuestionType;
  difficulty: InterviewDifficulty;
  probability: InterviewProbability;
  suggestedAnswer: string;
  tips: string[];
  keyPoints: string[];
}

export interface WeaknessAnalysis {
  type: 'gap' | 'frequent_change' | 'missing_skill' | 'inactivity';
  description: string;
  suggestions: string[];
}

export interface InterviewPrepResult {
  questions: InterviewQuestion[];
  weaknesses: WeaknessAnalysis[];
  overallTips: string[];
}

export interface ATSIssue {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'formatting' | 'content' | 'keywords' | 'structure';
  message: string;
  suggestion: string;
  autoFixable: boolean;
}

export interface ATSScoreResult {
  score: number;
  level: 'excellent' | 'good' | 'needs_improvement' | 'poor';
  issues: ATSIssue[];
  passedChecks: string[];
  keywordsPresent: string[];
  keywordsMissing: string[];
}

export interface MockInterviewSession {
  id: string;
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  answers: { questionId: string; answer: string; feedback?: string; score?: number }[];
  startedAt: string;
  completedAt?: string;
  finalReport?: MockInterviewReport;
}

export interface MockInterviewReport {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  questionFeedback: { questionId: string; score: number; feedback: string }[];
}
