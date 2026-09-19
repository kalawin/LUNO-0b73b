import React from 'react';
import type { UserProgress, StepId } from '../types';
import { COURSE_LEVELS } from '../data/courseData';
import { 
  CheckCircle2, 
  Lock, 
  PlayCircle, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';

interface DashboardFlowProps {
  progress: UserProgress;
  onSelectStep: (step: StepId) => void;
}

export const DashboardFlow: React.FC<DashboardFlowProps> = ({ progress, onSelectStep }) => {
  const isCompleted = (step: string) => progress.completedSteps.includes(step);
  const isCurrent = (step: string) => progress.currentStep === step;

  // รายการขั้นตอนทั้งหมดใน Journey
  const stages = [
    {
      id: 'pre-test' as StepId,
      stepNumber: 0,
      title: 'แบบทดสอบก่อนเรียน (Pre-test)',
      desc: 'วัดระดับความเข้าใจพื้นฐาน 4 มิติ (จำนวน 4 ข้อ ไม่จำกัดเวลา)',
      duration: '3–5 นาที',
      type: 'quiz'
    },
    ...COURSE_LEVELS.map(lvl => ({
      id: lvl.id as StepId,
      stepNumber: lvl.levelNumber,
      title: lvl.title,
      desc: lvl.subtitle,
      duration: `${lvl.durationMinutes} นาที`,
      type: 'level'
    })),
    {
      id: 'post-test' as StepId,
      stepNumber: 5,
      title: 'แบบทดสอบหลังเรียน (Post-test)',
      desc: 'วัดผลสัมฤทธิ์ทางการเรียนรู้ 4 มิติ (จำนวน 4 ข้อ)',
      duration: '3–5 นาที',
      type: 'quiz'
    },
    {
      id: 'evaluation' as StepId,
      stepNumber: 6,
      title: 'แบบประเมินรูปแบบการพัฒนา Luno',
      desc: 'ประเมินความเหมาะสม ความเป็นไปได้ และความเป็นประโยชน์ (5 ระดับ)',
      duration: '2 นาที',
      type: 'eval'
    },
    {
      id: 'completed' as StepId,
      stepNumber: 7,
      title: 'สรุปผลสัมฤทธิ์ & เกียรติบัตรรับรองสมรรถนะ',
      desc: 'วิเคราะห์ผลคะแนนเปรียบเทียบ กราฟสมรรถนะ 4 มิติ และพิมพ์เกียรติบัตร PDF',
      duration: 'สำเร็จ',
      type: 'cert'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Intro Box */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-red-950/80 via-zinc-900 to-zinc-950 border border-red-500/30 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-950 text-red-300 border border-red-500/40 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span>เส้นทางการเรียนรู้ 4 ด่านต่อเนื่อง (ไม่ผูกเวลา)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            แผนผังการเรียนรู้ภาวะผู้นำดิจิทัล Luno
          </h1>
          <p className="text-zinc-300 text-sm leading-relaxed mb-5">
            ระบบจะเปิดด่านถัดไปให้อัตโนมัติเมื่อท่านผ่านเงื่อนไขในแต่ละด่าน 
            หากติดภารกิจสามารถปิดและกลับมาทำต่อจากจุดเดิมได้ตลอดเวลา
          </p>

          <button
            onClick={() => onSelectStep(progress.currentStep)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition cursor-pointer border border-red-500/40"
          >
            <PlayCircle className="w-5 h-5" />
            <span>ทำต่อจากจุดล่าสุดทันที</span>
          </button>
        </div>
      </div>

      {/* Stages Timeline */}
      <div className="space-y-3.5">
        {stages.map((stage) => {
          const completed = isCompleted(stage.id);
          const current = isCurrent(stage.id);
          const locked = !completed && !current;

          return (
            <div
              key={stage.id}
              onClick={() => {
                if (!locked) {
                  onSelectStep(stage.id);
                }
              }}
              className={`rounded-2xl p-5 border transition-all duration-200 ${
                current
                  ? 'bg-zinc-900 border-red-500 shadow-lg shadow-red-600/20 ring-1 ring-red-500/40'
                  : completed
                  ? 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 cursor-pointer'
                  : 'bg-zinc-950/50 border-zinc-800/60 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start sm:items-center justify-between gap-4">
                
                <div className="flex items-start sm:items-center gap-4">
                  {/* Status Icon */}
                  <div className="shrink-0 mt-0.5 sm:mt-0">
                    {completed ? (
                      <div className="w-10 h-10 rounded-xl bg-red-950 text-red-400 border border-red-500/40 flex items-center justify-center font-bold">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    ) : current ? (
                      <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-md shadow-red-600/40 animate-pulse">
                        <PlayCircle className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 text-zinc-500 flex items-center justify-center font-bold">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Title & Desc */}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="font-bold text-base sm:text-lg text-white">
                        {stage.title}
                      </span>
                      {current && (
                        <span className="text-xs bg-red-950 text-red-300 font-bold px-2 py-0.5 rounded-full border border-red-500/40">
                          กำลังทำอยู่
                        </span>
                      )}
                      {completed && (
                        <span className="text-xs bg-zinc-800 text-zinc-300 font-medium px-2 py-0.5 rounded-full border border-zinc-700">
                          ผ่านแล้ว
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-400 text-xs sm:text-sm line-clamp-1 sm:line-clamp-none">
                      {stage.desc}
                    </p>
                  </div>
                </div>

                {/* Right Action / Duration */}
                <div className="shrink-0 flex items-center gap-3 text-right">
                  <div className="hidden sm:block text-xs font-semibold text-zinc-400">
                    {stage.duration}
                  </div>

                  {current ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStep(stage.id);
                      }}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-red-600/30 transition cursor-pointer"
                    >
                      <span>เข้าสู่ด่านนี้</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : completed ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStep(stage.id);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
                    >
                      ทบทวน
                    </button>
                  ) : (
                    <span className="text-xs text-zinc-500 font-medium hidden sm:inline">
                      ยังไม่ปลดล็อก
                    </span>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
