import type { UserProfile, UserProgress, StepId, UnitSubmission } from '../types';

// URL ของ Google Apps Script Web App ที่เชื่อมต่อกับ Google Sheet ใหม่ของ Luno
const DEFAULT_GAS_ENDPOINT = "https://script.google.com/macros/s/AKfycbxFx_OGc4YO8XFu-KVh0toM4Lse0pwcCttTeEXTwc3XbF11DljJ8NrbqHiDZxo3KxUM/exec"; 

const STORAGE_KEYS = {
  USER_PROFILE: 'luno_user_profile',
  USER_PROGRESS: 'luno_user_progress',
  GAS_URL: 'luno_gas_endpoint'
};

export class ApiService {
  // บันทึก/ดึง Custom GAS URL
  static getGasUrl(): string {
    const custom = localStorage.getItem(STORAGE_KEYS.GAS_URL);
    if (!custom || custom.includes('AKfycbxXzOQjibeWZCDTXHscNihZZp3e3C4Gm4EvjOJJ5LcZ_1-TCsUh9ji7HHNTbaauCMLQ')) {
      localStorage.setItem(STORAGE_KEYS.GAS_URL, DEFAULT_GAS_ENDPOINT);
      return DEFAULT_GAS_ENDPOINT;
    }
    return custom;
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
      completedUnits: [],
      unitSubmissions: {},
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
    
    // ซิงก์ขึ้น Cloud Google Sheet ในเบื้องหลัง
    this.syncProgressToCloud(updated);
    
    return updated;
  }

  // 2.1 บันทึกผลงานประจำหน่วย (Unit Submissions)
  static saveUnitSubmission(submission: UnitSubmission): UserProgress {
    const current = this.getLocalProgress();
    const completedUnits = new Set(current.completedUnits || []);
    completedUnits.add(submission.unitId);
    
    const unitSubmissions = {
      ...(current.unitSubmissions || {}),
      [submission.unitId]: submission
    };
    
    const updated = this.saveLocalProgress({
      completedUnits: Array.from(completedUnits),
      unitSubmissions
    });
    
    // ส่ง Telemetry สรุปผลงาน
    this.sendTelemetry({
      กิจกรรมล่าสุด: `ส่งผลงานหน่วย ${submission.unitId}`,
      คะแนนรูบริก: `${submission.totalScore}/10`,
      จำนวนหน่วยที่ผ่าน: completedUnits.size
    });
    
    return updated;
  }

  static isUnitCompleted(unitId: string): boolean {
    const current = this.getLocalProgress();
    return (current.completedUnits || []).includes(unitId);
  }

  static getUnitSubmission(unitId: string): UnitSubmission | undefined {
    const current = this.getLocalProgress();
    return current.unitSubmissions ? current.unitSubmissions[unitId] : undefined;
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
        evaluation_status: progress.completedSteps.includes('evaluation') ? 'COMPLETED' : 'LOCKED',
        completed_units: (progress.completedUnits || []).join(','),
        last_active_at: progress.lastUpdated
      };

      await this.sendToGas('saveProgress', payload);
    } catch (err) {
      console.warn('Sync progress to Sheet failed (Offline mode active):', err);
    }
  }

  // ส่งข้อมูล Telemetry เข้าแท็บ data1 ของ Google Sheet แบบเรียลไทม์
  static async sendTelemetry(data: Record<string, any>): Promise<void> {
    const profile = this.getLocalProfile();
    const gasUrl = this.getGasUrl();
    if (!gasUrl) return;

    const payload = {
      user_id: profile?.id || '',
      ชื่อ: profile?.firstname || profile?.name || '',
      นามสกุล: profile?.lastname || '',
      โรงเรียน: profile?.school || '',
      เวลาบันทึกล่าสุด: new Date().toLocaleString('th-TH'),
      ...data
    };

    this.sendJsonp({
      action: 'saveData1',
      sheetName: 'data1',
      data: payload
    }).catch(err => {
      console.warn('Telemetry data1 send:', err);
    });

    const currentProg = this.getLocalProgress();
    this.syncProgressToCloud(currentProg);
  }

  static async submitQuizScores(quizType: 'pre' | 'post', score: number, answers: Record<number, number>): Promise<void> {
    const profile = this.getLocalProfile();
    if (!profile) return;

    if (quizType === 'pre') {
      this.saveLocalProgress({ preTestScore: score, preTestAnswers: answers });
      await this.sendTelemetry({
        กิจกรรมล่าสุด: "ส่งแบบทดสอบก่อนเรียน (Pre-test)",
        คะแนนก่อนเรียน: score,
        คะแนนหลังเรียน: "-",
        สถานะด่าน1: "ปลดล็อกแล้ว"
      });
    } else {
      const current = this.getLocalProgress();
      const preScore = current.preTestScore || 0;
      const diff = score - preScore;
      this.saveLocalProgress({ postTestScore: score, postTestAnswers: answers });
      await this.sendTelemetry({
        กิจกรรมล่าสุด: "ส่งแบบทดสอบหลังเรียน (Post-test)",
        คะแนนก่อนเรียน: preScore,
        คะแนนหลังเรียน: score,
        อัตราพัฒนาการ: `${diff >= 0 ? '+' : ''}${diff}`
      });
    }

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

    const current = this.getLocalProgress();
    const certCode = current.certCode || `LUNO-${Math.floor(100000 + Math.random() * 900000)}`;
    const today = new Date();
    const thMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const compDate = current.completionDate || `${today.getDate()} ${thMonths[today.getMonth()]} ${today.getFullYear() + 543}`;
    const totalAvg = ((averages.propriety + averages.feasibility + averages.utility) / 3).toFixed(2);

    this.saveLocalProgress({
      evaluationAnswers: details,
      evaluationComments: comments,
      certCode: certCode,
      completionDate: compDate,
      evaluationScores: {
        eval1: averages.propriety,
        eval2: averages.feasibility,
        eval3: averages.utility,
        avg: totalAvg
      }
    });

    await this.sendTelemetry({
      กิจกรรมล่าสุด: "สำเร็จโปรแกรม Luno สมบูรณ์",
      คะแนนก่อนเรียน: current.preTestScore || 0,
      คะแนนหลังเรียน: current.postTestScore || 0,
      อัตราพัฒนาการ: `${(current.postTestScore || 0) - (current.preTestScore || 0) >= 0 ? '+' : ''}${(current.postTestScore || 0) - (current.preTestScore || 0)}`,
      สถานะด่าน1: "ผ่านสมบูรณ์",
      สถานะด่าน2: "ผ่านสมบูรณ์",
      สถานะด่าน3: "ผ่านสมบูรณ์",
      สถานะด่าน4: "ผ่านสมบูรณ์",
      ความพึงพอใจเฉลี่ย: totalAvg,
      รหัสเกียรติบัตร: certCode
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

  // ส่งข้อมูลเข้า GAS ด้วย JSONP Script Injection (เสถียรที่สุด ข้าม CORS 100%)
  private static sendJsonp(params: { action?: string; sheetName?: string; data: any }): Promise<any> {
    return new Promise((resolve) => {
      const baseUrl = this.getGasUrl();
      if (!baseUrl) {
        resolve({ status: 'no_url' });
        return;
      }

      const callbackName = 'jsonp_cb_' + Date.now() + '_' + Math.floor(Math.random() * 100000);
      const script = document.createElement('script');
      let isHandled = false;

      const cleanup = () => {
        if (!isHandled) {
          isHandled = true;
          if ((window as any)[callbackName]) {
            try {
              delete (window as any)[callbackName];
            } catch {
              (window as any)[callbackName] = undefined;
            }
          }
          if (script.parentNode) script.parentNode.removeChild(script);
        }
      };

      const timer = setTimeout(() => {
        cleanup();
        resolve({ status: 'timeout' });
      }, 10000);

      (window as any)[callbackName] = function(response: any) {
        clearTimeout(timer);
        cleanup();
        console.log(`[Luno GAS Sync] Action: ${params.action || 'saveProgress'} =>`, response);
        resolve(response);
      };

      script.onerror = () => {
        clearTimeout(timer);
        cleanup();
        console.warn(`[Luno GAS Sync Error] Action: ${params.action}`);
        resolve({ status: 'error' });
      };

      const queryParams = new URLSearchParams({
        callback: callbackName,
        action: params.action || 'saveProgress',
        data: JSON.stringify(params.data)
      });
      if (params.sheetName) {
        queryParams.set('sheetName', params.sheetName);
      }

      script.src = `${baseUrl}?${queryParams.toString()}`;
      document.body.appendChild(script);
    });
  }

  private static async sendToGas(action: string, data: any): Promise<any> {
    return this.sendJsonp({ action, data });
  }

  static clearSession(): void {
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.USER_PROGRESS);
  }
}
