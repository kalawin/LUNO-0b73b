import React, { useState } from 'react';
import { PRE_TEST_QUESTIONS, POST_TEST_QUESTIONS } from '../data/courseData';
import { CheckCircle2, ChevronRight, ChevronLeft, Send, Sparkles, Check, ArrowRight, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SoundService } from '../services/audio';

interface QuizViewProps {
  quizType: 'pre' | 'post';
  onComplete: (score: number, answers: Record<number, number>) => void;
  onBackToDashboard?: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ quizType, onComplete, onBackToDashboard }) => {
  const questions = quizType === 'pre' ? PRE_TEST_QUESTIONS : POST_TEST_QUESTIONS;
  const totalQuestions = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompletedModal, setIsCompletedModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const currentQ = questions[currentIndex];
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
      SoundService.playError();
      alert(`ท่านตอบไปแล้ว ${answeredCount} จาก ${totalQuestions} ข้อ กรุณาตอบให้ครบทุกข้อก่อนส่งแบบทดสอบครับ`);
      return;
    }

    // คำนวณคะแนน
    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctIndex) {
        score += 1;
      }
    });

    setFinalScore(score);
    SoundService.playSuccess();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // fallback
    }

    setIsCompletedModal(true);
  };

  const handleProceedAfterModal = () => {
    onComplete(finalScore, answers);
  };

  if (isCompletedModal) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 animate-fade-in text-center">
        <div className="bg-white border border-slate-200/90 rounded-[32px] p-8 sm:p-10 shadow-2xl shadow-slate-200/50 space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-teal-50 to-emerald-100 border border-teal-200 flex items-center justify-center mx-auto text-teal-600 shadow-sm">
            <Award className="w-10 h-10" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3">
              <Check className="w-3.5 h-3.5" /> บันทึกผลสำเร็จ
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              {quizType === 'pre' ? 'ส่งแบบทดสอบก่อนเรียนสำเร็จ!' : 'ส่งแบบทดสอบหลังเรียนสำเร็จ!'}
            </h2>
            <p className="text-slate-500 text-sm">
              {quizType === 'pre'
                ? 'คะแนนพื้นฐานก่อนการพัฒนาภาวะผู้นำดิจิทัล'
                : 'คะแนนประเมินผลสัมฤทธิ์ทางการเรียนรู้'}
            </p>
          </div>

          <div className="py-4 px-6 bg-slate-50 rounded-2xl border border-slate-100 inline-block">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">ผลคะแนนที่ได้</div>
            <div className="text-5xl font-black text-teal-600">
              {finalScore} <span className="text-2xl text-slate-400 font-medium">/ {totalQuestions} คะแนน</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            {quizType === 'pre'
              ? 'ระบบได้บันทึกคะแนนลงฐานข้อมูลวิจัยและปลดล็อกด่านที่ 1 (Module 1: การสื่อสารเชิงดิจิทัล) เรียบร้อยแล้ว'
              : 'บันทึกคะแนนลงระบบเรียบร้อยแล้ว ขั้นตอนถัดไปคือการทำแบบประเมินรูปแบบเพื่อออกวุฒิบัตรรับรองสมรรถนะ'}
          </p>

          <button
            onClick={handleProceedAfterModal}
            className="w-full py-4 px-6 rounded-2xl font-bold text-base text-white bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/15 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{quizType === 'pre' ? 'เข้าสู่ Module 1 (การสื่อสารเชิงดิจิทัล)' : 'เข้าสู่แบบประเมินรูปแบบ & วุฒิบัตร'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Quiz Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-[28px] p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-500" />
              {quizType === 'pre' ? 'แบบทดสอบก่อนเรียน (Pre-test)' : 'แบบทดสอบหลังเรียน (Post-test)'}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {quizType === 'pre' ? 'วัดระดับความเข้าใจพื้นฐาน 4 มิติ' : 'วัดผลสัมฤทธิ์ทางการเรียนรู้'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {quizType === 'pre'
                ? 'แบบทดสอบเลือกตอบ 10 ข้อ เพื่อประเมินสมรรถนะก่อนเข้ารับการพัฒนา'
                : 'แบบทดสอบประเมินสมรรถนะปลายทางหลังจากผ่านกิจกรรมครบ 4 โมดูล'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onBackToDashboard && (
              <button
                type="button"
                onClick={onBackToDashboard}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition cursor-pointer"
              >
                ภาพรวม
              </button>
            )}
            <div className="text-right bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200/80">
              <div className="text-[11px] font-semibold text-slate-400">ความคืบหน้า</div>
              <div className="text-sm font-black text-teal-700">
                {answeredCount} / {totalQuestions} ข้อ
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-5">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-300 rounded-full"
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white border border-slate-200/80 rounded-[28px] p-6 sm:p-8 shadow-xs space-y-6">
        {/* Counter and status */}
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold">
            คำถามข้อที่ {currentIndex + 1} จาก {totalQuestions}
          </span>
          {isAnswered ? (
            <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl flex items-center gap-1 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              เลือกคำตอบแล้ว
            </span>
          ) : (
            <span className="text-slate-400 px-2 py-1">
              ยังไม่ได้ตอบข้อนี้
            </span>
          )}
        </div>

        {/* Question Text */}
        <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
          {currentQ.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            const isSelected = answers[currentQ.id] === idx;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 sm:p-4.5 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer active:scale-[0.99] ${
                  isSelected
                    ? 'bg-teal-50/80 border-2 border-teal-600 text-teal-950 font-semibold shadow-xs ring-2 ring-teal-500/20'
                    : 'bg-slate-50/60 border-slate-200/80 hover:border-slate-300 hover:bg-slate-100/70 text-slate-700'
                }`}
              >
                <div className={`w-7 h-7 rounded-full border shrink-0 mt-0.5 flex items-center justify-center font-bold text-xs transition-colors ${
                  isSelected
                    ? 'border-teal-600 bg-teal-600 text-white shadow-xs'
                    : 'border-slate-300 bg-white text-slate-600'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="text-sm sm:text-base leading-relaxed pt-0.5">
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
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`px-5 py-3 rounded-2xl border font-bold text-sm flex items-center gap-2 transition cursor-pointer ${
            currentIndex === 0
              ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400 bg-slate-50'
              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>ข้อก่อนหน้า</span>
        </button>

        {currentIndex === totalQuestions - 1 ? (
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-teal-600/20 transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>ส่งคำตอบทั้งหมด</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center gap-2 transition cursor-pointer shadow-sm shadow-slate-900/10"
          >
            <span>ข้อถัดไป</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
