import React, { useState } from 'react';
import { PlayCircle, CheckCircle2, AlertTriangle, HeartHandshake } from 'lucide-react';
import { SoundService } from '../services/audio';
import { ApiService } from '../services/api';

import { LEVEL_3_CASE } from '../../1_EDIT_CONTENT_HERE/interactive_scenarios';

interface Props {
  onPassLevel: () => void;
  onBackToDashboard?: () => void;
}

export const Level3Interactive: React.FC<Props> = ({ onPassLevel, onBackToDashboard }) => {
  const [watchedVideos, setWatchedVideos] = useState<Record<string, boolean>>(() => {
    const prog = ApiService.getLocalProgress();
    return prog.watchedVideos || {};
  });

  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'warning'; title: string; message: string } | null>(null);

  const handleSimulateWatch = (videoId: string, title: string) => {
    const updated = { ...watchedVideos, [videoId]: true };
    setWatchedVideos(updated);
    ApiService.saveLocalProgress({ watchedVideos: updated });
    SoundService.playSuccess();
    setFeedback({
      type: 'success',
      title: 'เรียนรู้สำเร็จ!',
      message: `ท่านได้รับชมบทเรียน "${title}" เรียบร้อยแล้ว`
    });
  };

  const handleSelectScenario = async (choiceId: string) => {
    setSelectedChoice(choiceId);
    const chosen = LEVEL_3_CASE.choices.find(c => c.id === choiceId);
    if (!chosen) return;

    if (chosen.type === 'success') {
      SoundService.playSuccess();
      setFeedback({
        type: 'success',
        title: chosen.feedbackTitle,
        message: chosen.feedbackMessage
      });

      // ส่ง Telemetry ด่าน 3 เข้าชีท data1
      await ApiService.sendTelemetry({
        กิจกรรมล่าสุด: "ผ่านด่าน 3 - ต้นแบบทีมงาน",
        สถานะด่าน3: "ผ่านสมบูรณ์ (Buddy Coaching)"
      });

      setTimeout(() => {
        onPassLevel();
      }, 2400);
    } else {
      SoundService.playError();
      setFeedback({
        type: 'warning',
        title: chosen.feedbackTitle,
        message: chosen.feedbackMessage
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-red-950/80 via-zinc-900 to-zinc-950 border border-red-500/30 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <span className="px-3.5 py-1 rounded-full bg-red-950 text-red-300 border border-red-500/40 text-xs font-semibold">
            ด่านที่ 3 จาก 4
          </span>
          <span className="text-xs sm:text-sm text-zinc-300 bg-zinc-800/80 px-3 py-1 rounded-xl border border-zinc-700">
            สถานะ: <span className="text-red-400 font-medium">กำลังศึกษา</span>
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
          <span>🤝</span> ต้นแบบทีมงาน (Role Model & Team Collaborator)
        </h2>
        <p className="text-zinc-300 text-sm sm:text-base mt-2 leading-relaxed">
          สร้างความร่วมมือ สร้างความมั่นใจให้แก่ครูทุกวัย และเป็นแบบอย่างในการประยุกต์ใช้เทคโนโลยีด้วยความเข้าใจ (Empathy)
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
                <span>ตอนที่ 3.1</span>
                <span>⏱️ 3 นาที</span>
              </div>
              <h4 className="font-bold text-white text-sm sm:text-base mb-1.5">การเป็นแบบอย่างที่ดีในการใช้ดิจิทัล (Walk the Talk)</h4>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                ผู้นำที่เปิดใจเรียนรู้พร้อมครู ไม่กลัวความผิดพลาด และส่งเสริมความปลอดภัยข้อมูล
              </p>
            </div>
            <button
              onClick={() => handleSimulateWatch('l3_v1', 'การเป็นแบบอย่างที่ดี')}
              className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                watchedVideos['l3_v1']
                  ? 'bg-red-950/80 text-red-200 border-red-500/50'
                  : 'bg-zinc-800 hover:bg-red-600/20 text-zinc-300 hover:text-white border-zinc-700'
              }`}
            >
              {watchedVideos['l3_v1'] ? <CheckCircle2 className="w-4 h-4 text-red-400" /> : <PlayCircle className="w-4 h-4 text-red-400" />}
              {watchedVideos['l3_v1'] ? 'รับชมแล้ว' : 'ทำความเข้าใจแล้ว (3 นาที)'}
            </button>
          </div>

          <div className="bg-zinc-950/70 rounded-2xl p-4 border border-zinc-800 flex flex-col justify-between hover:border-zinc-700 transition">
            <div>
              <div className="flex justify-between text-xs text-red-400 font-semibold mb-2">
                <span>ตอนที่ 3.2</span>
                <span>⏱️ 3 นาที</span>
              </div>
              <h4 className="font-bold text-white text-sm sm:text-base mb-1.5">การทำงานเป็นทีมและระบบพี่เลี้ยงดิจิทัล (Buddy Coaching)</h4>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                จับคู่ครูรุ่นใหม่กับครูอาวุโสเพื่อแลกเปลี่ยนประสบการณ์การสอนและการใช้เทคโนโลยี
              </p>
            </div>
            <button
              onClick={() => handleSimulateWatch('l3_v2', 'การทำงานเป็นทีมและระบบพี่เลี้ยง')}
              className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                watchedVideos['l3_v2']
                  ? 'bg-red-950/80 text-red-200 border-red-500/50'
                  : 'bg-zinc-800 hover:bg-red-600/20 text-zinc-300 hover:text-white border-zinc-700'
              }`}
            >
              {watchedVideos['l3_v2'] ? <CheckCircle2 className="w-4 h-4 text-red-400" /> : <PlayCircle className="w-4 h-4 text-red-400" />}
              {watchedVideos['l3_v2'] ? 'รับชมแล้ว' : 'ทำความเข้าใจแล้ว (3 นาที)'}
            </button>
          </div>
        </div>
      </div>

      {/* Case-based Scenario Simulation */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/90 border border-red-500/30 space-y-6 shadow-xl">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-red-950 text-red-300 border border-red-500/40">
            สถานการณ์จำลองเพื่อการตัดสินใจ (Case-based Scenario)
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-red-400" />
            เหตุการณ์จำลอง: "ครูมาลี อายุ 56 ปี กังวลต่อการกรอกระบบคะแนนออนไลน์"
          </h3>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-zinc-200 text-sm leading-relaxed space-y-2.5">
          <p>
            <strong>บริบทสถานการณ์:</strong> {LEVEL_3_CASE.context}
          </p>
          <p className="text-red-300 font-medium">
            คำถาม: {LEVEL_3_CASE.question}
          </p>
        </div>

        {/* 3 Decision Option Cards */}
        <div className="space-y-3">
          {LEVEL_3_CASE.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => handleSelectScenario(choice.id)}
              className={`w-full text-left p-4 rounded-2xl border transition cursor-pointer ${
                selectedChoice === choice.id
                  ? 'bg-red-950/60 border-red-500'
                  : 'bg-zinc-950/60 hover:bg-zinc-800/80 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-red-500/20 text-red-300 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {choice.id}
                </span>
                <div>
                  <div className="font-bold text-white text-sm sm:text-base">{choice.title}</div>
                  <div className="text-xs text-zinc-400 mt-1">{choice.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Feedback Alert Box */}
        {feedback && (
          <div className={`p-4 rounded-2xl border text-sm transition ${
            feedback.type === 'success'
              ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
              : 'bg-amber-950/70 border-amber-500/50 text-amber-200'
          }`}>
            <div className="font-bold flex items-center gap-2 mb-1">
              {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
              <span>{feedback.title}</span>
            </div>
            <p className="text-xs opacity-90 mt-1 leading-relaxed">{feedback.message}</p>
          </div>
        )}

        {/* Action Link to overview if needed */}
        {onBackToDashboard && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={onBackToDashboard}
              className="py-2.5 px-4 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition cursor-pointer"
            >
              ดูแผนผังภาพรวม
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
