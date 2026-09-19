import React from 'react';
import type { UserProfile, UserProgress } from '../types';
import { Award, Printer, TrendingUp, Home } from 'lucide-react';

interface CertificateViewProps {
  profile: UserProfile;
  progress: UserProgress;
  onBackToDashboard: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ profile, progress, onBackToDashboard }) => {
  const handlePrint = () => {
    window.print();
  };

  const pre = progress.preTestScore ?? 0;
  const post = progress.postTestScore ?? 0;
  const diff = post - pre;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Action Bar (hidden when printing) */}
      <div className="print:hidden flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-base sm:text-lg">
              ยินดีด้วยครับ! ท่านผ่านโปรแกรมพัฒนาครบทั้ง 4 ด่านเรียบร้อยแล้ว
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              ท่านสามารถพิมพ์หรือบันทึกเกียรติบัตรนี้เป็น PDF เพื่อเก็บเป็นหลักฐานการพัฒนาตนเอง
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์เกียรติบัตร (PDF)</span>
          </button>
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-sm font-medium transition"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Score Comparison Summary (hidden when printing) */}
      <div className="print:hidden grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-xs font-semibold text-slate-500">คะแนนก่อนเรียน (Pre-test)</span>
          <div className="text-3xl font-bold text-slate-700 mt-1">{pre} / 10</div>
          <span className="text-[11px] text-slate-400">ระดับพื้นฐาน</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-xs font-semibold text-emerald-600">คะแนนหลังเรียน (Post-test)</span>
          <div className="text-3xl font-bold text-emerald-600 mt-1">{post} / 10</div>
          <span className="text-[11px] text-emerald-700 font-medium">หลังผ่าน 4 ด่านต่อเนื่อง</span>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/60 p-5 rounded-2xl border border-indigo-200 shadow-xs text-center">
          <span className="text-xs font-semibold text-indigo-700 flex items-center justify-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            พัฒนาการของท่าน
          </span>
          <div className="text-3xl font-bold text-indigo-900 mt-1">
            {diff >= 0 ? `+${diff}` : diff} คะแนน
          </div>
          <span className="text-[11px] text-indigo-600 font-medium">
            {diff > 0 ? 'มีพัฒนาการอย่างเห็นได้ชัด' : 'รักษาระดับมาตรฐานยอดเยี่ยม'}
          </span>
        </div>
      </div>

      {/* Printable Certificate Frame */}
      <div className="bg-white border-8 border-double border-indigo-950/20 rounded-3xl p-8 sm:p-14 shadow-lg text-center relative overflow-hidden print:border-indigo-950/40 print:shadow-none print:p-8">
        
        {/* Decorative corner ornaments */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-indigo-800" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-indigo-800" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-indigo-800" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-indigo-800" />

        {/* Logo / Badge */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-900 to-indigo-700 text-white shadow-md mb-6 mx-auto">
          <Award className="w-10 h-10 text-amber-300" />
        </div>

        <h3 className="text-xs sm:text-sm uppercase tracking-widest text-indigo-900 font-bold mb-2">
          Certificate of Completion
        </h3>
        <h1 className="text-2xl sm:text-4xl font-bold font-heading text-slate-900 mb-6 tracking-tight">
          เกียรติบัตรรับรองการพัฒนาตนเอง
        </h1>

        <p className="text-sm sm:text-base text-slate-600 mb-3">
          เกียรติบัตรฉบับนี้ให้ไว้เพื่อแสดงว่า
        </p>

        <div className="text-2xl sm:text-3xl font-bold text-indigo-950 font-heading mb-2 py-1 border-b-2 border-indigo-900/20 max-w-lg mx-auto">
          {profile.name}
        </div>

        <p className="text-sm sm:text-base text-slate-700 font-semibold mb-6">
          สถานศึกษา: {profile.school}
        </p>

        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
          ได้สำเร็จการอบรมตาม <br />
          <strong className="text-slate-900 font-heading text-sm sm:text-base">
            "โปรแกรมพัฒนาภาวะผู้นำดิจิทัลสำหรับผู้บริหารสถานศึกษาขนาดเล็ก แบบ 4 ด่านต่อเนื่อง ไม่ผูกเวลา"
          </strong><br />
          (Digital Leadership Development Program: Luno — งานวิจัยและพัฒนาทางการศึกษา ระยะที่ 3–4)
        </p>

        {/* Signatures & Issue Date */}
        <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto pt-6 border-t border-slate-200 text-xs sm:text-sm text-slate-600">
          <div>
            <div className="h-10 flex items-end justify-center font-serif text-indigo-900 italic font-semibold">
              คณะผู้วิจัยและพัฒนา
            </div>
            <div className="border-t border-slate-300 mt-2 pt-1 font-semibold text-slate-800">
              โครงการพัฒนาภาวะผู้นำดิจิทัล (Luno)
            </div>
            <div className="text-[11px] text-slate-400">ผู้วิจัยหลัก</div>
          </div>

          <div>
            <div className="h-10 flex items-end justify-center font-medium text-slate-700">
              {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="border-t border-slate-300 mt-2 pt-1 font-semibold text-slate-800">
              วันที่สำเร็จหลักสูตร
            </div>
            <div className="text-[11px] text-slate-400">รหัสยืนยัน: {profile.id}</div>
          </div>
        </div>

      </div>

    </div>
  );
};
