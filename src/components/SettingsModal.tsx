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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl relative">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900">การเชื่อมต่อ Google Sheets</h3>
            <p className="text-xs text-slate-500">กำหนดค่า Backend API สำหรับบันทึกผลงานวิจัย</p>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Google Apps Script Web App URL
            </label>
            <input
              type="text"
              value={gasUrl}
              onChange={(e) => setGasUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              *หากเว้นว่างไว้ ระบบจะทำงานในโหมดบันทึกข้อมูลในเครื่อง (LocalStorage Mode)
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
            <div className="font-semibold text-slate-700 flex items-center gap-1.5">
              <span>Google Sheet ID ปลายทาง:</span>
            </div>
            <p className="font-mono text-[11px] text-slate-600 break-all select-all">
              1LeSBKpY0HW3jjsoRdWmynbQnJGuWE6TyJV5PIq8Zyzk
            </p>
            <a
              href="https://docs.google.com/spreadsheets/d/1LeSBKpY0HW3jjsoRdWmynbQnJGuWE6TyJV5PIq8Zyzk/edit"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-indigo-600 hover:underline font-medium pt-1"
            >
              <span>เปิดดู Google Sheet ในแท็บใหม่</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {savedStatus && (
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>บันทึกการตั้งค่าเรียบร้อยแล้ว</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-3 py-2 rounded-lg font-medium transition"
            >
              รีเซ็ตด่านเริ่มต้นใหม่
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition"
            >
              บันทึกการตั้งค่า
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
