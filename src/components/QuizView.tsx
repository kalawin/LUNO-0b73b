import React, { useState } from 'react';
import { PRE_POST_QUIZ } from '../data/courseData';
import { CheckCircle2, ChevronRight, ChevronLeft, Send, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizViewProps {
  quizType: 'pre' | 'post';
  onComplete: (score: number, answers: Record<number, number>) => void;
  onBackToDashboard: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ quizType, onComplete, onBackToDashboard }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQ = PRE_POST_QUIZ[currentIndex];
  const totalQuestions = PRE_POST_QUIZ.length;
  const isAnswered = answers[currentQ.id] !== undefined;
  const answeredCount = Object.keys(answers).length;

  const handleSelectOption = (optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (answeredCount < totalQuestions) {
      alert(`ท่านตอบไปแล้ว ${answeredCount} จาก ${totalQuestions} ข้อ กรุณาตอบให้ครบทุกข้อก่อนส่งแบบทดสอบครับ`);
      return;
    }

    setIsSubmitting(true);

    // คำนวณคะแนน
    let score = 0;
    PRE_POST_QUIZ.forEach(q => {
      if (answers[q.id] === q.correctIndex) {
        score += 1;
      }
    });

    // ยิง Confetti พลุฉลอง
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // fallback
    }

    setTimeout(() => {
      onComplete(score, answers);
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      
      {/* Quiz Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 mb-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              {quizType === 'pre' ? 'แบบทดสอบก่อนเรียนรู้ (Pre-test)' : 'แบบทดสอบหลังเรียนรู้ (Post-test)'}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {quizType === 'pre' ? 'วัดระดับความเข้าใจพื้นฐาน' : 'วัดผลสัมฤทธิ์ทางการเรียนรู้'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToDashboard}
              className="text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-3 py-2 rounded-lg transition"
            >
              กลับหน้าแผนผัง
            </button>
            <div className="text-right">
              <div className="text-xs text-slate-500 font-medium">ตอบแล้ว</div>
              <div className="text-sm font-bold text-indigo-700">
                {answeredCount} / {totalQuestions} ข้อ
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-4">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-6">
        
        {/* Question Counter */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-4">
          <span>คำถามข้อที่ {currentIndex + 1} จาก {totalQuestions}</span>
          {isAnswered && (
            <span className="text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              เลือกคำตอบแล้ว
            </span>
          )}
        </div>

        {/* Question Text */}
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-6 leading-relaxed">
          {currentQ.question}
        </h2>

        {/* Options List */}
        <div className="space-y-3.5">
          {currentQ.options.map((option, idx) => {
            const isSelected = answers[currentQ.id] === idx;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 sm:p-4.5 rounded-xl border-2 transition-all flex items-start gap-3.5 cursor-pointer active:scale-[0.99] ${
                  isSelected
                    ? 'bg-indigo-50/80 border-indigo-600 text-indigo-950 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                }`}
              >
                {/* Radio Circle */}
                <div className={`w-6 h-6 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center font-bold text-xs ${
                  isSelected 
                    ? 'border-indigo-600 bg-indigo-600 text-white' 
                    : 'border-slate-300 text-slate-400'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>

                {/* Option Label */}
                <span className="text-base sm:text-lg leading-relaxed font-medium">
                  {option}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`px-5 py-3 rounded-xl border font-semibold text-sm sm:text-base flex items-center gap-2 transition cursor-pointer ${
            currentIndex === 0
              ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
              : 'border-slate-300 hover:bg-slate-100 text-slate-700 active:scale-95'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span>ข้อก่อนหน้า</span>
        </button>

        {currentIndex === totalQuestions - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-md transition active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
            <span>{isSubmitting ? 'กำลังส่งข้อมูล...' : 'ส่งคำตอบทั้งหมด'}</span>
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm sm:text-base flex items-center gap-2 shadow-sm transition active:scale-95 cursor-pointer"
          >
            <span>ข้อถัดไป</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

    </div>
  );
};
