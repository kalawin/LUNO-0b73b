import React, { useState } from 'react';
import type { UserProgress, StepId } from '../types';
import { COURSE_LEVELS } from '../data/courseData';
import { 
  CheckCircle2, 
  Lock, 
  PlayCircle, 
  Sparkles, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';
import { CurriculumModal } from './CurriculumModal';

interface DashboardFlowProps {
  progress: UserProgress;
  onSelectStep: (step: StepId) => void;
}

export const DashboardFlow: React.FC<DashboardFlowProps> = ({ progress, onSelectStep }) => {
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
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
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto px-4 py-8 space-y-8"
    >
      {/* Intro Box */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/40 border border-slate-200/90 shadow-lg shadow-teal-500/5 relative overflow-hidden backdrop-blur-md">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-semibold mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>เส้นทางการเรียนรู้ 4 ด่านต่อเนื่อง (ไม่ผูกเวลา)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
            แผนผังการเรียนรู้ภาวะผู้นำดิจิทัล Luno
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
            ระบบจะเปิดด่านถัดไปให้อัตโนมัติเมื่อท่านผ่านเงื่อนไขในแต่ละด่าน 
            หากติดภารกิจสามารถปิดและกลับมาทำต่อจากจุดเดิมได้ตลอดเวลา
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectStep(progress.currentStep)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition cursor-pointer border border-teal-500/30"
            >
              <PlayCircle className="w-5 h-5" />
              <span>ทำต่อจากจุดล่าสุดทันที</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCurriculumModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-teal-50 text-teal-800 border border-teal-300 font-semibold text-sm transition cursor-pointer shadow-xs"
            >
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>โครงสร้างหลักสูตร 10 องค์ประกอบ (100 คะแนน)</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stages Timeline */}
      <div className="space-y-3.5">
        {stages.map((stage, idx) => {
          const completed = isCompleted(stage.id);
          const current = isCurrent(stage.id);
          const locked = !completed && !current;

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => {
                if (!locked) {
                  onSelectStep(stage.id);
                }
              }}
              className={`rounded-2xl p-5 border transition-all duration-200 ${
                current
                  ? 'bg-white border-2 border-teal-500 shadow-lg shadow-teal-500/10 ring-2 ring-teal-500/20'
                  : completed
                  ? 'bg-white/95 border-slate-200/90 hover:border-emerald-300 hover:shadow-md cursor-pointer'
                  : 'bg-slate-50/70 border-slate-200/60 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start sm:items-center justify-between gap-4">
                
                <div className="flex items-start sm:items-center gap-4">
                  {/* Status Icon */}
                  <div className="shrink-0 mt-0.5 sm:mt-0">
                    {completed ? (
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    ) : current ? (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold shadow-md shadow-teal-500/30 animate-pulse">
                        <PlayCircle className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-slate-200/80 text-slate-400 flex items-center justify-center font-bold">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Title & Desc */}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="font-bold text-base sm:text-lg text-slate-900">
                        {stage.title}
                      </span>
                      {current && (
                        <span className="text-xs bg-teal-50 text-teal-800 font-bold px-2.5 py-0.5 rounded-full border border-teal-200">
                          กำลังทำอยู่
                        </span>
                      )}
                      {completed && (
                        <span className="text-xs bg-emerald-50 text-emerald-800 font-medium px-2.5 py-0.5 rounded-full border border-emerald-200">
                          ผ่านแล้ว
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-xs sm:text-sm line-clamp-1 sm:line-clamp-none">
                      {stage.desc}
                    </p>
                  </div>
                </div>

                {/* Right Action / Duration */}
                <div className="shrink-0 flex items-center gap-3 text-right">
                  <div className="hidden sm:block text-xs font-semibold text-slate-400">
                    {stage.duration}
                  </div>

                  {current ? (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStep(stage.id);
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-teal-600/20 transition cursor-pointer"
                    >
                      <span>เข้าสู่ด่านนี้</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  ) : completed ? (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStep(stage.id);
                      }}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 transition cursor-pointer"
                    >
                      ทบทวน
                    </motion.button>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                      ยังไม่ปลดล็อก
                    </span>
                  )}
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>

      <CurriculumModal
        isOpen={showCurriculumModal}
        onClose={() => setShowCurriculumModal(false)}
      />
    </motion.div>
  );
};
