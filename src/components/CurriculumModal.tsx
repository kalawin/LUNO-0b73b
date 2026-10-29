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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-red-950/80 via-zinc-900 to-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  โครงสร้างหลักสูตรและเกณฑ์การประเมิน LUNO
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-red-950 border border-red-500/40 text-[10px] text-red-300 font-semibold">
                  ฉบับปรับปรุงล่าสุด
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                4 โมดูล 10 องค์ประกอบย่อย (10 กิจกรรม × 10 คะแนน = 100 คะแนนเต็ม) พร้อมการวิเคราะห์ KPA
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition cursor-pointer border border-zinc-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Module Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-2 bg-zinc-900/60 border-b border-zinc-800/80">
          {modules.map((m) => (
            <button
              key={m.num}
              onClick={() => {
                setSelectedModule(m.num);
                const first = CURRICULUM_ELEMENTS.find(e => e.levelNumber === m.num);
                if (first) setSelectedElement(first);
              }}
              className={`p-3 rounded-2xl text-left transition cursor-pointer border ${
                selectedModule === m.num
                  ? 'bg-red-950/70 border-red-500/50 text-white shadow-sm'
                  : 'bg-zinc-950/40 border-transparent hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-bold text-red-400">โมดูลที่ {m.num}</span>
                <span className="text-zinc-500 font-medium">{m.score} คะแนน</span>
              </div>
              <div className="text-xs font-semibold truncate text-zinc-200">{m.title.replace(/^Module \d: /, '')}</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">{m.kpaFocus}</div>
            </button>
          ))}
        </div>

        {/* Modal Body: Master-Detail Layout */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
          
          {/* Left Column: Sub-element items (5 cols) */}
          <div className="md:col-span-4 p-4 space-y-2.5 overflow-y-auto bg-zinc-950/50">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-1">
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
                      ? 'bg-zinc-900 border-red-500/60 shadow-md'
                      : 'bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-900/70 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-red-400">หัวข้อย่อย {elem.id}</span>
                    <span className="text-[11px] text-zinc-400">⏱️ {elem.durationMinutes} นาที</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white leading-snug">
                    {elem.title.replace(/^\d\.\d\s*/, '')}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {elem.summary}
                  </p>
                </div>
              );
            })}

            {/* Total Rubric summary card */}
            <div className="p-3.5 rounded-2xl bg-zinc-900/30 border border-zinc-800/60 text-xs text-zinc-400 mt-4 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-zinc-300">
                <Scale className="w-3.5 h-3.5 text-red-400" />
                <span>เกณฑ์ประเมินรวมทั้งหลักสูตร:</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                10 องค์ประกอบย่อย × 10 คะแนน = 100 คะแนนเต็ม ครอบคลุมทั้งความรู้ (K) ทักษะปฏิบัติ (P) และเจตคติ (A)
              </p>
            </div>
          </div>

          {/* Right Column: Detailed View (8 cols) */}
          <div className="md:col-span-8 p-5 sm:p-6 overflow-y-auto space-y-6">
            {activeElement && (
              <>
                {/* Title & Platform Summary */}
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950 text-red-300 border border-red-500/40 text-xs font-semibold mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>องค์ประกอบย่อย {activeElement.id} (ระยะเวลา {activeElement.durationMinutes} นาที)</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {activeElement.title}
                  </h3>
                  <div className="mt-3 p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-300 leading-relaxed">
                    <strong className="text-red-400">สาระที่นำเสนอในแพลตฟอร์ม: </strong>
                    {activeElement.summary}
                  </div>
                </div>

                {/* Detailed Academic Content */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-red-400" />
                    สาระความรู้โดยละเอียดและฐานคิดงานวิจัย (Research Foundations)
                  </h4>
                  <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-950 p-4 rounded-2xl border border-zinc-800/80">
                    {activeElement.detailedContent}
                  </p>
                </div>

                {/* Individual Activity & Rubric */}
                <div className="p-5 rounded-2xl bg-zinc-900/80 border border-red-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-400 flex items-center gap-1.5 uppercase tracking-wider">
                      <Award className="w-4 h-4" /> กิจกรรมเดี่ยวประจำองค์ประกอบ
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-red-950 text-red-300 border border-red-500/40">
                      คะแนนเต็ม {activeElement.rubric.totalScore} คะแนน
                    </span>
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                    "{activeElement.individualActivity}"
                  </p>

                  <div className="pt-2 border-t border-zinc-800">
                    <div className="text-xs font-bold text-zinc-300 mb-2">เกณฑ์การประเมินรูบริก (Rubric):</div>
                    <ul className="space-y-1.5">
                      {activeElement.rubric.criteria.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* KPA Analysis */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    การวิเคราะห์มิติสมรรถนะ (K-P-A Analysis):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-500/30">
                      <div className="text-xs font-bold text-blue-400 mb-1">K — ความรู้ (Knowledge)</div>
                      <p className="text-xs text-zinc-300 leading-relaxed">{activeElement.kpa.knowledge}</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
                      <div className="text-xs font-bold text-emerald-400 mb-1">P — ทักษะ/กระบวนการ (Process)</div>
                      <p className="text-xs text-zinc-300 leading-relaxed">{activeElement.kpa.process}</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30">
                      <div className="text-xs font-bold text-amber-400 mb-1">A — เจตคติ (Attitude)</div>
                      <p className="text-xs text-zinc-300 leading-relaxed">{activeElement.kpa.attitude}</p>
                    </div>
                  </div>
                </div>

                {/* Academic References */}
                <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-xs text-zinc-400 leading-relaxed">
                  <strong className="text-zinc-300">แหล่งอ้างอิงของหัวข้อนี้: </strong>
                  <span>{activeElement.references}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between">
          <div className="text-xs text-zinc-400">
            หลักสูตรพัฒนาภาวะผู้นำดิจิทัล 4 โมดูล (สพป.ขอนแก่น เขต 1) © 2026
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};

