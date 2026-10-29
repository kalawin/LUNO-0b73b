import React from 'react';
import type { UserProfile, UserProgress, StepId } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Edit3
} from 'lucide-react';

interface RightSidebarProps {
  profile: UserProfile | null;
  progress: UserProgress;
  onSelectUnit: (stepId: StepId) => void;
  onOpenSettings: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  profile,
  progress,
  onSelectUnit,
  onOpenSettings
}) => {
  const completedUnits = progress.completedUnits || [];

  const tasks = [
    { id: '1.1', level: 'level-1' as StepId, title: 'แผนสื่อสาร 4 ช่อง', category: 'Module 1' },
    { id: '1.2', level: 'level-1' as StepId, title: 'สร้างเครือข่ายพันธมิตร', category: 'Module 1' },
    { id: '1.3', level: 'level-1' as StepId, title: 'ภาพลักษณ์ & PDPA', category: 'Module 1' },
    { id: '2.1', level: 'level-2' as StepId, title: 'โค้ชชิ่งครู 3 ครั้ง', category: 'Module 2' },
    { id: '2.2', level: 'level-2' as StepId, title: 'จัดสภาพแวดล้อม Quick Wins', category: 'Module 2' },
    { id: '2.3', level: 'level-2' as StepId, title: 'วัดและประเมินผลดิจิทัล', category: 'Module 2' },
    { id: '3.1', level: 'level-3' as StepId, title: 'ผู้นำต้นแบบ 1 วัน', category: 'Module 3' },
    { id: '3.2', level: 'level-3' as StepId, title: 'ทำงานร่วมกันด้วย Cloud', category: 'Module 3' },
    { id: '4.1', level: 'level-4' as StepId, title: 'สร้างวิสัยทัศน์ดิจิทัล', category: 'Module 4' },
    { id: '4.2', level: 'level-4' as StepId, title: 'เจตคติเชิงบวก (TAM)', category: 'Module 4' },
  ];

  const now = new Date();
  const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const currentDayIndex = (now.getDay() + 6) % 7; // จันทร์=0 ... อาทิตย์=6
  const currentDayNumber = now.getDate();
  const monthName = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  return (
    <aside className="w-80 bg-white border-l border-slate-100 flex flex-col p-6 shrink-0 h-full overflow-y-auto space-y-6 select-none">
      {/* Profile Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-lg text-slate-900">Profile</h2>
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="flex flex-col items-center text-center space-y-2 pb-2">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 via-rose-400 to-indigo-500 p-0.5 shadow-md">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-extrabold text-2xl">
                {profile?.name ? profile.name.trim().charAt(0) : 'ผ'}
              </div>
            </div>
            <span className="absolute bottom-0 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
              ✓
            </span>
          </div>

          <div>
            <div className="font-bold text-base text-slate-900 leading-snug">
              {profile?.name || 'ผู้บริหารสถานศึกษา'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              ผู้อำนวยการสถานศึกษา
            </div>
            <div className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full inline-block mt-1.5">
              {profile?.school || 'โรงเรียนขนาดเล็ก'}
            </div>
          </div>
        </div>
      </div>

      {/* Mini Calendar Widget (Dark Teal Card from sample image) */}
      <div className="bg-[#183945] text-white rounded-3xl p-5 shadow-lg shadow-teal-950/10 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <button type="button" className="p-1 hover:text-white transition">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>{monthName}</span>
          <button type="button" className="p-1 hover:text-white transition">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Day Name Headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-400">
          {dayNames.map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>

        {/* Days Row */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold">
          {dayNames.map((_, i) => {
            const isToday = i === currentDayIndex;
            const diff = i - currentDayIndex;
            const dayNum = currentDayNumber + diff;
            return (
              <div
                key={i}
                className={`py-1.5 rounded-full flex items-center justify-center ${
                  isToday
                    ? 'bg-[#d2f34c] text-slate-900 font-extrabold shadow-sm'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                {dayNum > 0 ? dayNum : ''}
              </div>
            );
          })}
        </div>
      </div>

      {/* Task List (10 Units from 4 Modules) */}
      <div className="space-y-3 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900">Task List (10 ภารกิจ)</h3>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            {completedUnits.length}/10 เสร็จแล้ว
          </span>
        </div>

        <div className="space-y-2 text-xs">
          {tasks.map(t => {
            const isDone = completedUnits.includes(t.id);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelectUnit(t.level)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isDone
                    ? 'bg-slate-50/80 border-slate-200 text-slate-700'
                    : 'bg-white border-slate-100 hover:border-teal-200 text-slate-800 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="shrink-0">
                    {isDone ? (
                      <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px]">
                        ✓
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                    )}
                  </div>
                  <div>
                    <div className={`font-semibold line-clamp-1 ${isDone ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {t.title}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      หน่วย {t.id} · {t.category}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400">
                  {isDone ? 'สำเร็จ' : 'เริ่ม'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
