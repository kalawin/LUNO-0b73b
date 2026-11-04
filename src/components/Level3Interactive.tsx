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
  Award, 
  FolderSync, 
  Sparkles,
  Users,
  Clock,
  Share2,
  Lock
} from 'lucide-react';

interface Props {
  onPassLevel: () => void;
  onBackToDashboard?: () => void;
}

export const Level3Interactive: React.FC<Props> = ({ onPassLevel, onBackToDashboard }) => {
  const [profile] = useState<UserProfile | null>(() => ApiService.getLocalProfile());
  const [activeUnitId, setActiveUnitId] = useState<'3.1' | '3.2'>('3.1');
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [showGuidance3_1, setShowGuidance3_1] = useState(false);
  const [showGuidance3_2, setShowGuidance3_2] = useState(false);

  const [submissions, setSubmissions] = useState<Record<string, UnitSubmission>>(() => {
    const prog = ApiService.getLocalProgress();
    return prog.unitSubmissions || {};
  });

  // State 3.1: ผู้นำต้นแบบแบบวันเดียว - เริ่มต้นด้วยค่าว่าง
  const [form3_1, setForm3_1] = useState(() => {
    const saved = submissions['3.1']?.formData || {};
    return {
      toolAndGoal: saved['เครื่องมือและเป้าหมาย'] || '',
      journalAction: saved['บันทึกช่อง1_ทำอะไรและได้ผลอย่างไร'] || '',
      journalObstacle: saved['บันทึกช่อง2_ติดขัดตรงไหน'] || '',
      journalEthics: saved['บันทึกช่อง3_จริยธรรมดิจิทัลและวิธีแก้'] || '',
      microTeachingPlan: saved['แผนถ่ายทอดให้ทีม10นาที'] || ''
    };
  });

  // State 3.2: ผังการทำงานทีม 3 เสาหลัก
  const [form3_2, setForm3_2] = useState(() => {
    const saved = submissions['3.2']?.formData || {};
    return {
      teamTask: saved['ชื่องานและบทบาทสมาชิก'] || '',
      commWorkflow: saved['เสาหลัก1_การสื่อสาร'] || '',
      driveWorkflow: saved['เสาหลัก2_การแบ่งปันไฟล์'] || '',
      trackingWorkflow: saved['เสาหลัก3_การติดตามงาน'] || ''
    };
  });

  const isCompleted3_1 = !!submissions['3.1'];
  const isCompleted3_2 = !!submissions['3.2'];
  const allCompleted = isCompleted3_1 && isCompleted3_2;

  const handleUnitSubmit = (sub: UnitSubmission) => {
    const updatedProg = ApiService.saveUnitSubmission(sub);
    setSubmissions(updatedProg.unitSubmissions || {});

    const completedUnits = updatedProg.completedUnits || [];
    if (completedUnits.includes('3.1') && completedUnits.includes('3.2')) {
      ApiService.completeStep('level-3', 'level-4');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Banner Navigation between Sub-units (Soft Modern Style) */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-50 text-rose-800 border border-rose-200">
                MODULE 3
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                การพัฒนาด้านการทำงานเป็นทีมสู่ความเป็นมืออาชีพ (Professional Teamwork)
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              พัฒนาความเป็นผู้นำต้นแบบด้วย Micro-journal บันทึกจริยธรรม และผังการทำงานร่วมกัน 3 เสาหลักบน Cloud
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCurriculumModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition cursor-pointer self-start sm:self-auto"
          >
            <BookOpen className="w-4 h-4 text-rose-600" /> โครงสร้างหลักสูตร
          </button>
        </div>

        {/* Sub-unit Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
          <button
            type="button"
            onClick={() => setActiveUnitId('3.1')}
            className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
              activeUnitId === '3.1'
                ? 'bg-[#fff5f5] border-rose-400 ring-2 ring-rose-400/20 text-slate-900 shadow-xs'
                : 'bg-slate-50 border-slate-200/80 hover:border-slate-300 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-extrabold text-rose-700">หน่วย 3.1 (1 วัน / 11 น.)</span>
              {isCompleted3_1 ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ผ่านแล้ว ({submissions['3.1']?.totalScore}/10)
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">รอส่งงาน</span>
              )}
            </div>
            <div className="text-sm font-bold text-slate-800">ผู้นำต้นแบบด้านดิจิทัลในทีม (แบบวันเดียว)</div>
            <div className="text-xs text-slate-500 mt-1 line-clamp-1">Micro-journal 3 ช่อง จริยธรรมดิจิทัล และแผนสอน 10 นาที</div>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!isCompleted3_1) {
                alert('🔒 กรุณาทำแบบฝึกหัดหน่วย 3.1 ให้ผ่านเกณฑ์ก่อนเข้าสู่หน่วย 3.2 ครับ');
                return;
              }
              setActiveUnitId('3.2');
            }}
            className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
              !isCompleted3_1
                ? 'opacity-60 cursor-not-allowed bg-slate-100 border-slate-200'
                : activeUnitId === '3.2'
                ? 'bg-[#fff5f5] border-rose-400 ring-2 ring-rose-400/20 text-slate-900 shadow-xs'
                : 'bg-slate-50 border-slate-200/80 hover:border-slate-300 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-extrabold text-rose-700">หน่วย 3.2 (60 น.)</span>
              {isCompleted3_2 ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ผ่านแล้ว ({submissions['3.2']?.totalScore}/10)
                </span>
              ) : !isCompleted3_1 ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-full border border-slate-300">
                  <Lock className="w-3 h-3 text-slate-500" /> ล็อกอยู่
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">พร้อมเรียนรู้</span>
              )}
            </div>
            <div className="text-sm font-bold text-slate-800">การทำงานร่วมกันด้วยเทคโนโลยีดิจิทัล (ทีม)</div>
            <div className="text-xs text-slate-500 mt-1 line-clamp-1">ผังขั้นตอนการทำงานร่วมกัน 3 เสาหลัก: สื่อสาร - ไฟล์กลาง - ติดตามงาน</div>
          </button>
        </div>
      </div>

      {/* Module 3 Celebration Banner */}
      {allCompleted && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-300 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 flex-shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-lg">ยอดเยี่ยม! ท่านผ่าน Module 3 ครบทั้ง 2 หน่วยแล้ว</div>
              <p className="text-xs font-medium text-slate-600 mt-0.5">
                คะแนนรวม: {(submissions['3.1']?.totalScore || 0) + (submissions['3.2']?.totalScore || 0)} / 20 คะแนน · ปลดล็อก Module 4 แล้ว
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onPassLevel}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition flex-shrink-0 cursor-pointer"
          >
            เข้าสู่ Module 4 <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* UNIT 3.1 INTERACTIVE FORM */}
      {activeUnitId === '3.1' && (
        <ActivityFlowContainer
          unit={UNITS_DATA['3.1']}
          profile={profile}
          existingSubmission={submissions['3.1']}
          formData={{
            'เครื่องมือและเป้าหมาย': form3_1.toolAndGoal,
            'บันทึกช่อง1_ทำอะไรและได้ผลอย่างไร': form3_1.journalAction,
            'บันทึกช่อง2_ติดขัดตรงไหน': form3_1.journalObstacle,
            'บันทึกช่อง3_จริยธรรมดิจิทัลและวิธีแก้': form3_1.journalEthics,
            'แผนถ่ายทอดให้ทีม10นาที': form3_1.microTeachingPlan
          }}
          isStep4Valid={
            !!form3_1.toolAndGoal.trim() &&
            !!form3_1.journalAction.trim() &&
            !!form3_1.journalObstacle.trim() &&
            !!form3_1.journalEthics.trim() &&
            !!form3_1.microTeachingPlan.trim()
          }
          onSubmitUnit={handleUnitSubmit}
          onNextUnit={() => setActiveUnitId('3.2')}
          onBackToDashboard={onBackToDashboard}
          childrenStep4={
            <div className="space-y-6">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-6 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Award className="w-5 h-5 text-rose-600" /> แบบบันทึก Micro-journal 3 ช่อง (ทดลองกับงานจริง)
                  </div>
                  <span className="text-xs bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1 rounded-full font-bold">
                    หน่วย 3.1
                  </span>
                </div>

                {/* Collapsible Example Guidance */}
                <div className="border border-rose-200/90 rounded-2xl overflow-hidden bg-rose-50/50">
                  <button
                    type="button"
                    onClick={() => setShowGuidance3_1(!showGuidance3_1)}
                    className="w-full p-3.5 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-rose-900 hover:bg-rose-100/60 transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-rose-600" />
                      💡 ดูแนวทางการตอบ Micro-journal 3 ช่อง (คลิกเพื่อดูโครงสร้างการตอบ)
                    </span>
                    <span className="text-xs text-rose-700 underline font-semibold">
                      {showGuidance3_1 ? 'ซ่อนแนวทาง' : 'เปิดดูแนวทาง'}
                    </span>
                  </button>
                  {showGuidance3_1 && (
                    <div className="p-4 bg-white border-t border-rose-200 text-xs space-y-1.5 text-slate-700 leading-relaxed">
                      <p className="font-bold text-rose-900">โครงสร้างและแนวทางการเขียนคำตอบด้วยตนเอง:</p>
                      <p><strong>• เครื่องมือและเป้าหมาย:</strong> ระบุชื่อเครื่องมือดิจิทัล 1 ชนิด และชิ้นงานบริหารหรือการสื่อสารที่ท่านได้ทดลองทำด้วยตนเอง</p>
                      <p><strong>• ช่องที่ 1 (ผลลัพธ์):</strong> อธิบายสิ่งที่ได้ลงมือทำจริง ผลลัพธ์ที่ได้ และประโยชน์ที่เกิดขึ้นต่อการทำงาน</p>
                      <p><strong>• ช่องที่ 2 (อุปสรรค):</strong> ระบุจุดที่ติดขัดหรือไม่คุ้นเคยระหว่างทดลองทำ และวิธีแก้ปัญหาของท่าน</p>
                      <p><strong>• ช่องที่ 3 (จริยธรรม):</strong> ระบุการตรวจสอบด้านลิขสิทธิ์สื่อ (ภาพ/ฟอนต์) การคุ้มครองข้อมูลส่วนบุคคล (PDPA) หรือความถูกต้องของข้อมูล</p>
                      <p><strong>• แผนถ่ายทอด 10 นาที:</strong> ระบุช่วงเวลา กลุ่มเป้าหมายครู และขั้นตอนสั้นๆ ที่จะนำไปสาธิตแบ่งปันทีมงาน</p>
                      <p className="text-[11px] text-rose-600 font-semibold pt-1">
                        *ห้ามคัดลอกข้อความจากแนวทางหรือตัวอย่างต้นแบบมาส่ง ระบบจะตรวจจับและไม่อนุมัติให้ผ่านเกณฑ์
                      </p>
                    </div>
                  )}
                </div>

                {/* Field 1: Tool & Goal */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    1. เครื่องมือดิจิทัลที่เลือก + เป้าหมายการใช้งาน 1 ข้อ:
                  </label>
                  <input
                    type="text"
                    value={form3_1.toolAndGoal}
                    placeholder="ระบุชื่อเครื่องมือดิจิทัลที่ทดลองใช้ และเป้าหมายของชิ้นงาน..."
                    onChange={(e) => setForm3_1({ ...form3_1, toolAndGoal: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200/50"
                  />
                </div>

                {/* 3-Column Micro-journal Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {/* Column 1 */}
                  <div className="bg-[#f0fbf7] p-4 rounded-2xl border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
                        ช่องที่ 1: ทำอะไรและได้ผลอย่างไร
                      </label>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">ผลลัพธ์</span>
                    </div>
                    <p className="text-[11px] text-emerald-700">งานจริงที่ทดลองทำ + สิ่งที่สำเร็จ</p>
                    <textarea
                      rows={3}
                      value={form3_1.journalAction}
                      placeholder="ระบุสิ่งที่ท่านได้ลงมือทดลองทำจริงและผลลัพธ์ที่ได้..."
                      onChange={(e) => setForm3_1({ ...form3_1, journalAction: e.target.value })}
                      className="w-full bg-white border border-emerald-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>

                  {/* Column 2 */}
                  <div className="bg-[#fff9e6] p-4 rounded-2xl border border-amber-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-extrabold text-amber-800 uppercase tracking-wider">
                        ช่องที่ 2: ติดขัดตรงไหน
                      </label>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">อุปสรรค</span>
                    </div>
                    <p className="text-[11px] text-amber-700">จุดที่สะดุดหรือฟังก์ชันที่ยังไม่คล่อง</p>
                    <textarea
                      rows={3}
                      value={form3_1.journalObstacle}
                      placeholder="ระบุจุดที่ติดขัดในการใช้งานและแนวทางแก้ไข..."
                      onChange={(e) => setForm3_1({ ...form3_1, journalObstacle: e.target.value })}
                      className="w-full bg-white border border-amber-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    />
                  </div>

                  {/* Column 3 */}
                  <div className="bg-[#eff6ff] p-4 rounded-2xl border border-blue-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-extrabold text-blue-800 uppercase tracking-wider">
                        ช่องที่ 3: จริยธรรมและวิธีแก้
                      </label>
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">จริยธรรม</span>
                    </div>
                    <p className="text-[11px] text-blue-700">ลิขสิทธิ์ / PDPA / ข้อมูลนักเรียน และวิธีจัดการ</p>
                    <textarea
                      rows={3}
                      value={form3_1.journalEthics}
                      placeholder="ระบุประเด็นลิขสิทธิ์ ความปลอดภัย หรือ PDPA และการป้องกัน..."
                      onChange={(e) => setForm3_1({ ...form3_1, journalEthics: e.target.value })}
                      className="w-full bg-white border border-blue-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>

                {/* Field 3: Micro-teaching Plan */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-rose-600" /> 2. แผนถ่ายทอดให้ทีม 10 นาที (เวลา, กลุ่มเป้าหมาย, สิ่งที่จะสาธิต):
                  </label>
                  <input
                    type="text"
                    value={form3_1.microTeachingPlan}
                    placeholder="ระบุช่วงเวลา กลุ่มครูเป้าหมาย และขั้นตอนสั้นๆ ที่จะสาธิตให้ทีมดูภายใน 10 นาที..."
                    onChange={(e) => setForm3_1({ ...form3_1, microTeachingPlan: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200/50"
                  />
                </div>
              </div>
            </div>
          }
        />
      )}

      {/* UNIT 3.2 INTERACTIVE FORM */}
      {activeUnitId === '3.2' && (
        <ActivityFlowContainer
          unit={UNITS_DATA['3.2']}
          profile={profile}
          existingSubmission={submissions['3.2']}
          formData={{
            'ชื่องานและบทบาทสมาชิก': form3_2.teamTask,
            'เสาหลัก1_การสื่อสาร': form3_2.commWorkflow,
            'เสาหลัก2_การแบ่งปันไฟล์': form3_2.driveWorkflow,
            'เสาหลัก3_การติดตามงาน': form3_2.trackingWorkflow
          }}
          isStep4Valid={
            !!form3_2.teamTask.trim() &&
            !!form3_2.commWorkflow.trim() &&
            !!form3_2.driveWorkflow.trim() &&
            !!form3_2.trackingWorkflow.trim()
          }
          onSubmitUnit={handleUnitSubmit}
          onBackToDashboard={onBackToDashboard}
          childrenStep4={
            <div className="space-y-6">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-6 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <FolderSync className="w-5 h-5 text-rose-600" /> ผังขั้นตอนการทำงานร่วมกัน 3 เสาหลัก
                  </div>
                  <span className="text-xs bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1 rounded-full font-bold">
                    หน่วย 3.2
                  </span>
                </div>

                {/* Collapsible Example Guidance */}
                <div className="border border-rose-200/90 rounded-2xl overflow-hidden bg-rose-50/50">
                  <button
                    type="button"
                    onClick={() => setShowGuidance3_2(!showGuidance3_2)}
                    className="w-full p-3.5 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-rose-900 hover:bg-rose-100/60 transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-rose-600" />
                      💡 ดูแนวทางการตอบผังงานทีม 3 เสาหลัก (คลิกเพื่อดูโครงสร้างการตอบ)
                    </span>
                    <span className="text-xs text-rose-700 underline font-semibold">
                      {showGuidance3_2 ? 'ซ่อนแนวทาง' : 'เปิดดูแนวทาง'}
                    </span>
                  </button>
                  {showGuidance3_2 && (
                    <div className="p-4 bg-white border-t border-rose-200 text-xs space-y-1.5 text-slate-700 leading-relaxed">
                      <p className="font-bold text-rose-900">โครงสร้างและแนวทางการเขียนคำตอบด้วยตนเอง:</p>
                      <p><strong>• ชื่องานและบทบาท:</strong> ระบุภารกิจงานของโรงเรียน 1 เรื่อง พร้อมแบ่งบทบาทหน้าที่ของ ผอ. และคณะครู</p>
                      <p><strong>• เสาหลัก 1 (การสื่อสาร):</strong> ระบุช่องทางสื่อสารของทีม ช่วงเวลาแจ้งงาน และวิธีปักหมุดข้อมูลสำคัญ</p>
                      <p><strong>• เสาหลัก 2 (ไฟล์กลางบน Cloud):</strong> ระบุการจัดโครงสร้างโฟลเดอร์บน Cloud มาตรฐานการตั้งชื่อไฟล์ การกำหนดสิทธิ์ และผู้ดูแลไฟล์หลัก</p>
                      <p><strong>• เสาหลัก 3 (การติดตามงาน):</strong> ระบุเครื่องมือที่ใช้ติดตามความก้าวหน้าของงานและกำหนดวันส่งงาน</p>
                      <p className="text-[11px] text-rose-600 font-semibold pt-1">
                        *ห้ามคัดลอกข้อความจากแนวทางหรือตัวอย่างต้นแบบมาส่ง ระบบจะตรวจจับและไม่อนุมัติให้ผ่านเกณฑ์
                      </p>
                    </div>
                  )}
                </div>

                {/* Team Task */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-rose-600" /> 1. งานทีมจริง 1 เรื่อง พร้อมบทบาทสมาชิก:
                  </label>
                  <input
                    type="text"
                    value={form3_2.teamTask}
                    placeholder="ระบุชื่องานทีมของโรงเรียน และบทบาทหน้าที่ของสมาชิกแต่ละฝ่าย..."
                    onChange={(e) => setForm3_2({ ...form3_2, teamTask: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200/50"
                  />
                </div>

                {/* 3 Pillars */}
                <div className="space-y-4 pt-2">
                  {/* Pillar 1 */}
                  <div className="bg-[#f0fbf7] p-4 rounded-2xl border border-emerald-200 space-y-2">
                    <label className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Share2 className="w-4 h-4 text-emerald-600" /> เสาหลักที่ 1: ขั้นตอนการสื่อสาร (ใคร – แจ้งอะไร – ช่องทาง – เมื่อไร)
                    </label>
                    <input
                      type="text"
                      value={form3_2.commWorkflow}
                      placeholder="ระบุกติกาการสื่อสารของทีม ช่องทางที่ใช้ และช่วงเวลาการแจ้งประสานงาน..."
                      onChange={(e) => setForm3_2({ ...form3_2, commWorkflow: e.target.value })}
                      className="w-full bg-white border border-emerald-300 rounded-xl px-4 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>

                  {/* Pillar 2 */}
                  <div className="bg-[#eff6ff] p-4 rounded-2xl border border-blue-200 space-y-2">
                    <label className="text-xs font-extrabold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                      <FolderSync className="w-4 h-4 text-blue-600" /> เสาหลักที่ 2: การแบ่งปันไฟล์บน Cloud (โฟลเดอร์ Google Drive, การตั้งชื่อ, สิทธิ์, เจ้าของไฟล์กลาง)
                    </label>
                    <textarea
                      rows={2}
                      value={form3_2.driveWorkflow}
                      placeholder="ระบุชื่อโฟลเดอร์กลางบน Cloud รูปแบบการตั้งชื่อไฟล์ การกำหนดสิทธิ์ และผู้ดูแลไฟล์หลัก..."
                      onChange={(e) => setForm3_2({ ...form3_2, driveWorkflow: e.target.value })}
                      className="w-full bg-white border border-blue-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  {/* Pillar 3 */}
                  <div className="bg-[#fff9e6] p-4 rounded-2xl border border-amber-200 space-y-2">
                    <label className="text-xs font-extrabold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-600" /> เสาหลักที่ 3: การติดตามความก้าวหน้า (Checklist / ปฏิทิน / ผู้รับผิดชอบ / กำหนดส่ง)
                    </label>
                    <input
                      type="text"
                      value={form3_2.trackingWorkflow}
                      placeholder="ระบุเครื่องมือติดตามความคืบหน้าของงาน และกรอบเวลาการส่งงาน..."
                      onChange={(e) => setForm3_2({ ...form3_2, trackingWorkflow: e.target.value })}
                      className="w-full bg-white border border-amber-300 rounded-xl px-4 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          }
        />
      )}

      {showCurriculumModal && (
        <CurriculumModal isOpen={showCurriculumModal} onClose={() => setShowCurriculumModal(false)} />
      )}
    </div>
  );
};
