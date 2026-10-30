import React, { useEffect, useRef } from 'react';
import type { UserProfile, UserProgress } from '../types';
import { Award, Printer, TrendingUp, BarChart3, Radar, Home, GraduationCap, CheckCircle2 } from 'lucide-react';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, RadarController, RadialLinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js';

// Register Chart.js components
Chart.register(BarController, BarElement, CategoryScale, LinearScale, RadarController, RadialLinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

interface CertificateViewProps {
  profile: UserProfile;
  progress: UserProgress;
  onBackToDashboard?: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ profile, progress, onBackToDashboard }) => {
  const barChartRef = useRef<HTMLCanvasElement | null>(null);
  const radarChartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstances = useRef<{ bar?: Chart; radar?: Chart }>({});

  const pre = progress.preTestScore ?? 0;
  const post = progress.postTestScore ?? 4;
  const diff = post - pre;
  const growthPct = pre === 0 ? (post * 25) : Math.round((diff / 4) * 100);

  const certCode = progress.certCode || `LUNO-${Math.floor(100000 + Math.random() * 900000)}`;
  const certDate = progress.completionDate || (() => {
    const today = new Date();
    const thMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    return `${today.getDate()} ${thMonths[today.getMonth()]} ${today.getFullYear() + 543}`;
  })();

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    // 1. Render Bar Chart
    if (barChartRef.current) {
      if (chartInstances.current.bar) {
        chartInstances.current.bar.destroy();
      }

      chartInstances.current.bar = new Chart(barChartRef.current, {
        type: 'bar',
        data: {
          labels: ['ก่อนเรียน (Pre-test)', 'หลังเรียน (Post-test)'],
          datasets: [{
            label: 'คะแนนสอบ (เต็ม 4)',
            data: [pre, post],
            backgroundColor: ['#cbd5e1', '#0d9488'],
            borderColor: ['#94a3b8', '#0f766e'],
            borderWidth: 1.5,
            borderRadius: 12,
            maxBarThickness: 56,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 4,
              ticks: { stepSize: 1, color: '#64748b', font: { family: 'Prompt, sans-serif' } },
              grid: { color: '#f1f5f9' }
            },
            x: {
              ticks: { color: '#334155', font: { family: 'Prompt, sans-serif', weight: 'bold' } },
              grid: { display: false }
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0f172a',
              padding: 10,
              cornerRadius: 10,
              titleFont: { family: 'Prompt, sans-serif' },
              bodyFont: { family: 'Prompt, sans-serif' }
            }
          }
        }
      });
    }

    // 2. Render Radar Chart
    if (radarChartRef.current) {
      if (chartInstances.current.radar) {
        chartInstances.current.radar.destroy();
      }

      chartInstances.current.radar = new Chart(radarChartRef.current, {
        type: 'radar',
        data: {
          labels: [
            'การสื่อสารเชิงดิจิทัล',
            'การสร้างวิถีการเรียนรู้',
            'การพัฒนาการทำงานเป็นทีม',
            'การสร้างค่านิยมเชิงดิจิทัล'
          ],
          datasets: [{
            label: 'ระดับสมรรถนะที่บรรลุ (%)',
            data: [95, 92, 98, 96],
            fill: true,
            backgroundColor: 'rgba(13, 148, 136, 0.18)',
            borderColor: '#0d9488',
            borderWidth: 2.5,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#0f766e',
            pointBorderWidth: 2,
            pointRadius: 4.5,
            pointHoverBackgroundColor: '#0f766e',
            pointHoverBorderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              angleLines: { color: '#e2e8f0' },
              grid: { color: '#e2e8f0' },
              pointLabels: { color: '#334155', font: { size: 12, family: 'Prompt, sans-serif', weight: 'bold' } },
              ticks: { backdropColor: 'transparent', color: '#64748b', stepSize: 20 },
              min: 0,
              max: 100
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0f172a',
              padding: 10,
              cornerRadius: 10,
              titleFont: { family: 'Prompt, sans-serif' },
              bodyFont: { family: 'Prompt, sans-serif' }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstances.current.bar) chartInstances.current.bar.destroy();
      if (chartInstances.current.radar) chartInstances.current.radar.destroy();
    };
  }, [pre, post]);

  return (
    <div className="max-w-5xl mx-auto space-y-7 animate-fade-in pb-12">
      
      {/* Action Bar (hidden when printing) */}
      <div className="print:hidden flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 rounded-[28px] bg-white border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">
                ยินดีด้วยครับ! ท่านผ่านโปรแกรมพัฒนา Luno ครบสมบูรณ์
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" /> สำเร็จ
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              ท่านสามารถพิมพ์หรือบันทึกเกียรติบัตรเป็น PDF เพื่อเก็บเป็นหลักฐานการพัฒนาสมรรถนะวิชาชีพ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์ / บันทึก PDF</span>
          </button>
          {onBackToDashboard && (
            <button
              type="button"
              onClick={onBackToDashboard}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              title="กลับหน้าแผนผัง"
            >
              <Home className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Score Summary Metrics (hidden when printing) */}
      <div className="print:hidden grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-[24px] bg-white border border-slate-200/80 text-center shadow-xs">
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">คะแนนก่อนเรียน (Pre-test)</span>
          <div className="text-4xl font-black text-slate-700 mt-2">{pre} <span className="text-sm font-medium text-slate-400">/ 4</span></div>
        </div>

        <div className="p-6 rounded-[24px] bg-teal-50/50 border border-teal-200 text-center shadow-xs">
          <span className="text-xs text-teal-800 uppercase font-bold tracking-wider">คะแนนหลังเรียน (Post-test)</span>
          <div className="text-4xl font-black text-teal-700 mt-2">{post} <span className="text-sm font-medium text-teal-500">/ 4</span></div>
        </div>

        <div className="p-6 rounded-[24px] bg-emerald-50/50 border border-emerald-200 text-center shadow-xs">
          <span className="text-xs text-emerald-800 uppercase font-bold tracking-wider flex items-center justify-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> อัตราพัฒนาการ (Growth)
          </span>
          <div className="text-4xl font-black text-emerald-700 mt-2">
            {diff >= 0 ? `+${growthPct}%` : `${growthPct}%`}
          </div>
        </div>
      </div>

      {/* Charts Grid (Chart.js) (hidden when printing) */}
      <div className="print:hidden grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Bar Chart */}
        <div className="p-6 rounded-[28px] bg-white border border-slate-200/80 shadow-xs">
          <h4 className="font-extrabold text-slate-900 text-sm sm:text-base mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-600" />
            เปรียบเทียบคะแนน Pre-test vs Post-test
          </h4>
          <div className="relative h-64 w-full">
            <canvas ref={barChartRef} />
          </div>
        </div>

        {/* Radar Chart */}
        <div className="p-6 rounded-[28px] bg-white border border-slate-200/80 shadow-xs">
          <h4 className="font-extrabold text-slate-900 text-sm sm:text-base mb-4 flex items-center gap-2">
            <Radar className="w-5 h-5 text-teal-600" />
            ประเมินสมรรถนะภาวะผู้นำ 4 มิติ
          </h4>
          <div className="relative h-64 w-full">
            <canvas ref={radarChartRef} />
          </div>
        </div>
      </div>

      {/* Certificate Printable Card (Executive Academic Certificate) */}
      <div
        id="certificate-printable"
        className="relative overflow-hidden rounded-[28px] p-8 sm:p-14 bg-[#fcfdfa] border-[8px] border-[#0f172a] shadow-xl text-center text-slate-900 print:rounded-none print:shadow-none print:border-[6px] print:m-0"
      >
        {/* Inner Gold Border */}
        <div className="absolute inset-2.5 sm:inset-3 border-2 border-amber-600/60 rounded-xl pointer-events-none" />
        
        {/* Decorative Gold Corners */}
        <div className="absolute top-4 left-4 w-8 sm:w-12 h-8 sm:h-12 border-t-2 border-l-2 border-amber-600 pointer-events-none" />
        <div className="absolute top-4 right-4 w-8 sm:w-12 h-8 sm:h-12 border-t-2 border-r-2 border-amber-600 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-8 sm:w-12 h-8 sm:h-12 border-b-2 border-l-2 border-amber-600 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-8 sm:w-12 h-8 sm:h-12 border-b-2 border-r-2 border-amber-600 pointer-events-none" />

        <div className="max-w-2xl mx-auto space-y-4 relative z-10 py-2">
          {/* Crest / Logo */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-white mx-auto shadow-md shadow-amber-500/20 border-2 border-amber-300">
            <GraduationCap className="w-9 h-9" />
          </div>

          <div className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">
            คณะศึกษาศาสตร์ มหาวิทยาลัยขอนแก่น ร่วมกับ สพป.ขอนแก่น เขต 1
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            เกียรติบัตรรับรองสมรรถนะผู้นำดิจิทัล
          </h2>

          <p className="text-xs sm:text-sm text-slate-500">
            ขอมอบเกียรติบัตรฉบับนี้ให้ไว้เพื่อแสดงว่า
          </p>

          <div className="text-2xl sm:text-3xl font-black text-slate-900 border-b-2 border-amber-500/80 pb-2 inline-block min-w-[280px]">
            {profile.name}
          </div>

          <p className="text-sm sm:text-base text-slate-700 font-medium">
            สถานศึกษา: <span className="text-slate-900 font-bold">{profile.school || 'สถานศึกษาขนาดเล็ก'}</span>
          </p>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed pt-2">
            ได้ผ่านการพัฒนาภาวะผู้นำดิจิทัลของผู้บริหารสถานศึกษาขนาดเล็ก ครบทั้ง 4 โมดูล 10 หน่วยการเรียนรู้
            (การสื่อสารดิจิทัล, การออกแบบวิถีการเรียนรู้, การพัฒนาการทำงานเป็นทีม, การสร้างค่านิยมดิจิทัล)
            ตามเกณฑ์มาตรฐานโปรแกรม LUNO เป็นผลสำเร็จสมบูรณ์
          </p>

          {/* Bottom signatures and certification info */}
          <div className="pt-8 flex justify-between items-end text-xs text-slate-500 border-t border-slate-200 mt-6 px-4">
            <div className="text-left space-y-1">
              <div className="font-bold text-teal-800">รหัสรับรอง: {certCode}</div>
              <div className="text-slate-500">ออกให้ ณ วันที่ {certDate}</div>
            </div>

            <div className="text-center">
              <div className="font-medium text-slate-800 text-xs sm:text-sm mb-1">
                (นายกาลวิน อดทน, นางสาวณัฎฐธิดา ใจอักษร, นางสาวบุษยา ศรีเพชร์)
              </div>
              <div className="border-t border-slate-300 pt-1 text-slate-500 text-[11px]">
                คณะผู้พัฒนาโปรแกรมและงานวิจัย LUNO
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
