import { useState, useEffect } from 'react';
import type { UserProfile, UserProgress, StepId } from './types';
import { ApiService } from './services/api';
import { COURSE_LEVELS } from './data/courseData';
import { Navbar } from './components/Navbar';
import { LoginScreen } from './components/LoginScreen';
import { DashboardFlow } from './components/DashboardFlow';
import { QuizView } from './components/QuizView';
import { LevelView } from './components/LevelView';
import { EvaluationView } from './components/EvaluationView';
import { CertificateView } from './components/CertificateView';
import { SettingsModal } from './components/SettingsModal';

export function App() {
  const [profile, setProfile] = useState<UserProfile | null>(() => ApiService.getLocalProfile());
  const [progress, setProgress] = useState<UserProgress>(() => ApiService.getLocalProgress());
  const [activeView, setActiveView] = useState<'flow' | 'step'>('step');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // ซิงก์โปรไฟล์และสถานะความก้าวหน้า
    if (profile) {
      const savedProg = ApiService.getLocalProgress();
      setProgress(savedProg);
    }
  }, [profile]);

  // ล็อกอิน
  const handleLogin = (newProfile: UserProfile) => {
    ApiService.saveLocalProfile(newProfile);
    setProfile(newProfile);

    // ตรวจสอบความก้าวหน้าเดิมที่มีอยู่
    const prog = ApiService.getLocalProgress();
    setProgress(prog);
    setActiveView('step');
  };

  // ออกจากระบบ
  const handleLogout = () => {
    if (confirm('ท่านต้องการออกจากระบบใช่หรือไม่? ข้อมูลของท่านจะถูกบันทึกไว้เสมอ')) {
      ApiService.clearSession();
      setProfile(null);
      setProgress({
        currentStep: 'pre-test',
        completedSteps: [],
        lastUpdated: new Date().toISOString()
      });
    }
  };

  // รีเซ็ตด่าน
  const handleResetProgress = () => {
    const initialProgress: UserProgress = {
      currentStep: 'pre-test',
      completedSteps: [],
      lastUpdated: new Date().toISOString()
    };
    ApiService.saveLocalProgress(initialProgress);
    setProgress(initialProgress);
    setActiveView('step');
  };

  // 1. ทำ Pre-test เสร็จสิ้น -> ปลดล็อก Level 1 ทันที
  const handlePreTestComplete = (score: number, answers: Record<number, number>) => {
    ApiService.submitQuizScores('pre', score, answers);
    const updated = ApiService.completeStep('pre-test', 'level-1');
    setProgress(updated);
    setActiveView('step');
  };

  // 2. ผ่านด่าน Level 1, 2, 3, 4
  const handleLevelComplete = (levelNumber: number) => {
    const currentLevelId = `level-${levelNumber}` as StepId;
    let nextStep: StepId = 'post-test';
    if (levelNumber < 4) {
      nextStep = `level-${levelNumber + 1}` as StepId;
    }

    const updated = ApiService.completeStep(currentLevelId, nextStep);
    setProgress(updated);
    setActiveView('step');
  };

  // 3. ทำ Post-test เสร็จสิ้น -> ปลดล็อกแบบประเมินรูปแบบ
  const handlePostTestComplete = (score: number, answers: Record<number, number>) => {
    ApiService.submitQuizScores('post', score, answers);
    const updated = ApiService.completeStep('post-test', 'evaluation');
    setProgress(updated);
    setActiveView('step');
  };

  // 4. ส่งแบบประเมินรูปแบบเสร็จสิ้น -> รับเกียรติบัตร
  const handleEvaluationComplete = (averages: { propriety: number; feasibility: number; utility: number }, details: Record<string, number>, comments: string) => {
    ApiService.submitEvaluation(averages, details, comments);
    const updated = ApiService.completeStep('evaluation', 'completed');
    setProgress(updated);
    setActiveView('step');
  };

  // ถ้ายังไม่ล็อกอิน ให้แสดงหน้า Login
  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar
          profile={null}
          progress={progress}
          onLogout={() => {}}
          onOpenSettings={() => setShowSettings(true)}
        />
        <main className="flex-1 flex items-center justify-center">
          <LoginScreen onLogin={handleLogin} />
        </main>
        <footer className="text-center py-5 text-xs text-slate-400 border-t border-slate-200">
          Luno Digital Leadership Development Program © 2026 — เพื่อการวิจัยและพัฒนาทางการศึกษา
        </footer>
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          onResetProgress={handleResetProgress}
        />
      </div>
    );
  }

  // เลือกว่าจะเรนเดอร์ Component ด่านไหน
  const renderCurrentStep = () => {
    // ถ้าผู้ใช้กดดูแผนผังภาพรวม
    if (activeView === 'flow') {
      return (
        <DashboardFlow
          progress={progress}
          onSelectStep={(step) => {
            ApiService.saveLocalProgress({ currentStep: step });
            setProgress(prev => ({ ...prev, currentStep: step }));
            setActiveView('step');
          }}
        />
      );
    }

    switch (progress.currentStep) {
      case 'pre-test':
        return (
          <QuizView
            quizType="pre"
            onComplete={handlePreTestComplete}
            onBackToDashboard={() => setActiveView('flow')}
          />
        );

      case 'level-1':
      case 'level-2':
      case 'level-3':
      case 'level-4': {
        const lvlNum = parseInt(progress.currentStep.replace('level-', ''), 10);
        const currentLevel = COURSE_LEVELS.find(l => l.levelNumber === lvlNum) || COURSE_LEVELS[0];
        return (
          <LevelView
            level={currentLevel}
            onCompleteLevel={() => handleLevelComplete(lvlNum)}
            onBackToDashboard={() => setActiveView('flow')}
          />
        );
      }

      case 'post-test':
        return (
          <QuizView
            quizType="post"
            onComplete={handlePostTestComplete}
            onBackToDashboard={() => setActiveView('flow')}
          />
        );

      case 'evaluation':
        return (
          <EvaluationView
            onSubmitEvaluation={handleEvaluationComplete}
            onBackToDashboard={() => setActiveView('flow')}
          />
        );

      case 'completed':
        return (
          <CertificateView
            profile={profile}
            progress={progress}
            onBackToDashboard={() => setActiveView('flow')}
          />
        );

      default:
        return (
          <DashboardFlow
            progress={progress}
            onSelectStep={(step) => {
              ApiService.saveLocalProgress({ currentStep: step });
              setProgress(prev => ({ ...prev, currentStep: step }));
              setActiveView('step');
            }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar
        profile={profile}
        progress={progress}
        onLogout={handleLogout}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* View Toggle Pill (หากไม่ได้อยู่ในหน้า Certificate) */}
      {progress.currentStep !== 'completed' && (
        <div className="print:hidden max-w-4xl mx-auto px-4 pt-4 w-full flex justify-end">
          <button
            onClick={() => setActiveView(prev => prev === 'flow' ? 'step' : 'flow')}
            className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50/80 border border-indigo-200/80 px-3.5 py-1.5 rounded-full transition cursor-pointer"
          >
            {activeView === 'flow' ? '← ทำด่านปัจจุบันต่อ' : '🗺️ ดูแผนผังทุกด่าน'}
          </button>
        </div>
      )}

      <main className="flex-1">
        {renderCurrentStep()}
      </main>

      <footer className="print:hidden text-center py-6 text-xs text-slate-500 border-t border-slate-200 mt-12">
        <p className="font-medium text-slate-600 mb-1">
          โปรแกรมพัฒนาภาวะผู้นำดิจิทัลสำหรับผู้บริหารสถานศึกษาขนาดเล็ก (Luno)
        </p>
        <p className="text-[11px] text-slate-400">
          งานวิจัยและพัฒนาทางการศึกษา ระยะที่ 3–4 การทดลองใช้และประเมินผลรูปแบบ
        </p>
      </footer>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onResetProgress={handleResetProgress}
      />
    </div>
  );
}

export default App;
