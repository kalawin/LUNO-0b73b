import React, { useState } from 'react';
import { PRE_TEST_QUESTIONS, POST_TEST_QUESTIONS } from '../data/courseData';
import { CheckCircle2, ChevronRight, ChevronLeft, Send, Sparkles, Check, ArrowRight } from 'lucide-react';
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
      <div className="max-w-xl mx-auto px-4 py-12 animate-fade-in text-center">
        <div className="bg-zinc-900/90 border border-red-500/40 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center mx-auto text-red-400">
            <Check className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {quizType === 'pre' ? 'ส่งแบบทดสอบก่อนเรียนสำเร็จ!' : 'ส่งแบบทดสอบหลังเรียนสำเร็จ!'}
            </h2>
            <p className="text-zinc-300 text-sm">
              {quizType === 'pre'
                ? 'คะแนนพื้นฐานก่อนเรียนของท่าน'
                : 'คะแนนประเมินผลสัมฤทธิ์หลังเรียนของท่าน'}
            </p>
          </div>

          <div className="text-5xl font-black text-red-400 my-4">
            {finalScore} <span className="text-2xl text-zinc-400 font-normal">/ {totalQuestions} คะแนน</span>
          </div>

          <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
            {quizType === 'pre'
              ? 'ระบบบันทึกคะแนนลง Google Sheet และปลดล็อกด่านที่ 1 (นักสื่อสารดิจิทัล) เรียบร้อยแล้ว'
              : 'บันทึกคะแนนลงระบบเรียบร้อยแล้ว ก้าวต่อไปคือการทำแบบประเมินรูปแบบเพื่อรับเกียรติบัตร'}
          </p>

          <button
            onClick={handleProceedAfterModal}
            className="w-full py-4 px-6 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 shadow-lg shadow-red-600/30 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer border border-red-500/40"
          >
            <span>{quizType === 'pre' ? 'เข้าสู่ด่านที่ 1 (นักสื่อสารดิจิทัล)' : 'เข้าสู่แบบประเมินรูปแบบ & วุฒิบัตร'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      {/* Quiz Header Banner */}
      <div className="bg-zinc-900/90 border border-red-500/30 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-950 text-red-300 border border-red-500/40 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              {quizType === 'pre' ? 'แบบทดสอบก่อนเรียน (Pre-test)' : 'แบบทดสอบหลังเรียน (Post-test)'}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {quizType === 'pre' ? 'วัดระดับความเข้าใจพื้นฐาน 4 มิติ' : 'วัดผลสัมฤทธิ์ทางการเรียนรู้'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {onBackToDashboard && (
              <button
                onClick={onBackToDashboard}
                className="text-xs text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-3 py-2 rounded-xl transition cursor-pointer border border-zinc-700"
              >
                แผนผัง
              </button>
            )}
            <div className="text-right bg-zinc-950 px-3.5 py-1.5 rounded-xl border border-zinc-800">
              <div className="text-[11px] text-zinc-400">ความคืบหน้า</div>
              <div className="text-sm font-bold text-red-400">
                {answeredCount} / {totalQuestions} ข้อ
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden mt-4 border border-zinc-800">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-300"
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        {/* Counter and status */}
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
          <span className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300">
            คำถามข้อที่ {currentIndex + 1} จาก {totalQuestions}
          </span>
          {isAnswered && (
            <span className="text-red-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              เลือกคำตอบแล้ว
            </span>
          )}
        </div>

        {/* Question Text */}
        <h2 className="text-base sm:text-lg font-semibold text-white leading-relaxed">
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
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer active:scale-[0.99] ${
                  isSelected
                    ? 'bg-red-950/70 border-red-500 text-white shadow-md shadow-red-600/20'
                    : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 text-zinc-200'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border shrink-0 mt-0.5 flex items-center justify-center font-bold text-xs ${
                  isSelected
                    ? 'border-red-500 bg-red-600 text-white'
                    : 'border-zinc-700 bg-zinc-900 text-zinc-400'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="text-sm sm:text-base leading-relaxed">
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
          className={`px-5 py-3 rounded-2xl border font-semibold text-sm flex items-center gap-2 transition cursor-pointer ${
            currentIndex === 0
              ? 'opacity-40 cursor-not-allowed border-zinc-800 text-zinc-600'
              : 'border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>ข้อก่อนหน้า</span>
        </button>

        {currentIndex === totalQuestions - 1 ? (
          <button
            onClick={handleSubmit}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-600/30 transition cursor-pointer border border-red-500/40"
          >
            <Send className="w-4 h-4" />
            <span>ส่งคำตอบทั้งหมด</span>
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-sm flex items-center gap-2 transition cursor-pointer border border-zinc-700"
          >
            <span>ข้อถัดไป</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
