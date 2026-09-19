import type { LevelInfo, QuizQuestion } from '../types';
import { LESSONS_CONTENT } from '../../1_EDIT_CONTENT_HERE/lessons_and_videos';
import { PRE_TEST_DATA, POST_TEST_DATA, EVALUATION_DATA } from '../../1_EDIT_CONTENT_HERE/quizzes_and_evaluation';

// ข้อมูลหลักถูกดึงตรงจากโฟลเดอร์ 1_EDIT_CONTENT_HERE เพื่อให้เพื่อนแก้ไขได้ง่าย
export const COURSE_LEVELS: LevelInfo[] = LESSONS_CONTENT.map(lvl => ({
  ...lvl,
  videoDurationSeconds: lvl.durationMinutes * 60
}));

export const PRE_TEST_QUESTIONS: QuizQuestion[] = PRE_TEST_DATA;
export const POST_TEST_QUESTIONS: QuizQuestion[] = POST_TEST_DATA;
export const EVALUATION_ITEMS = EVALUATION_DATA;
