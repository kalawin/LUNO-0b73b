import React from 'react';
import type { UserProfile, UserProgress, StepId } from '../types';
import { LogOut, CheckCircle2, Database } from 'lucide-react';

interface NavbarProps {
  profile: UserProfile | null;
  progress: UserProgress;
  onLogout: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ profile, progress, onLogout, onOpenSettings }) => {
  // คำนวณ % ความก้าวหน้า
  const stepWeights: Record<StepId, number> = {
    'login': 0,
    'pre-test': 10,
    'level-1': 25,
    'level-2': 45,
    'level-3': 65,
    'level-4': 85,
    'post-test': 92,
    'evaluation': 97,
    'completed': 100
  };

  const currentPercent = stepWeights[progress.currentStep] || 0;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-800 to-indigo-600 flex items-center justify-center text-white shadow-sm font-bold text-xl">
            L
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-xl tracking-tight text-slate-900">Luno</span>
              <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full border border-indigo-200/60">
                Digital Leadership
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              โปรแกรมพัฒนาภาวะผู้นำดิจิทัลสำหรับผู้บริหารสถานศึกษาขนาดเล็ก
            </p>
          </div>
        </div>

        {/* User Info & Actions */}
        {profile && (
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Progress overview */}
            <div className="hidden md:flex flex-col items-end">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>ความก้าวหน้า: {currentPercent}%</span>
              </div>
              <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden mt-1 border border-slate-200">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500" 
                  style={{ width: `${currentPercent}%` }}
                />
              </div>
            </div>

            {/* Profile pill */}
            <div className="flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200 text-left">
              <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                {profile.name ? profile.name.charAt(0) : 'ผ'}
              </div>
              <div className="text-xs leading-tight">
                <p className="font-semibold text-slate-800 line-clamp-1">{profile.name}</p>
                <p className="text-slate-500 text-[11px] line-clamp-1">{profile.school}</p>
              </div>
            </div>

            {/* Settings button */}
            <button
              onClick={onOpenSettings}
              title="ตั้งค่า Google Sheet"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            >
              <Database className="w-4 h-4" />
            </button>

            {/* Logout button */}
            <button
              onClick={onLogout}
              title="ออกจากระบบ"
              className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
      
      {/* Mobile progress bar */}
      {profile && (
        <div className="md:hidden h-1 bg-slate-100 w-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500" 
            style={{ width: `${currentPercent}%` }}
          />
        </div>
      )}
    </header>
  );
};
