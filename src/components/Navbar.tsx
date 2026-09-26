import React, { useState } from 'react';
import type { UserProfile, UserProgress, StepId } from '../types';
import { RotateCcw, Lock, CheckCircle2, TrendingUp, Settings, User, BookOpen } from 'lucide-react';
import { CurriculumModal } from './CurriculumModal';

interface NavbarProps {
  profile: UserProfile | null;
  progress: UserProgress;
  onNavigateStep?: (step: StepId) => void;
  onLogout: () => void;
  onOpenSettings: () => void;
  onResetProgress?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  progress,
  onNavigateStep,
  onLogout,
  onOpenSettings,
  onResetProgress
}) => {
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);

  // คำนวณ % ความก้าวหน้า
  let stepsCompleted = 0;
  if (profile) stepsCompleted += 1;
  if (progress.completedSteps.includes('pre-test')) stepsCompleted += 1;
  if (progress.completedSteps.includes('level-1')) stepsCompleted += 1;
  if (progress.completedSteps.includes('level-2')) stepsCompleted += 1;
  if (progress.completedSteps.includes('level-3')) stepsCompleted += 1;
  if (progress.completedSteps.includes('level-4')) stepsCompleted += 1;
  if (progress.completedSteps.includes('post-test') || progress.completedSteps.includes('evaluation') || progress.currentStep === 'completed') stepsCompleted += 1;

  const currentPercent = Math.round((stepsCompleted / 7) * 100);

  // สิทธิ์ในการเข้าถึงด่านต่างๆ
  const isUnlocked = (step: StepId) => {
    if (step === 'login') return true;
    if (step === 'pre-test') return !!profile;
    if (step === 'level-1') return progress.completedSteps.includes('pre-test');
    if (step === 'level-2') return progress.completedSteps.includes('level-1');
    if (step === 'level-3') return progress.completedSteps.includes('level-2');
    if (step === 'level-4') return progress.completedSteps.includes('level-3');
    if (step === 'post-test' || step === 'completed') return progress.completedSteps.includes('level-4');
    return false;
  };

  const navTabs: { id: StepId; label: string }[] = [
    { id: 'login', label: 'แนะนำ & ข้อมูล' },
    { id: 'pre-test', label: 'ก่อนเรียน (Pre-test)' },
    { id: 'level-1', label: 'ด่าน 1: นักสื่อสาร' },
    { id: 'level-2', label: 'ด่าน 2: นักออกแบบ' },
    { id: 'level-3', label: 'ด่าน 3: ต้นแบบทีม' },
    { id: 'level-4', label: 'ด่าน 4: ผู้นำค่านิยม' },
    { id: 'post-test', label: 'หลังเรียน & วุฒิบัตร' },
  ];

  const handleTabClick = (tabId: StepId) => {
    if (!isUnlocked(tabId)) {
      alert('ด่านนี้ยังถูกล็อกอยู่ กรุณาทำกิจกรรมในด่านก่อนหน้าให้สำเร็จเพื่อปลดล็อก');
      return;
    }
    if (onNavigateStep) {
      if (tabId === 'post-test' && (progress.completedSteps.includes('evaluation') || progress.currentStep === 'completed')) {
        onNavigateStep('completed');
      } else {
        onNavigateStep(tabId);
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Title */}
        <div
          onClick={() => handleTabClick('login')}
          className="flex items-center space-x-3 cursor-pointer select-none"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-red-700 flex items-center justify-center text-white shadow-lg shadow-red-600/30 text-xl font-bold border border-red-400/40">
            L
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-200 to-white">
                LUNO
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-500/40 font-medium">
                รร.ขนาดเล็ก
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              โปรแกรมพัฒนาภาวะผู้นำดิจิทัล 4 ด่านต่อเนื่อง
            </p>
          </div>
        </div>

        {/* Overall Learning Progress */}
        {profile && (
          <div className="flex-1 max-w-xs sm:max-w-sm mx-2 hidden md:block">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-zinc-300 font-medium flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-red-400" />
                ความก้าวหน้าสะสม
              </span>
              <span className="text-red-300 font-bold">{currentPercent}%</span>
            </div>
            <div className="w-full bg-zinc-900 rounded-full h-2.5 overflow-hidden p-0.5 border border-zinc-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-600 via-rose-500 to-zinc-200 transition-all duration-500"
                style={{ width: `${currentPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* User Profile & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {profile && (
            <div className="hidden sm:flex items-center space-x-2 bg-zinc-900/90 px-3 py-1.5 rounded-xl border border-zinc-700 text-xs text-zinc-200">
              <User className="w-4 h-4 text-red-400" />
              <span className="font-medium truncate max-w-[150px]">
                {profile.name}
              </span>
            </div>
          )}

          {/* View Full Curriculum 100 pts */}
          <button
            onClick={() => setShowCurriculumModal(true)}
            title="ดูโครงสร้างหลักสูตร 10 องค์ประกอบย่อย (100 คะแนนเต็ม)"
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-red-950/70 hover:bg-red-900/80 text-red-200 border border-red-500/40 hover:border-red-400 transition flex items-center text-xs font-semibold gap-1.5 cursor-pointer shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">เกณฑ์หลักสูตร (100 คะแนน)</span>
            <span className="sm:hidden">หลักสูตร</span>
          </button>

          {onResetProgress && (
            <button
              onClick={onResetProgress}
              title="รีเซ็ตข้อมูลเริ่มต้น"
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-zinc-850 hover:bg-red-950/60 text-zinc-300 hover:text-red-300 border border-zinc-700 hover:border-red-500/50 transition flex items-center text-xs gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">รีเซ็ต</span>
            </button>
          )}

          <button
            onClick={onOpenSettings}
            title="ตั้งค่า Google Sheet"
            className="p-2 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 transition cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>

          {profile && (
            <button
              onClick={onLogout}
              title="ออกจากระบบ"
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-zinc-850 hover:bg-red-950/60 text-zinc-400 hover:text-red-300 border border-zinc-700 hover:border-red-500/50 transition flex items-center text-xs gap-1 cursor-pointer"
            >
              <span className="hidden sm:inline">ออก</span>
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Nav Tabs */}
      <div className="bg-zinc-950 border-t border-zinc-800/80 px-4 overflow-x-auto py-2 scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 min-w-max text-xs sm:text-sm">
          {navTabs.map(tab => {
            const unlocked = isUnlocked(tab.id);
            const isCurrent = progress.currentStep === tab.id ||
              (tab.id === 'post-test' && (progress.currentStep === 'evaluation' || progress.currentStep === 'completed')) ||
              (tab.id === 'login' && !profile);

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 cursor-pointer ${
                  isCurrent
                    ? 'bg-red-600/30 text-red-200 border border-red-500/50 shadow-xs'
                    : unlocked
                    ? 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                    : 'text-zinc-600 hover:text-zinc-500'
                }`}
              >
                {!unlocked ? (
                  <Lock className="w-3.5 h-3.5 text-zinc-600" />
                ) : progress.completedSteps.includes(tab.id) ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
                ) : null}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Curriculum Modal */}
      <CurriculumModal
        isOpen={showCurriculumModal}
        onClose={() => setShowCurriculumModal(false)}
      />
    </header>
  );
};
