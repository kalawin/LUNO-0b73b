import React, { useState } from 'react';
import { ApiService } from '../services/api';
import { Database, X, CheckCircle2, ExternalLink } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onResetProgress }) => {
  const [gasUrl, setGasUrl] = useState(ApiService.getGasUrl());
  const [savedStatus, setSavedStatus] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    ApiService.setGasUrl(gasUrl);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  const handleReset = () => {
    if (confirm('คำเตือน: ท่านต้องการรีเซ็ตข้อมูลความก้าวหน้าและเริ่มทำด่านที่ 1 ใหม่ใช่หรือไม่?')) {
      onResetProgress();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-[32px] border border-slate-200/90 max-w-lg w-full p-6 sm:p-7 shadow-2xl relative">
        
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-xl bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-white flex items-center justify-center font-bold shadow-md shadow-teal-500/20">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-lg text-slate-900">การเชื่อมต่อ Google Sheets</h3>
            <p className="text-xs text-slate-500">กำหนดค่า Backend API สำหรับบันทึกผลงานวิจัย</p>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <label className="block font-bold text-xs text-slate-700 uppercase tracking-wider mb-1.5">
              Google Apps Script Web App URL
            </label>
            <input
              type="text"
              value={gasUrl}
              onChange={(e) => setGasUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full px-4 py-3 text-xs font-mono rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 transition"
            />
            <p className="text-[11px] text-slate-400 mt-1.5">
              *หากเว้นว่างไว้ ระบบจะทำงานในโหมดบันทึกข้อมูลในเครื่อง (LocalStorage Mode)
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs space-y-1.5">
            <div className="font-bold text-slate-700 flex items-center gap-1.5">
              <span>Google Sheet ID ปลายทาง:</span>
            </div>
            <p className="font-mono text-[11px] text-slate-600 break-all select-all">
              1LeSBKpY0HW3jjsoRdWmynbQnJGuWE6TyJV5PIq8Zyzk
            </p>
            <a
              href="https://docs.google.com/spreadsheets/d/1LeSBKpY0HW3jjsoRdWmynbQnJGuWE6TyJV5PIq8Zyzk/edit"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 hover:underline font-bold pt-1 cursor-pointer"
            >
              <span>เปิดดู Google Sheet ในแท็บใหม่</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {savedStatus && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>บันทึกการตั้งค่าเรียบร้อยแล้ว</span>
            </div>
          )}

          <div className="pt-3 flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer"
            >
              รีเซ็ตด่านเริ่มต้นใหม่
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer shadow-sm"
            >
              บันทึกการตั้งค่า
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
