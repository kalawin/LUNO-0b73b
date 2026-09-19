import React, { useState } from 'react';
import { EVALUATION_ITEMS } from '../data/courseData';
import { ClipboardCheck, Send, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EvaluationViewProps {
  onSubmitEvaluation: (averages: { propriety: number; feasibility: number; utility: number }, details: Record<string, number>, comments: string) => void;
  onBackToDashboard: () => void;
}

export const EvaluationView: React.FC<EvaluationViewProps> = ({ onSubmitEvaluation, onBackToDashboard }) => {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ค่าระดับคะแนน 1 - 5
  const scaleLabels = [
    { value: 5, label: 'มากที่สุด' },
    { value: 4, label: 'มาก' },
    { value: 3, label: 'ปานกลาง' },
    { value: 2, label: 'น้อย' },
    { value: 1, label: 'น้อยที่สุด' }
  ];

  const allItems = EVALUATION_ITEMS.flatMap(c => c.items);
  const totalItems = allItems.length;
  const answeredCount = Object.keys(ratings).length;

  const handleRate = (itemId: string, score: number) => {
    setRatings(prev => ({
      ...prev,
      [itemId]: score
    }));
  };

  const handleQuickFill = () => {
    // ฟังก์ชันช่วยเติม 5 ทุกข้อเพื่อความสะดวกในการทดสอบระบบ
    const mock: Record<string, number> = {};
    allItems.forEach(item => {
      mock[item.id] = 5;
    });
    setRatings(mock);
  };

  const handleSubmit = () => {
    if (answeredCount < totalItems) {
      alert(`ท่านตอบแบบประเมินไปแล้ว ${answeredCount} จาก ${totalItems} ข้อ กรุณาตอบให้ครบทุกข้อก่อนส่งแบบประเมินครับ`);
      return;
    }

    setIsSubmitting(true);

    // คำนวณค่าเฉลี่ยรายด้าน
    const calcAvg = (prefix: string) => {
      const keys = Object.keys(ratings).filter(k => k.startsWith(prefix));
      if (keys.length === 0) return 5;
      const sum = keys.reduce((acc, k) => acc + ratings[k], 0);
      return Number((sum / keys.length).toFixed(2));
    };

    const averages = {
      propriety: calcAvg('p'),
      feasibility: calcAvg('f'),
      utility: calcAvg('u')
    };

    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 }
      });
    } catch {
      // fallback
    }

    setTimeout(() => {
      onSubmitEvaluation(averages, ratings, comments);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>การวิจัยระยะที่ 3-4 (การประเมินผลรูปแบบ)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              แบบประเมินความเหมาะสม ความเป็นไปได้ และความเป็นประโยชน์ของรูปแบบ
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              โปรดทำเครื่องหมายเลือกระดับความคิดเห็นที่ตรงกับความเป็นจริงมากที่สุด (5 = มากที่สุด, 1 = น้อยที่สุด)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleQuickFill}
              type="button"
              className="text-xs text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200 font-medium transition"
            >
              (ทดสอบ: เติม 5 ทั้งหมด)
            </button>
            <button
              onClick={onBackToDashboard}
              className="text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition"
            >
              กลับหน้าแผนผัง
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
          <span>ความก้าวหน้าการประเมิน</span>
          <span className="text-indigo-700 font-bold">{answeredCount} / {totalItems} ข้อ</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${(answeredCount / totalItems) * 100}%` }}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-6">
        {EVALUATION_ITEMS.map((cat, catIdx) => (
          <div key={catIdx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 pb-3 mb-5 border-b border-slate-100 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-indigo-600" />
              {cat.category}
            </h2>

            <div className="space-y-6">
              {cat.items.map((item) => {
                const currentRating = ratings[item.id];

                return (
                  <div key={item.id} className="p-4 rounded-xl bg-slate-50/70 border border-slate-100">
                    <p className="text-base sm:text-lg font-medium text-slate-900 mb-4 leading-relaxed">
                      {item.text}
                    </p>

                    {/* 5-scale Buttons */}
                    <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
                      {scaleLabels.map(scale => {
                        const isSelected = currentRating === scale.value;

                        return (
                          <button
                            key={scale.value}
                            type="button"
                            onClick={() => handleRate(item.id, scale.value)}
                            className={`p-2 sm:p-3 rounded-xl border text-center transition cursor-pointer active:scale-95 flex flex-col items-center justify-center ${
                              isSelected
                                ? 'bg-indigo-600 border-indigo-600 text-white font-bold shadow-xs'
                                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            <span className="text-base sm:text-lg font-bold">{scale.value}</span>
                            <span className={`text-[10px] sm:text-xs hidden sm:inline-block mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                              {scale.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Comments Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-2">
            ข้อเสนอแนะเพิ่มเติมเพื่อการปรับปรุงและพัฒนารูปแบบ (วิจัยระยะต่อไป)
          </h3>
          <p className="text-xs text-slate-500 mb-3">
            ข้อคิดเห็นของท่านมีคุณค่ายิ่งต่อการปรับปรุงงานวิจัยเพื่อการพัฒนาผู้บริหารสถานศึกษาขนาดเล็ก
          </p>
          <textarea
            rows={3}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="โปรดระบุข้อคิดเห็น ข้อเสนอแนะ หรือจุดที่ควรพัฒนาเพิ่มเติม..."
            className="w-full p-4 text-base rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
          />
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-4 px-6 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-base sm:text-lg flex items-center justify-center gap-3 shadow-md transition active:scale-[0.99] cursor-pointer disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
          <span>{isSubmitting ? 'กำลังบันทึกแบบประเมิน...' : 'ส่งแบบประเมินรูปแบบและรับเกียรติบัตร'}</span>
        </button>
      </div>

    </div>
  );
};
