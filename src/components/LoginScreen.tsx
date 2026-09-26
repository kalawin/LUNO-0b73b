import React, { useState } from 'react';
import type { UserProfile } from '../types';
import { BadgeCheck, ArrowRight, Building2, User, BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
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
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="max-w-4xl mx-auto px-4 py-8 space-y-8"
    >
      {/* Hero Banner (Executive Academic White & Emerald/Teal Glow) */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/40 border border-slate-200/90 shadow-lg shadow-slate-200/50 backdrop-blur-md">
        <div className="max-w-3xl relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs sm:text-sm font-semibold mb-4 shadow-2xs"
          >
            <BadgeCheck className="w-4 h-4 text-emerald-600" />
            <span>โปรแกรมพัฒนาสมรรถนะแบบไม่ผูกเวลา (Self-Paced)</span>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-snug sm:leading-tight mb-4">
            Luno: โปรแกรมพัฒนา<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600">
              ภาวะผู้นำดิจิทัลสำหรับผู้บริหาร
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed mb-6">
            ออกแบบเฉพาะสำหรับผู้บริหารสถานศึกษาขนาดเล็ก เพื่อก้าวสู่การเป็นผู้นำแห่งการเปลี่ยนแปลง 
            บูรณาการเทคโนโลยีที่คุ้มค่า ปฏิบัติได้จริงใน 4 ด่านต่อเนื่อง
          </p>

          {/* 4 Pillars Cards Grid (เขียว-ฟ้า 4 เฉด) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
            <motion.div
              whileHover={{ y: -3, scale: 1.02 }}
              className="p-4 rounded-2xl bg-white/90 border border-slate-200/90 hover:border-emerald-300 text-center shadow-xs transition"
            >
              <div className="text-2xl mb-1.5">📢</div>
              <div className="font-bold text-emerald-700 text-sm sm:text-base">ด่านที่ 1</div>
              <div className="text-xs text-slate-600 font-medium mt-0.5">นักสื่อสารดิจิทัล</div>
            </motion.div>

            <motion.div
              whileHover={{ y: -3, scale: 1.02 }}
              className="p-4 rounded-2xl bg-white/90 border border-slate-200/90 hover:border-teal-300 text-center shadow-xs transition"
            >
              <div className="text-2xl mb-1.5">🎨</div>
              <div className="font-bold text-teal-700 text-sm sm:text-base">ด่านที่ 2</div>
              <div className="text-xs text-slate-600 font-medium mt-0.5">นักออกแบบการเรียนรู้</div>
            </motion.div>

            <motion.div
              whileHover={{ y: -3, scale: 1.02 }}
              className="p-4 rounded-2xl bg-white/90 border border-slate-200/90 hover:border-sky-300 text-center shadow-xs transition"
            >
              <div className="text-2xl mb-1.5">🤝</div>
              <div className="font-bold text-sky-700 text-sm sm:text-base">ด่านที่ 3</div>
              <div className="text-xs text-slate-600 font-medium mt-0.5">ต้นแบบทีมงาน</div>
            </motion.div>

            <motion.div
              whileHover={{ y: -3, scale: 1.02 }}
              className="p-4 rounded-2xl bg-white/90 border border-slate-200/90 hover:border-cyan-300 text-center shadow-xs transition"
            >
              <div className="text-2xl mb-1.5">🛡️</div>
              <div className="font-bold text-cyan-800 text-sm sm:text-base">ด่านที่ 4</div>
              <div className="text-xs text-slate-600 font-medium mt-0.5">ผู้นำค่านิยมดิจิทัล</div>
            </motion.div>
          </div>

          {/* Curriculum Structure Button */}
          <div className="mt-6 text-center sm:text-left">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setShowCurriculumModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-teal-50 text-teal-800 border border-teal-300 hover:border-teal-400 text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs"
            >
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>ดูโครงสร้างหลักสูตรฉบับปรับปรุง 10 องค์ประกอบย่อย (100 คะแนนเต็ม)</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Registration Card (Executive Form) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl p-6 sm:p-8 bg-white border border-slate-200/90 shadow-xl shadow-slate-200/60 max-w-2xl mx-auto"
      >
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <User className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            ข้อมูลผู้บริหารสถานศึกษา
          </h2>
        </div>
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          โปรดกรอกข้อมูลผู้บริหารสถานศึกษาเพื่อใช้ในการบันทึกกิจกรรม ออกวุฒิบัตร และซิงก์ข้อมูลลง Google Sheet อัตโนมัติ
        </p>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                ชื่อผู้บริหาร (พร้อมคำนำหน้า)*
              </label>
              <input
                type="text"
                required
                value={firstname}
                onChange={(e) => { setFirstname(e.target.value); setError(''); }}
                placeholder="เช่น ผอ. สมชาย หรือ น.ส. วันดี"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20 text-base transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                นามสกุล*
              </label>
              <input
                type="text"
                required
                value={lastname}
                onChange={(e) => { setLastname(e.target.value); setError(''); }}
                placeholder="เช่น พัฒนาวิทย์"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20 text-base transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              ชื่อโรงเรียน / สถานศึกษา*
            </label>
            <div className="relative">
              <Building2 className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                required
                value={school}
                onChange={(e) => { setSchool(e.target.value); setError(''); }}
                placeholder="เช่น โรงเรียนบ้านหนองขามหนองแสง หรือ โรงเรียนวัดดอนเจดีย์"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20 text-base transition"
              />
            </div>
          </div>

          <div className="pt-3">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full py-4 px-6 rounded-2xl font-bold text-base sm:text-lg text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-teal-600/25 active:scale-[0.99] transition flex items-center justify-center gap-2.5 cursor-pointer border border-teal-500/30"
            >
              <Sparkles className="w-5 h-5" />
              <span>บันทึกข้อมูลและเริ่มทำแบบทดสอบก่อนเรียน</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </form>
      </motion.div>

      <CurriculumModal
        isOpen={showCurriculumModal}
        onClose={() => setShowCurriculumModal(false)}
      />
    </motion.div>
  );
};
