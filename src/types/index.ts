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
  videoUrl: string; // YouTube embed or video URL
  videoDurationSeconds: number;
  description: string;
  keyTakeaways: string[];
  actionPrompt: string;
}

export interface UserProgress {
  currentStep: StepId;
  completedSteps: string[]; // e.g. ['pre-test', 'level-1']
  preTestScore?: number;
  postTestScore?: number;
  preTestAnswers?: Record<number, number>;
  postTestAnswers?: Record<number, number>;
  evaluationAnswers?: Record<string, number>;
  evaluationComments?: string;
  lastUpdated: string;
}
