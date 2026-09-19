import type { UserProfile, UserProgress, StepId } from '../types';

// URL ของ Google Apps Script Web App (สามารถใส่ URL ที่ Deploy ได้จริง หรือปล่อยว่างไว้เพื่อใช้ LocalStorage Mode)
const DEFAULT_GAS_ENDPOINT = ""; 

const STORAGE_KEYS = {
  USER_PROFILE: 'luno_user_profile',
  USER_PROGRESS: 'luno_user_progress',
  GAS_URL: 'luno_gas_endpoint'
};

export class ApiService {
  // บันทึก/ดึง Custom GAS URL
  static getGasUrl(): string {
    return localStorage.getItem(STORAGE_KEYS.GAS_URL) || DEFAULT_GAS_ENDPOINT;
  }

  static setGasUrl(url: string): void {
    localStorage.setItem(STORAGE_KEYS.GAS_URL, url.trim());
  }

  // 1. จัดการ Profile ผู้บริหาร
  static getLocalProfile(): UserProfile | null {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  static saveLocalProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  }

  // 2. จัดการ Progress (จำจุดที่ค้างไว้)
  static getLocalProgress(): UserProgress {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    return {
      currentStep: 'pre-test',
      completedSteps: [],
      lastUpdated: new Date().toISOString()
    };
  }

  static saveLocalProgress(progress: Partial<UserProgress>): UserProgress {
    const current = this.getLocalProgress();
    const updated: UserProgress = {
      ...current,
      ...progress,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(updated));
    
    // พยายามซิงก์ขึ้น Cloud Google Sheet ในเบื้องหลัง
    this.syncProgressToCloud(updated);
    
    return updated;
  }

  static completeStep(step: StepId, nextStep: StepId): UserProgress {
    const current = this.getLocalProgress();
    const completed = new Set(current.completedSteps);
    completed.add(step);

    return this.saveLocalProgress({
      currentStep: nextStep,
      completedSteps: Array.from(completed)
    });
  }

  // 3. ซิงก์ขึ้น Google Apps Script (JSONP / Fetch)
  static async syncProgressToCloud(progress: UserProgress): Promise<void> {
    const gasUrl = this.getGasUrl();
    const profile = this.getLocalProfile();
    if (!gasUrl || !profile) return;

    try {
      const payload = {
        user_id: profile.id,
        name: profile.name,
        school: profile.school,
        current_step: progress.currentStep,
        pre_test_status: progress.completedSteps.includes('pre-test') ? 'COMPLETED' : 'PENDING',
        level_1_status: progress.completedSteps.includes('level-1') ? 'COMPLETED' : (progress.currentStep === 'level-1' ? 'IN_PROGRESS' : 'LOCKED'),
        level_2_status: progress.completedSteps.includes('level-2') ? 'COMPLETED' : (progress.currentStep === 'level-2' ? 'IN_PROGRESS' : 'LOCKED'),
        level_3_status: progress.completedSteps.includes('level-3') ? 'COMPLETED' : (progress.currentStep === 'level-3' ? 'IN_PROGRESS' : 'LOCKED'),
        level_4_status: progress.completedSteps.includes('level-4') ? 'COMPLETED' : (progress.currentStep === 'level-4' ? 'IN_PROGRESS' : 'LOCKED'),
        post_test_status: progress.completedSteps.includes('post-test') ? 'COMPLETED' : 'LOCKED',
        evaluation_status: progress.completedSteps.includes('evaluation') ? 'COMPLETED' : 'LOCKED'
      };

      await this.sendToGas('saveProgress', payload);
    } catch (err) {
      console.warn('Sync to Google Sheet failed (Offline/Silent):', err);
    }
  }

  static async submitQuizScores(quizType: 'pre' | 'post', score: number, answers: Record<number, number>): Promise<void> {
    const profile = this.getLocalProfile();
    if (!profile) return;

    // บันทึก Local ทันที
    if (quizType === 'pre') {
      this.saveLocalProgress({ preTestScore: score, preTestAnswers: answers });
    } else {
      this.saveLocalProgress({ postTestScore: score, postTestAnswers: answers });
    }

    // ซิงก์ขึ้น Google Sheet
    const gasUrl = this.getGasUrl();
    if (!gasUrl) return;

    try {
      await this.sendToGas('submitQuiz', {
        user_id: profile.id,
        name: profile.name,
        quiz_type: quizType,
        score: score,
        answers: answers
      });
    } catch (err) {
      console.warn('Submit quiz to Sheet failed:', err);
    }
  }

  static async submitEvaluation(averages: { propriety: number; feasibility: number; utility: number }, details: Record<string, number>, comments: string): Promise<void> {
    const profile = this.getLocalProfile();
    if (!profile) return;

    this.saveLocalProgress({
      evaluationAnswers: details,
      evaluationComments: comments
    });

    const gasUrl = this.getGasUrl();
    if (!gasUrl) return;

    try {
      await this.sendToGas('submitEvaluation', {
        user_id: profile.id,
        name: profile.name,
        school: profile.school,
        propriety_avg: averages.propriety,
        feasibility_avg: averages.feasibility,
        utility_avg: averages.utility,
        details: details,
        comments: comments
      });
    } catch (err) {
      console.warn('Submit evaluation to Sheet failed:', err);
    }
  }

  // ส่งข้อมูลเข้า GAS รองรับทั้ง sendBeacon และ Image/Script JSONP
  private static async sendToGas(action: string, data: any): Promise<any> {
    const baseUrl = this.getGasUrl();
    if (!baseUrl) return;

    const fullUrl = `${baseUrl}?action=${encodeURIComponent(action)}&data=${encodeURIComponent(JSON.stringify(data))}`;
    
    // ใช้ no-cors fetch เพื่อ bypass CORS redirect ของ Google Apps Script
    try {
      await fetch(fullUrl, {
        method: 'GET',
        mode: 'no-cors'
      });
    } catch (err) {
      console.log('GAS pinged with no-cors:', err);
    }
  }

  static clearSession(): void {
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.USER_PROGRESS);
  }
}
