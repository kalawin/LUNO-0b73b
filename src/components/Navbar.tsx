import React, { useState } from 'react';
import type { UserProfile, UserProgress, StepId } from '../types';
import { RotateCcw, Lock, CheckCircle2, TrendingUp, Settings, User, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
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
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Title */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => handleTabClick('login')}
          className="flex items-center space-x-3 cursor-pointer select-none"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-sky-500 flex items-center justify-center text-white shadow-md shadow-teal-500/25 text-xl font-bold border border-emerald-400/40">
            L
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-teal-700 to-sky-700">
                LUNO
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                รร.ขนาดเล็ก
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              โปรแกรมพัฒนาภาวะผู้นำดิจิทัล 4 ด่านต่อเนื่อง
            </p>
          </div>
        </motion.div>

        {/* Overall Learning Progress */}
        {profile && (
          <div className="flex-1 max-w-xs sm:max-w-sm mx-2 hidden md:block">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-700 font-medium flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                ความก้าวหน้าสะสม
              </span>
              <span className="text-teal-700 font-bold">{currentPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 transition-all duration-500 shadow-xs"
                style={{ width: `${currentPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* User Profile & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {profile && (
            <div className="hidden sm:flex items-center space-x-2 bg-slate-50/90 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800">
              <User className="w-4 h-4 text-teal-600" />
              <span className="font-semibold truncate max-w-[150px]">
                {profile.name}
              </span>
            </div>
          )}

          {/* View Full Curriculum 100 pts */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowCurriculumModal(true)}
            title="ดูโครงสร้างหลักสูตร 10 องค์ประกอบย่อย (100 คะแนนเต็ม)"
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100/90 text-teal-800 border border-teal-300/80 hover:border-teal-400 transition flex items-center text-xs font-semibold gap-1.5 cursor-pointer shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-teal-600" />
            <span className="hidden sm:inline">เกณฑ์หลักสูตร (100 คะแนน)</span>
            <span className="sm:hidden">หลักสูตร</span>
          </motion.button>

          {onResetProgress && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onResetProgress}
              title="รีเซ็ตข้อมูลเริ่มต้น"
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 transition flex items-center text-xs gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">รีเซ็ต</span>
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenSettings}
            title="ตั้งค่า Google Sheet"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 border border-slate-200 transition cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </motion.button>

          {profile && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onLogout}
              title="ออกจากระบบ"
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 transition flex items-center text-xs gap-1 cursor-pointer"
            >
              <span className="hidden sm:inline">ออก</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Horizontal Nav Tabs (เขียว-ฟ้า) */}
      <div className="bg-slate-50/95 border-t border-slate-200/80 px-4 overflow-x-auto py-2 scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 min-w-max text-xs sm:text-sm">
          {navTabs.map(tab => {
            const unlocked = isUnlocked(tab.id);
            const isCurrent = progress.currentStep === tab.id ||
              (tab.id === 'post-test' && (progress.currentStep === 'evaluation' || progress.currentStep === 'completed')) ||
              (tab.id === 'login' && !profile);
            const isFinished = progress.completedSteps.includes(tab.id);

            return (
              <motion.button
                key={tab.id}
                whileHover={unlocked ? { scale: 1.02 } : undefined}
                whileTap={unlocked ? { scale: 0.98 } : undefined}
                onClick={() => handleTabClick(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 cursor-pointer ${
                  isCurrent
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs font-semibold'
                    : isFinished
                    ? 'bg-white text-emerald-800 border border-emerald-200/80 hover:bg-emerald-50 shadow-xs'
                    : unlocked
                    ? 'text-slate-700 hover:text-slate-900 hover:bg-white border border-transparent'
                    : 'text-slate-400 opacity-60 cursor-not-allowed border border-transparent'
                }`}
              >
                {!unlocked ? (
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                ) : isFinished ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : null}
                <span>{tab.label}</span>
              </motion.button>
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
