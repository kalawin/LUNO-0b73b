import React from 'react';
import type { UnitDefinition, UnitSubmission, UserProfile } from '../types';
import { Printer, X, Award, CheckCircle, FileText, School, Calendar, User } from 'lucide-react';
import { printElementById } from '../utils/printHelper';

interface Props {
  unit: UnitDefinition;
  submission: UnitSubmission;
  profile: UserProfile | null;
  onClose: () => void;
}

export const ArtifactPdfModal: React.FC<Props> = ({
  unit,
  submission,
  profile,
  onClose
}) => {
  const handlePrint = () => {
    printElementById('printable-artifact', `LUNO_Unit_${unit.id}_${profile?.name || 'Artifact'}`, 'portrait');
  };

  const formDataEntries = Object.entries(submission.formData || {});

  const formatFieldLabel = (key: string) => {
    return key
      .replace(/^ตรวจ_/, 'รายการตรวจสอบ PDPA: ')
      .replace(/_/g, ' ');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in print:static print:p-0 print:m-0 print:bg-white print:overflow-visible print:block print:inset-auto print:h-auto">
      <div className="relative w-full max-w-5xl bg-slate-100 border border-slate-200/90 rounded-[32px] shadow-2xl overflow-hidden my-4 max-h-[94vh] flex flex-col print:border-none print:shadow-none print:max-h-none print:m-0 print:w-full print:rounded-none print:bg-white">
        {/* Modal Top Bar (Hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  เอกสารใบงานและสรุปผลงานประจำหน่วย (One-Page Artifact)
                </h3>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                  ขนาดมาตรฐาน A4 (210 × 297 มม.)
                </span>
              </div>
              <p className="text-xs text-slate-500">จัดหน้าขนาดมาตรฐาน A4 แนวตั้งพร้อมสั่งพิมพ์หรือเลือก "บันทึกเป็น PDF (Save as PDF)" ได้ทันที</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4 text-emerald-400" /> สั่งพิมพ์ A4 / บันทึก PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable A4 Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-200/70 print:p-0 print:bg-white print:overflow-visible">
          {/* Printable A4 Portrait Sheet (210mm x 297mm) */}
          <div
            id="printable-artifact"
            className="w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-xl border border-slate-200/90 mx-auto p-6 sm:p-[14mm_16mm] box-border flex flex-col justify-between print:shadow-none print:border-none print:p-0 print:m-0"
          >
            <div>
              {/* Header */}
              <div className="border-b-2 border-teal-600 pb-4 mb-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full inline-block">
                      LUNO DIGITAL LEADERSHIP PLATFORM · MODULE {unit.moduleNumber}
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                      {unit.title}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1"><strong>ผลลัพธ์ประจำหน่วย:</strong> {unit.outcome}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs shadow-xs">
                      <Award className="w-4 h-4 text-amber-600" />
                      คะแนนประเมิน: {submission.totalScore}/10
                    </div>
                  </div>
                </div>

                {/* Metadata Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span><strong>ผู้บริหาร:</strong> {profile?.name || '..................................................'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span><strong>สถานศึกษา:</strong> {profile?.school || '..................................................'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span><strong>วันที่จัดทำ:</strong> {new Date(submission.submittedAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>

              {/* Form Content Section */}
              <div className="space-y-3 mb-5">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-l-4 border-teal-600 pl-2.5">
                  รายละเอียดแบบฟอร์มใบงานและแผนปฏิบัติการ (Action Worksheet & Artifact)
                </h2>

                <div className="grid grid-cols-1 gap-2.5">
                  {formDataEntries.map(([key, val]) => {
                    let formattedVal = '';
                    if (typeof val === 'boolean') {
                      formattedVal = val ? '☑ ผ่านการตรวจสอบและปฏิบัติตามมาตรฐานเรียบร้อยแล้ว' : '☐ ยังไม่ได้ตรวจสอบ';
                    } else if (typeof val === 'object' && val !== null) {
                      formattedVal = JSON.stringify(val, null, 2);
                    } else {
                      formattedVal = String(val || '').trim();
                    }

                    return (
                      <div key={key} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 page-break-avoid">
                        <div className="text-[11px] font-bold text-teal-800 uppercase tracking-wider mb-1">
                          {formatFieldLabel(key)}
                        </div>
                        {formattedVal ? (
                          <div className="text-xs sm:text-sm font-medium text-slate-800 whitespace-pre-wrap leading-relaxed">
                            {formattedVal}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 italic py-1.5 border-b border-dashed border-slate-300">
                            (พื้นที่สำหรับเขียนบันทึกเพิ่มเติม: ...........................................................................................................................................)
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reflection Section */}
              <div className="bg-teal-50/40 border border-teal-100 rounded-xl p-3.5 mb-5 page-break-avoid">
                <h3 className="text-xs sm:text-sm font-bold text-teal-900 mb-1 flex items-center gap-2">
                  💭 บันทึกสะท้อนคิดและการนำไปปรับใช้จริงในสถานศึกษา (Reflection Notes)
                </h3>
                {submission.reflectionNotes ? (
                  <p className="text-xs sm:text-sm text-teal-950 leading-relaxed italic">
                    "{submission.reflectionNotes}"
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 italic py-1">
                    ....................................................................................................................................................................................................
                  </p>
                )}
              </div>

              {/* Rubric Evaluation Summary */}
              <div className="border-t border-slate-200 pt-4 page-break-avoid">
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 mb-2.5 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> สรุปผลการประเมินตามเกณฑ์มาตรฐาน (Rubric Evaluation)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {unit.rubric.map((item) => {
                    const score = submission.rubricScores[item.id] ?? 0;
                    return (
                      <div key={item.id} className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/80 text-xs">
                        <div className="font-bold text-slate-700">{item.title}</div>
                        <div className="text-slate-500 mt-0.5">คะแนนที่ได้: <strong className="text-teal-700 font-extrabold">{score}</strong> / {item.maxScore} คะแนน</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              {/* Official Signature Area for School Administrator / PA Portfolio */}
              <div className="mt-6 pt-5 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs text-slate-700 page-break-avoid">
                <div>
                  <p className="font-semibold text-slate-500 mb-8">ลงชื่อ............................................................</p>
                  <p className="font-bold text-slate-800">({profile?.name || '............................................................'})</p>
                  <p className="text-slate-500 mt-0.5">ผู้จัดทำแผนพัฒนา / ผู้บริหารสถานศึกษา</p>
                  <p className="text-slate-400 mt-0.5">วันที่ {new Date(submission.submittedAt).toLocaleDateString('th-TH')}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-500 mb-8">ลงชื่อ............................................................</p>
                  <p className="font-bold text-slate-800">(คณะกรรมการประเมิน / ผู้ทรงคุณวุฒิ)</p>
                  <p className="text-slate-500 mt-0.5">ผู้รับรองแผนงานและสมรรถนะดิจิทัล</p>
                  <p className="text-slate-400 mt-0.5">วันที่ ......./......./...........</p>
                </div>
              </div>

              {/* Footer note */}
              <div className="mt-4 pt-2.5 border-t border-slate-100 text-center text-[10px] text-slate-400">
                เอกสารขนาดมาตรฐาน A4 (210 × 297 มม.) จัดทำขึ้นเพื่อเป็นหลักฐานเชิงประจักษ์ในการพัฒนาภาวะผู้นำดิจิทัลของผู้บริหารสถานศึกษาขนาดเล็ก · แพลตฟอร์ม LUNO
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
