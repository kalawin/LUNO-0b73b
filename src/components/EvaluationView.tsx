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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/90 border border-red-500/30 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
          <span className="px-3 py-1 rounded-full bg-red-950 text-red-300 border border-red-500/40 text-xs font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            ด่านประเมินผลสัมฤทธิ์ปลายทาง
          </span>
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="text-xs text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-xl border border-zinc-700 transition cursor-pointer"
            >
              แผนผัง
            </button>
          )}
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          แบบประเมินรูปแบบการพัฒนา Luno (5 ระดับ)
        </h2>
        <p className="text-zinc-300 text-sm mt-1.5 leading-relaxed">
          โปรดให้คะแนนความพึงพอใจต่อโปรแกรมเพื่อนำไปปรับปรุงและยืนยันการออกวุฒิบัตร (5 = มากที่สุด, 1 = น้อยที่สุด)
        </p>
      </div>

      {/* 3 Rating Items */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-xl">
        {EVALUATION_ITEMS.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-zinc-950/70 p-4 rounded-2xl border border-zinc-800/80"
          >
            <div>
              <span className="text-zinc-200 text-sm sm:text-base font-medium">{item.text}</span>
              <span className="text-xs text-zinc-500 block mt-0.5">{item.category}</span>
            </div>

            <div className="flex items-center gap-2">
              {[5, 4, 3, 2, 1].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleRate(item.id, val)}
                  className={`w-10 h-10 rounded-xl border text-sm font-bold transition flex items-center justify-center cursor-pointer active:scale-95 ${
                    ratings[item.id] === val
                      ? 'bg-red-600 border-red-500 text-white shadow-md shadow-red-600/30'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Optional Comments */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-zinc-400 mb-2">
            ข้อเสนอแนะเพิ่มเติมเพื่อการปรับปรุงและพัฒนา:
          </label>
          <textarea
            rows={3}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="ข้อคิดเห็นของท่านมีคุณค่ายิ่งต่อการพัฒนางานวิจัยต่อไป..."
            className="w-full p-3.5 text-sm rounded-xl border border-zinc-800 bg-zinc-950 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-2xl font-bold text-base sm:text-lg text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 shadow-xl shadow-red-600/30 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer border border-red-500/40 disabled:opacity-50"
          >
            <Award className="w-5 h-5" />
            <span>{isSubmitting ? 'กำลังประมวลผล...' : 'ส่งแบบประเมิน และประมวลผลวุฒิบัตร'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
