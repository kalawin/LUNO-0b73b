import React, { useState } from 'react';
import { CURRICULUM_ELEMENTS, type SubElementItem } from '../data/curriculumData';
import { BookOpen, X, Award, CheckCircle2, Sparkles, Scale, GraduationCap } from 'lucide-react';

interface CurriculumModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialModule?: number;
}

export const CurriculumModal: React.FC<CurriculumModalProps> = ({ isOpen, onClose, initialModule = 1 }) => {
  const [selectedModule, setSelectedModule] = useState<number>(initialModule);
  const [selectedElement, setSelectedElement] = useState<SubElementItem | null>(null);

  if (!isOpen) return null;

  const modules = [
    { num: 1, title: 'Module 1: การสื่อสารเชิงดิจิทัล', subCount: 3, score: 30, kpaFocus: 'เน้นด้านทักษะ (P)' },
    { num: 2, title: 'Module 2: การสร้างวิถีการเรียนรู้เชิงดิจิทัล', subCount: 3, score: 30, kpaFocus: 'เน้นด้านทักษะ (P)' },
    { num: 3, title: 'Module 3: การพัฒนาการทำงานเป็นทีมสู่ความเป็นมืออาชีพ', subCount: 2, score: 20, kpaFocus: 'สมดุล K-P-A' },
    { num: 4, title: 'Module 4: การสร้างค่านิยมเชิงดิจิทัล', subCount: 2, score: 20, kpaFocus: 'เน้นด้านเจตคติ (A)' }
  ];

  const filteredElements = CURRICULUM_ELEMENTS.filter(e => e.levelNumber === selectedModule);
  const activeElement = selectedElement || filteredElements[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200/90 rounded-[32px] w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20 shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  โครงสร้างหลักสูตรและเกณฑ์การประเมิน LUNO
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-700 font-bold">
                  ฉบับปรับปรุง 2026
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                4 โมดูล 10 องค์ประกอบย่อย (10 กิจกรรม × 10 คะแนน = 100 คะแนนเต็ม) พร้อมการวิเคราะห์ K-P-A
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Module Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-50 border-b border-slate-100">
          {modules.map((m) => {
            const isSelected = selectedModule === m.num;
            return (
              <button
                key={m.num}
                type="button"
                onClick={() => {
                  setSelectedModule(m.num);
                  const first = CURRICULUM_ELEMENTS.find(e => e.levelNumber === m.num);
                  if (first) setSelectedElement(first);
                }}
                className={`p-3 rounded-2xl text-left transition cursor-pointer border ${
                  isSelected
                    ? 'bg-white border-2 border-teal-600 text-slate-900 shadow-xs'
                    : 'bg-white/60 border-slate-200/70 hover:bg-white text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-extrabold text-teal-700">โมดูลที่ {m.num}</span>
                  <span className="text-slate-400 font-semibold">{m.score} คะแนน</span>
                </div>
                <div className="text-xs font-bold truncate text-slate-900">
                  {m.title.replace(/^Module \d: /, '')}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">{m.kpaFocus}</div>
              </button>
            );
          })}
        </div>

        {/* Modal Body: Master-Detail Layout */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          
          {/* Left Column: Sub-element items (4 cols) */}
          <div className="md:col-span-4 p-4 space-y-2.5 overflow-y-auto bg-slate-50/50">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              องค์ประกอบย่อยในโมดูลที่ {selectedModule}:
            </div>
            {filteredElements.map((elem) => {
              const isSelected = activeElement?.id === elem.id;
              return (
                <div
                  key={elem.id}
                  onClick={() => setSelectedElement(elem)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-white border-2 border-teal-500 shadow-sm'
                      : 'bg-white/80 border-slate-200/70 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-extrabold text-teal-700">หน่วย {elem.id}</span>
                    <span className="text-[11px] text-slate-400">⏱️ {elem.durationMinutes} นาที</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {elem.title.replace(/^\d\.\d\s*/, '')}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {elem.summary}
                  </p>
                </div>
              );
            })}

            {/* Total Rubric summary card */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 text-xs text-slate-600 mt-4 space-y-1.5 shadow-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Scale className="w-4 h-4 text-teal-600" />
                <span>เกณฑ์ประเมินรวมทั้งหลักสูตร:</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                10 องค์ประกอบย่อย × 10 คะแนน = 100 คะแนนเต็ม ครอบคลุมทั้งความรู้ (K) ทักษะปฏิบัติ (P) และเจตคติ (A)
              </p>
            </div>
          </div>

          {/* Right Column: Detailed View (8 cols) */}
          <div className="md:col-span-8 p-5 sm:p-6 overflow-y-auto space-y-6 bg-white">
            {activeElement && (
              <>
                {/* Title & Platform Summary */}
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                    <span>องค์ประกอบย่อย {activeElement.id} (ระยะเวลา {activeElement.durationMinutes} นาที)</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {activeElement.title}
                  </h3>
                  <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm text-slate-700 leading-relaxed">
                    <strong className="text-teal-700">สาระที่นำเสนอในแพลตฟอร์ม: </strong>
                    {activeElement.summary}
                  </div>
                </div>

                {/* Detailed Academic Content */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-teal-600" />
                    สาระความรู้โดยละเอียดและฐานคิดงานวิจัย (Research Foundations)
                  </h4>
                  <div className="text-sm text-slate-600 leading-relaxed bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
                    {activeElement.detailedContent}
                  </div>
                </div>

                {/* Individual Activity & Rubric */}
                <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-800 flex items-center gap-1.5 uppercase tracking-wider">
                      <Award className="w-4 h-4 text-amber-600" /> กิจกรรมเดี่ยวประจำองค์ประกอบ
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 border border-amber-300">
                      คะแนนเต็ม {activeElement.rubric.totalScore} คะแนน
                    </span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                    "{activeElement.individualActivity}"
                  </p>

                  <div className="pt-2 border-t border-amber-200/60">
                    <div className="text-xs font-bold text-slate-700 mb-2">เกณฑ์การประเมินรูบริก (Rubric):</div>
                    <ul className="space-y-1.5">
                      {activeElement.rubric.criteria.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* KPA Analysis */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    การวิเคราะห์มิติสมรรถนะ (K-P-A Analysis):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
                      <div className="text-xs font-extrabold text-blue-700 mb-1">K — ความรู้ (Knowledge)</div>
                      <p className="text-xs text-slate-700 leading-relaxed">{activeElement.kpa.knowledge}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                      <div className="text-xs font-extrabold text-emerald-700 mb-1">P — ทักษะ/กระบวนการ (Process)</div>
                      <p className="text-xs text-slate-700 leading-relaxed">{activeElement.kpa.process}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                      <div className="text-xs font-extrabold text-amber-800 mb-1">A — เจตคติ (Attitude)</div>
                      <p className="text-xs text-slate-700 leading-relaxed">{activeElement.kpa.attitude}</p>
                    </div>
                  </div>
                </div>

                {/* Academic References */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 leading-relaxed">
                  <strong className="text-slate-700 font-bold">แหล่งอ้างอิงของหัวข้อนี้: </strong>
                  <span>{activeElement.references}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            หลักสูตรพัฒนาภาวะผู้นำดิจิทัล 4 โมดูล (สพป.ขอนแก่น เขต 1) © 2026
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
