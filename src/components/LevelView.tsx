import React, { useState, useEffect } from 'react';
import type { LevelInfo } from '../types';
import { Play, CheckCircle2, ArrowRight, BookOpen, Lightbulb, Clock, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LevelViewProps {
  level: LevelInfo;
  onCompleteLevel: () => void;
  onBackToDashboard: () => void;
}

export const LevelView: React.FC<LevelViewProps> = ({ level, onCompleteLevel, onBackToDashboard }) => {
  const [reflectionAnswer, setReflectionAnswer] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(0);


  useEffect(() => {
    // จำลองการนับเวลาการเรียนรู้ หรือให้สิทธิ์ปลดล็อกได้ทันทีเมื่อผู้บริหารพร้อม
    const interval = setInterval(() => {
      setTimerSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFinish = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // fallback
    }

    onCompleteLevel();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBackToDashboard}
          className="text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition"
        >
          ← กลับหน้าแผนผัง
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
          <Clock className="w-3.5 h-3.5 text-indigo-600" />
          <span>เวลาเรียนรู้: {Math.floor(timerSeconds / 60)} นาที {timerSeconds % 60} วินาที</span>
        </div>
      </div>

      {/* Level Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ด่านที่ {level.levelNumber} จาก 4 ด่าน (ใช้เวลาประมาณ {level.durationMinutes} นาที)</span>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-2">
          {level.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
          {level.description}
        </p>

        {/* Video Player Box (16:9 Aspect Ratio) */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 shadow-md border border-slate-800 mb-6">
          {level.videoUrl.includes('youtube.com') ? (
            <iframe
              src={level.videoUrl}
              title={level.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white p-6 text-center">
              <Play className="w-16 h-16 text-indigo-400 mb-3 animate-pulse" />
              <p className="text-base font-semibold">สื่อวิดีโอบทเรียนดิจิทัล {level.durationMinutes} นาที</p>
              <p className="text-xs text-slate-400 mt-1">กดเปิดเพื่อรับชมเนื้อหาและกรณีศึกษา</p>
            </div>
          )}
        </div>

        {/* Key Takeaways */}
        <div className="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100 mb-6">
          <h3 className="text-base font-bold text-indigo-950 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            ประเด็นสำคัญประจำด่าน (Key Takeaways)
          </h3>
          <ul className="space-y-2.5">
            {level.keyTakeaways.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Reflection / Action Prompt */}
        <div className="bg-amber-50/60 rounded-xl p-5 border border-amber-200/80 mb-8">
          <h3 className="text-base font-bold text-amber-950 mb-2 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            ประเด็นชวนคิดเพื่อนำไปปรับใช้ในโรงเรียน
          </h3>
          <p className="text-sm sm:text-base text-slate-700 font-medium mb-3">
            "{level.actionPrompt}"
          </p>
          <textarea
            rows={2}
            value={reflectionAnswer}
            onChange={(e) => setReflectionAnswer(e.target.value)}
            placeholder="พิมพ์บันทึกความคิดเห็นสั้นๆ ของท่าน (ไม่บังคับ สามารถกดผ่านได้ทันที)..."
            className="w-full p-3 text-sm rounded-lg border border-amber-300/80 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-slate-800"
          />
        </div>

        {/* Complete Level Button */}
        <button
          onClick={handleFinish}
          className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base sm:text-lg flex items-center justify-center gap-3 shadow-md transition active:scale-[0.99] cursor-pointer"
        >
          <CheckCircle2 className="w-6 h-6" />
          <span>เรียนรู้จบแล้ว — ผ่านด่านที่ {level.levelNumber} และไปด่านถัดไป</span>
          <ArrowRight className="w-5 h-5" />
        </button>

      </div>

    </div>
  );
};
