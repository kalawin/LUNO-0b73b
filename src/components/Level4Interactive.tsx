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
  Compass, 
  HeartHandshake, 
  Sparkles,
  Target,
  GraduationCap,
  Users,
  Building2,
  Lock
} from 'lucide-react';

interface Props {
  onPassLevel: () => void;
  onBackToDashboard?: () => void;
}

export const Level4Interactive: React.FC<Props> = ({ onPassLevel, onBackToDashboard }) => {
  const [profile] = useState<UserProfile | null>(() => ApiService.getLocalProfile());
  const [activeUnitId, setActiveUnitId] = useState<'4.1' | '4.2'>('4.1');
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [showGuidance4_1, setShowGuidance4_1] = useState(false);
  const [showGuidance4_2, setShowGuidance4_2] = useState(false);

  const [submissions, setSubmissions] = useState<Record<string, UnitSubmission>>(() => {
    const prog = ApiService.getLocalProgress();
    return prog.unitSubmissions || {};
  });

  // State 4.1: วิสัยทัศน์ดิจิทัล (Guided Prompts + Vision 3-4 ประโยค + เวทีระดมความเห็น)
  const [form4_1, setForm4_1] = useState(() => {
    const saved = submissions['4.1']?.formData || {};
    return {
      promptStudent: saved['คำตอบนำทาง_ด้านผู้เรียน'] || '',
      promptTeacher: saved['คำตอบนำทาง_ด้านครู'] || '',
      promptCommunity: saved['คำตอบนำทาง_ด้านชุมชน'] || '',
      visionStatement: saved['วิสัยทัศน์ดิจิทัล'] || '',
      forumPlan: saved['แผนเวทีระดมความเห็น'] || '',
      commVisionChannel: saved['ช่องทางสื่อสารวิสัยทัศน์'] || ''
    };
  });

  // State 4.2: เจตคติเชิงบวกต่อเทคโนโลยี (TAM Model & Quick Win)
  const [form4_2, setForm4_2] = useState(() => {
    const saved = submissions['4.2']?.formData || {};
    return {
      targetGroupConcern: saved['กลุ่มเป้าหมายและความกังวล'] || '',
      activityFormat: saved['รูปแบบกิจกรรม'] || '',
      quickWinDetail: saved['QuickWinที่เห็นผลครั้งเดียว'] || '',
      frequencySchedule: saved['ความถี่และผู้รับผิดชอบ'] || '',
      metricQuantity: saved['ตัวชี้วัดเชิงปริมาณ'] || '',
      metricQuality: saved['ตัวชี้วัดเชิงคุณภาพ'] || ''
    };
  });

  const isCompleted4_1 = !!submissions['4.1'];
  const isCompleted4_2 = !!submissions['4.2'];
  const allCompleted = isCompleted4_1 && isCompleted4_2;

  const handleUnitSubmit = (sub: UnitSubmission) => {
    const updatedProg = ApiService.saveUnitSubmission(sub);
    setSubmissions(updatedProg.unitSubmissions || {});

    // หากบันทึกวิสัยทัศน์ ให้บันทึกไว้ใน UserProgress ด้วย
    if (sub.unitId === '4.1' && form4_1.visionStatement) {
      ApiService.saveLocalProgress({ visionStatement: form4_1.visionStatement });
    }

    const completedUnits = updatedProg.completedUnits || [];
    if (completedUnits.includes('4.1') && completedUnits.includes('4.2')) {
      ApiService.completeStep('level-4', 'post-test');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Banner Navigation between Sub-units (Soft Modern Style) */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-800 border border-indigo-200">
                MODULE 4
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                วิสัยทัศน์และเจตคติเชิงดิจิทัล (Digital Vision & Attitude)
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              สร้างวิสัยทัศน์ดิจิทัลแบบมีส่วนร่วม 3-4 ประโยค และกิจกรรม Quick Win เสริมเจตคติเชิงบวกตามหลัก TAM
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
          <button
            type="button"
            onClick={() => setActiveUnitId('4.1')}
            className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
              activeUnitId === '4.1'
                ? 'bg-[#f5f3ff] border-indigo-400 ring-2 ring-indigo-400/20 text-slate-900 shadow-xs'
                : 'bg-slate-50 border-slate-200/80 hover:border-slate-300 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-extrabold text-indigo-700">หน่วย 4.1 (60 น.)</span>
              {isCompleted4_1 ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ผ่านแล้ว ({submissions['4.1']?.totalScore}/10)
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">รอส่งงาน</span>
              )}
            </div>
            <div className="text-sm font-bold text-slate-800">การสร้างและสื่อสารวิสัยทัศน์ดิจิทัล</div>
            <div className="text-xs text-slate-500 mt-1 line-clamp-1">คำตอบนำทาง 3 ด้าน, แถลงวิสัยทัศน์ 3-4 ประโยค และแผนเวทีระดมความเห็น</div>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!isCompleted4_1) {
                alert('🔒 กรุณาทำแบบฝึกหัดหน่วย 4.1 ให้ผ่านเกณฑ์ก่อนเข้าสู่หน่วย 4.2 ครับ');
                return;
              }
              setActiveUnitId('4.2');
            }}
            className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
              !isCompleted4_1
                ? 'opacity-60 cursor-not-allowed bg-slate-100 border-slate-200'
                : activeUnitId === '4.2'
                ? 'bg-[#f5f3ff] border-indigo-400 ring-2 ring-indigo-400/20 text-slate-900 shadow-xs'
                : 'bg-slate-50 border-slate-200/80 hover:border-slate-300 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-extrabold text-indigo-700">หน่วย 4.2 (60 น.)</span>
              {isCompleted4_2 ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ผ่านแล้ว ({submissions['4.2']?.totalScore}/10)
                </span>
              ) : !isCompleted4_1 ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-full border border-slate-300">
                  <Lock className="w-3 h-3 text-slate-500" /> ล็อกอยู่
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">พร้อมเรียนรู้</span>
              )}
            </div>
            <div className="text-sm font-bold text-slate-800">การส่งเสริมเจตคติเชิงบวกต่อเทคโนโลยี</div>
            <div className="text-xs text-slate-500 mt-1 line-clamp-1">โมเดล TAM (มีประโยชน์-ใช้ง่าย), Quick Win ใน 1 ครั้ง และตัวชี้วัดความสำเร็จ</div>
          </button>
        </div>
      </div>

      {/* Module 4 Celebration Banner */}
      {allCompleted && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-300 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 flex-shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-lg">ยินดีด้วยอย่างยิ่ง! ท่านผ่านครบทั้ง 4 Modules (10 หน่วยสมบูรณ์แล้ว)</div>
              <p className="text-xs font-medium text-slate-600 mt-0.5">
                คะแนนรวม: {(submissions['4.1']?.totalScore || 0) + (submissions['4.2']?.totalScore || 0)} / 20 คะแนน · พร้อมทำแบบทดสอบหลังเรียน (Post-test) แล้ว
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onPassLevel}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition flex-shrink-0 cursor-pointer"
          >
            ทำแบบทดสอบหลังเรียน <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* UNIT 4.1 INTERACTIVE FORM */}
      {activeUnitId === '4.1' && (
        <ActivityFlowContainer
          unit={UNITS_DATA['4.1']}
          profile={profile}
          existingSubmission={submissions['4.1']}
          formData={{
            'คำตอบนำทาง_ด้านผู้เรียน': form4_1.promptStudent,
            'คำตอบนำทาง_ด้านครู': form4_1.promptTeacher,
            'คำตอบนำทาง_ด้านชุมชน': form4_1.promptCommunity,
            'วิสัยทัศน์ดิจิทัล': form4_1.visionStatement,
            'แผนเวทีระดมความเห็น': form4_1.forumPlan,
            'ช่องทางสื่อสารวิสัยทัศน์': form4_1.commVisionChannel
          }}
          isStep4Valid={
            !!form4_1.promptStudent.trim() &&
            !!form4_1.promptTeacher.trim() &&
            !!form4_1.promptCommunity.trim() &&
            !!form4_1.visionStatement.trim() &&
            !!form4_1.forumPlan.trim() &&
            !!form4_1.commVisionChannel.trim()
          }
          onSubmitUnit={handleUnitSubmit}
          onNextUnit={() => setActiveUnitId('4.2')}
          onBackToDashboard={onBackToDashboard}
          childrenStep4={
            <div className="space-y-6">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-6 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Compass className="w-5 h-5 text-indigo-600" /> ชุดสร้างวิสัยทัศน์ดิจิทัล 3-4 ประโยค (Vision Builder)
                  </div>
                  <span className="text-xs bg-indigo-50 text-indigo-800 border border-indigo-200 px-3 py-1 rounded-full font-bold">
                    หน่วย 4.1
                  </span>
                </div>

                {/* Collapsible Example Guidance */}
                <div className="border border-indigo-200/90 rounded-2xl overflow-hidden bg-indigo-50/50">
                  <button
                    type="button"
                    onClick={() => setShowGuidance4_1(!showGuidance4_1)}
                    className="w-full p-3.5 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-indigo-900 hover:bg-indigo-100/60 transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      💡 ดูแนวทางการตอบวิสัยทัศน์ดิจิทัล 3-4 ประโยค (คลิกเพื่อดูโครงสร้างการตอบ)
                    </span>
                    <span className="text-xs text-indigo-700 underline font-semibold">
                      {showGuidance4_1 ? 'ซ่อนแนวทาง' : 'เปิดดูแนวทาง'}
                    </span>
                  </button>
                  {showGuidance4_1 && (
                    <div className="p-4 bg-white border-t border-indigo-200 text-xs space-y-1.5 text-slate-700 leading-relaxed">
                      <p className="font-bold text-indigo-900">โครงสร้างและแนวทางการเขียนคำตอบด้วยตนเอง:</p>
                      <p><strong>• คำถามนำทาง 3 ด้าน:</strong> ระบุเป้าหมายที่ต้องการให้เกิดขึ้นจริงกับ (1) นักเรียน (2) ครู และ (3) ชุมชน/ผู้ปกครอง ของโรงเรียนท่าน</p>
                      <p><strong>• โครงสร้างวิสัยทัศน์ดิจิทัล (3–4 ประโยค):</strong> เริ่มต้นด้วยกรอบเวลา (เช่น "ภายใน ... ปี") ตามด้วยผลลัพธ์ด้านผู้เรียน การใช้เทคโนโลยีของครู และการมีส่วนร่วมของชุมชน</p>
                      <p><strong>• แผนเวทีระดมความเห็น & ช่องทางสื่อสาร:</strong> ระบุรูปแบบการเปิดรับฟังความคิดเห็นจากคณะครู และช่องทางที่จะใช้เผยแพร่วิสัยทัศน์อย่างน้อย 2 ช่องทาง</p>
                      <p className="text-[11px] text-rose-600 font-semibold pt-1">
                        *ห้ามคัดลอกข้อความจากแนวทางหรือตัวอย่างต้นแบบมาส่ง ระบบจะตรวจจับและไม่อนุมัติให้ผ่านเกณฑ์
                      </p>
                    </div>
                  )}
                </div>

                {/* 3 Guided Prompts */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    1. ตอบคำถามนำทาง 3 ด้านเพื่อใช้เป็นวัตถุดิบในการสร้างวิสัยทัศน์:
                  </span>

                  {/* Student */}
                  <div className="bg-[#eff6ff] p-3.5 rounded-xl border border-blue-200 space-y-1">
                    <label className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-blue-600" /> ด้านผู้เรียน: อีก 3 ปีข้างหน้า นักเรียนของเราจะใช้เทคโนโลยีอย่างไรให้เกิดประโยชน์สูงสุด?
                    </label>
                    <input
                      type="text"
                      value={form4_1.promptStudent}
                      placeholder="ระบุทักษะหรือผลลัพธ์ด้านการใช้เทคโนโลยีที่ต้องการให้เกิดกับนักเรียน..."
                      onChange={(e) => setForm4_1({ ...form4_1, promptStudent: e.target.value })}
                      className="w-full bg-white border border-blue-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  {/* Teacher */}
                  <div className="bg-[#f0fbf7] p-3.5 rounded-xl border border-emerald-200 space-y-1">
                    <label className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-emerald-600" /> ด้านครู: อีก 3 ปีข้างหน้า เทคโนโลยีจะเข้ามาช่วยสนับสนุนการสอนและลดภาระงานครูอย่างไร?
                    </label>
                    <input
                      type="text"
                      value={form4_1.promptTeacher}
                      placeholder="ระบุแนวทางการใช้เทคโนโลยีช่วยจัดการเรียนรู้และลดภาระงานของครู..."
                      onChange={(e) => setForm4_1({ ...form4_1, promptTeacher: e.target.value })}
                      className="w-full bg-white border border-emerald-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>

                  {/* Community */}
                  <div className="bg-[#fff9e6] p-3.5 rounded-xl border border-amber-200 space-y-1">
                    <label className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-amber-600" /> ด้านชุมชน/ผู้ปกครอง: ชุมชนจะมีส่วนร่วมและรับรู้ข้อมูลผ่านช่องทางดิจิทัลอย่างไร?
                    </label>
                    <input
                      type="text"
                      value={form4_1.promptCommunity}
                      placeholder="ระบุรูปแบบการเชื่อมโยงข้อมูลและการมีส่วนร่วมของผู้ปกครองและชุมชน..."
                      onChange={(e) => setForm4_1({ ...form4_1, promptCommunity: e.target.value })}
                      className="w-full bg-white border border-amber-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    />
                  </div>
                </div>

                {/* Final Vision Statement */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> 2. แถลงวิสัยทัศน์ดิจิทัล (ความยาว 3-4 ประโยค พร้อมระบุระยะเวลาที่ชัดเจน):
                    </label>
                  </div>
                  <textarea
                    rows={4}
                    value={form4_1.visionStatement}
                    placeholder="เรียบเรียงแถลงการณ์วิสัยทัศน์ดิจิทัลของโรงเรียนท่าน (ระบุกรอบเวลา และครอบคลุมทั้งนักเรียน ครู และชุมชน)..."
                    onChange={(e) => setForm4_1({ ...form4_1, visionStatement: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 leading-relaxed"
                  />
                </div>

                {/* Forum Plan & Communication Channels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      3. แผนเวทีระดมความเห็นครู (หัวข้อ, เวลา, คำถามกระตุ้น):
                    </label>
                    <textarea
                      rows={2}
                      value={form4_1.forumPlan}
                      placeholder="ระบุรูปแบบเวทีรับฟังความคิดเห็นครู ช่วงเวลา และประเด็นคำถามที่ใช้ระดมสมอง..."
                      onChange={(e) => setForm4_1({ ...form4_1, forumPlan: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      4. ช่องทางสื่อสารวิสัยทัศน์ให้ทุกคนรับรู้ (อย่างน้อย 2 ช่องทาง):
                    </label>
                    <textarea
                      rows={2}
                      value={form4_1.commVisionChannel}
                      placeholder="ระบุช่องทางที่จะใช้สื่อสารวิสัยทัศน์ให้ครู ผู้ปกครอง และชุมชนรับทราบ (อย่างน้อย 2 ช่องทาง)..."
                      onChange={(e) => setForm4_1({ ...form4_1, commVisionChannel: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          }
        />
      )}

      {/* UNIT 4.2 INTERACTIVE FORM */}
      {activeUnitId === '4.2' && (
        <ActivityFlowContainer
          unit={UNITS_DATA['4.2']}
          profile={profile}
          existingSubmission={submissions['4.2']}
          formData={{
            'กลุ่มเป้าหมายและความกังวล': form4_2.targetGroupConcern,
            'รูปแบบกิจกรรม': form4_2.activityFormat,
            'QuickWinที่เห็นผลครั้งเดียว': form4_2.quickWinDetail,
            'ความถี่และผู้รับผิดชอบ': form4_2.frequencySchedule,
            'ตัวชี้วัดเชิงปริมาณ': form4_2.metricQuantity,
            'ตัวชี้วัดเชิงคุณภาพ': form4_2.metricQuality
          }}
          isStep4Valid={
            !!form4_2.targetGroupConcern.trim() &&
            !!form4_2.activityFormat.trim() &&
            !!form4_2.quickWinDetail.trim() &&
            !!form4_2.frequencySchedule.trim() &&
            !!form4_2.metricQuantity.trim() &&
            !!form4_2.metricQuality.trim()
          }
          onSubmitUnit={handleUnitSubmit}
          onBackToDashboard={onBackToDashboard}
          childrenStep4={
            <div className="space-y-6">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-6 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <HeartHandshake className="w-5 h-5 text-indigo-600" /> แผนกิจกรรม Quick Win เสริมเจตคติเชิงบวก (TAM Model)
                  </div>
                  <span className="text-xs bg-indigo-50 text-indigo-800 border border-indigo-200 px-3 py-1 rounded-full font-bold">
                    หน่วย 4.2
                  </span>
                </div>

                {/* Collapsible Example Guidance */}
                <div className="border border-indigo-200/90 rounded-2xl overflow-hidden bg-indigo-50/50">
                  <button
                    type="button"
                    onClick={() => setShowGuidance4_2(!showGuidance4_2)}
                    className="w-full p-3.5 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-indigo-900 hover:bg-indigo-100/60 transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      💡 ดูแนวทางการตอบแผนกิจกรรม Quick Win ตามหลัก TAM (คลิกเพื่อดูโครงสร้างการตอบ)
                    </span>
                    <span className="text-xs text-indigo-700 underline font-semibold">
                      {showGuidance4_2 ? 'ซ่อนแนวทาง' : 'เปิดดูแนวทาง'}
                    </span>
                  </button>
                  {showGuidance4_2 && (
                    <div className="p-4 bg-white border-t border-indigo-200 text-xs space-y-1.5 text-slate-700 leading-relaxed">
                      <p className="font-bold text-indigo-900">โครงสร้างและแนวทางการเขียนคำตอบด้วยตนเอง:</p>
                      <p><strong>• กลุ่มเป้าหมายและความกังวล:</strong> ระบุกลุ่มครูในโรงเรียนและความกังวลหรืออุปสรรคในการใช้เทคโนโลยี</p>
                      <p><strong>• รูปแบบกิจกรรม & ความถี่:</strong> ออกแบบกิจกรรมสั้นๆ ที่เป็นกันเอง ไม่กดดัน พร้อมระบุความถี่และผู้รับผิดชอบดูแล</p>
                      <p><strong>• รายละเอียด Quick Win:</strong> ระบุเครื่องมือหรือเทคนิคที่ใช้ง่าย (Easy to Use) และช่วยลดภาระงานได้ทันทีในครั้งเดียว (Useful)</p>
                      <p><strong>• ตัวชี้วัดความสำเร็จ:</strong> แยกเป็นตัวชี้วัดเชิงปริมาณ (จำนวน/ร้อยละ) และตัวชี้วัดเชิงคุณภาพ (ความมั่นใจ/เจตคติเชิงบวก)</p>
                      <p className="text-[11px] text-rose-600 font-semibold pt-1">
                        *ห้ามคัดลอกข้อความจากแนวทางหรือตัวอย่างต้นแบบมาส่ง ระบบจะตรวจจับและไม่อนุมัติให้ผ่านเกณฑ์
                      </p>
                    </div>
                  )}
                </div>

                {/* Target Group */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    1. กลุ่มเป้าหมาย + ความกังวลเกี่ยวกับเทคโนโลยีที่มีอยู่:
                  </label>
                  <input
                    type="text"
                    value={form4_2.targetGroupConcern}
                    placeholder="ระบุกลุ่มครูเป้าหมาย และสาเหตุความกังวลต่อการใช้เทคโนโลยี..."
                    onChange={(e) => setForm4_2({ ...form4_2, targetGroupConcern: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50"
                  />
                </div>

                {/* Activity Format & Quick Win */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      2. รูปแบบกิจกรรม (สั้น ไม่เป็นทางการ ไม่สร้างความเครียด):
                    </label>
                    <input
                      type="text"
                      value={form4_2.activityFormat}
                      placeholder="ระบุชื่อหรือรูปแบบกิจกรรมสั้นๆ ที่สร้างบรรยากาศผ่อนคลาย..."
                      onChange={(e) => setForm4_2({ ...form4_2, activityFormat: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      3. ความถี่และผู้รับผิดชอบ:
                    </label>
                    <input
                      type="text"
                      value={form4_2.frequencySchedule}
                      placeholder="ระบุความถี่ในการจัดกิจกรรม และผู้รับผิดชอบ/ครูพี่เลี้ยง..."
                      onChange={(e) => setForm4_2({ ...form4_2, frequencySchedule: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    />
                  </div>
                </div>

                {/* Quick Win Detail */}
                <div className="bg-[#f0fbf7] p-4 rounded-2xl border border-emerald-200 space-y-2">
                  <label className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" /> 4. รายละเอียด Quick Win ที่เห็นผลสำเร็จทันทีในครั้งเดียว (Useful & Easy to Use):
                  </label>
                  <textarea
                    rows={2}
                    value={form4_2.quickWinDetail}
                    placeholder="อธิบายทักษะหรือเครื่องมือที่จะให้ครูทดลองทำแล้วเห็นผลช่วยลดงานได้ทันทีในครั้งเดียว..."
                    onChange={(e) => setForm4_2({ ...form4_2, quickWinDetail: e.target.value })}
                    className="w-full bg-white border border-emerald-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>

                {/* Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#eff6ff] p-3.5 rounded-xl border border-blue-200 space-y-1">
                    <label className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-blue-600" /> ตัวชี้วัดเชิงปริมาณ (เช่น % ผู้เข้าร่วม, ชิ้นงาน):
                    </label>
                    <input
                      type="text"
                      value={form4_2.metricQuantity}
                      placeholder="ระบุตัวชี้วัดเชิงปริมาณที่นับหรือวัดผลได้ชัดเจน..."
                      onChange={(e) => setForm4_2({ ...form4_2, metricQuantity: e.target.value })}
                      className="w-full bg-white border border-blue-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  <div className="bg-[#fff9e6] p-3.5 rounded-xl border border-amber-200 space-y-1">
                    <label className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                      <HeartHandshake className="w-4 h-4 text-amber-600" /> ตัวชี้วัดเชิงคุณภาพ (เจตคติ, ความมั่นใจ, บรรยากาศ):
                    </label>
                    <input
                      type="text"
                      value={form4_2.metricQuality}
                      placeholder="ระบุตัวชี้วัดเชิงคุณภาพด้านความมั่นใจและเจตคติของครู..."
                      onChange={(e) => setForm4_2({ ...form4_2, metricQuality: e.target.value })}
                      className="w-full bg-white border border-amber-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-200"
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
