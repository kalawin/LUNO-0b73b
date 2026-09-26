import React, { useState } from 'react';
import { PlayCircle, CheckCircle2, RotateCcw, AlertTriangle, Smartphone, FolderSync, Share2, BookOpen } from 'lucide-react';
import { SoundService } from '../services/audio';
import { ApiService } from '../services/api';
import { CurriculumModal } from './CurriculumModal';

import { LEVEL_1_CHANNELS } from '../../1_EDIT_CONTENT_HERE/interactive_scenarios';

const INITIAL_ITEMS = LEVEL_1_CHANNELS as Array<{
  id: string;
  name: string;
  category: 'cat-emergency' | 'cat-internal' | 'cat-community';
  icon: string;
}>;

interface Props {
  onPassLevel: () => void;
  onBackToDashboard?: () => void;
}

export const Level1Interactive: React.FC<Props> = ({ onPassLevel, onBackToDashboard }) => {
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  // สถานะการดูคลิปวิดีโอ 3 ตอน
  const [watchedVideos, setWatchedVideos] = useState<Record<string, boolean>>(() => {
    const prog = ApiService.getLocalProgress();
    return prog.watchedVideos || {};
  });

  // ตำแหน่งของการ์ด (item id -> category id หรือ 'pool')
  const [placements, setPlacements] = useState<Record<string, string>>({
    'item-1': 'pool',
    'item-2': 'pool',
    'item-3': 'pool',
    'item-4': 'pool',
    'item-5': 'pool',
    'item-6': 'pool',
  });

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'warning'; message: string; details?: string[] } | null>(null);

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

  const handleItemClick = (itemId: string) => {
    if (selectedItemId === itemId) {
      setSelectedItemId(null);
    } else {
      setSelectedItemId(itemId);
    }
  };

  const handleZoneClick = (targetZone: string) => {
    if (selectedItemId) {
      setPlacements(prev => ({ ...prev, [selectedItemId]: targetZone }));
      setSelectedItemId(null);
      setFeedback(null);
    }
  };

  const handleReset = () => {
    const resetPlacements: Record<string, string> = {};
    INITIAL_ITEMS.forEach(it => { resetPlacements[it.id] = 'pool'; });
    setPlacements(resetPlacements);
    setSelectedItemId(null);
    setFeedback(null);
  };

  const handleCheckAnswer = async () => {
    const poolItems = INITIAL_ITEMS.filter(it => placements[it.id] === 'pool');
    if (poolItems.length > 0) {
      SoundService.playError();
      setFeedback({
        type: 'warning',
        message: 'ยังจัดหมวดหมู่ไม่ครบถ้วน',
        details: ['กรุณาลากหรือเลือกวางรายการทั้ง 6 ช่องทางลงในกล่องหมวดหมู่ให้ครบก่อนตรวจคำตอบ']
      });
      return;
    }

    let correctCount = 0;
    INITIAL_ITEMS.forEach(it => {
      if (placements[it.id] === it.category) {
        correctCount++;
      }
    });

    if (correctCount === 6) {
      SoundService.playSuccess();
      setFeedback({
        type: 'success',
        message: 'ยอดเยี่ยมมาก! ท่านจัดหมวดหมู่ถูกต้องครบทั้ง 6 รายการ',
        details: [
          'หมวดด่วน & ฉุกเฉิน: LINE Alert และ SMS เข้าถึงผู้ปกครองได้ทันทีโดยไม่ต้องรอเปิดแอป',
          'หมวดบริหารภายใน: Google Drive และ LINE กลุ่มครู จัดการงานเอกสารได้รวดเร็ว ปลอดภัย และเป็นระบบ',
          'หมวดประชาสัมพันธ์: Social Media สื่อสารภาพลักษณ์เชิงบวก สร้างความเชื่อมั่นและศรัทธากับชุมชน'
        ]
      });

      // ส่ง Telemetry ด่าน 1 เข้าชีท data1
      await ApiService.sendTelemetry({
        กิจกรรมล่าสุด: "ผ่านด่าน 1 - นักสื่อสารดิจิทัล",
        สถานะด่าน1: "ผ่านสมบูรณ์ (6/6)"
      });

      setTimeout(() => {
        onPassLevel();
      }, 2200);
    } else {
      SoundService.playError();
      setFeedback({
        type: 'error',
        message: `ตอบถูกต้อง ${correctCount} จาก 6 รายการ`,
        details: ['บางช่องทางอาจยังไม่ตรงกับวัตถุประสงค์หลักของหมวดหมู่ โปรดลองแตะเพื่อสลับตำแหน่งอีกครั้ง']
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-red-950/80 via-zinc-900 to-zinc-950 border border-red-500/30 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <span className="px-3.5 py-1 rounded-full bg-red-950 text-red-300 border border-red-500/40 text-xs font-semibold">
            ด่านที่ 1 จาก 4
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCurriculumModal(true)}
              className="text-xs font-semibold text-red-300 hover:text-white bg-red-950/80 hover:bg-red-900/80 px-3 py-1.5 rounded-xl border border-red-500/40 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-red-400" />
              <span>สาระ & เกณฑ์รูบริก 10 คะแนน</span>
            </button>
            <span className="text-xs sm:text-sm text-zinc-300 bg-zinc-800/80 px-3 py-1 rounded-xl border border-zinc-700">
              สถานะ: <span className="text-red-400 font-medium">กำลังศึกษา</span>
            </span>
          </div>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
          <span>📢</span> นักสื่อสารดิจิทัล (Digital Communicator)
        </h2>
        <p className="text-zinc-300 text-sm sm:text-base mt-2 leading-relaxed">
          พัฒนาทักษะการวางแผน การบริหารช่องทางสื่อสาร และการสร้างภาพลักษณ์ที่ดีแก่โรงเรียนขนาดเล็กในยุคสารสนเทศ
        </p>
      </div>

      {/* Video Micro-Learning Modules (3 clips) */}
      <div className="rounded-3xl p-6 bg-zinc-900/80 border border-zinc-800 space-y-5 shadow-lg">
        <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <PlayCircle className="w-5 h-5 text-red-500" />
          วิดีโอชุดการเรียนรู้ (Micro-Learning Modules)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="bg-zinc-950/70 rounded-2xl p-4 border border-zinc-800 flex flex-col justify-between hover:border-zinc-700 transition">
            <div>
              <div className="flex justify-between text-xs text-red-400 font-semibold mb-2">
                <span>ตอนที่ 1.1</span>
                <span>⏱️ 3 นาที</span>
              </div>
              <h4 className="font-bold text-white text-sm sm:text-base mb-1.5">วางแผนการสื่อสารดิจิทัลในโรงเรียนขนาดเล็ก</h4>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                กลยุทธ์การจำแนกกลุ่มเป้าหมาย (ครู ผู้ปกครอง คณะกรรมการสถานศึกษา) เพื่อส่งสารได้ตรงจุด
              </p>
            </div>
            <button
              onClick={() => handleSimulateWatch('l1_v1', 'วางแผนการสื่อสารดิจิทัล')}
              className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                watchedVideos['l1_v1']
                  ? 'bg-red-950/80 text-red-200 border-red-500/50'
                  : 'bg-zinc-800 hover:bg-red-600/20 text-zinc-300 hover:text-white border-zinc-700'
              }`}
            >
              {watchedVideos['l1_v1'] ? <CheckCircle2 className="w-4 h-4 text-red-400" /> : <PlayCircle className="w-4 h-4 text-red-400" />}
              {watchedVideos['l1_v1'] ? 'รับชมแล้ว' : 'ทำความเข้าใจแล้ว (3 นาที)'}
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-zinc-950/70 rounded-2xl p-4 border border-zinc-800 flex flex-col justify-between hover:border-zinc-700 transition">
            <div>
              <div className="flex justify-between text-xs text-red-400 font-semibold mb-2">
                <span>ตอนที่ 1.2</span>
                <span>⏱️ 2 นาที</span>
              </div>
              <h4 className="font-bold text-white text-sm sm:text-base mb-1.5">สร้างเครือข่ายความร่วมมือผ่าน LINE & Social Media</h4>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                การตั้งกลุ่ม LINE Official และมารยาทการสื่อสารที่เป็นมิตรแต่เป็นมืออาชีพ
              </p>
            </div>
            <button
              onClick={() => handleSimulateWatch('l1_v2', 'สร้างเครือข่ายผ่าน LINE')}
              className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                watchedVideos['l1_v2']
                  ? 'bg-red-950/80 text-red-200 border-red-500/50'
                  : 'bg-zinc-800 hover:bg-red-600/20 text-zinc-300 hover:text-white border-zinc-700'
              }`}
            >
              {watchedVideos['l1_v2'] ? <CheckCircle2 className="w-4 h-4 text-red-400" /> : <PlayCircle className="w-4 h-4 text-red-400" />}
              {watchedVideos['l1_v2'] ? 'รับชมแล้ว' : 'ทำความเข้าใจแล้ว (2 นาที)'}
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-zinc-950/70 rounded-2xl p-4 border border-zinc-800 flex flex-col justify-between hover:border-zinc-700 transition">
            <div>
              <div className="flex justify-between text-xs text-red-400 font-semibold mb-2">
                <span>ตอนที่ 1.3</span>
                <span>⏱️ 3 นาที</span>
              </div>
              <h4 className="font-bold text-white text-sm sm:text-base mb-1.5">ยกระดับภาพลักษณ์ด้วย Storytelling & PDPA</h4>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                การสื่อสารผลงานผ่านสื่อดิจิทัลอย่างมืออาชีพ ควบคู่กับการปฏิบัติตาม PDPA และเคารพลิขสิทธิ์สื่อ
              </p>
            </div>
            <button
              onClick={() => handleSimulateWatch('l1_v3', 'ยกระดับภาพลักษณ์ด้วย Storytelling และ PDPA')}
              className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                watchedVideos['l1_v3']
                  ? 'bg-red-950/80 text-red-200 border-red-500/50'
                  : 'bg-zinc-800 hover:bg-red-600/20 text-zinc-300 hover:text-white border-zinc-700'
              }`}
            >
              {watchedVideos['l1_v3'] ? <CheckCircle2 className="w-4 h-4 text-red-400" /> : <PlayCircle className="w-4 h-4 text-red-400" />}
              {watchedVideos['l1_v3'] ? 'รับชมแล้ว' : 'ทำความเข้าใจแล้ว (3 นาที)'}
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Drag & Drop / Tap-to-Move Simulation */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/90 border border-red-500/30 space-y-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-red-950 text-red-300 border border-red-500/40">
              กิจกรรมจำลองเชิงโต้ตอบ (Interactive Simulation)
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 flex items-center gap-2">
              <span>🎯</span> จัดหมวดหมู่ช่องทางการสื่อสารดิจิทัลของสถานศึกษา
            </h3>
          </div>
          <button
            onClick={handleReset}
            className="text-xs text-zinc-400 hover:text-white underline flex items-center gap-1 cursor-pointer transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> คืนค่าตำแหน่งเดิม
          </button>
        </div>

        <p className="text-zinc-300 text-sm leading-relaxed">
          <strong className="text-red-400">คำสั่ง:</strong> ให้ท่านจัดสรรช่องทางดิจิทัลลงในหมวดหมู่การใช้งานที่เหมาะสมที่สุดสำหรับโรงเรียนขนาดเล็ก
          <span className="text-zinc-400 text-xs block sm:inline mt-1 sm:mt-0 sm:ml-2">
            (แตะเลือกการ์ด แล้วแตะเลือกกล่องเป้าหมายที่ต้องการวาง)
          </span>
        </p>

        {/* Source Items Pool */}
        <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            📦 รายการช่องทางสื่อสาร (แตะเลือกการ์ด แล้วแตะเลือกกล่องเป้าหมาย):
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 min-h-[70px]">
            {INITIAL_ITEMS.filter(it => placements[it.id] === 'pool').map(item => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`p-3 rounded-xl border text-sm flex items-center gap-2.5 transition cursor-pointer select-none ${
                  selectedItemId === item.id
                    ? 'bg-red-950/70 border-red-500 text-white shadow-md shadow-red-600/30 scale-[1.02]'
                    : 'bg-zinc-800/90 border-zinc-700 hover:border-red-400 text-zinc-200'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium text-xs sm:text-sm">{item.name}</span>
              </div>
            ))}
            {INITIAL_ITEMS.filter(it => placements[it.id] === 'pool').length === 0 && (
              <div className="col-span-full py-4 text-center text-xs text-zinc-500 italic">
                นำการ์ดไปใส่ในหมวดหมู่เป้าหมายครบทุกช่องทางแล้ว
              </div>
            )}
          </div>
        </div>

        {/* 3 Target Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Box 1: Emergency */}
          <div
            onClick={() => handleZoneClick('cat-emergency')}
            className={`p-4 rounded-2xl bg-zinc-950/70 border-2 border-dashed transition flex flex-col justify-between min-h-[190px] cursor-pointer ${
              selectedItemId ? 'hover:border-red-400 hover:bg-red-950/20' : ''
            } border-red-500/40`}
          >
            <div>
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm mb-1">
                <Smartphone className="w-4 h-4" /> หมวดที่ 1: ข่าวสารด่วน & ฉุกเฉิน
              </div>
              <p className="text-xs text-zinc-400 mb-3">ต้องการความรวดเร็ว ตรวจสอบได้ทันที</p>
              <div className="space-y-2">
                {INITIAL_ITEMS.filter(it => placements[it.id] === 'cat-emergency').map(item => (
                  <div
                    key={item.id}
                    onClick={(e) => { e.stopPropagation(); handleItemClick(item.id); }}
                    className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 transition select-none ${
                      selectedItemId === item.id
                        ? 'bg-red-950 border-red-500 text-white'
                        : 'bg-zinc-800/90 border-zinc-700 hover:border-red-400 text-zinc-200'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-[11px] text-zinc-500 pt-2 text-center">แตะที่นี่เพื่อวาง</div>
          </div>

          {/* Box 2: Internal Staff */}
          <div
            onClick={() => handleZoneClick('cat-internal')}
            className={`p-4 rounded-2xl bg-zinc-950/70 border-2 border-dashed transition flex flex-col justify-between min-h-[190px] cursor-pointer ${
              selectedItemId ? 'hover:border-zinc-400 hover:bg-zinc-800/40' : ''
            } border-zinc-600/50`}
          >
            <div>
              <div className="flex items-center gap-2 text-zinc-200 font-bold text-sm mb-1">
                <FolderSync className="w-4 h-4 text-zinc-400" /> หมวดที่ 2: งานบริหารภายในครู
              </div>
              <p className="text-xs text-zinc-400 mb-3">ประสานงานเอกสาร แผนการสอน และธุรการ</p>
              <div className="space-y-2">
                {INITIAL_ITEMS.filter(it => placements[it.id] === 'cat-internal').map(item => (
                  <div
                    key={item.id}
                    onClick={(e) => { e.stopPropagation(); handleItemClick(item.id); }}
                    className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 transition select-none ${
                      selectedItemId === item.id
                        ? 'bg-red-950 border-red-500 text-white'
                        : 'bg-zinc-800/90 border-zinc-700 hover:border-zinc-400 text-zinc-200'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-[11px] text-zinc-500 pt-2 text-center">แตะที่นี่เพื่อวาง</div>
          </div>

          {/* Box 3: Community PR */}
          <div
            onClick={() => handleZoneClick('cat-community')}
            className={`p-4 rounded-2xl bg-zinc-950/70 border-2 border-dashed transition flex flex-col justify-between min-h-[190px] cursor-pointer ${
              selectedItemId ? 'hover:border-rose-400 hover:bg-rose-950/20' : ''
            } border-rose-500/40`}
          >
            <div>
              <div className="flex items-center gap-2 text-rose-300 font-bold text-sm mb-1">
                <Share2 className="w-4 h-4" /> หมวดที่ 3: ประชาสัมพันธ์ชุมชน
              </div>
              <p className="text-xs text-zinc-400 mb-3">เผยแพร่ภาพลักษณ์ สื่อสารผู้ปกครองและชุมชน</p>
              <div className="space-y-2">
                {INITIAL_ITEMS.filter(it => placements[it.id] === 'cat-community').map(item => (
                  <div
                    key={item.id}
                    onClick={(e) => { e.stopPropagation(); handleItemClick(item.id); }}
                    className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 transition select-none ${
                      selectedItemId === item.id
                        ? 'bg-red-950 border-red-500 text-white'
                        : 'bg-zinc-800/90 border-zinc-700 hover:border-rose-400 text-zinc-200'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-[11px] text-zinc-500 pt-2 text-center">แตะที่นี่เพื่อวาง</div>
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
              <ul className="list-disc pl-5 space-y-1 text-xs opacity-90 mt-2">
                {feedback.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleCheckAnswer}
            className="flex-1 py-4 px-6 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 shadow-lg shadow-red-600/30 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer border border-red-500/40"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>ตรวจคำตอบการจัดหมวดหมู่สื่อสาร และปลดล็อกด่านที่ 2</span>
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

      {/* Curriculum Modal for Module 1 */}
      <CurriculumModal
        isOpen={showCurriculumModal}
        onClose={() => setShowCurriculumModal(false)}
        initialModule={1}
      />
    </div>
  );
};
