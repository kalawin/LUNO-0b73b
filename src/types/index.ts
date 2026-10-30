export type StepId = 
  | 'login'
  | 'pre-test'
  | 'level-1'
  | 'level-2'
  | 'level-3'
  | 'level-4'
  | 'post-test'
  | 'evaluation'
  | 'completed';

export interface UserProfile {
  id: string;
  name: string;
  firstname?: string;
  lastname?: string;
  school: string;
  phone?: string;
  loginAt: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex?: number;
}

export interface LevelInfo {
  id: string;
  levelNumber: number;
  title: string;
  subtitle: string;
  durationMinutes: number;
  videoUrl: string;
  videoDurationSeconds: number;
  description: string;
  keyTakeaways: string[];
  actionPrompt: string;
}

export interface RubricLevel {
  score: number;
  desc: string;
}

export interface RubricCriterion {
  id: string;
  title: string;
  maxScore: number;
  high: RubricLevel;
  medium: RubricLevel;
  low: RubricLevel;
}

export interface ActivityStepData {
  stepIndex: 1 | 2 | 3 | 4 | 5;
  stepName: string;
  timeEstimate: string;
  goal: string;
  content: string;
  instructions: string[];
}

export interface ScenarioItem {
  id: string;
  code: string; // 'A' | 'B' | 'C'
  title: string;
  shortSummary: string;
  fullDescription: string;
  extraDetails?: string;
}

export interface UnitDefinition {
  id: string; // e.g. '1.1', '1.2'
  moduleNumber: 1 | 2 | 3 | 4;
  subNumber: number;
  title: string;
  estimatedTime: string;
  outcome: string;
  platformTools: string;
  prerequisites?: string;
  steps: ActivityStepData[];
  scenarios?: ScenarioItem[];
  rubric: RubricCriterion[];
  checklist: string[];
  commonMistakes: string[];
  theoryReference: string;
}

export interface UnitSubmission {
  unitId: string;
  formData: Record<string, any>;
  rubricScores: Record<string, number>;
  totalScore: number;
  reflectionNotes?: string;
  submittedAt: string;
}

export interface UserProgress {
  currentStep: StepId;
  completedSteps: string[];
  completedUnits?: string[];
  unitSubmissions?: Record<string, UnitSubmission>;
  preTestScore?: number;
  postTestScore?: number;
  preTestAnswers?: Record<number, number>;
  postTestAnswers?: Record<number, number>;
  evaluationAnswers?: Record<string, number>;
  evaluationScores?: {
    eval1: number;
    eval2: number;
    eval3: number;
    avg: string;
  };
  evaluationComments?: string;
  watchedVideos?: Record<string, boolean>;
  visionStatement?: string;
  certCode?: string;
  completionDate?: string;
  lastUpdated: string;
}