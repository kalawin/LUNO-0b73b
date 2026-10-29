import React, { useState } from 'react';
import type { UnitDefinition, UnitSubmission, UserProfile } from '../types';
import { RubricEvaluationTable } from './RubricEvaluationTable';
import { ArtifactPdfModal } from './ArtifactPdfModal';
import { SoundService } from '../services/audio';
import { 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Printer, 
  Sparkles, 
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';

interface Props {
  unit: UnitDefinition;
  profile: UserProfile | null;
  existingSubmission?: UnitSubmission;
  formData: Record<string, any>;
  isStep4Valid: boolean;
  childrenStep4: React.ReactNode;
  onSubmitUnit: (sub: UnitSubmission) => void;
  onNextUnit?: () => void;
  onBackToDashboard?: () => void;
}

export const ActivityFlowContainer: React.FC<Props> = ({
  unit,
  profile,
  existingSubmission,
  formData,
  isStep4Valid,
  childrenStep4,
  onSubmitUnit,
  onNextUnit,
  onBackToDashboard
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(() => {
    return existingSubmission ? 5 : 1;
  });

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(() => {
    return formData['สถานการณ์ที่เลือก'] || (unit.scenarios?.[0]?.id ?? '');
  });

  const [rubricScores, setRubricScores] = useState<Record<string, number>>(() => {
    if (existingSubmission?.rubricScores) return existingSubmission.rubricScores;
    const initial: Record<string, number> = {};
    unit.rubric.forEach(r => {
      initial[r.id] = r.high.score;
    });
    return initial;
  });

  const [reflectionNotes, setReflectionNotes] = useState<string>(() => {
    return existingSubmission?.reflectionNotes || '';
  });

  const [showPdfModal, setShowPdfModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(() => !!existingSubmission);

  const totalScore = unit.rubric.reduce((sum, item) => sum + (rubricScores[item.id] ?? 0), 0);

  const stepMeta = [
    { index: 1, label: 'เปิดสถานการณ์' },
    { index: 2, label: 'เรียนรู้เนื้อหาย่อย' },
    { index: 3, label: 'ดูตัวอย่าง' },
    { index: 4, label: 'ลงมือปฏิบัติ' },
    { index: 5, label: 'ตรวจสอบ & ส่งงาน' }
  ];

  const handleScoreChange = (criterionId: string, score: number) => {
    setRubricScores(prev => ({ ...prev, [criterionId]: score }));
  };

  const handleFinalSubmit = () => {
    const sub: UnitSubmission = {
      unitId: unit.id,
      formData: {
        ...formData,
        ...(unit.scenarios ? { 'สถานการณ์ที่เลือก': unit.scenarios.find(s => s.id === selectedScenarioId)?.title || selectedScenarioId } : {})
      },
      rubricScores,
      totalScore,
      reflectionNotes,
      submittedAt: new Date().toISOString()
    };

    onSubmitUnit(sub);
    setIsSubmitted(true);
    SoundService.playSuccess();
  };

  const currentStepData = unit.steps.find(s => s.stepIndex === currentStep) || unit.steps[0];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                MODULE {unit.moduleNumber} · หน่วย {unit.id}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> {unit.estimatedTime}
              </span>
              {isSubmitted && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ส่งงานสำเร็จแล้ว ({existingSubmission?.totalScore || totalScore}/10)
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{unit.title}</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">{unit.outcome}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isSubmitted && (
              <button
                type="button"
                onClick={() => setShowPdfModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition cursor-pointer"
              >
                <Printer className="w-4 h-4 text-emerald-400" /> ดูผลงาน PDF
              </button>
            )}
            {onBackToDashboard && (
              <button
                type="button"
                onClick={onBackToDashboard}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> แดชบอร์ด
              </button>
            )}
          </div>
        </div>

        {/* 5-Step Stepper Progress Bar (Soft Modern Style) */}
        <div className="grid grid-cols-5 gap-2 pt-5">
          {stepMeta.map(s => {
            const isActive = currentStep === s.index;
            const isPassed = currentStep > s.index || isSubmitted;
            return (
              <button
                key={s.index}
                type="button"
                onClick={() => setCurrentStep(s.index as any)}
                className={`flex flex-col items-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/10'
                    : isPassed
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100/70'
                    : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1 mb-1">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    isActive
                      ? 'bg-emerald-400 text-slate-900'
                      : isPassed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {isPassed && !isActive ? '✓' : s.index}
                  </span>
                </div>
                <span className="text-[11px] font-bold truncate w-full hidden sm:block">
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Step Body */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Step Indicator Sub-header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-2xl bg-teal-50 text-teal-800 font-extrabold flex items-center justify-center text-sm border border-teal-200">
              {currentStep}
            </span>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">{currentStepData.stepName}</h3>
              <p className="text-xs text-slate-500">{currentStepData.goal} · ใช้เวลาประมาณ {currentStepData.timeEstimate}</p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
            ขั้นที่ {currentStep} จาก 5
          </span>
        </div>

        {/* STEP 1: เปิดสถานการณ์ */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-[#f0f8ff] border border-[#d2e9fb] rounded-3xl p-6 text-slate-800 text-sm leading-relaxed">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white shadow-xs flex items-center justify-center text-sky-600 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 text-base mb-1">จุดประกายความคิด</div>
                  <p className="whitespace-pre-line text-slate-700 leading-relaxed">{currentStepData.content}</p>
                </div>
              </div>
            </div>

            {/* หากมีสถานการณ์จำลอง A, B, C */}
            {unit.scenarios && unit.scenarios.length > 0 && (
              <div className="space-y-3">
                <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  เลือกสถานการณ์จำลองที่ท่านต้องการนำมาจัดทำแผน (1 เรื่อง):
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {unit.scenarios.map(sc => {
                    const isSelected = selectedScenarioId === sc.id;
                    return (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => setSelectedScenarioId(sc.id)}
                        className={`text-left p-4 rounded-3xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#f4f3ff] border-indigo-400 ring-2 ring-indigo-500/20 text-slate-900 shadow-sm'
                            : 'bg-slate-50 border-slate-200/80 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            เรื่อง {sc.code}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                        </div>
                        <div className="font-bold text-sm mb-1 text-slate-900">{sc.title}</div>
                        <p className="text-xs text-slate-500 leading-relaxed mb-3">{sc.shortSummary}</p>
                        <div className="text-[11px] p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 leading-normal">
                          {sc.fullDescription}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">คำแนะนำในขั้นนี้:</div>
              <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                {currentStepData.instructions.map((ins, i) => (
                  <li key={i}>{ins}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* STEP 2: เรียนรู้เนื้อหาย่อย */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-[#f0f8ff] border border-[#d2e9fb] rounded-3xl p-6 sm:p-8 text-slate-800 text-sm leading-relaxed whitespace-pre-line">
              <div className="flex items-center gap-2 text-sky-800 font-extrabold text-base mb-3">
                <FileText className="w-5 h-5 text-sky-600" /> สาระสำคัญประจำหน่วย (Micro-Content)
              </div>
              {currentStepData.content}
            </div>

            <div className="bg-[#fdf8e6] border border-[#fcefc0] rounded-2xl p-4 text-xs text-amber-900">
              <strong>ทฤษฎีและแนวคิดอ้างอิง:</strong> {unit.theoryReference}
            </div>
          </div>
        )}

        {/* STEP 3: ดูตัวอย่าง */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-[#eef8f5] border border-[#d2f0e6] rounded-3xl p-6 sm:p-8 text-slate-800 text-sm leading-relaxed whitespace-pre-line">
              <div className="flex items-center gap-2 text-teal-800 font-extrabold text-base mb-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600" /> ตัวอย่างชิ้นงานที่กรอกถูกต้อง (Worked Example)
              </div>
              {currentStepData.content}
            </div>

            {unit.commonMistakes && unit.commonMistakes.length > 0 && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-rose-600" /> ข้อผิดพลาดที่พบบ่อย (Common Pitfalls):
                </div>
                <ul className="text-xs text-rose-900/80 space-y-1 list-disc list-inside">
                  {unit.commonMistakes.map((mis, i) => (
                    <li key={i}>{mis}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: ลงมือปฏิบัติ (Interactive Form) */}
        {currentStep === 4 && (
          <div className="space-y-6">
            {childrenStep4}

            {unit.checklist && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs">
                <div className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-teal-600" /> รายการตรวจสอบความครบถ้วนก่อนส่ง (Checklist):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                  {unit.checklist.map((chk, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-teal-600 font-bold">✓</span>
                      <span>{chk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: ตรวจสอบและส่งงาน */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <RubricEvaluationTable
              rubric={unit.rubric}
              selectedScores={rubricScores}
              onChangeScore={handleScoreChange}
              reflectionNotes={reflectionNotes}
              onChangeReflection={setReflectionNotes}
            />

            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/90 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="font-extrabold text-slate-900 text-base">พร้อมส่งผลงานประจำหน่วยนี้หรือยัง?</div>
                <p className="text-xs text-slate-600 mt-0.5">
                  ท่านได้คะแนนประเมินตนเอง <strong>{totalScore}/10 คะแนน</strong> ข้อมูลจะถูกบันทึกและซิงก์สู่ระบบ
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowPdfModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-teal-600" /> พรีวิวเอกสาร
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {isSubmitted ? 'บันทึกการแก้ไข' : 'ยืนยันและส่งงาน'}
                </button>
              </div>
            </div>

            {isSubmitted && onNextUnit && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={onNextUnit}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition cursor-pointer"
                >
                  ไปต่อยังหน่วยการเรียนรู้ถัดไป <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((currentStep - 1) as any)}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> ย้อนกลับ
          </button>

          <div className="text-xs font-semibold text-slate-400">
            ขั้นที่ {currentStep} จาก 5
          </div>

          {currentStep < 5 ? (
            <button
              type="button"
              disabled={currentStep === 4 && !isStep4Valid}
              onClick={() => setCurrentStep((currentStep + 1) as any)}
              className="flex items-center gap-1 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              ถัดไป <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" /> {isSubmitted ? 'บันทึกแล้ว' : 'ส่งผลงาน'}
            </button>
          )}
        </div>
      </div>

      {showPdfModal && (
        <ArtifactPdfModal
          unit={unit}
          submission={{
            unitId: unit.id,
            formData: {
              ...formData,
              ...(unit.scenarios ? { 'สถานการณ์ที่เลือก': unit.scenarios.find(s => s.id === selectedScenarioId)?.title || selectedScenarioId } : {})
            },
            rubricScores,
            totalScore,
            reflectionNotes,
            submittedAt: existingSubmission?.submittedAt || new Date().toISOString()
          }}
          profile={profile}
          onClose={() => setShowPdfModal(false)}
        />
      )}
    </div>
  );
};
