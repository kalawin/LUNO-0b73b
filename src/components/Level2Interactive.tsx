import React, { useState } from 'react';
import type { UserProfile, UnitSubmission } from '../types';
import { ApiService } from '../services/api';
import { UNITS_DATA } from '../data/modulesData';
import { ActivityFlowContainer } from './ActivityFlowContainer';
import { CurriculumModal } from './CurriculumModal';
import { 
  CheckCircle2, 
  BookOpen, 
  ArrowRight, 
  GraduationCap, 
  Layers, 
  BarChart3,
  Sparkles
} from 'lucide-react';

interface Props {
  onPassLevel: () => void;
  onBackToDashboard?: () => void;
}

export const Level2Interactive: React.FC<Props> = ({ onPassLevel, onBackToDashboard }) => {
  const [profile] = useState<UserProfile | null>(() => ApiService.getLocalProfile());
  const [activeUnitId, setActiveUnitId] = useState<'2.1' | '2.2' | '2.3'>('2.1');
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);

  const [submissions, setSubmissions] = useState<Record<string, UnitSubmission>>(() => {
    const prog = ApiService.getLocalProgress();
    return prog.unitSubmissions || {};
  });

  // State 2.1: แผนโค้ชครู 3 ครั้ง
  const [form2_1, setForm2_1] = useState(() => {
    const saved = submissions['2.1']?.formData || {};
    return {
      teacherTarget: saved['ครูเป้าหมายและปัญหา'] || 'ครูสมศรี (ครูประจำชั้น ป.2-3 สอนวิชาภาษาไทย ปัญหา: ไม่มีเวลาเตรียมสื่อบัตรคำ นักเรียนอ่านไม่คล่อง)',
      toolSelected: saved['เครื่องมือดิจิทัลที่เลือก'] || 'Canva for Education (สร้างใบงานและเกมจับคู่คำศัพท์ใน 10 นาที)',
      coachSession1: saved['โค้ชครั้งที่1_ชวนคุยสาธิต'] || 'สาธิตการค้นหาเทมเพลตภาษาไทยใน Canva และคัดลอกมาปรับใช้ง่ายๆ โดยไม่ต้องเริ่มจากศูนย์ (15 นาที)',
      coachSession2: saved['โค้ชครั้งที่2_ร่วมออกแบบ'] || 'นั่งข้างๆ ช่วยครูลองทำเกมคำศัพท์ ป.2 ร่วมกัน 1 กิจกรรม และทดลองเปิดบนจอทีวี (20 นาที)',
      coachSession3: saved['โค้ชครั้งที่3_สังเกตชื่นชม'] || 'เข้าชมห้องเรียน ให้กำลังใจ สังเกตความสนุกของเด็กๆ และกล่าวชื่นชมครูในที่ประชุมประจำสัปดาห์ (15 นาที)',
      adminSupport: saved['การหนุนเสริมของผู้บริหาร'] || 'จัดหาเครื่องคอมพิวเตอร์ที่เสถียร, อนุญาตให้ใช้เวลาช่วงพัก, และให้เกียรติบัตรครูต้นแบบสื่อดิจิทัล'
    };
  });

  // State 2.2: สภาพแวดล้อมดิจิทัล & Quick Wins
  const [form2_2, setForm2_2] = useState(() => {
    const saved = submissions['2.2']?.formData || {};
    return {
      hwScore: saved['คะแนนอุปกรณ์ฮาร์ดแวร์'] || 'พอใช้ (มีทีวีในห้องเรียน คอมพิวเตอร์ห้องสมุด 8 เครื่อง)',
      netScore: saved['คะแนนระบบเครือข่าย'] || 'ต้องปรับปรุง (Wi-Fi หลุดบ่อยในอาคารเรียน 2)',
      spaceScore: saved['คะแนนแหล่งเรียนรู้'] || 'ดี (มีห้องสมุดดิจิทัลและเปิดสื่อ DLTV สม่ำเสมอ)',
      quickWin1: saved['QuickWin_1'] || 'ติดตั้งตัวขยายสัญญาณ Wi-Fi Mesh ประจำอาคาร 2 ใช้งบผ้าป่าการศึกษา 1,500 บาท',
      quickWin2: saved['QuickWin_2'] || 'จัดตารางสลับเวลาเข้าใช้ห้องคอมพิวเตอร์เพื่อลดความแออัด',
      quickWin3: saved['QuickWin_3'] || 'ขอรับบริจาคจอภาพคอมพิวเตอร์มือสองจากศิษย์เก่า'
    };
  });

  // State 2.3: วัดและประเมินผล
  const [form2_3, setForm2_3] = useState(() => {
    const saved = submissions['2.3']?.formData || {};
    return {
      surveyTopic: saved['หัวข้อแบบสำรวจดิจิทัล'] || 'แบบสำรวจความพึงพอใจการจัดอาหารกลางวันและกิจกรรมพัฒนาผู้เรียน',
      targetRespondents: saved['กลุ่มผู้ตอบ'] || 'นักเรียนชั้น ป.4-6 และผู้ปกครอง (ตอบผ่านมือถือ)',
      questionsDraft: saved['รายการข้อคำถาม'] || '1) ปริมาณอาหารเพียงพอหรือไม่ (คะแนน 1-5)\n2) ความสะอาดและรสชาติ (คะแนน 1-5)\n3) เมนูที่อยากให้ปรับปรุง (เลือกตอบ)\n4) ข้อเสนอแนะเพิ่มเติม (สั้นๆ)',
      dataDecision: saved['การตัดสินใจเชิงบริหารจากข้อมูล'] || 'หากผลชี้ว่ารสชาติเค็มเกินไป ผู้บริหารจะประชุมแม่ครัวปรับลดปริมาณเกลือและซอสปรุงรสทันทีในสัปดาห์ถัดไป'
    };
  });

  const isCompleted2_1 = !!submissions['2.1'];
  const isCompleted2_2 = !!submissions['2.2'];
  const isCompleted2_3 = !!submissions['2.3'];
  const allCompleted = isCompleted2_1 && isCompleted2_2 && isCompleted2_3;

  const handleUnitSubmit = (sub: UnitSubmission) => {
    const updatedProg = ApiService.saveUnitSubmission(sub);
    setSubmissions(updatedProg.unitSubmissions || {});

    const completedUnits = updatedProg.completedUnits || [];
    if (completedUnits.includes('2.1') && completedUnits.includes('2.2') && completedUnits.includes('2.3')) {
      ApiService.completeStep('level-2', 'level-3');
    }
  };

  const handleNextUnitFrom = (current: '2.1' | '2.2' | '2.3') => {
    if (current === '2.1') setActiveUnitId('2.2');
    else if (current === '2.2') setActiveUnitId('2.3');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Banner Navigation */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-800 border border-indigo-200">
                MODULE 2
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                การสร้างวิถีการเรียนรู้เชิงดิจิทัล (Digital Learning Culture)
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              โค้ชชิ่งครูด้วยเทคโนโลยี จัดสภาพแวดล้อมที่เอื้อต่อการเรียนรู้ และนำข้อมูลดิจิทัลมาใช้ในการตัดสินใจ
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCurriculumModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition cursor-pointer self-start sm:self-auto"
          >
            <BookOpen className="w-4 h-4 text-indigo-600" /> โครงสร้างหลักสูตร
          </button>
        </div>

        {/* Sub-unit Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
          <button
            type="button"
            onClick={() => setActiveUnitId('2.1')}
            className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
              activeUnitId === '2.1'
                ? 'bg-[#f4f3ff] border-indigo-400 ring-2 ring-indigo-400/20 text-slate-900 shadow-xs'
                : 'bg-slate-50 border-slate-200/80 hover:border-slate-300 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-indigo-800">หน่วย 2.1 (60 น.)</span>
              {isCompleted2_1 ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ผ่านแล้ว ({submissions['2.1']?.totalScore}/10)
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">รอส่งงาน</span>
              )}
            </div>
            <div className="text-sm font-extrabold text-slate-900">การจัดการเรียนการสอนฯ (โค้ชครู)</div>
          </button>

          <button
            type="button"
            onClick={() => setActiveUnitId('2.2')}
            className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
              activeUnitId === '2.2'
                ? 'bg-[#f4f3ff] border-indigo-400 ring-2 ring-indigo-400/20 text-slate-900 shadow-xs'
                : 'bg-slate-50 border-slate-200/80 hover:border-slate-300 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-indigo-800">หน่วย 2.2 (45 น.)</span>
              {isCompleted2_2 ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ผ่านแล้ว ({submissions['2.2']?.totalScore}/10)
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">รอส่งงาน</span>
              )}
            </div>
            <div className="text-sm font-extrabold text-slate-900">การจัดสภาพแวดล้อมฯ (Quick Wins)</div>
          </button>

          <button
            type="button"
            onClick={() => setActiveUnitId('2.3')}
            className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
              activeUnitId === '2.3'
                ? 'bg-[#f4f3ff] border-indigo-400 ring-2 ring-indigo-400/20 text-slate-900 shadow-xs'
                : 'bg-slate-50 border-slate-200/80 hover:border-slate-300 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-indigo-800">หน่วย 2.3 (60 น.)</span>
              {isCompleted2_3 ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ผ่านแล้ว ({submissions['2.3']?.totalScore}/10)
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">รอส่งงาน</span>
              )}
            </div>
            <div className="text-sm font-extrabold text-slate-900">การวัดและประเมินผลดิจิทัล</div>
          </button>
        </div>
      </div>

      {/* Module 2 Celebration */}
      {allCompleted && (
        <div className="bg-[#eef8f5] border border-[#d2f0e6] rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-teal-600 shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-lg">ยอดเยี่ยม! ท่านผ่าน Module 2 ครบทั้ง 3 หน่วยแล้ว</div>
              <p className="text-xs text-teal-800 font-semibold mt-0.5">
                คะแนนรวม: {(submissions['2.1']?.totalScore || 0) + (submissions['2.2']?.totalScore || 0) + (submissions['2.3']?.totalScore || 0)} / 30 คะแนน · ปลดล็อก Module 3 แล้ว
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onPassLevel}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition cursor-pointer shrink-0"
          >
            เข้าสู่ Module 3 <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* UNIT 2.1 */}
      {activeUnitId === '2.1' && (
        <ActivityFlowContainer
          unit={UNITS_DATA['2.1']}
          profile={profile}
          existingSubmission={submissions['2.1']}
          formData={{
            'ครูเป้าหมายและปัญหา': form2_1.teacherTarget,
            'เครื่องมือดิจิทัลที่เลือก': form2_1.toolSelected,
            'โค้ชครั้งที่1_ชวนคุยสาธิต': form2_1.coachSession1,
            'โค้ชครั้งที่2_ร่วมออกแบบ': form2_1.coachSession2,
            'โค้ชครั้งที่3_สังเกตชื่นชม': form2_1.coachSession3,
            'การหนุนเสริมของผู้บริหาร': form2_1.adminSupport
          }}
          isStep4Valid={!!form2_1.teacherTarget.trim() && !!form2_1.coachSession1.trim()}
          onSubmitUnit={handleUnitSubmit}
          onNextUnit={() => handleNextUnitFrom('2.1')}
          onBackToDashboard={onBackToDashboard}
          childrenStep4={
            <div className="space-y-4">
              <div className="bg-slate-50/80 border border-slate-200/90 rounded-3xl p-6 space-y-4">
                <div className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-600" /> แผนการโค้ชชิ่งครู 3 ครั้ง (Coaching Cycle)
                </div>

                {/* Smart Suggestion Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> ตัวอย่างเครื่องมือแนะนำ:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setForm2_1(prev => ({
                        ...prev,
                        toolSelected: 'Canva for Education (สร้างใบงาน ภาพประกอบ และเกมจับคู่คำศัพท์ใน 10 นาที)'
                      }));
                    }}
                    className="text-[11px] font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100 transition cursor-pointer"
                  >
                    + Canva for Education
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setForm2_1(prev => ({
                        ...prev,
                        toolSelected: 'DLTV & YouTube for Kids (เปิดคลิปบทเรียนมาตรฐานเสริมชั้นเรียนควบชั้น)'
                      }));
                    }}
                    className="text-[11px] font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition cursor-pointer"
                  >
                    + DLTV ทางไกล
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setForm2_1(prev => ({
                        ...prev,
                        toolSelected: 'Quizizz / Google Forms (เกมแบบทดสอบตอบคำถามเก็บคะแนนทันที)'
                      }));
                    }}
                    className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition cursor-pointer"
                  >
                    + Quizizz Interactive
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ครูเป้าหมาย และสภาพปัญหาการสอน:</label>
                    <input
                      type="text"
                      value={form2_1.teacherTarget}
                      onChange={(e) => setForm2_1({ ...form2_1, teacherTarget: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">เครื่องมือดิจิทัลที่เลือกและเหตุผล:</label>
                    <input
                      type="text"
                      value={form2_1.toolSelected}
                      onChange={(e) => setForm2_1({ ...form2_1, toolSelected: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-indigo-700 mb-1">ครั้งที่ 1 (ชวนคุยและสาธิตจุดเด่น - 15 น.):</label>
                    <input
                      type="text"
                      value={form2_1.coachSession1}
                      onChange={(e) => setForm2_1({ ...form2_1, coachSession1: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-indigo-700 mb-1">ครั้งที่ 2 (นั่งข้างๆ ร่วมออกแบบ 1 คาบ - 20 น.):</label>
                    <input
                      type="text"
                      value={form2_1.coachSession2}
                      onChange={(e) => setForm2_1({ ...form2_1, coachSession2: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-indigo-700 mb-1">ครั้งที่ 3 (สังเกตชั้นเรียนและกล่าวชื่นชม - 15 น.):</label>
                    <input
                      type="text"
                      value={form2_1.coachSession3}
                      onChange={(e) => setForm2_1({ ...form2_1, coachSession3: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">บทบาทการหนุนเสริมของผู้บริหาร (เวลา อุปกรณ์ กำลังใจ):</label>
                  <input
                    type="text"
                    value={form2_1.adminSupport}
                    onChange={(e) => setForm2_1({ ...form2_1, adminSupport: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-900"
                  />
                </div>
              </div>
            </div>
          }
        />
      )}

      {/* UNIT 2.2 */}
      {activeUnitId === '2.2' && (
        <ActivityFlowContainer
          unit={UNITS_DATA['2.2']}
          profile={profile}
          existingSubmission={submissions['2.2']}
          formData={{
            'คะแนนอุปกรณ์ฮาร์ดแวร์': form2_2.hwScore,
            'คะแนนระบบเครือข่าย': form2_2.netScore,
            'คะแนนแหล่งเรียนรู้': form2_2.spaceScore,
            'QuickWin_1': form2_2.quickWin1,
            'QuickWin_2': form2_2.quickWin2,
            'QuickWin_3': form2_2.quickWin3
          }}
          isStep4Valid={!!form2_2.quickWin1.trim()}
          onSubmitUnit={handleUnitSubmit}
          onNextUnit={() => handleNextUnitFrom('2.2')}
          onBackToDashboard={onBackToDashboard}
          childrenStep4={
            <div className="space-y-4">
              <div className="bg-slate-50/80 border border-slate-200/90 rounded-3xl p-6 space-y-4">
                <div className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600" /> ประเมินความพร้อมและวางแผน Quick Wins 3 ลำดับแรก
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">1. อุปกรณ์ & ฮาร์ดแวร์:</label>
                    <input
                      type="text"
                      value={form2_2.hwScore}
                      onChange={(e) => setForm2_2({ ...form2_2, hwScore: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">2. อินเทอร์เน็ต & Wi-Fi:</label>
                    <input
                      type="text"
                      value={form2_2.netScore}
                      onChange={(e) => setForm2_2({ ...form2_2, netScore: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">3. แหล่งเรียนรู้ & DLTV:</label>
                    <input
                      type="text"
                      value={form2_2.spaceScore}
                      onChange={(e) => setForm2_2({ ...form2_2, spaceScore: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-indigo-800 uppercase tracking-wider">
                    แผนพัฒนาเร่งด่วน 3 ลำดับแรก (Quick Action Plan - ใช้งบน้อย เห็นผลเร็ว):
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">อันดับที่ 1 (ด่วนที่สุด):</label>
                    <input
                      type="text"
                      value={form2_2.quickWin1}
                      onChange={(e) => setForm2_2({ ...form2_2, quickWin1: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">อันดับที่ 2:</label>
                    <input
                      type="text"
                      value={form2_2.quickWin2}
                      onChange={(e) => setForm2_2({ ...form2_2, quickWin2: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">อันดับที่ 3:</label>
                    <input
                      type="text"
                      value={form2_2.quickWin3}
                      onChange={(e) => setForm2_2({ ...form2_2, quickWin3: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          }
        />
      )}

      {/* UNIT 2.3 */}
      {activeUnitId === '2.3' && (
        <ActivityFlowContainer
          unit={UNITS_DATA['2.3']}
          profile={profile}
          existingSubmission={submissions['2.3']}
          formData={{
            'หัวข้อแบบสำรวจดิจิทัล': form2_3.surveyTopic,
            'กลุ่มผู้ตอบ': form2_3.targetRespondents,
            'รายการข้อคำถาม': form2_3.questionsDraft,
            'การตัดสินใจเชิงบริหารจากข้อมูล': form2_3.dataDecision
          }}
          isStep4Valid={!!form2_3.surveyTopic.trim() && !!form2_3.dataDecision.trim()}
          onSubmitUnit={handleUnitSubmit}
          onBackToDashboard={onBackToDashboard}
          childrenStep4={
            <div className="space-y-4">
              <div className="bg-slate-50/80 border border-slate-200/90 rounded-3xl p-6 space-y-4">
                <div className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" /> การออกแบบแบบสอบถามดิจิทัลและการตัดสินใจบนฐานข้อมูล
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">หัวข้อแบบสำรวจออนไลน์:</label>
                    <input
                      type="text"
                      value={form2_3.surveyTopic}
                      onChange={(e) => setForm2_3({ ...form2_3, surveyTopic: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">กลุ่มผู้ตอบเป้าหมาย:</label>
                    <input
                      type="text"
                      value={form2_3.targetRespondents}
                      onChange={(e) => setForm2_3({ ...form2_3, targetRespondents: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ร่างรายการข้อคำถาม (สั้น กระชับ ไม่เกิน 5–8 ข้อ):</label>
                  <textarea
                    rows={4}
                    value={form2_3.questionsDraft}
                    onChange={(e) => setForm2_3({ ...form2_3, questionsDraft: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-indigo-700 mb-1">
                    การตัดสินใจเชิงบริหารจากแนวโน้มข้อมูลสมมติ 1 เรื่อง (Data-Driven Decision):
                  </label>
                  <textarea
                    rows={2}
                    value={form2_3.dataDecision}
                    onChange={(e) => setForm2_3({ ...form2_3, dataDecision: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>
            </div>
          }
        />
      )}

      <CurriculumModal
        isOpen={showCurriculumModal}
        onClose={() => setShowCurriculumModal(false)}
      />
    </div>
  );
};
