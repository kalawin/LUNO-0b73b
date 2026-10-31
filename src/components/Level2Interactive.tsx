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
  Sparkles,
  Lock
} from 'lucide-react';

interface Props {
  onPassLevel: () => void;
  onBackToDashboard?: () => void;
}

export const Level2Interactive: React.FC<Props> = ({ onPassLevel, onBackToDashboard }) => {
  const [profile] = useState<UserProfile | null>(() => ApiService.getLocalProfile());
  const [activeUnitId, setActiveUnitId] = useState<'2.1' | '2.2' | '2.3'>('2.1');
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [showSample2_1, setShowSample2_1] = useState(false);
  const [showSample2_2, setShowSample2_2] = useState(false);
  const [showSample2_3, setShowSample2_3] = useState(false);

  const [submissions, setSubmissions] = useState<Record<string, UnitSubmission>>(() => {
    const prog = ApiService.getLocalProgress();
    return prog.unitSubmissions || {};
  });

  // State 2.1: แผนโค้ชครู 3 ครั้ง - เริ่มต้นด้วยค่าว่าง
  const [form2_1, setForm2_1] = useState(() => {
    const saved = submissions['2.1']?.formData || {};
    return {
      teacherTarget: saved['ครูเป้าหมายและปัญหา'] || '',
      toolSelected: saved['เครื่องมือดิจิทัลที่เลือก'] || '',
      coachSession1: saved['โค้ชครั้งที่1_ชวนคุยสาธิต'] || '',
      coachSession2: saved['โค้ชครั้งที่2_ร่วมออกแบบ'] || '',
      coachSession3: saved['โค้ชครั้งที่3_สังเกตชื่นชม'] || '',
      adminSupport: saved['การหนุนเสริมของผู้บริหาร'] || ''
    };
  });

  // State 2.2: สภาพแวดล้อมดิจิทัล & Quick Wins - เริ่มต้นด้วยค่าว่างเพื่อให้กรอกตามสภาพจริงของโรงเรียน
  const [form2_2, setForm2_2] = useState(() => {
    const saved = submissions['2.2']?.formData || {};
    return {
      hwScore: saved['คะแนนอุปกรณ์ฮาร์ดแวร์'] || '',
      netScore: saved['คะแนนระบบเครือข่าย'] || '',
      spaceScore: saved['คะแนนแหล่งเรียนรู้'] || '',
      quickWin1: saved['QuickWin_1'] || '',
      quickWin2: saved['QuickWin_2'] || '',
      quickWin3: saved['QuickWin_3'] || ''
    };
  });

  // State 2.3: วัดและประเมินผล
  const [form2_3, setForm2_3] = useState(() => {
    const saved = submissions['2.3']?.formData || {};
    return {
      surveyTopic: saved['หัวข้อแบบสำรวจดิจิทัล'] || '',
      targetRespondents: saved['กลุ่มผู้ตอบ'] || '',
      questionsDraft: saved['รายการข้อคำถาม'] || '',
      dataDecision: saved['การตัดสินใจเชิงบริหารจากข้อมูล'] || ''
    };
  });

  const isCompleted2_1 = !!submissions['2.1'] && (submissions['2.1']?.totalScore ?? 0) >= 7;
  const isCompleted2_2 = !!submissions['2.2'] && (submissions['2.2']?.totalScore ?? 0) >= 7;
  const isCompleted2_3 = !!submissions['2.3'] && (submissions['2.3']?.totalScore ?? 0) >= 7;
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
                <span className="text-[11px] text-slate-400">พร้อมทำ</span>
              )}
            </div>
            <div className="text-sm font-extrabold text-slate-900">การจัดการเรียนการสอนฯ (โค้ชครู)</div>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!isCompleted2_1) {
                alert('🔒 กรุณาทำแบบฝึกหัดหน่วย 2.1 ให้ผ่านเกณฑ์ (อย่างน้อย 7/10 คะแนน) ก่อนเข้าสู่หน่วย 2.2 ครับ');
                return;
              }
              setActiveUnitId('2.2');
            }}
            className={`p-4 rounded-2xl border text-left transition ${
              !isCompleted2_1
                ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed text-slate-400'
                : activeUnitId === '2.2'
                ? 'bg-[#f4f3ff] border-indigo-400 ring-2 ring-indigo-400/20 text-slate-900 shadow-xs cursor-pointer'
                : 'bg-slate-50 border-slate-200/80 hover:border-slate-300 text-slate-600 cursor-pointer'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-indigo-800">หน่วย 2.2 (45 น.)</span>
              {isCompleted2_2 ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ผ่านแล้ว ({submissions['2.2']?.totalScore}/10)
                </span>
              ) : !isCompleted2_1 ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                  <Lock className="w-3 h-3" /> ล็อกอยู่
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">พร้อมทำ</span>
              )}
            </div>
            <div className="text-sm font-extrabold text-slate-900">การจัดสภาพแวดล้อมฯ (Quick Wins)</div>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!isCompleted2_2) {
                alert('🔒 กรุณาทำแบบฝึกหัดหน่วย 2.2 ให้ผ่านเกณฑ์ (อย่างน้อย 7/10 คะแนน) ก่อนเข้าสู่หน่วย 2.3 ครับ');
                return;
              }
              setActiveUnitId('2.3');
            }}
            className={`p-4 rounded-2xl border text-left transition ${
              !isCompleted2_2
                ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed text-slate-400'
                : activeUnitId === '2.3'
                ? 'bg-[#f4f3ff] border-indigo-400 ring-2 ring-indigo-400/20 text-slate-900 shadow-xs cursor-pointer'
                : 'bg-slate-50 border-slate-200/80 hover:border-slate-300 text-slate-600 cursor-pointer'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-indigo-800">หน่วย 2.3 (60 น.)</span>
              {isCompleted2_3 ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ผ่านแล้ว ({submissions['2.3']?.totalScore}/10)
                </span>
              ) : !isCompleted2_2 ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                  <Lock className="w-3 h-3" /> ล็อกอยู่
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">พร้อมทำ</span>
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
          isStep4Valid={
            !!form2_1.teacherTarget.trim() &&
            !!form2_1.toolSelected.trim() &&
            !!form2_1.coachSession1.trim() &&
            !!form2_1.coachSession2.trim() &&
            !!form2_1.coachSession3.trim() &&
            !!form2_1.adminSupport.trim()
          }
          onSubmitUnit={handleUnitSubmit}
          onNextUnit={() => handleNextUnitFrom('2.1')}
          onBackToDashboard={onBackToDashboard}
          childrenStep4={
            <div className="space-y-4">
              <div className="bg-slate-50/80 border border-slate-200/90 rounded-3xl p-6 space-y-4">
                <div className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-600" /> แผนการโค้ชชิ่งครู 3 ครั้ง (Coaching Cycle)
                </div>

                {/* Collapsible Sample Guidance 2.1 */}
                <div className="border border-indigo-200/90 rounded-2xl overflow-hidden bg-indigo-50/60">
                  <button
                    type="button"
                    onClick={() => setShowSample2_1(!showSample2_1)}
                    className="w-full p-3.5 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-indigo-900 hover:bg-indigo-100/70 transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      💡 ดูแนวทางการเขียนแผนโค้ชครู 3 ครั้ง (คลิกเพื่อศึกษาแนวทาง)
                    </span>
                    <span className="text-xs text-indigo-700 underline font-semibold">
                      {showSample2_1 ? 'ซ่อนแนวทาง' : 'เปิดดูแนวทาง'}
                    </span>
                  </button>
                  {showSample2_1 && (
                    <div className="p-4 bg-white border-t border-indigo-200 text-xs sm:text-sm space-y-1.5 text-slate-700 leading-relaxed">
                      <p><strong>• ครูเป้าหมายและปัญหา:</strong> ครูประจำชั้น ป.2 สอนควบชั้น ป.3 นักเรียนอ่านสะกดคำไม่คล่อง และครูไม่มีเวลาทำบัตรคำกระดาษ</p>
                      <p><strong>• เครื่องมือที่เลือก:</strong> Canva for Education และคลังสื่อ DLTV เพราะมีเทมเพลตบัตรคำและคลิปการสอนพร้อมใช้</p>
                      <p><strong>• ครั้งที่ 1 (ชวนคุย-สาธิต):</strong> พูดคุยรับฟังปัญหาการสอนอ่าน และเปิดตัวอย่างเทมเพลตบัตรคำใน Canva ให้ครูดู</p>
                      <p><strong>• ครั้งที่ 2 (ร่วมออกแบบ):</strong> นั่งข้างๆ ช่วยครูสร้างชุดบัตรคำศัพท์ภาษาไทยและวางแผนใช้สอนในคาบเรียนวันพุธ</p>
                      <p><strong>• ครั้งที่ 3 (สังเกต-ชื่นชม):</strong> ร่วมเข้าสังเกตชั้นเรียนดูการมีส่วนร่วมของเด็ก และกล่าวชื่นชมให้กำลังใจครูในที่ประชุม</p>
                      <p><strong>• การหนุนเสริมของผู้บริหาร:</strong> สนับสนุนอินเทอร์เน็ต สายเชื่อมต่อทีวี และลดภาระงานเอกสารที่ไม่จำเป็น</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">1. ครูเป้าหมาย และสภาพปัญหาการสอนจริง:</label>
                    <input
                      type="text"
                      value={form2_1.teacherTarget}
                      onChange={(e) => setForm2_1({ ...form2_1, teacherTarget: e.target.value })}
                      placeholder="เช่น ครูประจำชั้น ป.2 สอนควบ ป.3 นักเรียนอ่านไม่คล่องและไม่มีเวลาทำสื่อ"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">2. เครื่องมือดิจิทัลที่เลือกและเหตุผล:</label>
                    <input
                      type="text"
                      value={form2_1.toolSelected}
                      onChange={(e) => setForm2_1({ ...form2_1, toolSelected: e.target.value })}
                      placeholder="เช่น Canva for Education / DLTV เพราะมีสื่อสำเร็จรูปช่วยลดเวลาเตรียมสอน"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-indigo-700 mb-1">3.1 การโค้ชครั้งที่ 1 (ชวนคุยรับฟังและสาธิตจุดเด่น - 15 น.):</label>
                    <input
                      type="text"
                      value={form2_1.coachSession1}
                      onChange={(e) => setForm2_1({ ...form2_1, coachSession1: e.target.value })}
                      placeholder="เช่น ชวนครูคุยเรื่องปัญหาการสอนและสาธิตวิธีใช้แม่แบบสื่อสำเร็จรูปให้ดู 15 นาที"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-indigo-700 mb-1">3.2 การโค้ชครั้งที่ 2 (นั่งข้างๆ ร่วมออกแบบแผนการสอน 1 คาบ - 20 น.):</label>
                    <input
                      type="text"
                      value={form2_1.coachSession2}
                      onChange={(e) => setForm2_1({ ...form2_1, coachSession2: e.target.value })}
                      placeholder="เช่น นั่งข้างครูช่วยกันปรับแก้สื่อและออกแบบกิจกรรมการสอนสำหรับใช้จริง 1 คาบ"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-indigo-700 mb-1">3.3 การโค้ชครั้งที่ 3 (สังเกตชั้นเรียนและกล่าวชื่นชมเชิงบวก - 15 น.):</label>
                    <input
                      type="text"
                      value={form2_1.coachSession3}
                      onChange={(e) => setForm2_1({ ...form2_1, coachSession3: e.target.value })}
                      placeholder="เช่น เข้าเยี่ยมชั้นเรียนด้วยความเป็นกัลยาณมิตรและกล่าวชื่นชมความสำเร็จของครูในที่ประชุม"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">4. บทบาทการหนุนเสริมของผู้บริหาร (เวลา อุปกรณ์ กำลังใจ):</label>
                  <input
                    type="text"
                    value={form2_1.adminSupport}
                    onChange={(e) => setForm2_1({ ...form2_1, adminSupport: e.target.value })}
                    placeholder="เช่น จัดเตรียมสายเชื่อมต่อทีวี ดูแลสัญญาณอินเทอร์เน็ต และลดงานเอกสารให้ครูมีเวลาเตรียมสอน"
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900"
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
          isStep4Valid={
            !!form2_2.hwScore.trim() &&
            !!form2_2.netScore.trim() &&
            !!form2_2.spaceScore.trim() &&
            !!form2_2.quickWin1.trim() &&
            !!form2_2.quickWin2.trim() &&
            !!form2_2.quickWin3.trim()
          }
          onSubmitUnit={handleUnitSubmit}
          onNextUnit={() => handleNextUnitFrom('2.2')}
          onBackToDashboard={onBackToDashboard}
          childrenStep4={
            <div className="space-y-4">
              <div className="bg-slate-50/80 border border-slate-200/90 rounded-3xl p-6 space-y-4">
                <div className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600" /> ประเมินความพร้อม 3 ด้าน และวางแผน Quick Wins 3 ลำดับแรก
                </div>

                {/* Collapsible Sample Guidance 2.2 */}
                <div className="border border-indigo-200/90 rounded-2xl overflow-hidden bg-indigo-50/60">
                  <button
                    type="button"
                    onClick={() => setShowSample2_2(!showSample2_2)}
                    className="w-full p-3.5 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-indigo-900 hover:bg-indigo-100/70 transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      💡 ดูแนวทางการประเมินและการเขียนแผน Quick Wins 3 ลำดับ (คลิกเพื่อศึกษาแนวทาง)
                    </span>
                    <span className="text-xs text-indigo-700 underline font-semibold">
                      {showSample2_2 ? 'ซ่อนแนวทาง' : 'เปิดดูแนวทาง'}
                    </span>
                  </button>
                  {showSample2_2 && (
                    <div className="p-4 bg-white border-t border-indigo-200 text-xs sm:text-sm space-y-1.5 text-slate-700 leading-relaxed">
                      <p><strong>• การประเมิน 3 ด้าน:</strong> ระบุสภาพจริง เช่น (1) ฮาร์ดแวร์: มีทีวีครบห้องแต่สาย HDMI ชำรุด 2 ห้อง (2) เครือข่าย: สัญญาณ Wi-Fi ไปไม่ถึงตึกประถมปลาย (3) แหล่งเรียนรู้: มีการเปิดสื่อ DLTV แต่ยังไม่ได้จัดตารางใช้ห้องคอมพ์</p>
                      <p><strong>• Quick Win อันดับ 1:</strong> ย้ายจุดวางเราเตอร์หรือเดินสายแลนเพิ่มจุดกระจายสัญญาณ Wi-Fi อาคารประถมปลายภายในสัปดาห์นี้</p>
                      <p><strong>• Quick Win อันดับ 2:</strong> ซ่อมบำรุงปลั๊กไฟและจัดซื้อสาย HDMI ใหม่ประจำห้องเรียนให้พร้อมใช้งานทันที</p>
                      <p><strong>• Quick Win อันดับ 3:</strong> จัดตารางหมุนเวียนการใช้คอมพิวเตอร์ห้องสมุด และแนะนำครูดาวน์โหลดคลิป DLTV เก็บไว้เปิดแบบออฟไลน์</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">1. สภาพอุปกรณ์ & ฮาร์ดแวร์:</label>
                    <input
                      type="text"
                      value={form2_2.hwScore}
                      onChange={(e) => setForm2_2({ ...form2_2, hwScore: e.target.value })}
                      placeholder="เช่น พอใช้ มีทีวีทุกห้องและคอมพิวเตอร์ 8 เครื่อง แต่สายเชื่อมต่อชำรุดบางจุด"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">2. สภาพอินเทอร์เน็ต & Wi-Fi:</label>
                    <input
                      type="text"
                      value={form2_2.netScore}
                      onChange={(e) => setForm2_2({ ...form2_2, netScore: e.target.value })}
                      placeholder="เช่น ต้องปรับปรุง สัญญาณ Wi-Fi หลุดบ่อยและไปไม่ถึงห้องเรียนชั้น ป.4-6"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">3. สภาพแหล่งเรียนรู้ & DLTV:</label>
                    <input
                      type="text"
                      value={form2_2.spaceScore}
                      onChange={(e) => setForm2_2({ ...form2_2, spaceScore: e.target.value })}
                      placeholder="เช่น ดี มีการเปิดสื่อ DLTV ประจำ แต่ยังขาดตารางหมุนเวียนใช้เครื่องสืบค้น"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-indigo-800 uppercase tracking-wider">
                    แผนพัฒนาเร่งด่วน 3 ลำดับแรก (Quick Action Plan - ใช้งบน้อย เห็นผลเร็ว และไม่ซ้ำกัน):
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">อันดับที่ 1 (ด่วนที่สุด - แก้ปัญหาคอขวดหลัก):</label>
                    <input
                      type="text"
                      value={form2_2.quickWin1}
                      onChange={(e) => setForm2_2({ ...form2_2, quickWin1: e.target.value })}
                      placeholder="เช่น เดินสายแลนและเพิ่มจุดกระจายสัญญาณ Wi-Fi กึ่งกลางอาคารเรียนภายในสัปดาห์นี้"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">อันดับที่ 2 (การจัดการอุปกรณ์/จุดเชื่อมต่อ):</label>
                    <input
                      type="text"
                      value={form2_2.quickWin2}
                      onChange={(e) => setForm2_2({ ...form2_2, quickWin2: e.target.value })}
                      placeholder="เช่น ตรวจเช็คปลั๊กพ่วงและเปลี่ยนสาย HDMI ที่ชำรุดในห้องเรียนให้พร้อมเชื่อมต่อทันที"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">อันดับที่ 3 (การจัดตารางและคลังสื่อออฟไลน์):</label>
                    <input
                      type="text"
                      value={form2_2.quickWin3}
                      onChange={(e) => setForm2_2({ ...form2_2, quickWin3: e.target.value })}
                      placeholder="เช่น จัดตารางหมุนเวียนใช้คอมพิวเตอร์ห้องสมุด และทำคลังโหลดคลิป DLTV ไว้ใช้ตอนเน็ตหลุด"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900"
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
          isStep4Valid={
            !!form2_3.surveyTopic.trim() &&
            !!form2_3.targetRespondents.trim() &&
            !!form2_3.questionsDraft.trim() &&
            !!form2_3.dataDecision.trim()
          }
          onSubmitUnit={handleUnitSubmit}
          onBackToDashboard={onBackToDashboard}
          childrenStep4={
            <div className="space-y-4">
              <div className="bg-slate-50/80 border border-slate-200/90 rounded-3xl p-6 space-y-4">
                <div className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" /> การออกแบบแบบสอบถามดิจิทัลและการตัดสินใจบนฐานข้อมูล
                </div>

                {/* Collapsible Sample Guidance 2.3 */}
                <div className="border border-indigo-200/90 rounded-2xl overflow-hidden bg-indigo-50/60">
                  <button
                    type="button"
                    onClick={() => setShowSample2_3(!showSample2_3)}
                    className="w-full p-3.5 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-indigo-900 hover:bg-indigo-100/70 transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      💡 ดูแนวทางการร่างข้อคำถามดิจิทัลและการตัดสินใจเชิงบริหาร (คลิกเพื่อศึกษาแนวทาง)
                    </span>
                    <span className="text-xs text-indigo-700 underline font-semibold">
                      {showSample2_3 ? 'ซ่อนแนวทาง' : 'เปิดดูแนวทาง'}
                    </span>
                  </button>
                  {showSample2_3 && (
                    <div className="p-4 bg-white border-t border-indigo-200 text-xs sm:text-sm space-y-1.5 text-slate-700 leading-relaxed">
                      <p><strong>• หัวข้อแบบสำรวจ:</strong> แบบสำรวจปัญหาการอ่านออกเขียนได้และความต้องการสื่อเสริมที่บ้าน</p>
                      <p><strong>• กลุ่มผู้ตอบ:</strong> ครูประจำชั้น ป.1-ป.6 และผู้ปกครองนักเรียน</p>
                      <p><strong>• ตัวอย่างรายการข้อคำถาม (อย่างน้อย 3-5 ข้อ):</strong><br/>
                        1. ระดับชั้นของนักเรียน (ตัวเลือก)<br/>
                        2. ความคล่องแคล่วในการอ่านสะกดคำของนักเรียนอยู่ในระดับใด (มาตรวัด 1-5)<br/>
                        3. ความสม่ำเสมอในการทบทวนบทเรียนที่บ้านผ่านสื่อดิจิทัล (มาตรวัด 1-5)<br/>
                        4. ปัญหาหรือข้อเสนอแนะที่ต้องการให้โรงเรียนสนับสนุนเพิ่มเติม (ปลายเปิด)
                      </p>
                      <p><strong>• การตัดสินใจเชิงบริหาร:</strong> หากพบว่านักเรียนชั้น ป.1-2 ร้อยละ 40 ยังอ่านคำควบกล้ำไม่คล่อง ผู้บริหารจะตัดสินใจจัดตารางซ่อมเสริม 15 นาทีหลังเลิกเรียนและส่งชุดบัตรคำดิจิทัลให้ผู้ปกครองผ่านกลุ่มไลน์</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">1. หัวข้อแบบสำรวจออนไลน์:</label>
                    <input
                      type="text"
                      value={form2_3.surveyTopic}
                      onChange={(e) => setForm2_3({ ...form2_3, surveyTopic: e.target.value })}
                      placeholder="เช่น แบบสำรวจภาวะการอ่านคล่องเขียนคล่อง / ความพึงพอใจอาหารกลางวัน"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">2. กลุ่มผู้ตอบเป้าหมาย:</label>
                    <input
                      type="text"
                      value={form2_3.targetRespondents}
                      onChange={(e) => setForm2_3({ ...form2_3, targetRespondents: e.target.value })}
                      placeholder="เช่น นักเรียนชั้น ป.4-6 และผู้ปกครองนักเรียนทุกคน"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    3. ร่างรายการข้อคำถาม (เขียนแยกเป็นข้อ 1, 2, 3... อย่างน้อย 3–5 ข้อ):
                  </label>
                  <textarea
                    rows={4}
                    value={form2_3.questionsDraft}
                    onChange={(e) => setForm2_3({ ...form2_3, questionsDraft: e.target.value })}
                    placeholder={"1. ระดับชั้นของผู้เรียน (ตัวเลือก)\n2. ความพึงพอใจต่อปริมาณและรสชาติอาหารกลางวัน (มาตรวัด 1-5)\n3. ความสะอาดและคุณค่าทางโภชนาการของเมนูผักผลไม้ (มาตรวัด 1-5)\n4. ข้อเสนอแนะเมนูอาหารที่ต้องการให้ปรับปรุงเพิ่มเติม (ปลายเปิด)"}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-indigo-700 mb-1">
                    4. การตัดสินใจเชิงบริหารจากแนวโน้มข้อมูลสมมติ 1 เรื่อง (Data-Informed Decision):
                  </label>
                  <textarea
                    rows={2}
                    value={form2_3.dataDecision}
                    onChange={(e) => setForm2_3({ ...form2_3, dataDecision: e.target.value })}
                    placeholder="เช่น หากผลสำรวจพบว่านักเรียนร้อยละ 60 ไม่ชอบทานผักเพราะชิ้นใหญ่ ผู้บริหารจะตัดสินใจปรับเมนูอาหารร่วมกับแม่ครัวและติดตามผลซ้ำใน 2 สัปดาห์"
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
