import React, { useState } from 'react';
import type { UserProfile } from '../types';
import { Sparkles, ShieldCheck, Clock, BookOpen, ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (profile: UserProfile) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('กรุณาระบุชื่อ-นามสกุลของท่าน');
      return;
    }
    if (!school.trim()) {
      setError('กรุณาระบุชื่อสถานศึกษาของท่าน');
      return;
    }

    const newProfile: UserProfile = {
      id: phone.trim() ? `USR-${phone.trim().slice(-4)}` : `USR-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      school: school.trim(),
      phone: phone.trim(),
      loginAt: new Date().toISOString()
    };

    onLogin(newProfile);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">
      
      {/* Header Badge */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-sm font-medium mb-3">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>งานวิจัยและพัฒนาทางการศึกษา ระยะที่ 3–4</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 tracking-tight">
          โปรแกรมพัฒนาภาวะผู้นำดิจิทัล<br />
          <span className="text-indigo-700">สำหรับผู้บริหารสถานศึกษาขนาดเล็ก</span>
        </h1>
        <p className="text-slate-600 text-base leading-relaxed max-w-lg mx-auto">
          ระบบการเรียนรู้เชิงปฏิบัติการ 4 ด่านต่อเนื่อง ยืดหยุ่น ไม่ผูกเวลา 
          ใช้เวลาด่านละประมาณ 10 นาที บันทึกจุดที่ค้างไว้ให้อัตโนมัติ
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          ลงทะเบียนเข้าสู่บทเรียน
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          กรุณาระบุข้อมูลเพื่อใช้ในการออกเกียรติบัตรและบันทึกความก้าวหน้า
        </p>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              ชื่อ - นามสกุล (พร้อมคำนำหน้า)*
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="เช่น ผอ. สมศักดิ์ พัฒนาการ"
              className="w-full px-4 py-3 text-base rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              ชื่อสถานศึกษา (โรงเรียน)*
            </label>
            <input
              type="text"
              required
              value={school}
              onChange={(e) => { setSchool(e.target.value); setError(''); }}
              placeholder="เช่น โรงเรียนบ้านหนองบัว สพป. เขต 1"
              className="w-full px-4 py-3 text-base rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              เบอร์โทรศัพท์ติดต่อ (หรือรหัสประจำตัว)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="เช่น 0812345678 (ใช้สำหรับกลับเข้ามาทำต่อจากจุดเดิม)"
              className="w-full px-4 py-3 text-base rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-semibold text-base flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.99] cursor-pointer"
          >
            <span>เริ่มเข้าสู่โปรแกรมพัฒนา</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Feature Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-100/70 border border-slate-200/80">
          <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>ไม่ผูกเวลา ว่างเมื่อใดทำต่อได้ทันที</span>
        </div>
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-100/70 border border-slate-200/80">
          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>บันทึกจุดที่ค้างไว้ในระบบเสมอ</span>
        </div>
      </div>

    </div>
  );
};
