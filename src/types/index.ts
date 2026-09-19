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

export interface UserProgress {
  currentStep: StepId;
  completedSteps: string[];
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

