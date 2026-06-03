import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarBlank, VideoCamera, X as XIcon, ArrowRight,
  ChatCircle, VideoCamera as VideoIcon, CheckCircle,
  DotsThreeVertical, CaretDown, Clock
} from '@phosphor-icons/react';

// ─── Types ──────────────────────────────────────────────────────────────────
interface ApptRow {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  mode: 'Online' | 'Trực tiếp';
  status: 'done' | 'checkin' | 'cancelled' | 'scheduled';
  fee: string;
  initials: string;
  avatarBg: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────
const APPOINTMENTS: ApptRow[] = [
  { id: 'a1', name: 'Nguyễn Hồng Minh',  phone: '+84 42470755', date: '27 Tháng 5 2025', time: '09:30', mode: 'Online',    status: 'done',      fee: '$400', initials: 'NM', avatarBg: 'bg-red-200' },
  { id: 'a2', name: 'Nguyễn Hồng Trang', phone: '+84 42470756', date: '26 Tháng 5 2025', time: '10:15', mode: 'Online',    status: 'checkin',   fee: '$370', initials: 'NT', avatarBg: 'bg-amber-200' },
  { id: 'a3', name: 'Nguyễn Hồng Lam',   phone: '+84 42470757', date: '25 Tháng 5 2025', time: '14:40', mode: 'Trực tiếp', status: 'cancelled', fee: '$450', initials: 'NL', avatarBg: 'bg-emerald-200' },
  { id: 'a4', name: 'Nguyễn Hồng Lâm',   phone: '+84 42470758', date: '24 Tháng 5 2025', time: '11:30', mode: 'Trực tiếp', status: 'scheduled', fee: '$310', initials: 'NL', avatarBg: 'bg-sky-200' },
  { id: 'a5', name: 'Nguyễn Hồng Phúc',  phone: '+84 42470759', date: '23 Tháng 5 2025', time: '16:10', mode: 'Online',    status: 'scheduled', fee: '$400', initials: 'NP', avatarBg: 'bg-purple-200' },
];

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  done:      { label: 'Đã hoàn tất', className: 'bg-emerald-100 text-emerald-700 border border-emerald-200' },
  checkin:   { label: 'Đã check-in', className: 'bg-amber-100  text-amber-700  border border-amber-200' },
  cancelled: { label: 'Đã hủy',      className: 'bg-red-100    text-red-700    border border-red-200' },
  scheduled: { label: 'Đã lên lịch', className: 'bg-blue-100   text-blue-700   border border-blue-200' },
};

const WORK_SCHEDULE = [
  { day: 'Thứ 2', hours: '8:00 – 19:30', closed: false },
  { day: 'Thứ 3', hours: '8:00 – 19:30', closed: false },
  { day: 'Thứ 4', hours: '8:00 – 19:30', closed: false },
  { day: 'Thứ 5', hours: '8:00 – 19:30', closed: false },
  { day: 'Thứ 6', hours: '8:00 – 19:30', closed: false },
  { day: 'Thứ 7', hours: '8:00 – 17:30', closed: false },
  { day: 'Chủ Nhật', hours: 'Đóng cửa', closed: true },
];

// Mini bar chart data
const BAR_DATA_APPT    = [35, 55, 42, 68, 52, 78, 65];
const BAR_DATA_ONLINE  = [20, 45, 30, 55, 40, 60, 50];
const BAR_DATA_CANCEL  = [8,  12, 6,  15, 10, 18, 14];

// ─── Sub-components ───────────────────────────────────────────────────────────
const MiniBarChart = ({
  data,
  colorClass,
  height = 36,
}: {
  data: number[];
  colorClass: string;
  height?: number;
}) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-0.5" style={{ height }}>
      {data.map((v, i) => (
        <div
          key={i}
          className={`flex-1 rounded-sm ${colorClass} opacity-80 transition-all`}
          style={{ height: `${(v / max) * 100}%` }}
        />
      ))}
    </div>
  );
};

// Donut chart (pure SVG)
const DonutChart = () => {
  // 260 done, 21 processing, 50 cancelled
  const total = 331;
  const done = 260;
  const processing = 21;
  const cancelled = 50;

  const r = 60;
  const cx = 80;
  const cy = 80;
  const circum = 2 * Math.PI * r;

  const doneRatio = done / total;
  const procRatio = processing / total;
  const cancRatio = cancelled / total;

  const doneLen = doneRatio * circum;
  const procLen = procRatio * circum;
  const cancLen = cancRatio * circum;

  return (
    <svg viewBox="0 0 160 160" className="w-40 h-40">
      {/* Background */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={20} />
      {/* Done */}
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke="#22c55e" strokeWidth={20}
        strokeDasharray={`${doneLen} ${circum - doneLen}`}
        strokeDashoffset={circum * 0.25}
        strokeLinecap="butt"
      />
      {/* Processing */}
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke="#f59e0b" strokeWidth={20}
        strokeDasharray={`${procLen} ${circum - procLen}`}
        strokeDashoffset={circum * 0.25 - doneLen}
        strokeLinecap="butt"
      />
      {/* Cancelled */}
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke="#ef4444" strokeWidth={20}
        strokeDasharray={`${cancLen} ${circum - cancLen}`}
        strokeDashoffset={circum * 0.25 - doneLen - procLen}
        strokeLinecap="butt"
      />
      {/* Center text */}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="20" fontWeight="700" fill="#0f172a">65%</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="9" fill="#94a3b8">Hoàn thành</text>
    </svg>
  );
};

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [filterMode, setFilterMode] = useState<string>('Theo tuần');
  const [detailRow, setDetailRow] = useState<ApptRow | null>(null);

  return (
    <div id="doctor-dashboard-main">
          {/* Page title */}
          <h1 className="text-xl font-bold text-slate-900 mb-5">Trang tổng quan bác sĩ</h1>

          {/* ── Stat Cards ─────────────────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-4 mb-6">

            {/* Card 1: Tổng số lịch hẹn */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-default">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Tổng số lịch hẹn</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-slate-900">658</span>
                    <span className="mb-1 text-xs font-semibold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">+89%</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <CalendarBlank size={20} className="text-blue-600" weight="fill" />
                </div>
              </div>
              <MiniBarChart data={BAR_DATA_APPT} colorClass="bg-blue-500" height={36} />
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-xs text-emerald-600 font-semibold">+21%</span>
                <span className="text-xs text-slate-400">trong 7 ngày qua</span>
              </div>
            </div>

            {/* Card 2: Tư vấn trực tuyến */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-orange-200 transition-all cursor-default">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Tư vấn trực tuyến</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-slate-900">125</span>
                    <span className="mb-1 text-xs font-semibold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">-15%</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                  <VideoCamera size={20} className="text-orange-500" weight="fill" />
                </div>
              </div>
              <MiniBarChart data={BAR_DATA_ONLINE} colorClass="bg-orange-400" height={36} />
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-xs text-emerald-600 font-semibold">+21%</span>
                <span className="text-xs text-slate-400">trong 7 ngày qua</span>
              </div>
            </div>

            {/* Card 3: Lịch hẹn đã hủy */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all cursor-default">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Lịch hẹn đã hủy</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-slate-900">35</span>
                    <span className="mb-1 text-xs font-semibold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">+45%</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <CheckCircle size={20} className="text-emerald-500" weight="fill" />
                </div>
              </div>
              <MiniBarChart data={BAR_DATA_CANCEL} colorClass="bg-emerald-400" height={36} />
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-xs text-emerald-600 font-semibold">+31%</span>
                <span className="text-xs text-slate-400">trong 7 ngày qua</span>
              </div>
            </div>
          </div>

          {/* ── Appointments Table ──────────────────────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-6">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Lịch hẹn gần đây</h2>
              <div className="relative">
                <select
                  value={filterMode}
                  onChange={e => setFilterMode(e.target.value)}
                  className="appearance-none bg-white border border-slate-200 rounded-lg py-1.5 pl-3 pr-8 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
                  aria-label="Lọc theo thời gian"
                >
                  <option>Theo tuần</option>
                  <option>Theo tháng</option>
                  <option>Hôm nay</option>
                </select>
                <CaretDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" aria-label="Danh sách lịch hẹn">
                <thead>
                  <tr className="text-xs font-semibold text-slate-500 border-b border-slate-100">
                    <th className="px-6 py-3 font-semibold">Bệnh nhân</th>
                    <th className="px-4 py-3 font-semibold">Ngày &amp; giờ</th>
                    <th className="px-4 py-3 font-semibold">Hình thức</th>
                    <th className="px-4 py-3 font-semibold">Trạng thái</th>
                    <th className="px-4 py-3 font-semibold">Phí khám</th>
                    <th className="px-4 py-3 font-semibold"></th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-50">
                  {APPOINTMENTS.map(row => (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full ${row.avatarBg} flex items-center justify-center shrink-0`}>
                            <span className="text-xs font-bold text-slate-700">{row.initials}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 text-sm">{row.name}</div>
                            <div className="text-xs text-slate-400">{row.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 text-sm">
                        {row.date} – {row.time}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-medium px-2 py-1 rounded ${row.mode === 'Online' ? 'bg-slate-100 text-slate-600' : 'bg-violet-50 text-violet-700'}`}>
                          {row.mode}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${STATUS_CONFIG[row.status].className}`}>
                          {STATUS_CONFIG[row.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">{row.fee}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            title="Xem chi tiết"
                            onClick={() => setDetailRow(row)}
                            aria-label={`Xem chi tiết lịch hẹn của ${row.name}`}
                            className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            title="Menu thêm"
                            aria-label="Menu thêm"
                            className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                          >
                            <DotsThreeVertical size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Bottom 3 Panels ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-4">

            {/* Panel 1: Lịch hẹn sắp tới */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-900">Lịch hẹn sắp tới</h2>
                <div className="relative">
                  <select className="appearance-none bg-white border border-slate-200 rounded-lg py-1 pl-2.5 pr-6 text-xs font-semibold text-slate-600 focus:outline-none cursor-pointer">
                    <option>Hôm nay</option>
                    <option>Tuần này</option>
                  </select>
                  <CaretDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Doctor info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center shrink-0">
                  <span className="font-bold text-slate-700">TM</span>
                </div>
                <div>
                  <div className="font-semibold text-sm text-slate-900">Hoàng Thị Mai</div>
                  <div className="text-xs text-slate-400">#BN455898</div>
                </div>
              </div>

              {/* Appointment info */}
              <div className="bg-slate-50 rounded-xl p-3.5 mb-4 border border-slate-100">
                <div className="font-semibold text-sm text-slate-900 mb-3">Tái khám thần kinh</div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <CalendarBlank size={13} className="text-slate-400" />
                    <span>Hôm nay</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} className="text-slate-400" />
                    <span>10:00 SA</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mt-2">
                  <div>
                    <span className="text-slate-400 text-[10px] block mb-0.5">Khoa</span>
                    <span className="font-medium text-slate-700">Thần kinh</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block mb-0.5">Loại khám</span>
                    <span className="font-medium text-slate-700">Tư vấn trực tuyến</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/doctor/messages?call=true&contact=c4')}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 mb-3 active:scale-[0.98]"
                aria-label="Tư vấn trực tuyến"
              >
                <VideoCamera size={16} weight="fill" />
                Tư vấn trực tuyến
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/doctor/messages?contact=c4')}
                  className="flex-1 py-2 border border-slate-200 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]"
                  aria-label="Nhắn tin"
                >
                  <ChatCircle size={14} />
                  Nhắn tin
                </button>
                <button
                  onClick={() => navigate('/doctor/messages?call=true')}
                  className="flex-1 py-2 border border-slate-200 bg-white text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]"
                  aria-label="Gọi video"
                >
                  <VideoIcon size={14} />
                  Gọi video
                </button>
              </div>
            </div>

            {/* Panel 2: Thống kê lịch hẹn */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-900">Thống kê lịch hẹn</h2>
                <div className="relative">
                  <select className="appearance-none bg-white border border-slate-200 rounded-lg py-1 pl-2.5 pr-6 text-xs font-semibold text-slate-600 focus:outline-none cursor-pointer">
                    <option>Theo tháng</option>
                    <option>Theo tuần</option>
                  </select>
                  <CaretDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>

              <div className="flex justify-center mb-4">
                <DonutChart />
              </div>

              {/* Legend */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1.5 mb-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    <span className="text-[10px] text-slate-500">Hoàn tất</span>
                  </div>
                  <div className="font-bold text-slate-900 text-sm">260</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1.5 mb-0.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                    <span className="text-[10px] text-slate-500">Chờ xử lý</span>
                  </div>
                  <div className="font-bold text-slate-900 text-sm">21</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1.5 mb-0.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                    <span className="text-[10px] text-slate-500">Đã hủy</span>
                  </div>
                  <div className="font-bold text-slate-900 text-sm">50</div>
                </div>
              </div>
            </div>

            {/* Panel 3: Lịch làm việc */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-900">Lịch làm việc</h2>
                <div className="relative">
                  <select className="appearance-none bg-white border border-slate-200 rounded-lg py-1 pl-2.5 pr-6 text-xs font-semibold text-slate-600 focus:outline-none cursor-pointer">
                    <option>Trustcare Clinic</option>
                  </select>
                  <CaretDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col divide-y divide-slate-50">
                {WORK_SCHEDULE.map(({ day, hours, closed }) => (
                  <div key={day} className="flex items-center justify-between py-2">
                    <span className={`text-sm font-medium ${closed ? 'text-slate-400' : 'text-slate-700'}`}>{day}</span>
                    {closed ? (
                      <span className="text-xs font-semibold text-red-500 flex items-center gap-1">
                        <XIcon size={12} />
                        {hours}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Clock size={12} className="text-slate-400" />
                        {hours}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <button
                className="w-full mt-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                aria-label="Chỉnh sửa lịch làm việc"
              >
                Chỉnh sửa lịch làm việc
              </button>
            </div>
          </div>      {/* ── Detail Modal ──────────────────────────────────────────────────────── */}
      {detailRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setDetailRow(null)}
            aria-hidden="true"
          />
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 id="modal-title" className="text-base font-bold text-slate-900">Chi tiết lịch hẹn</h2>
              <button
                onClick={() => setDetailRow(null)}
                aria-label="Đóng"
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
              >
                <XIcon size={18} weight="bold" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 flex flex-col gap-4">
              <span className={`inline-flex self-start px-3 py-1 rounded-full text-xs font-semibold ${STATUS_CONFIG[detailRow.status].className}`}>
                {STATUS_CONFIG[detailRow.status].label}
              </span>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className={`w-12 h-12 rounded-full ${detailRow.avatarBg} flex items-center justify-center shrink-0`}>
                  <span className="text-sm font-bold text-slate-700">{detailRow.initials}</span>
                </div>
                <div>
                  <div className="font-bold text-slate-900">{detailRow.name}</div>
                  <div className="text-sm text-slate-500">{detailRow.phone}</div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl border border-slate-100 divide-y divide-slate-100">
                {[
                  { label: 'Ngày & giờ', value: `${detailRow.date} – ${detailRow.time}` },
                  { label: 'Hình thức', value: detailRow.mode },
                  { label: 'Phí khám', value: detailRow.fee, highlight: true },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center px-4 py-3">
                    <span className="text-xs text-slate-500">{item.label}</span>
                    <span className={`text-sm font-semibold ${item.highlight ? 'text-blue-700 text-base' : 'text-slate-900'}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => setDetailRow(null)}
                className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => setDetailRow(null)}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <ArrowRight size={16} weight="bold" />
                Xem lịch hẹn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
