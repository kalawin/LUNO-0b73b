import React, { useState } from 'react';
import { PlayCircle, CheckCircle2, AlertTriangle, ArrowRight, Lightbulb } from 'lucide-react';
import { SoundService } from '../services/audio';
import { ApiService } from '../services/api';
import { LEVEL_4_VISION_PARTS, LEVEL_4_QUIZ } from '../../1_EDIT_CONTENT_HERE/interactive_scenarios';

interface Props {
  onPassLevel: () => void;
  onBackToDashboard?: () => void;
}

export const Level4Interactive: React.FC<Props> = ({ onPassLevel, onBackToDashboard }) => {
  const [watchedVideos, setWatchedVideos] = useState<Record<string, boolean>>(() => {
    const prog = ApiService.getLocalProgress();
    return prog.watchedVideos || {};
  });

  // Vision Builder states (ดึงค่าเริ่มต้นจาก 1_EDIT_CONTENT_HERE/interactive_scenarios.ts)
  const [part1, setPart1] = useState(LEVEL_4_VISION_PARTS.pillars[0] || '');
  const [part2, setPart2] = useState(LEVEL_4_VISION_PARTS.actionDrivers[0] || '');
  const [part3, setPart3] = useState(LEVEL_4_VISION_PARTS.impacts[0] || '');

  const [quizAnswer, setQuizAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'warning'; message: string; details?: string } | null>(null);

  const fullVisionStatement = `"${part1} ${part2} ${part3}"`;

  const handleSimulateWatch = (videoId: string, title: string) => {
    const updated = { ...watchedVideos, [videoId]: true };
    setWatchedVideos(updated);
    ApiService.saveLocalProgress({ watchedVideos: updated });
    SoundService.playSuccess();
    setFeedback({
      type: 'success',
      message: `เรียนรู้สำเร็จ! ท่านได้รับชมบทเรียน "${title}" เรียบร้อยแล้ว`
    });
  };

  const handleCheckQuiz = async () => {
    if (!quizAnswer) {
      SoundService.playError();
      setFeedback({
        type: 'warning',
        message: 'กรุณาเลือกคำตอบ',
        details: 'โปรดเลือกแนวปฏิบัติด้าน PDPA และการเผยแพร่สื่อในด่านที่ 4'
      });
      return;
    }

    const selected = LEVEL_4_QUIZ.choices.find(c => c.id === quizAnswer);
    if (selected && selected.isCorrect) {
      SoundService.playSuccess();
      setFeedback({
        type: 'success',
        message: LEVEL_4_QUIZ.correctFeedback.message,
        details: LEVEL_4_QUIZ.correctFeedback.details
      });

      // บันทึกวิสัยทัศน์ที่สร้างลงเครื่องและส่ง Telemetry เข้าชีท data1
      ApiService.saveLocalProgress({ visionStatement: fullVisionStatement });
      await ApiService.sendTelemetry({
        กิจกรรมล่าสุด: "ผ่านด่าน 4 - ผู้นำค่านิยมดิจิทัล",
        สถานะด่าน4: "ผ่านสมบูรณ์",
        วิสัยทัศน์ที่สร้าง: fullVisionStatement
      });

      setTimeout(() => {
        onPassLevel();
      }, 2200);
    } else {
      SoundService.playError();
      setFeedback({
        type: 'error',
        message: LEVEL_4_QUIZ.incorrectFeedback.message,
        details: LEVEL_4_QUIZ.incorrectFeedback.details
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-red-950/80 via-zinc-900 to-zinc-950 border border-red-500/30 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <span className="px-3.5 py-1 rounded-full bg-red-950 text-red-300 border border-red-500/40 text-xs font-semibold">
            ด่านที่ 4 จาก 4
          </span>
          <span className="text-xs sm:text-sm text-zinc-300 bg-zinc-800/80 px-3 py-1 rounded-xl border border-zinc-700">
            สถานะ: <span className="text-red-400 font-medium">กำลังศึกษา</span>
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
          <span>🛡️</span> ผู้นำค่านิยมดิจิทัล (Digital Value Leader)
        </h2>
        <p className="text-zinc-300 text-sm sm:text-base mt-2 leading-relaxed">
          กำหนดวิสัยทัศน์ วางแนวปฏิบัติด้านความปลอดภัยทางไซเบอร์ จริยธรรมดิจิทัล และสร้างความยั่งยืนในสถานศึกษาขนาดเล็ก
        </p>
      </div>

      {/* Video Micro-Learning Modules (2 clips) */}
      <div className="rounded-3xl p-6 bg-zinc-900/80 border border-zinc-800 space-y-5 shadow-lg">
        <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <PlayCircle className="w-5 h-5 text-red-500" />
          วิดีโอชุดการเรียนรู้ (Micro-Learning Modules)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-950/70 rounded-2xl p-4 border border-zinc-800 flex flex-col justify-between hover:border-zinc-700 transition">
            <div>
              <div className="flex justify-between text-xs text-red-400 font-semibold mb-2">
                <span>ตอนที่ 4.1</span>
                <span>⏱️ 3 นาที</span>
              </div>
              <h4 className="font-bold text-white text-sm sm:text-base mb-1.5">การสร้างวิสัยทัศน์ดิจิทัลที่จับต้องได้</h4>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                เปลี่ยนวิสัยทัศน์บนกระดาษสู่เป้าหมายที่ชุมชนและคุณครูทุกคนมีส่วนร่วมสร้าง
              </p>
            </div>
            <button
              onClick={() => handleSimulateWatch('l4_v1', 'สร้างวิสัยทัศน์ดิจิทัล')}
              className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                watchedVideos['l4_v1']
                  ? 'bg-red-950/80 text-red-200 border-red-500/50'
                  : 'bg-zinc-800 hover:bg-red-600/20 text-zinc-300 hover:text-white border-zinc-700'
              }`}
            >
              {watchedVideos['l4_v1'] ? <CheckCircle2 className="w-4 h-4 text-red-400" /> : <PlayCircle className="w-4 h-4 text-red-400" />}
              {watchedVideos['l4_v1'] ? 'รับชมแล้ว' : 'ทำความเข้าใจแล้ว (3 นาที)'}
            </button>
          </div>

          <div className="bg-zinc-950/70 rounded-2xl p-4 border border-zinc-800 flex flex-col justify-between hover:border-zinc-700 transition">
            <div>
              <div className="flex justify-between text-xs text-red-400 font-semibold mb-2">
                <span>ตอนที่ 4.2</span>
                <span>⏱️ 3 นาที</span>
              </div>
              <h4 className="font-bold text-white text-sm sm:text-base mb-1.5">จริยธรรมดิจิทัลและความปลอดภัยไซเบอร์ในโรงเรียน</h4>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                การปกป้องข้อมูลส่วนบุคคลของเด็กนักเรียน (PDPA) และการรู้เท่าทันสื่อดิจิทัล
              </p>
            </div>
            <button
              onClick={() => handleSimulateWatch('l4_v2', 'จริยธรรมและความปลอดภัยไซเบอร์')}
              className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                watchedVideos['l4_v2']
                  ? 'bg-red-950/80 text-red-200 border-red-500/50'
                  : 'bg-zinc-800 hover:bg-red-600/20 text-zinc-300 hover:text-white border-zinc-700'
              }`}
            >
              {watchedVideos['l4_v2'] ? <CheckCircle2 className="w-4 h-4 text-red-400" /> : <PlayCircle className="w-4 h-4 text-red-400" />}
              {watchedVideos['l4_v2'] ? 'รับชมแล้ว' : 'ทำความเข้าใจแล้ว (3 นาที)'}
            </button>
          </div>
        </div>
      </div>

      {/* Vision Statement Builder Tool */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/90 border border-red-500/30 space-y-6 shadow-xl">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-red-950 text-red-300 border border-red-500/40">
            เครื่องมือสร้างสรรค์วิสัยทัศน์ (Vision Builder Tool)
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-red-400" />
            ประกอบวิสัยทัศน์ดิจิทัลประจำสถานศึกษาของท่าน
          </h3>
        </div>

        <p className="text-zinc-300 text-sm leading-relaxed">
          เลือกองค์ประกอบ 3 ส่วนเพื่อประกอบเป็นแถลงการณ์วิสัยทัศน์ดิจิทัล (Digital Vision Statement) ที่สอดคล้องกับโรงเรียนของท่าน:
        </p>

        {/* 3 Component Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-red-300 mb-1.5">
              เสาหลักเป้าหมาย (Pillar):
            </label>
            <select
              value={part1}
              onChange={(e) => setPart1(e.target.value)}
              className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs sm:text-sm focus:border-red-500 focus:outline-none"
            >
              {LEVEL_4_VISION_PARTS.pillars.map((item, idx) => (
                <option key={idx} value={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-red-300 mb-1.5">
              กลไกขับเคลื่อน (Action Driver):
            </label>
            <select
              value={part2}
              onChange={(e) => setPart2(e.target.value)}
              className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs sm:text-sm focus:border-red-500 focus:outline-none"
            >
              {LEVEL_4_VISION_PARTS.actionDrivers.map((item, idx) => (
                <option key={idx} value={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-red-300 mb-1.5">
              ผลลัพธ์ปลายทาง (Impact):
            </label>
            <select
              value={part3}
              onChange={(e) => setPart3(e.target.value)}
              className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs sm:text-sm focus:border-red-500 focus:outline-none"
            >
              {LEVEL_4_VISION_PARTS.impacts.map((item, idx) => (
                <option key={idx} value={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Vision Statement Display Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/70 via-zinc-900 to-zinc-950 border border-red-500/40 text-center shadow-lg">
          <div className="text-xs uppercase tracking-widest text-red-400 font-bold mb-2">
            คำแถลงวิสัยทัศน์ดิจิทัลของโรงเรียนท่าน
          </div>
          <div className="text-base sm:text-xl font-bold text-white leading-relaxed">
            {fullVisionStatement}
          </div>
        </div>

        {/* Level 4 Scenario Question (PDPA) */}
        <div className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-4">
          <div className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center font-bold text-sm flex-shrink-0">
              ?
            </span>
            <div className="flex-1">
              <h4 className="text-sm sm:text-base font-bold text-white mb-3">
                {LEVEL_4_QUIZ.question}
              </h4>
              <div className="space-y-2.5">
                {LEVEL_4_QUIZ.choices.map((c) => (
                  <label key={c.id} className={`flex items-center p-3 rounded-xl border text-sm cursor-pointer transition ${
                    quizAnswer === c.id ? 'bg-red-950/60 border-red-500 text-white' : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-200'
                  }`}>
                    <input
                      type="radio"
                      name="l4_quiz"
                      value={c.id}
                      checked={quizAnswer === c.id}
                      onChange={() => setQuizAnswer(c.id)}
                      className="w-4 h-4 text-red-600 focus:ring-red-500"
                    />
                    <span className="ml-3">{c.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Alert Box */}
        {feedback && (
          <div className={`p-4 rounded-2xl border text-sm transition ${
            feedback.type === 'success'
              ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
              : feedback.type === 'error'
              ? 'bg-red-950/70 border-red-500/50 text-red-200'
              : 'bg-amber-950/70 border-amber-500/50 text-amber-200'
          }`}>
            <div className="font-bold flex items-center gap-2 mb-1">
              {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {feedback.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-400" />}
              {feedback.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
              <span>{feedback.message}</span>
            </div>
            {feedback.details && (
              <p className="text-xs opacity-90 mt-1">{feedback.details}</p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleCheckQuiz}
            className="flex-1 py-4 px-6 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 shadow-lg shadow-red-600/30 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer border border-red-500/40"
          >
            <span>ยืนยันคำตอบ และปลดล็อกแบบทดสอบหลังเรียน (Post-test)</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="py-4 px-5 rounded-2xl text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition cursor-pointer"
            >
              ดูแผนผังภาพรวม
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
