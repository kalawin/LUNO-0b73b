import React from 'react';
import type { StepId, UserProgress } from '../types';
import { 
  LayoutGrid, 
  BookOpen, 
  BarChart2, 
  CheckSquare, 
  Settings, 
  LogOut, 
  Sparkles,
  Award,
  GraduationCap,
  Lock,
  CheckCircle2
} from 'lucide-react';

interface SidebarProps {
  currentStep: StepId;
  activeView: 'flow' | 'step';
  progress: UserProgress;
  onNavigate: (step: StepId | 'flow') => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  onOpenCurriculum: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentStep,
  activeView,
  progress,
  onNavigate,
  onOpenSettings,
  onLogout,
  onOpenCurriculum
}) => {
  const completedUnits = progress.completedUnits || [];
  const completedSteps = progress.completedSteps || [];
  const completedUnitsCount = completedUnits.length;
  const pendingUnitsCount = Math.max(0, 10 - completedUnitsCount);

  // ตรวจสอบสิทธิ์แต่ละเมนู
  const isPreTestDone = completedSteps.includes('pre-test');
  const isModulesUnlocked = isPreTestDone;
  const isAllModulesDone = completedUnitsCount >= 10;
  const isPostTestDone = completedSteps.includes('post-test');
  const isEvaluationDone = completedSteps.includes('evaluation');

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between p-6 shrink-0 h-full select-none">
      {/* Brand & Logo */}
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="font-extrabold text-xl text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>LUNO</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                R&D
              </span>
            </div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              E-LEARNING PLATFORM
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5 text-sm font-semibold">
          {/* Overview / แดชบอร์ด */}
          <button
            type="button"
            onClick={() => onNavigate('flow')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all cursor-pointer ${
              activeView === 'flow'
                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <LayoutGrid className="w-5 h-5 shrink-0" />
            <span>Overview (ภาพรวม)</span>
          </button>

          {/* 4 Modules (10 หน่วย) */}
          <button
            type="button"
            onClick={() => {
              if (!isModulesUnlocked) {
                alert('🔒 กรุณาทำแบบทดสอบก่อนเรียน (Pre-test) ให้เสร็จสิ้นก่อนเริ่ม 4 Modules');
                return;
              }
              if (currentStep.startsWith('level-')) {
                onNavigate(currentStep);
              } else {
                onNavigate('level-1');
              }
            }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
              !isModulesUnlocked
                ? 'text-slate-400 opacity-60 cursor-not-allowed'
                : activeView === 'step' && currentStep.startsWith('level-')
                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10 cursor-pointer'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 cursor-pointer'
            }`}
          >
            <div className="flex items-center gap-3">
              {isModulesUnlocked ? (
                <BookOpen className="w-5 h-5 shrink-0" />
              ) : (
                <Lock className="w-5 h-5 shrink-0 text-slate-400" />
              )}
              <span>4 Modules</span>
            </div>
            {isModulesUnlocked ? (
              pendingUnitsCount > 0 ? (
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  activeView === 'step' && currentStep.startsWith('level-')
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-500 text-white'
                }`}>
                  {completedUnitsCount}/10
                </span>
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              )
            ) : (
              <Lock className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {/* แบบทดสอบ (Pre-test & Post-test) */}
          <button
            type="button"
            onClick={() => {
              if (isAllModulesDone) {
                onNavigate('post-test');
              } else {
                onNavigate('pre-test');
              }
            }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all cursor-pointer ${
              activeView === 'step' && (currentStep === 'pre-test' || currentStep === 'post-test')
                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <BarChart2 className="w-5 h-5 shrink-0" />
              <span>{isAllModulesDone ? 'แบบทดสอบหลังเรียน' : 'แบบทดสอบก่อนเรียน'}</span>
            </div>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              (isPreTestDone && !isAllModulesDone)
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-slate-100 text-slate-600'
            }`}>
              {isPreTestDone && !isAllModulesDone ? 'ทำแล้ว' : '10 ข้อ'}
            </span>
          </button>

          {/* แบบประเมิน Luno */}
          <button
            type="button"
            onClick={() => {
              if (!isPostTestDone) {
                alert('🔒 แบบประเมินจะปลดล็อกหลังจากทำแบบทดสอบหลังเรียน (Post-test) เสร็จสิ้น');
                return;
              }
              onNavigate('evaluation');
            }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
              !isPostTestDone
                ? 'text-slate-400 opacity-60 cursor-not-allowed'
                : activeView === 'step' && currentStep === 'evaluation'
                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10 cursor-pointer'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 cursor-pointer'
            }`}
          >
            <div className="flex items-center gap-3">
              {isPostTestDone ? (
                <CheckSquare className="w-5 h-5 shrink-0" />
              ) : (
                <Lock className="w-5 h-5 shrink-0 text-slate-400" />
              )}
              <span>แบบประเมิน Luno</span>
            </div>
            {isEvaluationDone ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : !isPostTestDone ? (
              <Lock className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                พร้อมทำ
              </span>
            )}
          </button>

          {/* วุฒิบัตร / ผลงาน */}
          <button
            type="button"
            onClick={() => {
              if (!isEvaluationDone) {
                alert('🔒 เกียรติบัตรจะปลดล็อกหลังจากประเมินรูปแบบการวิจัยเสร็จสิ้น');
                return;
              }
              onNavigate('completed');
            }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
              !isEvaluationDone
                ? 'text-slate-400 opacity-60 cursor-not-allowed'
                : activeView === 'step' && currentStep === 'completed'
                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10 cursor-pointer'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 cursor-pointer'
            }`}
          >
            <div className="flex items-center gap-3">
              {isEvaluationDone ? (
                <Award className="w-5 h-5 shrink-0 text-amber-500" />
              ) : (
                <Lock className="w-5 h-5 shrink-0 text-slate-400" />
              )}
              <span>เกียรติบัตร & ผลงาน</span>
            </div>
            {!isEvaluationDone && (
              <Lock className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {/* ตั้งค่า */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Settings className="w-5 h-5 shrink-0" />
            <span>ตั้งค่าระบบ (Settings)</span>
          </button>
        </nav>
      </div>

      {/* Bottom Area: Promo / Info Card & Logout */}
      <div className="space-y-4 pt-6">
        {/* Soft Modern Info Card */}
        <div className="rounded-3xl p-4 bg-gradient-to-br from-[#e6f4fe] to-[#edf7fe] border border-[#d6ecfd] relative overflow-hidden text-center">
          <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-teal-600 mx-auto mb-2">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="font-extrabold text-sm text-slate-900 mb-1">
            โครงสร้างหลักสูตร
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
            10 องค์ประกอบ 100 คะแนน เพื่อพัฒนาภาวะผู้นำดิจิทัล
          </p>
          <button
            type="button"
            onClick={onOpenCurriculum}
            className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition cursor-pointer"
          >
            ดูรายละเอียดหลักสูตร
          </button>
        </div>

        {/* Log Out */}
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 font-semibold text-xs transition cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>ออกจากระบบ (Log Out)</span>
        </button>
      </div>
    </aside>
  );
};
