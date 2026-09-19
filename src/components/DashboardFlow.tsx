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

  // รายการขั้นตอนทั้งหมดใน Linear Journey
  const stages = [
    {
      id: 'pre-test' as StepId,
      stepNumber: 0,
      title: 'แบบทดสอบก่อนเรียนรู้ (Pre-test)',
      desc: 'วัดระดับความรู้ความเข้าใจพื้นฐาน 10 ข้อ ก่อนเริ่มโปรแกรม (ปลดล็อกด่าน 1 ทันทีหลังทำเสร็จ)',
      duration: '5-10 นาที',
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
      title: 'แบบทดสอบหลังเรียนรู้ (Post-test)',
      desc: 'วัดผลสัมฤทธิ์ทางการเรียนรู้หลังผ่านครบ 4 ด่าน (10 ข้อ)',
      duration: '5-10 นาที',
      type: 'quiz'
    },
    {
      id: 'evaluation' as StepId,
      stepNumber: 6,
      title: 'แบบประเมินรูปแบบการวิจัย',
      desc: 'ประเมินความเหมาะสม ความเป็นไปได้ และความเป็นประโยชน์ของรูปแบบ (15 ข้อ)',
      duration: '5 นาที',
      type: 'eval'
    },
    {
      id: 'completed' as StepId,
      stepNumber: 7,
      title: 'สรุปผลสำเร็จและรับเกียรติบัตร',
      desc: 'ดาวน์โหลดเกียรติบัตรรับรองการพัฒนาภาวะผู้นำดิจิทัล',
      duration: 'เสร็จสิ้น',
      type: 'cert'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Intro Box */}
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 text-white rounded-2xl p-6 sm:p-8 shadow-sm mb-8 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold mb-3 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>เส้นทางการเรียนรู้ 4 ด่านต่อเนื่อง (ไม่ผูกเวลา)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            แผนผังการเรียนรู้ภาวะผู้นำดิจิทัล
          </h1>
          <p className="text-indigo-100/90 text-sm sm:text-base leading-relaxed mb-5">
            ระบบจะเปิดด่านถัดไปให้อัตโนมัติเมื่อท่านผ่านเงื่อนไขในแต่ละด่าน 
            หากติดภารกิจสามารถปิดและกลับมาทำต่อได้ตลอดเวลา
          </p>

          <button
            onClick={() => onSelectStep(progress.currentStep)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-sm shadow-md transition active:scale-95 cursor-pointer"
          >
            <PlayCircle className="w-5 h-5" />
            <span>ทำต่อจากจุดล่าสุดทันที</span>
          </button>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mb-20 pointer-events-none" />
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
                // อนุญาตให้คลิกได้ถ้าเป็นด่านที่ทำเสร็จแล้ว หรือด่านปัจจุบัน
                if (!locked) {
                  onSelectStep(stage.id);
                }
              }}
              className={`rounded-2xl p-5 border transition-all duration-200 ${
                current
                  ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                  : completed
                  ? 'bg-white border-slate-200 hover:border-slate-300 cursor-pointer shadow-xs'
                  : 'bg-slate-100/60 border-slate-200/60 opacity-70 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start sm:items-center justify-between gap-4">
                
                <div className="flex items-start sm:items-center gap-4">
                  {/* Status Icon */}
                  <div className="shrink-0 mt-0.5 sm:mt-0">
                    {completed ? (
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                    ) : current ? (
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold animate-pulse shadow-sm">
                        <PlayCircle className="w-6 h-6" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-400 flex items-center justify-center font-bold">
                        <Lock className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Title & Desc */}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="font-heading font-bold text-base sm:text-lg text-slate-900">
                        {stage.title}
                      </span>
                      {current && (
                        <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                          กำลังทำอยู่
                        </span>
                      )}
                      {completed && (
                        <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                          ผ่านแล้ว
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm line-clamp-1 sm:line-clamp-none">
                      {stage.desc}
                    </p>
                  </div>
                </div>

                {/* Right Action / Duration */}
                <div className="shrink-0 flex items-center gap-3 text-right">
                  <div className="hidden sm:block text-xs font-semibold text-slate-500">
                    {stage.duration}
                  </div>

                  {current ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStep(stage.id);
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
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
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
                    >
                      ทบทวน
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium hidden sm:inline">
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
