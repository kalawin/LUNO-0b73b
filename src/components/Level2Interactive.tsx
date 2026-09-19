import React, { useState } from 'react';
import { PlayCircle, CheckCircle2, Calculator, AlertTriangle, ArrowRight } from 'lucide-react';
import { SoundService } from '../services/audio';
import { ApiService } from '../services/api';

import { LEVEL_2_STRATEGIES } from '../../1_EDIT_CONTENT_HERE/interactive_scenarios';

interface Props {
  onPassLevel: () => void;
  onBackToDashboard?: () => void;
}

export const Level2Interactive: React.FC<Props> = ({ onPassLevel, onBackToDashboard }) => {
  const [watchedVideos, setWatchedVideos] = useState<Record<string, boolean>>(() => {
    const prog = ApiService.getLocalProgress();
    return prog.watchedVideos || {};
  });

  // Decision modeling states
  const [students, setStudents] = useState<number>(45);
  const [strategy, setStrategy] = useState<'oer' | 'freemium' | 'commercial'>('oer');
  const [quizAnswer, setQuizAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'warning'; message: string; details?: string } | null>(null);

  // คำนวณ ROI โดยดึงค่าจาก LEVEL_2_STRATEGIES
  const currentStratData = LEVEL_2_STRATEGIES.find(s => s.id === strategy) || LEVEL_2_STRATEGIES[0];
  const costPerHead = currentStratData.costPerHead;
  const efficiencyDelta = currentStratData.efficiencyDelta;
  const roiScore = Math.min(99.5, Math.max(15, Math.round(((efficiencyDelta * students) / (costPerHead + 10)) * 2.5)));

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
        details: 'โปรดเลือกแนวทางการแก้ปัญหาในด่านที่ 2 ก่อนกดยืนยันคำตอบ'
      });
      return;
    }

    if (quizAnswer === 'B') {
      SoundService.playSuccess();
      setFeedback({
        type: 'success',
        message: 'ถูกต้องยอดเยี่ยม!',
        details: 'ในโรงเรียนขนาดเล็ก การจัดการเรียนรู้แบบผสมผสาน (Hybrid & Offline Caching) โดยดาวน์โหลดสื่อ OER ไว้ล่วงหน้า ช่วยแก้ปัญหาสัญญาณเน็ตสะดุดได้อย่างยั่งยืนที่สุดโดยไม่ตัดโอกาสการเรียนรู้ของนักเรียน'
      });

      // ส่ง Telemetry ด่าน 2 เข้าชีท data1
      await ApiService.sendTelemetry({
        กิจกรรมล่าสุด: "ผ่านด่าน 2 - นักออกแบบการเรียนรู้",
        สถานะด่าน2: "ผ่านสมบูรณ์"
      });

      setTimeout(() => {
        onPassLevel();
      }, 2200);
    } else {
      SoundService.playError();
      setFeedback({
        type: 'error',
        message: 'ยังไม่ตรงกับบริบทโรงเรียนขนาดเล็ก',
        details: 'การระงับการเรียนหรือผลักภาระค่าใช้จ่ายให้นักเรียนไม่ใช่ทางออกที่ยั่งยืน โปรดทบทวนหลักการของนักออกแบบการเรียนรู้และตอบใหม่อีกครั้ง'
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-red-950/80 via-zinc-900 to-zinc-950 border border-red-500/30 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <span className="px-3.5 py-1 rounded-full bg-red-950 text-red-300 border border-red-500/40 text-xs font-semibold">
            ด่านที่ 2 จาก 4
          </span>
          <span className="text-xs sm:text-sm text-zinc-300 bg-zinc-800/80 px-3 py-1 rounded-xl border border-zinc-700">
            สถานะ: <span className="text-red-400 font-medium">กำลังศึกษา</span>
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
          <span>🎨</span> นักออกแบบการเรียนรู้ (Learning Designer)
        </h2>
        <p className="text-zinc-300 text-sm sm:text-base mt-2 leading-relaxed">
          นำการเปลี่ยนแปลงด้านการจัดการเรียนรู้ดิจิทัล เลือกใช้แพลตฟอร์มอย่างคุ้มค่า และสนับสนุนครูออกแบบชั้นเรียนที่ตอบโจทย์นักเรียน
        </p>
      </div>

      {/* Video Micro-Learning Modules (3 clips) */}
      <div className="rounded-3xl p-6 bg-zinc-900/80 border border-zinc-800 space-y-5 shadow-lg">
        <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <PlayCircle className="w-5 h-5 text-red-500" />
          วิดีโอชุดการเรียนรู้ (Micro-Learning Modules)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-950/70 rounded-2xl p-4 border border-zinc-800 flex flex-col justify-between hover:border-zinc-700 transition">
            <div>
              <div className="flex justify-between text-xs text-red-400 font-semibold mb-2">
                <span>ตอนที่ 2.1</span>
                <span>⏱️ 3 นาที</span>
              </div>
              <h4 className="font-bold text-white text-sm sm:text-base mb-1.5">การเลือกเทคโนโลยีการสอนที่คุ้มค่า</h4>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                เกณฑ์การเลือกเครื่องมือดิจิทัลฟรีและ OER ที่ไม่สร้างภาระค่าใช้จ่ายแก่โรงเรียน
              </p>
            </div>
            <button
              onClick={() => handleSimulateWatch('l2_v1', 'เลือกเทคโนโลยีการสอนที่คุ้มค่า')}
              className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                watchedVideos['l2_v1']
                  ? 'bg-red-950/80 text-red-200 border-red-500/50'
                  : 'bg-zinc-800 hover:bg-red-600/20 text-zinc-300 hover:text-white border-zinc-700'
              }`}
            >
              {watchedVideos['l2_v1'] ? <CheckCircle2 className="w-4 h-4 text-red-400" /> : <PlayCircle className="w-4 h-4 text-red-400" />}
              {watchedVideos['l2_v1'] ? 'รับชมแล้ว' : 'ทำความเข้าใจแล้ว (3 นาที)'}
            </button>
          </div>

          <div className="bg-zinc-950/70 rounded-2xl p-4 border border-zinc-800 flex flex-col justify-between hover:border-zinc-700 transition">
            <div>
              <div className="flex justify-between text-xs text-red-400 font-semibold mb-2">
                <span>ตอนที่ 2.2</span>
                <span>⏱️ 3 นาที</span>
              </div>
              <h4 className="font-bold text-white text-sm sm:text-base mb-1.5">การจัดสภาพแวดล้อมห้องเรียนดิจิทัล</h4>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                การบริหารจัดการอุปกรณ์ที่มีจำกัด (BYOD / สลับรอบใช้) ในบริบทชนบท
              </p>
            </div>
            <button
              onClick={() => handleSimulateWatch('l2_v2', 'จัดสภาพแวดล้อมดิจิทัล')}
              className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                watchedVideos['l2_v2']
                  ? 'bg-red-950/80 text-red-200 border-red-500/50'
                  : 'bg-zinc-800 hover:bg-red-600/20 text-zinc-300 hover:text-white border-zinc-700'
              }`}
            >
              {watchedVideos['l2_v2'] ? <CheckCircle2 className="w-4 h-4 text-red-400" /> : <PlayCircle className="w-4 h-4 text-red-400" />}
              {watchedVideos['l2_v2'] ? 'รับชมแล้ว' : 'ทำความเข้าใจแล้ว (3 นาที)'}
            </button>
          </div>

          <div className="bg-zinc-950/70 rounded-2xl p-4 border border-zinc-800 flex flex-col justify-between hover:border-zinc-700 transition">
            <div>
              <div className="flex justify-between text-xs text-red-400 font-semibold mb-2">
                <span>ตอนที่ 2.3</span>
                <span>⏱️ 2 นาที</span>
              </div>
              <h4 className="font-bold text-white text-sm sm:text-base mb-1.5">การวัดผลด้วยเครื่องมือดิจิทัลที่ง่ายดาย</h4>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                ใช้ Google Forms, Quizizz หรือแบบประเมินเรียลไทม์ลดงานเอกสารครู
              </p>
            </div>
            <button
              onClick={() => handleSimulateWatch('l2_v3', 'วัดผลด้วยเครื่องมือดิจิทัล')}
              className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                watchedVideos['l2_v3']
                  ? 'bg-red-950/80 text-red-200 border-red-500/50'
                  : 'bg-zinc-800 hover:bg-red-600/20 text-zinc-300 hover:text-white border-zinc-700'
              }`}
            >
              {watchedVideos['l2_v3'] ? <CheckCircle2 className="w-4 h-4 text-red-400" /> : <PlayCircle className="w-4 h-4 text-red-400" />}
              {watchedVideos['l2_v3'] ? 'รับชมแล้ว' : 'ทำความเข้าใจแล้ว (2 นาที)'}
            </button>
          </div>
        </div>
      </div>

      {/* Decision Modeling & ROI Simulation Box */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/90 border border-red-500/30 space-y-6 shadow-xl">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-red-950 text-red-300 border border-red-500/40">
            แบบจำลองการคำนวณและตัดสินใจ (Decision Modeling)
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 flex items-center gap-2">
            <Calculator className="w-6 h-6 text-red-400" />
            การคำนวณดัชนีผลตอบแทนความคุ้มค่าการเรียนรู้ดิจิทัล (Digital Learning ROI)
          </h3>
        </div>

        <p className="text-zinc-300 text-sm leading-relaxed">
          ในโรงเรียนขนาดเล็ก ผู้บริหารต้องใช้หลักคิดความคุ้มค่าเชิงประสิทธิภาพการเรียนรู้ โดยอาศัยสมการจำลอง:
        </p>

        {/* Formula Display Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/90 border border-red-500/30 text-center shadow-inner">
          <div className="text-base sm:text-xl font-mono text-red-200 py-1 font-bold">
            ROI<sub className="text-xs">Digital</sub> = [ ( ΔLearning Efficiency × N<sub className="text-xs">students</sub> ) / ( Cost per Head + ε ) ] × 100%
          </div>
          <p className="text-xs text-zinc-400 mt-2">
            เมื่อ ΔLearning Efficiency คือ ประสิทธิภาพการเรียนรู้ที่เพิ่มขึ้น (1–10) และ N<sub>students</sub> คือ จำนวนนักเรียน
          </p>
        </div>

        {/* Simulation Sliders & Interactive Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800">
          <div>
            <label className="block text-sm font-semibold text-zinc-200 mb-2">
              จำนวนนักเรียนในโรงเรียน: <span className="text-red-400 font-bold">{students} คน</span>
            </label>
            <input
              type="range"
              min="15"
              max="120"
              value={students}
              onChange={(e) => setStudents(parseInt(e.target.value, 10))}
              className="w-full accent-red-500 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-zinc-400 mt-1">
              <span>15 คน</span>
              <span>60 คน</span>
              <span>120 คน</span>
            </div>

            <label className="block text-sm font-semibold text-zinc-200 mt-5 mb-2">
              กลยุทธ์การจัดหาซอฟต์แวร์/แพลตฟอร์ม:
            </label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-red-500"
            >
              <option value="oer">เน้นสื่อเปิดฟรี OER + Google Workspace (ต้นทุน 0 บาท/คน)</option>
              <option value="freemium">โมเดลผสมผสาน Freemium Tools (ต้นทุน 30 บาท/คน)</option>
              <option value="commercial">จัดซื้อซอฟต์แวร์เชิงพาณิชย์สำเร็จรูป (ต้นทุน 350 บาท/คน)</option>
            </select>
          </div>

          <div className="flex flex-col justify-center items-center p-6 rounded-2xl bg-zinc-900/90 border border-red-500/30 text-center">
            <span className="text-xs uppercase font-semibold text-zinc-400 tracking-wider mb-1">
              ผลการประเมินความคุ้มค่าสำหรับ รร.ขนาดเล็ก
            </span>
            <div className={`text-3xl sm:text-4xl font-black my-2 ${
              strategy === 'oer'
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-white'
                : strategy === 'freemium'
                ? 'text-zinc-200'
                : 'text-red-400'
            }`}>
              {strategy === 'oer' && `คุ้มค่าสูงสุด (${roiScore}%)`}
              {strategy === 'freemium' && `คุ้มค่าปานกลาง (${roiScore}%)`}
              {strategy === 'commercial' && `ความคุ้มค่าต่ำ (${roiScore}%)`}
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1">
              {strategy === 'oer' && 'คลังสื่อเปิด OER และเครื่องมือฟรีช่วยประหยัดงบได้มากที่สุด และครูปรับแต่งเนื้อหาได้อิสระ'}
              {strategy === 'freemium' && 'โมเดล Freemium คล่องตัวแต่ต้องระวังข้อจำกัดของฟีเจอร์ฟรีในระยะยาว'}
              {strategy === 'commercial' && 'ซอฟต์แวร์เชิงพาณิชย์สร้างภาระงบประมาณรายปีสูงเกินไปสำหรับโรงเรียนขนาดเล็ก'}
            </p>
          </div>
        </div>

        {/* Level 2 Scenario Question */}
        <div className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-4">
          <div className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center font-bold text-sm flex-shrink-0">
              ?
            </span>
            <div className="flex-1">
              <h4 className="text-sm sm:text-base font-bold text-white mb-3">
                คำถามท้ายด่านที่ 2: หากโรงเรียนของท่านมีสัญญาณอินเทอร์เน็ตไม่เสถียรในบางวัน ผู้บริหารควรชี้นำคุณครูให้ปรับรูปแบบการจัดการเรียนรู้อย่างไร?
              </h4>
              <div className="space-y-2.5">
                <label className={`flex items-center p-3 rounded-xl border text-sm cursor-pointer transition ${
                  quizAnswer === 'A' ? 'bg-red-950/60 border-red-500 text-white' : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-200'
                }`}>
                  <input
                    type="radio"
                    name="l2_quiz"
                    value="A"
                    checked={quizAnswer === 'A'}
                    onChange={() => setQuizAnswer('A')}
                    className="w-4 h-4 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-3">ก. งดการเรียนการสอนด้านเทคโนโลยีจนกว่าเสาสัญญาณหลักจะได้รับการอัปเกรด</span>
                </label>
                <label className={`flex items-center p-3 rounded-xl border text-sm cursor-pointer transition ${
                  quizAnswer === 'B' ? 'bg-red-950/60 border-red-500 text-white' : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-200'
                }`}>
                  <input
                    type="radio"
                    name="l2_quiz"
                    value="B"
                    checked={quizAnswer === 'B'}
                    onChange={() => setQuizAnswer('B')}
                    className="w-4 h-4 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-3">ข. จัดการเรียนรู้แบบผสมผสาน (Hybrid & Offline Caching) โดยโหลดสื่อ OER ไว้ล่วงหน้า</span>
                </label>
                <label className={`flex items-center p-3 rounded-xl border text-sm cursor-pointer transition ${
                  quizAnswer === 'C' ? 'bg-red-950/60 border-red-500 text-white' : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-200'
                }`}>
                  <input
                    type="radio"
                    name="l2_quiz"
                    value="C"
                    checked={quizAnswer === 'C'}
                    onChange={() => setQuizAnswer('C')}
                    className="w-4 h-4 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-3">ค. บังคับให้นักเรียนซื้อซิมการ์ดส่วนตัวความเร็วสูงทุกคน</span>
                </label>
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
            <span>ยืนยันคำตอบ และปลดล็อกด่านที่ 3</span>
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
