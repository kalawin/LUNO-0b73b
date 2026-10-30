import React, { useState } from 'react';
import { EVALUATION_ITEMS } from '../data/courseData';
import { Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SoundService } from '../services/audio';

interface EvaluationViewProps {
  onSubmitEvaluation: (averages: { propriety: number; feasibility: number; utility: number }, details: Record<string, number>, comments: string) => void;
  onBackToDashboard?: () => void;
}

export const EvaluationView: React.FC<EvaluationViewProps> = ({ onSubmitEvaluation, onBackToDashboard }) => {
  const [ratings, setRatings] = useState<Record<string, number>>({
    eval_1: 5,
    eval_2: 5,
    eval_3: 5
  });
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRate = (id: string, score: number) => {
    setRatings(prev => ({ ...prev, [id]: score }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    SoundService.playSuccess();

    const eval1 = ratings['eval_1'] || 5;
    const eval2 = ratings['eval_2'] || 5;
    const eval3 = ratings['eval_3'] || 5;

    const averages = {
      propriety: eval1,
      feasibility: eval2,
      utility: eval3
    };

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch {
      // fallback
    }

    setTimeout(() => {
      onSubmitEvaluation(averages, ratings, comments);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="rounded-[28px] p-6 sm:p-8 bg-white border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
          <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            ด่านประเมินผลสัมฤทธิ์ปลายทาง (Evaluation Phase)
          </span>
          {onBackToDashboard && (
            <button
              type="button"
              onClick={onBackToDashboard}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-xl transition cursor-pointer"
            >
              ภาพรวม
            </button>
          )}
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          แบบประเมินรูปแบบการพัฒนา LUNO (5 ระดับ)
        </h2>
        <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
          โปรดให้คะแนนความคิดเห็นต่อโปรแกรมเพื่อนำไปปรับปรุงและยืนยันการออกวุฒิบัตรรับรองสมรรถนะ
          <span className="block text-xs text-slate-400 mt-1 font-medium">
            (เกณฑ์การให้คะแนน: 5 = มากที่สุด, 4 = มาก, 3 = ปานกลาง, 2 = น้อย, 1 = น้อยที่สุด)
          </span>
        </p>
      </div>

      {/* 3 Rating Items */}
      <div className="rounded-[28px] p-6 sm:p-8 bg-white border border-slate-200/80 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span>ประเด็นการประเมิน (3 มิติหลัก)</span>
          <span className="hidden sm:inline">ระดับคะแนน (1 - 5)</span>
        </div>

        {EVALUATION_ITEMS.map((item, idx) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-50/70 p-5 rounded-2xl border border-slate-200/70 hover:border-slate-300 transition-colors"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs font-extrabold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-slate-900 text-sm sm:text-base font-bold">{item.text}</span>
              </div>
              <span className="text-xs text-slate-500 block mt-1 ml-8">
                มิติ: <strong className="text-slate-700">{item.category}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              {[5, 4, 3, 2, 1].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleRate(item.id, val)}
                  className={`w-11 h-11 rounded-xl text-sm font-bold transition flex items-center justify-center cursor-pointer active:scale-95 ${
                    ratings[item.id] === val
                      ? 'bg-gradient-to-tr from-teal-600 to-emerald-600 border border-teal-600 text-white shadow-md shadow-teal-600/30 ring-2 ring-teal-400/30'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-xs'
                  }`}
                  title={`${val} คะแนน`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Optional Comments */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            💭 ข้อเสนอแนะเพิ่มเติมเพื่อการปรับปรุงและพัฒนาแพลตฟอร์ม:
          </label>
          <textarea
            rows={3}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="ข้อคิดเห็นและข้อเสนอแนะของท่านมีคุณค่ายิ่งต่อการพัฒนางานวิจัยทางการศึกษาต่อไป..."
            className="w-full p-4 text-sm rounded-2xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
          />
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-2xl font-bold text-base sm:text-lg text-white bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/15 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Award className="w-5 h-5 text-amber-400" />
            <span>{isSubmitting ? 'กำลังประมวลผลข้อมูล...' : 'ส่งแบบประเมิน และประมวลผลวุฒิบัตร'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
