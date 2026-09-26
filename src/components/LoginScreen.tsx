import React, { useState } from 'react';
import type { UserProfile } from '../types';
import { BadgeCheck, ArrowRight, Building2, User, BookOpen } from 'lucide-react';
import { SoundService } from '../services/audio';
import { ApiService } from '../services/api';
import { CurriculumModal } from './CurriculumModal';

interface LoginScreenProps {
  onLogin: (profile: UserProfile) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [school, setSchool] = useState('');
  const [error, setError] = useState('');
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstname.trim()) {
      setError('กรุณาระบุชื่อผู้บริหาร');
      return;
    }
    if (!lastname.trim()) {
      setError('กรุณาระบุนามสกุล');
      return;
    }
    if (!school.trim()) {
      setError('กรุณาระบุชื่อโรงเรียน / สถานศึกษา');
      return;
    }

    const fullName = `${firstname.trim()} ${lastname.trim()}`;
    const newProfile: UserProfile = {
      id: `DIR-${Date.now().toString().slice(-6)}`,
      name: fullName,
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      school: school.trim(),
      loginAt: new Date().toISOString()
    };

    SoundService.playSuccess();

    ApiService.saveLocalProfile(newProfile);
    const initialProg = ApiService.getLocalProgress();
    await ApiService.syncProgressToCloud(initialProg);

    // บันทึก Telemetry การลงทะเบียนเข้าชีท data1
    await ApiService.sendTelemetry({
      user_id: newProfile.id,
      ชื่อ: newProfile.firstname,
      นามสกุล: newProfile.lastname,
      โรงเรียน: newProfile.school,
      กิจกรรมล่าสุด: "ลงทะเบียนผู้บริหารสถานศึกษา",
      คะแนนก่อนเรียน: "-",
      คะแนนหลังเรียน: "-",
      สถานะด่าน1: "รอเริ่ม",
      สถานะด่าน2: "รอเริ่ม",
      สถานะด่าน3: "รอเริ่ม",
      สถานะด่าน4: "รอเริ่ม"
    });

    onLogin(newProfile);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-red-950/70 via-zinc-900 to-zinc-950 border border-red-500/30 shadow-2xl">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-200 text-xs sm:text-sm font-semibold mb-4">
            <BadgeCheck className="w-4 h-4 text-red-400" />
            <span>โปรแกรมพัฒนาสมรรถนะแบบไม่ผูกเวลา (Self-Paced)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-snug sm:leading-tight mb-4">
            Luno: โปรแกรมพัฒนา<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-200 to-white">
              ภาวะผู้นำดิจิทัลสำหรับผู้บริหาร
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-zinc-300 font-light leading-relaxed mb-6">
            ออกแบบเฉพาะสำหรับผู้บริหารสถานศึกษาขนาดเล็ก เพื่อก้าวสู่การเป็นผู้นำแห่งการเปลี่ยนแปลง 
            บูรณาการเทคโนโลยีที่คุ้มค่า ปฏิบัติได้จริงใน 4 ด่านต่อเนื่อง
          </p>

          {/* 4 Pillars Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-center hover:border-red-500/50 transition">
              <div className="text-2xl mb-1">📢</div>
              <div className="font-bold text-red-400 text-xs sm:text-sm">ด่านที่ 1</div>
              <div className="text-[11px] text-zinc-400">นักสื่อสารดิจิทัล</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-center hover:border-red-500/50 transition">
              <div className="text-2xl mb-1">🎨</div>
              <div className="font-bold text-white text-xs sm:text-sm">ด่านที่ 2</div>
              <div className="text-[11px] text-zinc-400">นักออกแบบการเรียนรู้</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-center hover:border-red-500/50 transition">
              <div className="text-2xl mb-1">🤝</div>
              <div className="font-bold text-rose-300 text-xs sm:text-sm">ด่านที่ 3</div>
              <div className="text-[11px] text-zinc-400">ต้นแบบทีมงาน</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-center hover:border-red-500/50 transition">
              <div className="text-2xl mb-1">🛡️</div>
              <div className="font-bold text-red-300 text-xs sm:text-sm">ด่านที่ 4</div>
              <div className="text-[11px] text-zinc-400">ผู้นำค่านิยมดิจิทัล</div>
            </div>
          </div>

          {/* Curriculum Structure Button */}
          <div className="mt-5 text-center sm:text-left">
            <button
              type="button"
              onClick={() => setShowCurriculumModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-850 text-red-300 hover:text-white border border-red-500/40 hover:border-red-400 text-xs sm:text-sm font-semibold transition cursor-pointer shadow-md"
            >
              <BookOpen className="w-4 h-4 text-red-400" />
              <span>ดูโครงสร้างหลักสูตรฉบับปรับปรุง 10 องค์ประกอบย่อย (100 คะแนนเต็ม)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Registration Card */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/90 border border-zinc-800 shadow-xl max-w-2xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1.5 flex items-center gap-2">
          <User className="w-5 h-5 text-red-400" />
          ข้อมูลผู้บริหารสถานศึกษา
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm mb-6">
          โปรดกรอกข้อมูลผู้บริหารสถานศึกษาเพื่อใช้ในการบันทึกกิจกรรม ออกวุฒิบัตร และซิงก์ข้อมูลลง Google Sheet อัตโนมัติ
        </p>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-zinc-300 mb-1.5">
                ชื่อผู้บริหาร (พร้อมคำนำหน้า)*
              </label>
              <input
                type="text"
                required
                value={firstname}
                onChange={(e) => { setFirstname(e.target.value); setError(''); }}
                placeholder="เช่น ผอ. สมชาย หรือ น.ส. วันดี"
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 text-sm transition"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-zinc-300 mb-1.5">
                นามสกุล*
              </label>
              <input
                type="text"
                required
                value={lastname}
                onChange={(e) => { setLastname(e.target.value); setError(''); }}
                placeholder="เช่น พัฒนาวิทย์"
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 text-sm transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-zinc-300 mb-1.5">
              ชื่อโรงเรียน / สถานศึกษา*
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400" />
              <input
                type="text"
                required
                value={school}
                onChange={(e) => { setSchool(e.target.value); setError(''); }}
                placeholder="เช่น โรงเรียนบ้านหนองขามหนองแสง หรือ โรงเรียนวัดดอนเจดีย์"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 text-sm transition"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 shadow-lg shadow-red-600/30 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer border border-red-500/40"
            >
              <span>บันทึกข้อมูลและเริ่มทำแบบทดสอบก่อนเรียน</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      <CurriculumModal
        isOpen={showCurriculumModal}
        onClose={() => setShowCurriculumModal(false)}
      />
    </div>
  );
};
