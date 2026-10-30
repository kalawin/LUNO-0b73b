import React from 'react';
import type { RubricCriterion } from '../types';
import type { CriterionFeedback } from '../utils/evaluatorEngine';
import { Award, CheckCircle2, AlertTriangle, ArrowLeft, HelpCircle } from 'lucide-react';

interface Props {
  rubric: RubricCriterion[];
  scores: Record<string, number>;
  totalScore: number;
  maxPossible: number;
  isPassed: boolean;
  feedbacks: CriterionFeedback[];
  reflectionNotes: string;
  onChangeReflection: (note: string) => void;
  onGoBackToEdit?: () => void;
}

export const RubricEvaluationTable: React.FC<Props> = ({
  rubric,
  scores,
  totalScore,
  maxPossible,
  isPassed,
  feedbacks,
  reflectionNotes,
  onChangeReflection,
  onGoBackToEdit
}) => {
  const feedbackMap = new Map<string, CriterionFeedback>();
  feedbacks.forEach(f => feedbackMap.set(f.criterionId, f));

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
              isPassed ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`}>
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              ผลการประเมินคุณภาพชิ้นงานโดยระบบ (System Rubric Check)
            </h3>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            ระบบตรวจสอบเนื้อหาของท่านเทียบกับเกณฑ์สมรรถนะมาตรฐานโดยอัตโนมัติ (เกณฑ์ผ่าน: 7/10 คะแนน)
          </p>
        </div>

        {/* Score Badge */}
        <div className={`border rounded-2xl px-6 py-3 text-right shrink-0 ${
          isPassed 
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' 
            : 'bg-amber-50/80 border-amber-200 text-amber-950'
        }`}>
          <div className="text-xs uppercase font-extrabold tracking-wider text-slate-500">
            คะแนนที่ระบบตรวจได้
          </div>
          <div className={`text-3xl font-black ${isPassed ? 'text-emerald-700' : 'text-amber-700'}`}>
            {totalScore} <span className="text-sm font-bold text-slate-400">/ {maxPossible}</span>
          </div>
          <div className={`text-xs font-bold mt-0.5 inline-flex items-center gap-1 ${
            isPassed ? 'text-emerald-700' : 'text-amber-800'
          }`}>
            {isPassed ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> ผ่านเกณฑ์มาตรฐานแล้ว
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" /> ยังไม่ถึงเกณฑ์ขั้นต่ำ 7 คะแนน
              </>
            )}
          </div>
        </div>
      </div>

      {/* Warning Notice if not passed */}
      {!isPassed && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-amber-950 text-base">
                ชิ้นงานยังไม่ผ่านเกณฑ์การประเมิน (ต้องการอย่างน้อย 7 คะแนน)
              </h4>
              <p className="text-sm text-amber-900/90 mt-0.5 leading-relaxed">
                กรุณาอ่านคำแนะนำในการปรับปรุงในแต่ละข้อด้านล่าง แล้วคลิกกลับไปเติมข้อมูลใน <strong>"ขั้นที่ 4: ลงมือปฏิบัติ"</strong> ให้ครบถ้วนเพื่อปลดล็อกการส่งงาน
              </p>
            </div>
          </div>
          {onGoBackToEdit && (
            <button
              type="button"
              onClick={onGoBackToEdit}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-sm transition shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> กลับไปแก้ไขในขั้นที่ 4
            </button>
          )}
        </div>
      )}

      {/* Criteria Breakdown */}
      <div className="space-y-5">
        <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-teal-600" /> รายละเอียดผลการประเมินแยกตามเกณฑ์สมรรถนะ:
        </h4>

        {rubric.map((item, idx) => {
          const currentScore = scores[item.id] ?? 0;
          const fb = feedbackMap.get(item.id);
          const isHigh = currentScore === item.high.score;
          const isMed = currentScore === item.medium.score;
          const isLow = currentScore <= item.low.score;

          return (
            <div key={item.id} className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="font-extrabold text-slate-900 text-base">
                  {idx + 1}. {item.title} <span className="text-teal-700 text-sm font-bold">(เต็ม {item.maxScore} คะแนน)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black border ${
                    isHigh 
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                      : isMed 
                      ? 'bg-amber-100 text-amber-800 border-amber-300' 
                      : 'bg-rose-100 text-rose-800 border-rose-300'
                  }`}>
                    {isHigh && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {isMed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {isLow && <AlertTriangle className="w-3.5 h-3.5" />}
                    ระบบตรวจได้: {currentScore} / {item.maxScore} คะแนน ({isHigh ? 'ระดับสูง' : isMed ? 'ระดับกลาง' : 'ระดับต้องปรับปรุง'})
                  </span>
                </div>
              </div>

              {/* System observation & suggestion */}
              {fb && (
                <div className={`p-4 rounded-xl text-sm border ${
                  fb.status === 'high'
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                    : fb.status === 'medium'
                    ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                    : 'bg-rose-50/80 border-rose-200 text-rose-950'
                }`}>
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <span>ผลการตรวจ:</span>
                    <span>{fb.comment}</span>
                  </div>
                  {fb.suggestion && (
                    <div className="text-xs text-rose-700 font-semibold mt-1.5 pl-2 border-l-2 border-rose-400">
                      💡 คำแนะนำในการปรับปรุง: {fb.suggestion}
                    </div>
                  )}
                </div>
              )}

              {/* Rubric descriptions for reference */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  isHigh ? 'bg-emerald-50 border-emerald-400 font-medium text-emerald-950 ring-1 ring-emerald-400/40' : 'bg-white border-slate-200 text-slate-500 opacity-60'
                }`}>
                  <div className="font-bold text-emerald-700 mb-1 flex items-center justify-between">
                    <span>ระดับสูง ({item.high.score} คะแนน)</span>
                    {isHigh && <span className="text-[10px] bg-emerald-200 px-1.5 py-0.5 rounded-md font-extrabold">ได้ระดับนี้</span>}
                  </div>
                  {item.high.desc}
                </div>

                <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  isMed ? 'bg-amber-50 border-amber-400 font-medium text-amber-950 ring-1 ring-amber-400/40' : 'bg-white border-slate-200 text-slate-500 opacity-60'
                }`}>
                  <div className="font-bold text-amber-700 mb-1 flex items-center justify-between">
                    <span>ระดับกลาง ({item.medium.score} คะแนน)</span>
                    {isMed && <span className="text-[10px] bg-amber-200 px-1.5 py-0.5 rounded-md font-extrabold">ได้ระดับนี้</span>}
                  </div>
                  {item.medium.desc}
                </div>

                <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  isLow ? 'bg-rose-50 border-rose-400 font-medium text-rose-950 ring-1 ring-rose-400/40' : 'bg-white border-slate-200 text-slate-500 opacity-60'
                }`}>
                  <div className="font-bold text-rose-700 mb-1 flex items-center justify-between">
                    <span>ระดับต้องปรับปรุง ({item.low.score} คะแนน)</span>
                    {isLow && <span className="text-[10px] bg-rose-200 px-1.5 py-0.5 rounded-md font-extrabold">ได้ระดับนี้</span>}
                  </div>
                  {item.low.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reflection Field */}
      <div className="bg-[#f0f9ff] border border-[#d2e9fb] rounded-3xl p-6 space-y-3">
        <label className="block">
          <div className="font-extrabold text-slate-900 text-base flex items-center gap-2 mb-1">
            <span>💭 บันทึกสะท้อนคิดและการนำไปปรับใช้จริง (Reflection & Action Plan)</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mb-3">
            โปรดบันทึกสั้นๆ ว่า: สิ่งสำคัญที่ท่านได้เรียนรู้จากหน่วยนี้คืออะไร? และท่านจะนำชิ้นงานนี้ไปปรับใช้จริงในโรงเรียนของท่านอย่างไร?
          </p>
          <textarea
            rows={3}
            value={reflectionNotes}
            onChange={(e) => onChangeReflection(e.target.value)}
            placeholder="พิมพ์บันทึกสะท้อนคิดของท่านที่นี่ (จะถูกบันทึกและแสดงในเอกสาร One-Page Artifact ประจำหน่วย)..."
            className="w-full p-4 text-sm rounded-2xl border border-sky-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 text-slate-800 leading-relaxed placeholder:text-slate-400"
          />
        </label>
      </div>
    </div>
  );
};
