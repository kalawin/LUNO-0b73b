import React from 'react';
import type { RubricCriterion } from '../types';
import { Award, CheckCircle2 } from 'lucide-react';

interface Props {
  rubric: RubricCriterion[];
  selectedScores: Record<string, number>;
  onChangeScore: (criterionId: string, score: number) => void;
  reflectionNotes: string;
  onChangeReflection: (note: string) => void;
}

export const RubricEvaluationTable: React.FC<Props> = ({
  rubric,
  selectedScores,
  onChangeScore,
  reflectionNotes,
  onChangeReflection
}) => {
  const totalScore = rubric.reduce((sum, item) => sum + (selectedScores[item.id] ?? 0), 0);
  const maxPossible = rubric.reduce((sum, item) => sum + item.maxScore, 0);

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">เกณฑ์การประเมินตนเองตาม Rubric</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            โปรดอ่านเกณฑ์แต่ละระดับและคลิกเลือกระดับที่ตรงกับชิ้นงานของท่าน เพื่อประเมินคุณภาพก่อนกดส่งงาน
          </p>
        </div>
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl px-5 py-3 text-right shrink-0">
          <div className="text-[11px] uppercase font-bold tracking-wider text-amber-800">คะแนนประเมินรวม</div>
          <div className="text-2xl font-black text-amber-700">
            {totalScore} <span className="text-xs font-semibold text-slate-400">/ {maxPossible} คะแนน</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {rubric.map((item, idx) => {
          const currentScore = selectedScores[item.id];
          return (
            <div key={item.id} className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-900 text-sm sm:text-base">
                  {idx + 1}. {item.title} <span className="text-amber-600 font-semibold text-xs">(เต็ม {item.maxScore} คะแนน)</span>
                </div>
                {currentScore !== undefined && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ระดับ {currentScore} คะแนน
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* ระดับสูง */}
                <button
                  type="button"
                  onClick={() => onChangeScore(item.id, item.high.score)}
                  className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                    currentScore === item.high.score
                      ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20 text-emerald-950 shadow-xs'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">ระดับสูง</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      {item.high.score} คะแนน
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">{item.high.desc}</p>
                </button>

                {/* ระดับกลาง */}
                <button
                  type="button"
                  onClick={() => onChangeScore(item.id, item.medium.score)}
                  className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                    currentScore === item.medium.score
                      ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-500/20 text-amber-950 shadow-xs'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-extrabold text-amber-700 uppercase tracking-wider">ระดับกลาง</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                      {item.medium.score} คะแนน
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">{item.medium.desc}</p>
                </button>

                {/* ระดับต้องปรับปรุง */}
                <button
                  type="button"
                  onClick={() => onChangeScore(item.id, item.low.score)}
                  className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                    currentScore === item.low.score
                      ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-500/20 text-rose-950 shadow-xs'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-extrabold text-rose-700 uppercase tracking-wider">ต้องปรับปรุง</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                      {item.low.score} คะแนน
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">{item.low.desc}</p>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* บันทึกสะท้อนคิด */}
      <div className="pt-4 border-t border-slate-100 space-y-2">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
          💭 บันทึกสะท้อนคิดและข้อสังเกตการนำไปปรับใช้กับโรงเรียนของท่าน:
        </label>
        <textarea
          rows={3}
          value={reflectionNotes}
          onChange={(e) => onChangeReflection(e.target.value)}
          placeholder="ระบุสิ่งที่ได้เรียนรู้จากหน่วยนี้ หรือแผนการนำไปปฏิบัติจริงกับบุคลากรในโรงเรียน..."
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
        />
      </div>
    </div>
  );
};
