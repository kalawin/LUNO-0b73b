import React from 'react';
import type { UnitDefinition, UnitSubmission, UserProfile } from '../types';
import { Printer, X, Award, CheckCircle, FileText, School, Calendar, User } from 'lucide-react';

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
    window.print();
  };

  const formDataEntries = Object.entries(submission.formData || {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Top Bar (Hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-lg">เอกสารผลงานสรุปประจำหน่วย (One-Page Artifact)</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/30"
            >
              <Printer className="w-4 h-4" /> สั่งพิมพ์ / บันทึกเป็น PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div id="printable-artifact" className="flex-1 overflow-y-auto p-8 sm:p-12 bg-white text-slate-900 print:p-0 print:m-0 print:overflow-visible">
          {/* Header */}
          <div className="border-b-2 border-indigo-600 pb-6 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
                  LUNO DIGITAL LEADERSHIP PLATFORM
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                  {unit.title}
                </h1>
                <p className="text-sm text-slate-600 mt-1">{unit.outcome}</p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-sm">
                  <Award className="w-4 h-4 text-amber-600" />
                  คะแนน: {submission.totalScore}/10
                </div>
              </div>
            </div>

            {/* Metadata Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-200 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-600" />
                <span><strong>ผู้บริหาร:</strong> {profile?.name || 'ไม่ระบุชื่อ'}</span>
              </div>
              <div className="flex items-center gap-2">
                <School className="w-4 h-4 text-indigo-600" />
                <span><strong>สถานศึกษา:</strong> {profile?.school || 'สถานศึกษาขนาดเล็ก'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span><strong>วันที่ส่งงาน:</strong> {new Date(submission.submittedAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>

          {/* Form Content Section */}
          <div className="space-y-5 mb-8">
            <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider border-l-4 border-indigo-600 pl-3">
              รายละเอียดชิ้นงานที่จัดทำ (Action Artifact)
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {formDataEntries.map(([key, val]) => {
                if (typeof val === 'boolean') return null;
                const formattedVal = typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val);
                return (
                  <div key={key} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      {key}
                    </div>
                    <div className="text-sm font-medium text-slate-800 whitespace-pre-wrap leading-relaxed">
                      {formattedVal || '-'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reflection Section */}
          {submission.reflectionNotes && (
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-5 mb-8">
              <h3 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
                💭 บันทึกสะท้อนคิดและการนำไปปรับใช้จริง
              </h3>
              <p className="text-sm text-indigo-950 leading-relaxed italic">
                "{submission.reflectionNotes}"
              </p>
            </div>
          )}

          {/* Rubric Evaluation Summary */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> สรุปผลการประเมินตามเกณฑ์มาตรฐาน (Rubric Evaluation)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {unit.rubric.map((item) => {
                const score = submission.rubricScores[item.id] ?? 0;
                return (
                  <div key={item.id} className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs">
                    <div className="font-semibold text-slate-700 truncate">{item.title}</div>
                    <div className="text-slate-500 mt-1">คะแนนที่ได้: <strong className="text-indigo-600">{score}</strong> / {item.maxScore}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-8 pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
            เอกสารนี้จัดทำขึ้นเพื่อเป็นหลักฐานเชิงประจักษ์ในการพัฒนาภาวะผู้นำดิจิทัลของผู้บริหารสถานศึกษาขนาดเล็ก · แพลตฟอร์ม LUNO
          </div>
        </div>
      </div>
    </div>
  );
};

