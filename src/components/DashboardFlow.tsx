import React, { useState } from 'react';
import type { UserProgress, StepId, UserProfile } from '../types';
import { 
  Search, 
  Bell, 
  BookOpen, 
  Clock, 
  Award, 
  ArrowRight,
  ChevronDown,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { CurriculumModal } from './CurriculumModal';

interface DashboardFlowProps {
  progress: UserProgress;
  profile: UserProfile | null;
  onSelectStep: (step: StepId) => void;
}

export const DashboardFlow: React.FC<DashboardFlowProps> = ({ progress, profile, onSelectStep }) => {
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [courseFilter, setCourseFilter] = useState<'ongoing' | 'completed'>('ongoing');
  const [searchQuery, setSearchQuery] = useState('');

  const completedUnits = progress.completedUnits || [];
  const completedSteps = progress.completedSteps || [];
  const completedCount = completedUnits.length;
  const overallPercent = Math.round((completedCount / 10) * 100);

  // คำนวณความก้าวหน้าของแต่ละ Module
  const m1Units = ['1.1', '1.2', '1.3'];
  const m2Units = ['2.1', '2.2', '2.3'];
  const m3Units = ['3.1', '3.2'];
  const m4Units = ['4.1', '4.2'];

  const m1Done = m1Units.filter(u => completedUnits.includes(u)).length;
  const m2Done = m2Units.filter(u => completedUnits.includes(u)).length;
  const m3Done = m3Units.filter(u => completedUnits.includes(u)).length;
  const m4Done = m4Units.filter(u => completedUnits.includes(u)).length;

  const m1Pct = Math.round((m1Done / 3) * 100);
  const m2Pct = Math.round((m2Done / 3) * 100);
  const m3Pct = Math.round((m3Done / 2) * 100);
  const m4Pct = Math.round((m4Done / 2) * 100);

  // ตรวจสอบเงื่อนไขการปลดล็อกแต่ละ Module
  const isM1Unlocked = completedSteps.includes('pre-test');
  const isM2Unlocked = m1Done === 3;
  const isM3Unlocked = isM2Unlocked && m2Done === 3;
  const isM4Unlocked = isM3Unlocked && m3Done === 2;

  const modules = [
    {
      id: 'level-1' as StepId,
      code: 'Module 1',
      title: 'การสื่อสารเชิงดิจิทัล (Digital Communication)',
      desc: 'หน่วย 1.1, 1.2, 1.3 · แผนสื่อสาร 4 ช่อง เครือข่ายพันธมิตร และภาพลักษณ์ PDPA',
      duration: '3.2 ชม.',
      colorBg: 'bg-[#fff9e6]',
      colorBorder: 'border-[#fdeec3]',
      barColor: 'bg-amber-400',
      badgeColor: 'text-amber-800 bg-amber-100',
      percent: m1Pct,
      doneCount: m1Done,
      totalCount: 3,
      isUnlocked: isM1Unlocked,
      lockMsg: 'ต้องทำ Pre-test ให้เสร็จสิ้นก่อน'
    },
    {
      id: 'level-2' as StepId,
      code: 'Module 2',
      title: 'การสร้างวิถีการเรียนรู้เชิงดิจิทัล (Digital Learning Culture)',
      desc: 'หน่วย 2.1, 2.2, 2.3 · แผนโค้ชครู 3 ครั้ง สภาพแวดล้อม Quick Wins และ Data Decision',
      duration: '2.8 ชม.',
      colorBg: 'bg-[#f4f3ff]',
      colorBorder: 'border-[#e4dfff]',
      barColor: 'bg-indigo-500',
      badgeColor: 'text-indigo-800 bg-indigo-100',
      percent: m2Pct,
      doneCount: m2Done,
      totalCount: 3,
      isUnlocked: isM2Unlocked,
      lockMsg: 'ปลดล็อกเมื่อผ่าน Module 1 ครบทั้ง 3 หน่วย'
    },
    {
      id: 'level-3' as StepId,
      code: 'Module 3',
      title: 'การพัฒนาด้านการทำงานเป็นทีมสู่ความเป็นมืออาชีพ (Professional Teamwork)',
      desc: 'หน่วย 3.1, 3.2 · Micro-journal ผู้นำต้นแบบ 1 วัน และผังการทำงานทีมบน Cloud',
      duration: '1.2 ชม.',
      colorBg: 'bg-[#eaf8f5]',
      colorBorder: 'border-[#d2f1eb]',
      barColor: 'bg-teal-500',
      badgeColor: 'text-teal-800 bg-teal-100',
      percent: m3Pct,
      doneCount: m3Done,
      totalCount: 2,
      isUnlocked: isM3Unlocked,
      lockMsg: 'ปลดล็อกเมื่อผ่าน Module 2 ครบทั้ง 3 หน่วย'
    },
    {
      id: 'level-4' as StepId,
      code: 'Module 4',
      title: 'การสร้างค่านิยมเชิงดิจิทัล (Digital Values & Culture)',
      desc: 'หน่วย 4.1, 4.2 · วิสัยทัศน์ดิจิทัล 3-4 ประโยค และกิจกรรมสร้างแรงจูงใจ TAM Model',
      duration: '1.5 ชม.',
      colorBg: 'bg-[#fff2f0]',
      colorBorder: 'border-[#fde2de]',
      barColor: 'bg-rose-500',
      badgeColor: 'text-rose-800 bg-rose-100',
      percent: m4Pct,
      doneCount: m4Done,
      totalCount: 2,
      isUnlocked: isM4Unlocked,
      lockMsg: 'ปลดล็อกเมื่อผ่าน Module 3 ครบทั้ง 2 หน่วย'
    }
  ];

  const filteredModules = modules.filter(m => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!m.title.toLowerCase().includes(q) && !m.desc.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (courseFilter === 'completed') {
      return m.percent === 100;
    }
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-7 bg-white">
      {/* Top Header Greeting Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Hello {profile?.firstname || profile?.name?.split(' ')[0] || 'Leader'}!
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">
            Let's learn something new today! (ยินดีต้อนรับสู่โปรแกรม LUNO)
          </p>
        </div>

        {/* Search & Notification Bar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search from courses..."
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 w-52 sm:w-64 transition"
            />
          </div>

          <button
            type="button"
            className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition relative"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2.5 right-2.5" />
          </button>
        </div>
      </div>

      {/* Top 3 Pastel Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Lessons / Units (Pastel Purple) */}
        <div className="bg-[#eef0ff] border border-[#dcdfff] rounded-3xl p-5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-indigo-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                Lessons (หน่วย)
              </div>
              <div className="text-2xl font-black text-slate-900 mt-0.5">
                {completedCount} <span className="text-xs font-semibold text-slate-400">/ 10 หน่วย</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Hours Spent (Pastel Sky) */}
        <div className="bg-[#e6f6fe] border border-[#c8edf9] rounded-3xl p-5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-sky-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-sky-900 uppercase tracking-wider">
                Hours (เวลาสะสม)
              </div>
              <div className="text-2xl font-black text-slate-900 mt-0.5">
                8.7 <span className="text-xs font-semibold text-slate-400">ชม. ตามแผน</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Certificates / Progress (Pastel Pink) */}
        <div className="bg-[#fceef5] border border-[#fad7e8] rounded-3xl p-5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-pink-600">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-pink-900 uppercase tracking-wider">
                Certificates (วุฒิบัตร)
              </div>
              <div className="text-2xl font-black text-slate-900 mt-0.5">
                {overallPercent}% <span className="text-xs font-semibold text-slate-400">เสร็จสมบูรณ์</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Analytics Row: Hours Spent Chart & Performance Speedometer */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        {/* Hours Spent / Modules Bar Chart (3 Cols) */}
        <div className="md:col-span-3 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900">
              Hours Spent (ความก้าวหน้า 4 โมดูล)
            </h3>
            <div className="flex items-center gap-1 px-3 py-1 bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 rounded-xl cursor-pointer">
              <span>รายโมดูล</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-44 flex items-end justify-around pt-6 pb-2 px-4 border-b border-dashed border-slate-100">
            {/* Bar 1 */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-[11px] font-bold text-slate-500">{m1Pct}%</div>
              <div className="w-9 h-32 bg-slate-100 rounded-xl relative overflow-hidden">
                <div 
                  style={{ height: `${m1Pct}%` }}
                  className="w-full bg-[#ff7a59] rounded-xl absolute bottom-0 transition-all duration-500" 
                />
              </div>
              <div className="text-xs font-bold text-slate-600">Mod 1</div>
            </div>

            {/* Bar 2 */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-[11px] font-bold text-slate-500">{m2Pct}%</div>
              <div className="w-9 h-32 bg-slate-100 rounded-xl relative overflow-hidden">
                <div 
                  style={{ height: `${m2Pct}%` }}
                  className="w-full bg-[#ff7a59] rounded-xl absolute bottom-0 transition-all duration-500" 
                />
              </div>
              <div className="text-xs font-bold text-slate-600">Mod 2</div>
            </div>

            {/* Bar 3 */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-[11px] font-bold text-slate-500">{m3Pct}%</div>
              <div className="w-9 h-32 bg-slate-100 rounded-xl relative overflow-hidden">
                <div 
                  style={{ height: `${m3Pct}%` }}
                  className="w-full bg-[#ff7a59] rounded-xl absolute bottom-0 transition-all duration-500" 
                />
              </div>
              <div className="text-xs font-bold text-slate-600">Mod 3</div>
            </div>

            {/* Bar 4 */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-[11px] font-bold text-slate-500">{m4Pct}%</div>
              <div className="w-9 h-32 bg-slate-100 rounded-xl relative overflow-hidden">
                <div 
                  style={{ height: `${m4Pct}%` }}
                  className="w-full bg-[#ff7a59] rounded-xl absolute bottom-0 transition-all duration-500" 
                />
              </div>
              <div className="text-xs font-bold text-slate-600">Mod 4</div>
            </div>
          </div>
        </div>

        {/* Performance Gauge (2 Cols) */}
        <div className="md:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between items-center text-center">
          <div className="w-full text-left">
            <h3 className="font-extrabold text-base text-slate-900">
              Performance (สมรรถนะดิจิทัล)
            </h3>
          </div>

          {/* Speedometer Gauge SVG */}
          <div className="relative my-2 flex items-center justify-center">
            <svg viewBox="0 0 160 100" className="w-44 h-28">
              {/* Background Arc */}
              <path
                d="M 20 85 A 60 60 0 0 1 140 85"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="14"
                strokeLinecap="round"
              />
              {/* Colored Gauge Arc */}
              <path
                d="M 20 85 A 60 60 0 0 1 140 85"
                fill="none"
                stroke="url(#gauge-gradient)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray="188"
                strokeDashoffset={188 - (188 * (overallPercent / 100))}
                className="transition-all duration-700"
              />
              <defs>
                <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ff7a59" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              {/* Needle center circle */}
              <circle cx="80" cy="85" r="7" fill="#0f172a" />
            </svg>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-400">
              Your Point: <strong className="text-slate-900 text-sm">{(overallPercent * 0.1).toFixed(2)} / 10</strong>
            </div>
            <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mt-1">
              {overallPercent >= 80 ? 'ระดับดีเยี่ยม (Excellence)' : overallPercent >= 50 ? 'ระดับปานกลาง (Developing)' : 'กำลังพัฒนา (In Progress)'}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Courses (Ongoing & Completed Tabs) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-xl text-slate-900">Courses (หลักสูตร 4 Modules)</h2>
          <div className="bg-slate-50 p-1 rounded-xl border border-slate-200/80 flex items-center gap-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setCourseFilter('ongoing')}
              className={`px-3 py-1.5 rounded-lg transition ${
                courseFilter === 'ongoing' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Ongoing
            </button>
            <button
              type="button"
              onClick={() => setCourseFilter('completed')}
              className={`px-3 py-1.5 rounded-lg transition ${
                courseFilter === 'completed' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Modules Cards List */}
        <div className="space-y-3.5">
          {filteredModules.map((m) => {
            const isCompleted = m.percent === 100;
            return (
              <motion.div
                key={m.id}
                whileHover={m.isUnlocked ? { scale: 1.01 } : {}}
                whileTap={m.isUnlocked ? { scale: 0.99 } : {}}
                onClick={() => onSelectStep(m.id)}
                className={`rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition ${
                  m.isUnlocked
                    ? `${m.colorBg} border ${m.colorBorder} cursor-pointer`
                    : 'bg-slate-50 border border-slate-200/90 opacity-70 grayscale-[35%] cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Tech Thumbnail Icon */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                    m.isUnlocked ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {m.isUnlocked ? (
                      isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <BookOpen className="w-6 h-6 text-emerald-400" />
                      )
                    ) : (
                      <Lock className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                        m.isUnlocked ? m.badgeColor : 'bg-slate-200 text-slate-600'
                      }`}>
                        {m.code}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">{m.duration}</span>

                      {m.isUnlocked ? (
                        isCompleted ? (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> ผ่านแล้ว ({m.doneCount}/{m.totalCount} หน่วย)
                          </span>
                        ) : m.doneCount > 0 ? (
                          <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-md">
                            ⚡ กำลังเรียน ({m.doneCount}/{m.totalCount} หน่วย)
                          </span>
                        ) : null
                      ) : (
                        <span className="text-[11px] font-bold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Lock className="w-3 h-3" /> {m.lockMsg}
                        </span>
                      )}
                    </div>
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-snug">
                      {m.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5 line-clamp-1">
                      {m.desc}
                    </p>
                  </div>
                </div>

                {/* Progress Pill Bar */}
                <div className="shrink-0 flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="w-32 bg-white/80 rounded-full h-3 overflow-hidden border border-slate-200/60 relative">
                    <div
                      style={{ width: `${m.percent}%` }}
                      className={`h-full ${m.barColor} rounded-full transition-all duration-500`}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700 min-w-10 text-right">
                    {m.percent}%
                  </span>
                  {m.isUnlocked ? (
                    <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-400 hidden sm:block" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <CurriculumModal
        isOpen={showCurriculumModal}
        onClose={() => setShowCurriculumModal(false)}
      />
    </div>
  );
};
