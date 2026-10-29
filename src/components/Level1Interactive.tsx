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
  MessageSquare, 
  Users, 
  ShieldCheck,
  Send,
  Sparkles
} from 'lucide-react';

interface Props {
  onPassLevel: () => void;
  onBackToDashboard?: () => void;
}

export const Level1Interactive: React.FC<Props> = ({ onPassLevel, onBackToDashboard }) => {
  const [profile] = useState<UserProfile | null>(() => ApiService.getLocalProfile());
  const [activeUnitId, setActiveUnitId] = useState<'1.1' | '1.2' | '1.3'>('1.1');
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);

  const [submissions, setSubmissions] = useState<Record<string, UnitSubmission>>(() => {
    const prog = ApiService.getLocalProgress();
    return prog.unitSubmissions || {};
  });

  // State ฟอร์มของหน่วย 1.1 (แผนสื่อสาร 4 ช่อง)
  const [form1_1, setForm1_1] = useState(() => {
    const saved = submissions['1.1']?.formData || {};
    return {
      goal: saved['เป้าหมาย'] || 'ให้ผู้ปกครองทุกคนทราบว่าวันนี้ปิดเรียนฉุกเฉิน ก่อน 07.00 น.',
      audienceMain: saved['ผู้รับสารหลัก'] || 'ผู้ปกครองนักเรียน (ต้องรู้ว่าไม่ต้องส่งบุตรหลานมาโรงเรียน)',
      audienceSub: saved['ผู้รับสารรอง'] || 'ครูและบุคลากร (เตรียมจัดการสอนเสริมและรอประกาศ)',
      keyMessage: saved['ข้อความหลัก'] || 'ขอแจ้งปิดการเรียนการสอนวันนี้ เนื่องจากน้ำท่วมถนนเข้าโรงเรียน ขอให้ผู้ปกครองงดส่งนักเรียนเพื่อความปลอดภัย โรงเรียนจะแจ้งวันเปิดเรียนอีกครั้งผ่านกลุ่มนี้',
      channels: saved['ช่องทางและเหตุผล'] || '1) LINE กลุ่มผู้ปกครอง: เข้าถึงเร็วในตอนเช้า\n2) หอกระจายข่าวหมู่บ้าน: สำหรับบ้านที่ไม่มีสมาร์ทโฟน\n3) Facebook เพจโรงเรียน: ประกาศทางการ'
    };
  });

  // State ฟอร์มของหน่วย 1.2 (เครือข่ายพันธมิตร)
  const [form1_2, setForm1_2] = useState(() => {
    const saved = submissions['1.2']?.formData || {};
    return {
      networkInternal: saved['เครือข่ายภายในโรงเรียน'] || 'ครูประจำชั้น, ครูเวร, ภารโรง (ช่องทาง: LINE กลุ่มครู)',
      networkParents: saved['เครือข่ายผู้ปกครอง'] || 'คณะกรรมการเครือข่ายผู้ปกครอง, ผู้แทนห้องเรียน (ช่องทาง: LINE OpenChat)',
      networkCommunity: saved['เครือข่ายชุมชนและท้องถิ่น'] || 'ผู้ใหญ่บ้าน, นายก อบต., ผอ.รพ.สต. (ช่องทาง: โทรประสานงาน และกลุ่มไลน์ตำบล)',
      networkExternal: saved['เครือข่ายภายนอก'] || 'ชมรมศิษย์เก่า, เครือข่ายโรงเรียนพี่น้อง (ช่องทาง: เพจศิษย์เก่าสัมพันธ์)',
      inquiryCase: saved['ข้อกังวลจากพันธมิตร'] || 'ผู้ปกครองสอบถามในกลุ่มไลน์: "ได้ยินข่าวลือว่าปีหน้าโรงเรียนจะยุบไปรวมกับโรงเรียนตำบลข้างเคียง จริงหรือไม่คะ เป็นห่วงลูกมาก"',
      responseCase: saved['ข้อความตอบกลับของผู้บริหาร'] || 'ขอเรียนชี้แจงด้วยความเคารพครับ โรงเรียนไม่ได้มีนโยบายยุบรวมแต่อย่างใดครับ ในทางตรงกันข้าม ปีนี้เรากำลังพัฒนาห้องคอมพิวเตอร์และหลักสูตรดิจิทัลเพิ่มเติม ขอขอบพระคุณท่านผู้ปกครองที่เป็นห่วงและร่วมดูแลโรงเรียนของเราเสมอมาครับ'
    };
  });

  // State ฟอร์มของหน่วย 1.3 (ภาพลักษณ์และ PDPA)
  const [form1_3, setForm1_3] = useState(() => {
    const saved = submissions['1.3']?.formData || {};
    return {
      mediaTitle: saved['หัวข้อประชาสัมพันธ์'] || 'เปิดรับสมัครนักเรียนใหม่ อนุบาลและ ป.1: โรงเรียนขนาดเล็ก คุณภาพอบอุ่น',
      mediaHighlight: saved['จุดเด่นที่ต้องการสื่อสาร'] || 'เรียนรู้สนุกด้วยห้องคอมพิวเตอร์และสื่อดิจิทัล DLTV, อาหารกลางวันถูกหลักโภชนาการ, ครูดูแลใกล้ชิดครบทุกคน',
      pdpaCheck1: saved['ตรวจ_ไม่ระบุเลขบัตรประชาชน_ที่อยู่'] ?? true,
      pdpaCheck2: saved['ตรวจ_เบลอชื่อเด็กหรือใช้ชื่อเล่น'] ?? true,
      pdpaCheck3: saved['ตรวจ_มีหนังสือยินยอมจากผู้ปกครอง'] ?? true,
      pdpaCheck4: saved['ตรวจ_ใช้ภาพถ่ายโรงเรียนหรือภาพฟรีลิขสิทธิ์'] ?? true,
      pdpaCheck5: saved['ตรวจ_มีข้อความคุ้มครองข้อมูลส่วนบุคคล'] ?? true,
      consentNote: saved['ข้อความขอความยินยอม'] || 'ภาพถ่ายและวิดีโอนี้เผยแพร่เพื่อการประชาสัมพันธ์กิจกรรมของโรงเรียน โดยได้รับความยินยอมจากผู้ปกครองตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562'
    };
  });

  const isCompleted1_1 = !!submissions['1.1'];
  const isCompleted1_2 = !!submissions['1.2'];
  const isCompleted1_3 = !!submissions['1.3'];
  const allCompleted = isCompleted1_1 && isCompleted1_2 && isCompleted1_3;

  const handleUnitSubmit = (sub: UnitSubmission) => {
    const updatedProg = ApiService.saveUnitSubmission(sub);
    setSubmissions(updatedProg.unitSubmissions || {});

    const completedUnits = updatedProg.completedUnits || [];
    if (completedUnits.includes('1.1') && completedUnits.includes('1.2') && completedUnits.includes('1.3')) {
      ApiService.completeStep('level-1', 'level-2');
    }
  };

  const handleNextUnitFrom = (current: '1.1' | '1.2' | '1.3') => {
    if (current === '1.1') setActiveUnitId('1.2');
    else if (current === '1.2') setActiveUnitId('1.3');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Banner Navigation between Sub-units (Soft Modern Light Style) */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-800 border border-amber-200">
                MODULE 1
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                การสื่อสารเชิงดิจิทัล (Digital Communication)
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              พัฒนาทักษะการวางแผนสื่อสาร 4 ช่อง การสร้างเครือข่ายพันธมิตร และการสื่อสารภาพลักษณ์ที่ปลอดภัยตาม PDPA
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCurriculumModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition cursor-pointer self-start sm:self-auto"
          >
            <BookOpen className="w-4 h-4 text-amber-600" /> โครงสร้างหลักสูตร
          </button>
        </div>

        {/* Sub-unit Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
          {/* Tab 1.1 */}
          <button
            type="button"
            onClick={() => setActiveUnitId('1.1')}
            className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
              activeUnitId === '1.1'
                ? 'bg-[#fff9e6] border-amber-400 ring-2 ring-amber-400/20 text-slate-900 shadow-xs'
                : 'bg-slate-50 border-slate-200/80 hover:border-slate-300 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-amber-800">หน่วย 1.1 (45 น.)</span>
              {isCompleted1_1 ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ผ่านแล้ว ({submissions['1.1']?.totalScore}/10)
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">รอส่งงาน</span>
              )}
            </div>
            <div className="text-sm font-extrabold text-slate-900">การวางแผนในการสื่อสาร</div>
          </button>

          {/* Tab 1.2 */}
          <button
            type="button"
            onClick={() => setActiveUnitId('1.2')}
            className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
              activeUnitId === '1.2'
                ? 'bg-[#fff9e6] border-amber-400 ring-2 ring-amber-400/20 text-slate-900 shadow-xs'
                : 'bg-slate-50 border-slate-200/80 hover:border-slate-300 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-amber-800">หน่วย 1.2 (60 น.)</span>
              {isCompleted1_2 ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ผ่านแล้ว ({submissions['1.2']?.totalScore}/10)
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">รอส่งงาน</span>
              )}
            </div>
            <div className="text-sm font-extrabold text-slate-900">การสร้างเครือข่ายพันธมิตร</div>
          </button>

          {/* Tab 1.3 */}
          <button
            type="button"
            onClick={() => setActiveUnitId('1.3')}
            className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
              activeUnitId === '1.3'
                ? 'bg-[#fff9e6] border-amber-400 ring-2 ring-amber-400/20 text-slate-900 shadow-xs'
                : 'bg-slate-50 border-slate-200/80 hover:border-slate-300 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-amber-800">หน่วย 1.3 (90 น.)</span>
              {isCompleted1_3 ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ผ่านแล้ว ({submissions['1.3']?.totalScore}/10)
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">รอส่งงาน</span>
              )}
            </div>
            <div className="text-sm font-extrabold text-slate-900">การสื่อสารภาพลักษณ์และ PDPA</div>
          </button>
        </div>
      </div>

      {/* Module 1 Completion Celebration Card */}
      {allCompleted && (
        <div className="bg-[#eef8f5] border border-[#d2f0e6] rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-teal-600 shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-lg">ยอดเยี่ยม! ท่านผ่าน Module 1 ครบทั้ง 3 หน่วยแล้ว</div>
              <p className="text-xs text-teal-800 font-semibold mt-0.5">
                คะแนนรวม: {(submissions['1.1']?.totalScore || 0) + (submissions['1.2']?.totalScore || 0) + (submissions['1.3']?.totalScore || 0)} / 30 คะแนน · ปลดล็อก Module 2 แล้ว
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onPassLevel}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition cursor-pointer shrink-0"
          >
            เข้าสู่ Module 2 <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* RENDER ACTIVE SUB-UNIT */}
      {activeUnitId === '1.1' && (
        <ActivityFlowContainer
          unit={UNITS_DATA['1.1']}
          profile={profile}
          existingSubmission={submissions['1.1']}
          formData={{
            'เป้าหมาย': form1_1.goal,
            'ผู้รับสารหลัก': form1_1.audienceMain,
            'ผู้รับสารรอง': form1_1.audienceSub,
            'ข้อความหลัก': form1_1.keyMessage,
            'ช่องทางและเหตุผล': form1_1.channels
          }}
          isStep4Valid={!!form1_1.goal.trim() && !!form1_1.keyMessage.trim()}
          onSubmitUnit={handleUnitSubmit}
          onNextUnit={() => handleNextUnitFrom('1.1')}
          onBackToDashboard={onBackToDashboard}
          childrenStep4={
            <div className="space-y-4">
              <div className="bg-slate-50/80 border border-slate-200/90 rounded-3xl p-6 space-y-4">
                <div className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-600" /> แบบฟอร์มแผนสื่อสาร 4 ช่อง (4-Cell Plan Form)
                </div>

                {/* Smart Suggestion Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> ตัวอย่างด่วน:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setForm1_1({
                        goal: 'ให้ผู้ปกครองทุกคนทราบว่าวันนี้ปิดเรียนฉุกเฉิน ก่อน 07.00 น.',
                        audienceMain: 'ผู้ปกครองนักเรียน (ต้องรู้ว่างดส่งบุตรหลานมาโรงเรียน)',
                        audienceSub: 'ครูและบุคลากร (เตรียมจัดการสอนเสริมและรอประกาศ)',
                        keyMessage: 'ขอแจ้งปิดการเรียนการสอนวันนี้ เนื่องจากน้ำท่วมถนนเข้าโรงเรียน ขอให้ผู้ปกครองงดส่งนักเรียนเพื่อความปลอดภัย โรงเรียนจะแจ้งวันเปิดเรียนอีกครั้งผ่านกลุ่มนี้',
                        channels: '1) LINE กลุ่มผู้ปกครอง: เข้าถึงเร็วในตอนเช้า\n2) หอกระจายข่าวหมู่บ้าน: สำหรับบ้านที่ไม่มีสมาร์ทโฟน\n3) Facebook เพจโรงเรียน: ประกาศทางการ'
                      });
                    }}
                    className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition cursor-pointer"
                  >
                    + กรณีน้ำท่วมฉุกเฉิน (เรื่อง A)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setForm1_1({
                        goal: 'ให้ผู้ปกครองเข้าร่วมประชุมอย่างพร้อมเพรียง ในวันเสาร์ 09.00 น.',
                        audienceMain: 'ผู้ปกครองกลุ่มวัยทำงาน และกลุ่มผู้สูงอายุที่ดูแลเด็ก',
                        audienceSub: 'คณะกรรมการสถานศึกษา (ร่วมสังเกตการณ์)',
                        keyMessage: 'ขอเรียนเชิญผู้ปกครองทุกท่านร่วมประชุมชี้แจงแนวทางการเรียนรู้และรับเงินอุดหนุนการศึกษา ในวันเสาร์นี้ เวลา 09.00 น. ณ หอประชุมโรงเรียน',
                        channels: '1) จดหมายเชิญเป็นทางการ 2) LINE กลุ่มห้องเรียน 3) หอกระจายข่าวหมู่บ้าน'
                      });
                    }}
                    className="text-[11px] font-bold px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 transition cursor-pointer"
                  >
                    + กรณีประชุมผู้ปกครอง (เรื่อง B)
                  </button>
                </div>

                {/* 1. เป้าหมาย */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    1. เป้าหมาย (Goal): 1 ประโยค ระบุ "ใคร ทำอะไร เมื่อไร"
                  </label>
                  <input
                    type="text"
                    value={form1_1.goal}
                    onChange={(e) => setForm1_1({ ...form1_1, goal: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                {/* 2. ผู้รับสารหลัก / รอง */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      2.1 ผู้รับสารหลัก (สิ่งที่ต้องรู้)
                    </label>
                    <input
                      type="text"
                      value={form1_1.audienceMain}
                      onChange={(e) => setForm1_1({ ...form1_1, audienceMain: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      2.2 ผู้รับสารรอง (สิ่งที่ต้องรู้)
                    </label>
                    <input
                      type="text"
                      value={form1_1.audienceSub}
                      onChange={(e) => setForm1_1({ ...form1_1, audienceSub: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-900"
                    />
                  </div>
                </div>

                {/* 3. ข้อความหลัก */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      3. ข้อความหลัก (Key Message): ไม่เกิน 3 ประโยค สั้น กระชับ ชัดเจน
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {form1_1.keyMessage.length} ตัวอักษร
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={form1_1.keyMessage}
                    onChange={(e) => setForm1_1({ ...form1_1, keyMessage: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                {/* 4. ช่องทางสื่อสาร + เหตุผล */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    4. ช่องทางสื่อสาร 2–3 ช่องทาง พร้อมเหตุผลประกอบ
                  </label>
                  <textarea
                    rows={3}
                    value={form1_1.channels}
                    onChange={(e) => setForm1_1({ ...form1_1, channels: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>
            </div>
          }
        />
      )}

      {activeUnitId === '1.2' && (
        <ActivityFlowContainer
          unit={UNITS_DATA['1.2']}
          profile={profile}
          existingSubmission={submissions['1.2']}
          formData={{
            'เครือข่ายภายในโรงเรียน': form1_2.networkInternal,
            'เครือข่ายผู้ปกครอง': form1_2.networkParents,
            'เครือข่ายชุมชนและท้องถิ่น': form1_2.networkCommunity,
            'เครือข่ายภายนอก': form1_2.networkExternal,
            'ข้อกังวลจากพันธมิตร': form1_2.inquiryCase,
            'ข้อความตอบกลับของผู้บริหาร': form1_2.responseCase
          }}
          isStep4Valid={!!form1_2.responseCase.trim()}
          onSubmitUnit={handleUnitSubmit}
          onNextUnit={() => handleNextUnitFrom('1.2')}
          onBackToDashboard={onBackToDashboard}
          childrenStep4={
            <div className="space-y-4">
              <div className="bg-slate-50/80 border border-slate-200/90 rounded-3xl p-6 space-y-4">
                <div className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-600" /> 1. ผังเครือข่ายพันธมิตร 4 ทิศทาง
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ภายใน (ครู/บุคลากร + ช่องทาง):</label>
                    <input
                      type="text"
                      value={form1_2.networkInternal}
                      onChange={(e) => setForm1_2({ ...form1_2, networkInternal: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ผู้ปกครองและนักเรียน (+ ช่องทาง):</label>
                    <input
                      type="text"
                      value={form1_2.networkParents}
                      onChange={(e) => setForm1_2({ ...form1_2, networkParents: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ชุมชน/ท้องถิ่น/อบต. (+ ช่องทาง):</label>
                    <input
                      type="text"
                      value={form1_2.networkCommunity}
                      onChange={(e) => setForm1_2({ ...form1_2, networkCommunity: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ภายนอก/ศิษย์เก่า/เอกชน (+ ช่องทาง):</label>
                    <input
                      type="text"
                      value={form1_2.networkExternal}
                      onChange={(e) => setForm1_2({ ...form1_2, networkExternal: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <div className="font-extrabold text-slate-900 text-base flex items-center gap-2 mb-3">
                    <Send className="w-5 h-5 text-amber-600" /> 2. การจำลองสื่อสารสองทาง (Two-Way Communication)
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ข้อคำถาม หรือข้อกังวลที่ได้รับจากพันธมิตร 1 กรณี:</label>
                      <input
                        type="text"
                        value={form1_2.inquiryCase}
                        onChange={(e) => setForm1_2({ ...form1_2, inquiryCase: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ข้อความตอบกลับของผู้บริหาร (แสดงการรับฟัง สุภาพ และสร้างความมั่นใจ):</label>
                      <textarea
                        rows={3}
                        value={form1_2.responseCase}
                        onChange={(e) => setForm1_2({ ...form1_2, responseCase: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        />
      )}

      {activeUnitId === '1.3' && (
        <ActivityFlowContainer
          unit={UNITS_DATA['1.3']}
          profile={profile}
          existingSubmission={submissions['1.3']}
          formData={{
            'หัวข้อประชาสัมพันธ์': form1_3.mediaTitle,
            'จุดเด่นที่ต้องการสื่อสาร': form1_3.mediaHighlight,
            'ตรวจ_ไม่ระบุเลขบัตรประชาชน_ที่อยู่': form1_3.pdpaCheck1,
            'ตรวจ_เบลอชื่อเด็กหรือใช้ชื่อเล่น': form1_3.pdpaCheck2,
            'ตรวจ_มีหนังสือยินยอมจากผู้ปกครอง': form1_3.pdpaCheck3,
            'ตรวจ_ใช้ภาพถ่ายโรงเรียนหรือภาพฟรีลิขสิทธิ์': form1_3.pdpaCheck4,
            'ตรวจ_มีข้อความคุ้มครองข้อมูลส่วนบุคคล': form1_3.pdpaCheck5,
            'ข้อความขอความยินยอม': form1_3.consentNote
          }}
          isStep4Valid={!!form1_3.mediaTitle.trim() && form1_3.pdpaCheck3}
          onSubmitUnit={handleUnitSubmit}
          onBackToDashboard={onBackToDashboard}
          childrenStep4={
            <div className="space-y-4">
              <div className="bg-slate-50/80 border border-slate-200/90 rounded-3xl p-6 space-y-4">
                <div className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-600" /> ออกแบบสื่อและตรวจสอบมาตรฐาน PDPA / ลิขสิทธิ์
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">หัวข้อสื่อประชาสัมพันธ์โรงเรียน:</label>
                  <input
                    type="text"
                    value={form1_3.mediaTitle}
                    onChange={(e) => setForm1_3({ ...form1_3, mediaTitle: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">จุดเด่นที่ต้องการสื่อสาร (Storytelling):</label>
                  <textarea
                    rows={2}
                    value={form1_3.mediaHighlight}
                    onChange={(e) => setForm1_3({ ...form1_3, mediaHighlight: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-900"
                  />
                </div>

                <div className="pt-2">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> ตรวจสอบ Checklist PDPA 5 ข้อ (คลิกเพื่อยืนยัน):
                  </div>
                  <div className="space-y-2 bg-white p-4 rounded-2xl border border-slate-200 text-xs text-slate-700">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form1_3.pdpaCheck1}
                        onChange={(e) => setForm1_3({ ...form1_3, pdpaCheck1: e.target.checked })}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span>1. ไม่เปิดเผยเลขประจำตัวประชาชน ที่อยู่ หรือเกรดเฉลี่ยของนักเรียน</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form1_3.pdpaCheck2}
                        onChange={(e) => setForm1_3({ ...form1_3, pdpaCheck2: e.target.checked })}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span>2. เบลอชื่อ-นามสกุลจริงบนป้ายชื่อ หรือใช้ชื่อเล่น/ภาพมุมกว้าง</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form1_3.pdpaCheck3}
                        onChange={(e) => setForm1_3({ ...form1_3, pdpaCheck3: e.target.checked })}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span>3. มีหนังสือขอความยินยอม (Consent) จากผู้ปกครองในการเผยแพร่ภาพถ่าย</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form1_3.pdpaCheck4}
                        onChange={(e) => setForm1_3({ ...form1_3, pdpaCheck4: e.target.checked })}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span>4. ใช้ภาพถ่ายของโรงเรียนเอง หรือภาพฟรีที่มีสัญญาอนุญาต Commercial Use</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form1_3.pdpaCheck5}
                        onChange={(e) => setForm1_3({ ...form1_3, pdpaCheck5: e.target.checked })}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span>5. มีข้อความระบุการคุ้มครองข้อมูลส่วนบุคคลแนบท้ายสื่อ</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    ร่างข้อความขอความยินยอม (Consent Note) สั้นๆ:
                  </label>
                  <input
                    type="text"
                    value={form1_3.consentNote}
                    onChange={(e) => setForm1_3({ ...form1_3, consentNote: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-900"
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
