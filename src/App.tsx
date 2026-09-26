import { useState, useEffect } from 'react';
import type { UserProfile, UserProgress, StepId } from './types';
import { ApiService } from './services/api';
import { Navbar } from './components/Navbar';
import { LoginScreen } from './components/LoginScreen';
import { DashboardFlow } from './components/DashboardFlow';
import { QuizView } from './components/QuizView';
import { Level1Interactive } from './components/Level1Interactive';
import { Level2Interactive } from './components/Level2Interactive';
import { Level3Interactive } from './components/Level3Interactive';
import { Level4Interactive } from './components/Level4Interactive';
import { EvaluationView } from './components/EvaluationView';
import { CertificateView } from './components/CertificateView';
import { SettingsModal } from './components/SettingsModal';

export function App() {
  const [profile, setProfile] = useState<UserProfile | null>(() => ApiService.getLocalProfile());
  const [progress, setProgress] = useState<UserProgress>(() => ApiService.getLocalProgress());
  const [activeView, setActiveView] = useState<'flow' | 'step'>('step');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (profile) {
      const savedProg = ApiService.getLocalProgress();
      setProgress(savedProg);
    }
  }, [profile]);

  // ล็อกอิน
  const handleLogin = (newProfile: UserProfile) => {
    ApiService.saveLocalProfile(newProfile);
    setProfile(newProfile);

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

  // รีเซ็ตข้อมูลทั้งหมด
  const handleResetProgress = () => {
    if (confirm('ยืนยันการรีเซ็ตข้อมูลหรือไม่? ข้อมูลคะแนน ความก้าวหน้า และวุฒิบัตรจะถูกล้างเพื่อเริ่มใหม่')) {
      ApiService.clearSession();
      setProfile(null);
      const initialProgress: UserProgress = {
        currentStep: 'pre-test',
        completedSteps: [],
        lastUpdated: new Date().toISOString()
      };
      setProgress(initialProgress);
      setActiveView('step');
    }
  };

  // 1. ทำ Pre-test เสร็จสิ้น -> ปลดล็อก Level 1 ทันที
  const handlePreTestComplete = (score: number, answers: Record<number, number>) => {
    ApiService.submitQuizScores('pre', score, answers);
    const updated = ApiService.completeStep('pre-test', 'level-1');
    setProgress(updated);
    setActiveView('step');
  };

  // 2. ผ่านด่าน Level 1
  const handleLevel1Complete = () => {
    const updated = ApiService.completeStep('level-1', 'level-2');
    setProgress(updated);
    setActiveView('step');
  };

  // 3. ผ่านด่าน Level 2
  const handleLevel2Complete = () => {
    const updated = ApiService.completeStep('level-2', 'level-3');
    setProgress(updated);
    setActiveView('step');
  };

  // 4. ผ่านด่าน Level 3
  const handleLevel3Complete = () => {
    const updated = ApiService.completeStep('level-3', 'level-4');
    setProgress(updated);
    setActiveView('step');
  };

  // 5. ผ่านด่าน Level 4
  const handleLevel4Complete = () => {
    const updated = ApiService.completeStep('level-4', 'post-test');
    setProgress(updated);
    setActiveView('step');
  };

  // 6. ทำ Post-test เสร็จสิ้น -> ไปที่แบบประเมิน
  const handlePostTestComplete = (score: number, answers: Record<number, number>) => {
    ApiService.submitQuizScores('post', score, answers);
    const updated = ApiService.completeStep('post-test', 'evaluation');
    setProgress(updated);
    setActiveView('step');
  };

  // 7. ส่งแบบประเมินเสร็จสิ้น -> ออกวุฒิบัตร
  const handleEvaluationComplete = (
    averages: { propriety: number; feasibility: number; utility: number },
    details: Record<string, number>,
    comments: string
  ) => {
    ApiService.submitEvaluation(averages, details, comments);
    const updated = ApiService.completeStep('evaluation', 'completed');
    setProgress(updated);
    setActiveView('step');
  };

  // เปลี่ยนด่านจาก Navbar หรือแผนผัง
  const handleNavigateStep = (step: StepId) => {
    if (step === 'login') {
      // กลับหน้าแนะนำ
      setActiveView('step');
      return;
    }
    ApiService.saveLocalProgress({ currentStep: step });
    setProgress(prev => ({ ...prev, currentStep: step }));
    setActiveView('step');
  };

  // หากยังไม่ลงทะเบียน
  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white">
        <Navbar
          profile={null}
          progress={progress}
          onLogout={() => {}}
          onOpenSettings={() => setShowSettings(true)}
        />
        <main className="flex-1 flex items-center justify-center">
          <LoginScreen onLogin={handleLogin} />
        </main>
        <footer className="text-center py-6 text-xs text-slate-500 border-t border-slate-200 bg-white/60">
          <p className="font-semibold text-slate-700 mb-1">
            Luno Digital Leadership Development Program © 2026 — เพื่อการวิจัยและพัฒนาทางการศึกษา
          </p>
          <p className="text-[12px] text-slate-500">
            ผู้พัฒนา: กาลวิน อดทน, ณัฎฐธิดา ใจอักษร, บุษยา ศรีเพชร์ คณะศึกษาศาสตร์ มข.
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

  // เรนเดอร์ด่านปัจจุบัน
  const renderCurrentStep = () => {
    if (activeView === 'flow') {
      return (
        <DashboardFlow
          progress={progress}
          onSelectStep={(step) => {
            handleNavigateStep(step);
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
        return (
          <Level1Interactive
            onPassLevel={handleLevel1Complete}
            onBackToDashboard={() => setActiveView('flow')}
          />
        );

      case 'level-2':
        return (
          <Level2Interactive
            onPassLevel={handleLevel2Complete}
            onBackToDashboard={() => setActiveView('flow')}
          />
        );

      case 'level-3':
        return (
          <Level3Interactive
            onPassLevel={handleLevel3Complete}
            onBackToDashboard={() => setActiveView('flow')}
          />
        );

      case 'level-4':
        return (
          <Level4Interactive
            onPassLevel={handleLevel4Complete}
            onBackToDashboard={() => setActiveView('flow')}
          />
        );

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
              handleNavigateStep(step);
            }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white">
      <Navbar
        profile={profile}
        progress={progress}
        onNavigateStep={handleNavigateStep}
        onLogout={handleLogout}
        onOpenSettings={() => setShowSettings(true)}
        onResetProgress={handleResetProgress}
      />

      {/* View Toggle Pill */}
      {progress.currentStep !== 'completed' && (
        <div className="print:hidden max-w-5xl mx-auto px-4 pt-3 w-full flex justify-end">
          <button
            onClick={() => setActiveView(prev => prev === 'flow' ? 'step' : 'flow')}
            className="text-xs font-semibold text-teal-800 hover:text-teal-900 bg-white hover:bg-teal-50 border border-teal-200 shadow-2xs px-4 py-2 rounded-full transition cursor-pointer flex items-center gap-1.5"
          >
            {activeView === 'flow' ? '← กลับไปทำด่านปัจจุบัน' : '🗺️ แผนผังการเรียนรู้ 4 ด่าน'}
          </button>
        </div>
      )}

      <main className="flex-1">
        {renderCurrentStep()}
      </main>

      <footer className="print:hidden text-center py-6 text-xs text-slate-500 border-t border-slate-200 mt-12 bg-white/60">
        <p className="font-semibold text-slate-700 mb-1">
          Luno: โปรแกรมพัฒนาภาวะผู้นำดิจิทัลสำหรับผู้บริหารสถานศึกษาขนาดเล็ก
        </p>
        <p className="text-[12px] text-slate-500">
          © 2026 กาลวิน อดทน, ณัฎฐธิดา ใจอักษร, บุษยา ศรีเพชร์ คณะศึกษาศาสตร์ มข. — เพื่อการวิจัยและพัฒนาทางการศึกษา
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
