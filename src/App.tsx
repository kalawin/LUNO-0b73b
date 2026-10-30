import { useState, useEffect } from 'react';
import type { UserProfile, UserProgress, StepId } from './types';
import { ApiService } from './services/api';
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
import { CurriculumModal } from './components/CurriculumModal';
import { Sidebar } from './components/Sidebar';
import { RightSidebar } from './components/RightSidebar';
import { Menu, X, ArrowLeft, User as UserIcon } from 'lucide-react';

export function App() {
  const [profile, setProfile] = useState<UserProfile | null>(() => ApiService.getLocalProfile());
  const [progress, setProgress] = useState<UserProgress>(() => ApiService.getLocalProgress());
  const [activeView, setActiveView] = useState<'flow' | 'step'>('flow');
  const [showSettings, setShowSettings] = useState(false);
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [isMobileLeftOpen, setIsMobileLeftOpen] = useState(false);
  const [isMobileRightOpen, setIsMobileRightOpen] = useState(false);

  useEffect(() => {
    if (profile) {
      const savedProg = ApiService.getLocalProgress();
      setProgress(savedProg);
    }
  }, [profile]);

  // เข้าสู่ระบบ
  const handleLogin = (newProfile: UserProfile) => {
    ApiService.saveLocalProfile(newProfile);
    setProfile(newProfile);

    const prog = ApiService.getLocalProgress();
    setProgress(prog);
    setActiveView('flow');
  };

  // ออกจากระบบ
  const handleLogout = () => {
    if (confirm('ท่านต้องการออกจากระบบใช่หรือไม่? ข้อมูลผลงานของท่านถูกบันทึกไว้อย่างปลอดภัย')) {
      ApiService.clearSession();
      setProfile(null);
      setProgress({
        currentStep: 'pre-test',
        completedSteps: [],
        lastUpdated: new Date().toISOString()
      });
      setIsMobileLeftOpen(false);
      setIsMobileRightOpen(false);
    }
  };

  // รีเซ็ตข้อมูลทั้งหมด
  const handleResetProgress = () => {
    if (confirm('ยืนยันการรีเซ็ตข้อมูลหรือไม่? คะแนน ความก้าวหน้า และผลงานจะถูกล้างเพื่อเริ่มต้นใหม่')) {
      ApiService.clearSession();
      setProfile(null);
      const initialProgress: UserProgress = {
        currentStep: 'pre-test',
        completedSteps: [],
        lastUpdated: new Date().toISOString()
      };
      setProgress(initialProgress);
      setActiveView('flow');
      setIsMobileLeftOpen(false);
      setIsMobileRightOpen(false);
    }
  };

  // 1. ทำ Pre-test เสร็จสิ้น -> ปลดล็อก Level 1
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

  // เปลี่ยนด่าน / เมนู
  const handleNavigateStep = (step: StepId | 'flow') => {
    setIsMobileLeftOpen(false);
    setIsMobileRightOpen(false);
    if (step === 'flow') {
      setActiveView('flow');
      return;
    }
    ApiService.saveLocalProgress({ currentStep: step });
    setProgress(prev => ({ ...prev, currentStep: step }));
    setActiveView('step');
  };

  // หากยังไม่ลงทะเบียน
  if (!profile) {
    return (
      <div className="min-h-screen bg-[#dce7eb] flex items-center justify-center p-3 sm:p-6 text-slate-800 font-sans selection:bg-teal-500 selection:text-white">
        <div className="w-full max-w-5xl bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl border border-slate-200/70 p-6 sm:p-12 overflow-hidden">
          <LoginScreen onLogin={handleLogin} />
          
          <div className="text-center pt-8 border-t border-slate-100 mt-8 text-xs text-slate-400">
            <p className="font-semibold text-slate-600 mb-0.5">
              Luno Digital Leadership Development Program © 2026 — เพื่อการวิจัยและพัฒนาทางการศึกษา
            </p>
            <p className="text-[11px] text-slate-400">
              คณะศึกษาศาสตร์ มหาวิทยาลัยขอนแก่น
            </p>
          </div>
        </div>
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
          profile={profile}
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

      case 'level-5':
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
            <div className="text-6xl">🧪</div>
            <h1 className="text-3xl font-bold text-slate-800">Module 5 — Test Page</h1>
            <p className="text-lg text-slate-500 max-w-md">
              หน้านี้ใช้ทดสอบระบบ Auto Deploy<br />
              ถ้าเห็นหน้านี้ แสดงว่า deploy สำเร็จ!
            </p>
            <p className="text-sm text-slate-400">
              Deployed at: {new Date().toLocaleString('th-TH')}
            </p>
            <button
              onClick={() => setActiveView('flow')}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
            >
              ← กลับหน้าหลัก
            </button>
          </div>
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
            profile={profile}
            onSelectStep={(step) => {
              handleNavigateStep(step);
            }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#dce7eb] flex items-center justify-center p-2 sm:p-5 lg:p-7 text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
      {/* Main Tablet Canvas Container (Matching the user's reference design) */}
      <div className="w-full max-w-[1560px] bg-white rounded-[28px] sm:rounded-[36px] lg:rounded-[40px] shadow-2xl shadow-slate-400/25 border border-slate-200/80 overflow-hidden flex flex-col h-[94vh] max-h-[1050px]">
        
        {/* Mobile Header (Hidden on large screens) */}
        <header className="lg:hidden flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-white shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileLeftOpen(true)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="font-extrabold text-base text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>LUNO</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                R&D
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeView === 'step' && (
              <button
                type="button"
                onClick={() => setActiveView('flow')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> ภาพรวม
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsMobileRightOpen(true)}
              className="p-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              <UserIcon className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* 3-Column Content Layout */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* 1. Left Navigation Sidebar (Desktop) */}
          <div className="hidden lg:block shrink-0 h-full">
            <Sidebar
              currentStep={progress.currentStep}
              activeView={activeView}
              progress={progress}
              onNavigate={handleNavigateStep}
              onOpenSettings={() => setShowSettings(true)}
              onLogout={handleLogout}
              onOpenCurriculum={() => setShowCurriculumModal(true)}
            />
          </div>

          {/* Mobile Left Sidebar Drawer */}
          {isMobileLeftOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
                onClick={() => setIsMobileLeftOpen(false)}
              />
              <div className="relative w-72 max-w-full bg-white h-full shadow-2xl flex flex-col z-10">
                <div className="flex justify-end p-3 border-b border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsMobileLeftOpen(false)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <Sidebar
                    currentStep={progress.currentStep}
                    activeView={activeView}
                    progress={progress}
                    onNavigate={handleNavigateStep}
                    onOpenSettings={() => {
                      setIsMobileLeftOpen(false);
                      setShowSettings(true);
                    }}
                    onLogout={handleLogout}
                    onOpenCurriculum={() => {
                      setIsMobileLeftOpen(false);
                      setShowCurriculumModal(true);
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. Center Column: Main Workspace */}
          <main className="flex-1 min-w-0 h-full overflow-y-auto p-4 sm:p-6 lg:p-7 flex flex-col bg-white">
            {/* Top breadcrumb when viewing an active step */}
            {activeView === 'step' && (
              <div className="mb-4 flex items-center justify-between pb-3 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveView('flow')}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> กลับสู่ภาพรวมแดชบอร์ด (Overview)
                </button>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <span>สถานะปัจจุบัน:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-mono text-[11px]">
                    {progress.currentStep}
                  </span>
                </div>
              </div>
            )}

            <div className="flex-1">
              {renderCurrentStep()}
            </div>
          </main>

          {/* 3. Right Sidebar (Desktop xl: display) */}
          <div className="hidden xl:block shrink-0 h-full">
            <RightSidebar
              profile={profile}
              progress={progress}
              onSelectUnit={(step) => handleNavigateStep(step)}
              onOpenSettings={() => setShowSettings(true)}
            />
          </div>

          {/* Mobile Right Sidebar Drawer */}
          {isMobileRightOpen && (
            <div className="xl:hidden fixed inset-0 z-50 flex justify-end">
              <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
                onClick={() => setIsMobileRightOpen(false)}
              />
              <div className="relative w-80 max-w-full bg-white h-full shadow-2xl flex flex-col z-10">
                <div className="flex justify-between items-center p-3 border-b border-slate-100">
                  <span className="font-extrabold text-sm text-slate-800">โปรไฟล์ & ปฏิทิน</span>
                  <button
                    type="button"
                    onClick={() => setIsMobileRightOpen(false)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <RightSidebar
                    profile={profile}
                    progress={progress}
                    onSelectUnit={(step) => {
                      setIsMobileRightOpen(false);
                      handleNavigateStep(step);
                    }}
                    onOpenSettings={() => {
                      setIsMobileRightOpen(false);
                      setShowSettings(true);
                    }}
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Curriculum Modal */}
      {showCurriculumModal && (
        <CurriculumModal
          isOpen={showCurriculumModal}
          onClose={() => setShowCurriculumModal(false)}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onResetProgress={handleResetProgress}
      />
    </div>
  );
}

export default App;
