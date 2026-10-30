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
          isStep4Valid={!!form4_1.visionStatement.trim() && !!form4_1.forumPlan.trim()}
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
                      placeholder="เช่น นักเรียนทุกคนได้เรียนรู้ผ่านสื่อดิจิทัลและฝึกทักษะการสืบค้นอย่างสนุกสนานและปลอดภัย"
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
                      placeholder="เช่น ครูใช้เทคโนโลยีลดภาระงานเอกสาร และมีเวลาดูแลพัฒนาผู้เรียนเป็นรายบุคคลมากขึ้น"
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
                      placeholder="เช่น ผู้ปกครองและชุมชนเข้าถึงข้อมูลผลงานนักเรียนและกิจกรรมโรงเรียนได้สะดวกรวดเร็ว"
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
                    placeholder="เช่น ภายใน 3 ปี โรงเรียนจะขับเคลื่อนการเรียนรู้เชิงรุกด้วยเทคโนโลยีดิจิทัล ครูทุกคนใช้สื่อดิจิทัลในการสอนสม่ำเสมอ นักเรียนมีทักษะดิจิทัลและคุณธรรม และผู้ปกครองมีส่วนร่วมผ่านระบบออนไลน์"
                    onChange={(e) => setForm4_1({ ...form4_1, visionStatement: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 leading-relaxed"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[
                      'ภายใน 3 ปี โรงเรียนจะขับเคลื่อนการเรียนรู้เชิงรุกด้วยเทคโนโลยีดิจิทัล ครูทุกคนใช้สื่อดิจิทัลอย่างน้อยสัปดาห์ละ 2 คาบ นักเรียน ป.4-6 ใช้คอมพิวเตอร์สืบค้นและนำเสนอผลงานได้ทุกคน และผู้ปกครองรับข่าวสารผ่านไลน์กลุ่มอย่างสม่ำเสมอ',
                      'ภายใน 2 ปี ยกระดับโรงเรียนสู่สังคมแห่งการเรียนรู้ดิจิทัลที่ปลอดภัย ครูใช้ระบบ Cloud จัดการเอกสารลดการใช้กระดาษ 50% นักเรียนมีทักษะความฉลาดทางดิจิทัล (DQ) และชุมชนร่วมประเมินผลผ่านระบบออนไลน์'
                    ].map((example, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setForm4_1({ ...form4_1, visionStatement: example })}
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-900 border border-slate-200 transition"
                      >
                        แม่แบบวิสัยทัศน์ {i + 1}
                      </button>
                    ))}
                  </div>
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
                      placeholder="เช่น ประชุมครูประจำเดือน (30 นาที) หัวข้อ เทคโนโลยีอะไรจะช่วยลดงานเอกสารของครูได้มากที่สุด"
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
                      placeholder="เช่น กลุ่มไลน์ครู, ป้ายนิเทศหน้าโรงเรียน, เพจเฟซบุ๊กโรงเรียน, ประชุมผู้ปกครอง"
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
          isStep4Valid={!!form4_2.targetGroupConcern.trim() && !!form4_2.quickWinDetail.trim()}
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

                {/* Target Group */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    1. กลุ่มเป้าหมาย + ความกังวลเกี่ยวกับเทคโนโลยีที่มีอยู่:
                  </label>
                  <input
                    type="text"
                    value={form4_2.targetGroupConcern}
                    placeholder="เช่น ครูอาวุโส กังวลว่าจะจำขั้นตอนไม่ได้ หรือกลัวทำคอมพิวเตอร์เสียหาย"
                    onChange={(e) => setForm4_2({ ...form4_2, targetGroupConcern: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[
                      'ครูอาวุโส: กังวลว่าจะทำคอมพิวเตอร์พัง หรือจำขั้นตอนการใช้งานไม่ได้',
                      'ครูประจำชั้น: กังวลว่าการใช้แอพใหม่จะเพิ่มภาระงานและเสียเวลาสอน',
                      'ครูธุรการ/การเงิน: กังวลเรื่องความถูกต้องของเอกสารและความปลอดภัยของข้อมูล'
                    ].map((example, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setForm4_2({ ...form4_2, targetGroupConcern: example })}
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-900 border border-slate-200 transition"
                      >
                        {example.split(':')[0]}
                      </button>
                    ))}
                  </div>
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
                      placeholder="เช่น เวิร์กช็อปสั้น 15 นาทีช่วงพักบ่าย พร้อมชากาแฟ (Tech Coffee Break)"
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
                      placeholder="เช่น สัปดาห์ละ 1 ครั้ง (วันพุธบ่าย) ผู้รับผิดชอบ: ผู้อำนวยการร่วมกับครูแกนนำ"
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
                    placeholder="เช่น ทดลองใช้ Google Docs Voice Typing พิมพ์ข้อความด้วยเสียงพูด ช่วยลดเวลาพิมพ์ได้ 50% ทันที"
                    onChange={(e) => setForm4_2({ ...form4_2, quickWinDetail: e.target.value })}
                    className="w-full bg-white border border-emerald-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      'พิมพ์บันทึกข้อความด้วยเสียงใน Google Docs (Voice Typing) ลดเวลาพิมพ์ 50% ทันที',
                      'สแกนเอกสารด้วยแอป CamScanner หรือ Google Drive บนมือถือ แปลงเป็น PDF ส่งใน 1 นาที',
                      'ใช้แม่แบบรายงานสำเร็จรูปใน Canva เปลี่ยนรูปและข้อความเสร็จได้เล่มรายงานใน 15 นาที'
                    ].map((example, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setForm4_2({ ...form4_2, quickWinDetail: example })}
                        className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 border border-emerald-200 transition"
                      >
                        ตัวอย่าง {i + 1}
                      </button>
                    ))}
                  </div>
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
                      placeholder="เช่น ครูเข้าร่วมอย่างน้อย 80% และทดลองใช้เครื่องมือสำเร็จทุกคนในครั้งแรก"
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
                      placeholder="เช่น ครูมีความมั่นใจเพิ่มขึ้น และรู้สึกเชิงบวกว่าเทคโนโลยีช่วยลดภาระงานได้จริง"
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
