import React, { useEffect, useRef } from 'react';
import type { UserProfile, UserProgress } from '../types';
import { Award, Printer, TrendingUp, BarChart3, Radar, Home } from 'lucide-react';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, RadarController, RadialLinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
Chart.register(BarController, BarElement, CategoryScale, LinearScale, RadarController, RadialLinearScale, PointElement, LineElement, Tooltip, Legend);

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
    const thMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
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
            backgroundColor: ['rgba(113, 113, 122, 0.75)', 'rgba(239, 68, 68, 0.85)'],
            borderColor: ['#a1a1aa', '#ef4444'],
            borderWidth: 2,
            borderRadius: 8,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 4,
              ticks: { stepSize: 1, color: '#a1a1aa' },
              grid: { color: 'rgba(255, 255, 255, 0.08)' }
            },
            x: {
              ticks: { color: '#f4f4f5' },
              grid: { display: false }
            }
          },
          plugins: {
            legend: { display: false }
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
            'นักสื่อสารดิจิทัล',
            'นักออกแบบการเรียนรู้',
            'ต้นแบบทีมงาน',
            'ผู้นำค่านิยมดิจิทัล'
          ],
          datasets: [{
            label: 'ระดับสมรรถนะที่บรรลุ (%)',
            data: [95, 92, 98, 96],
            fill: true,
            backgroundColor: 'rgba(239, 68, 68, 0.25)',
            borderColor: '#ef4444',
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#dc2626',
            pointHoverBackgroundColor: '#dc2626',
            pointHoverBorderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              angleLines: { color: 'rgba(255, 255, 255, 0.12)' },
              grid: { color: 'rgba(255, 255, 255, 0.12)' },
              pointLabels: { color: '#f4f4f5', font: { size: 11 } },
              ticks: { backdropColor: 'transparent', color: '#a1a1aa', stepSize: 20 },
              min: 0,
              max: 100
            }
          },
          plugins: {
            legend: { display: false }
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
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Action Bar (hidden when printing) */}
      <div className="print:hidden flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-zinc-900/90 border border-red-500/30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center font-bold shadow-lg shadow-red-600/30">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base sm:text-lg">
              ยินดีด้วยครับ! ท่านผ่านโปรแกรมพัฒนา Luno ครบสมบูรณ์
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              ท่านสามารถพิมพ์หรือบันทึกเกียรติบัตรเป็น PDF เพื่อเก็บเป็นหลักฐานการพัฒนาสมรรถนะ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition cursor-pointer border border-red-500/40"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์ / บันทึกเป็น PDF</span>
          </button>
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition cursor-pointer"
              title="กลับหน้าแผนผัง"
            >
              <Home className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Score Summary Metrics (hidden when printing) */}
      <div className="print:hidden grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 text-center shadow-lg">
          <span className="text-xs text-zinc-400 uppercase font-semibold">คะแนนก่อนเรียน (Pre-test)</span>
          <div className="text-4xl font-extrabold text-zinc-300 mt-2">{pre} / 4</div>
        </div>

        <div className="p-6 rounded-3xl bg-zinc-900/80 border border-red-500/40 text-center shadow-lg">
          <span className="text-xs text-red-300 uppercase font-semibold">คะแนนหลังเรียน (Post-test)</span>
          <div className="text-4xl font-extrabold text-red-400 mt-2">{post} / 4</div>
        </div>

        <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-700 text-center shadow-lg">
          <span className="text-xs text-white uppercase font-semibold flex items-center justify-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> อัตราพัฒนาการ (Growth)
          </span>
          <div className="text-4xl font-extrabold text-white mt-2">
            {diff >= 0 ? `+${growthPct}%` : `${growthPct}%`}
          </div>
        </div>
      </div>

      {/* Charts Grid (Chart.js) (hidden when printing) */}
      <div className="print:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 shadow-lg">
          <h4 className="font-bold text-white text-sm sm:text-base mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-red-400" />
            เปรียบเทียบคะแนน Pre-test vs Post-test
          </h4>
          <div className="relative h-64 w-full">
            <canvas ref={barChartRef} />
          </div>
        </div>

        {/* Radar Chart */}
        <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 shadow-lg">
          <h4 className="font-bold text-white text-sm sm:text-base mb-4 flex items-center gap-2">
            <Radar className="w-5 h-5 text-red-400" />
            ประเมินสมรรถนะภาวะผู้นำ 4 มิติ
          </h4>
          <div className="relative h-64 w-full">
            <canvas ref={radarChartRef} />
          </div>
        </div>
      </div>

      {/* Certificate Printable Card */}
      <div id="certificate-printable" className="relative overflow-hidden rounded-3xl p-8 sm:p-14 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black border-4 border-red-600 shadow-2xl text-center text-white">
        {/* Decorative Corners in Red */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-red-500 pointer-events-none" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-red-500 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-red-500 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-red-500 pointer-events-none" />

        <div className="max-w-2xl mx-auto space-y-4">
          <div className="text-4xl mb-1">🎓</div>
          <div className="text-xs uppercase tracking-widest text-red-300 font-bold">
            คณะศึกษาศาสตร์ มหาวิทยาลัยขอนแก่น
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-white to-red-200">
            เกียรติบัตรรับรองสมรรถนะ
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300">
            มอบให้ไว้เพื่อแสดงว่า
          </p>

          <div className="text-2xl sm:text-3xl font-black text-red-400 border-b border-red-500/50 pb-2 inline-block min-w-[280px]">
            {profile.name}
          </div>

          <p className="text-sm sm:text-base text-zinc-200 font-medium">
            สถานศึกษา: <span className="text-white font-semibold">{profile.school || '-'}</span>
          </p>

          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed pt-2">
            ได้ผ่านการพัฒนาภาวะผู้นำดิจิทัลครบทั้ง 4 ด่านต่อเนื่อง (นักสื่อสารดิจิทัล, นักออกแบบการเรียนรู้, ต้นแบบทีมงาน, ผู้นำค่านิยมดิจิทัล) ตามเกณฑ์โปรแกรม Luno อย่างสมบูรณ์
          </p>

          <div className="pt-8 flex justify-between items-end text-xs text-zinc-400 border-t border-zinc-800 mt-6 px-4">
            <div className="text-left space-y-1">
              <div className="font-semibold text-red-400">รหัสรับรอง: {certCode}</div>
              <div>ออกให้ ณ วันที่: {certDate}</div>
            </div>

            <div className="text-center">
              <div className="font-serif italic text-white text-sm mb-1">(กาลวิน อดทน)</div>
              <div className="border-t border-zinc-700 pt-1 text-zinc-300">ผู้พัฒนาโปรแกรม Luno</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
