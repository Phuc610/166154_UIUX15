import React, { useState } from 'react';
import {
  CalendarPlus, SortAscending, CaretDown,
  DownloadSimple, CalendarBlank, User, Users,
  ChartBar, TrendUp, TrendDown, Clock, CheckCircle
} from '@phosphor-icons/react';

// ── Mock data per report type ──────────────────────────────
const FINANCE_STATS = [
  { label: 'Tổng doanh thu', value: '$124,500', change: '+15%', up: true },
  { label: 'Chi phí hoạt động', value: '$42,300', change: '-3%', up: false },
  { label: 'Lợi nhuận ròng', value: '$82,200', change: '+22%', up: true },
  { label: 'Công nợ chưa thu', value: '$8,700', change: '+5%', up: false },
];

const PATIENTS_STATS = [
  { label: 'Tổng lịch hẹn', value: '856', change: '+8%', up: true },
  { label: 'Bệnh nhân mới', value: '234', change: '+12%', up: true },
  { label: 'Tỷ lệ hoàn thành', value: '91%', change: '+2%', up: true },
  { label: 'Lịch hẹn hủy', value: '47', change: '-5%', up: false },
];

const KPI_STATS = [
  { label: 'KPI trung bình', value: '88%', change: '+4%', up: true },
  { label: 'Tổng giờ làm', value: '3,240h', change: '+1%', up: true },
  { label: 'Ngày nghỉ phép', value: '28 ngày', change: '+3%', up: false },
  { label: 'Đánh giá BN', value: '4.7/5', change: '+0.2', up: true },
];

const PATIENTS_TABLE = [
  { dept: 'Khám tổng quát', total: 312, new: 88, rate: '92%', cancelled: 14 },
  { dept: 'Nhi khoa',       total: 198, new: 64, rate: '89%', cancelled: 11 },
  { dept: 'Tim mạch',       total: 167, new: 42, rate: '94%', cancelled: 8  },
  { dept: 'Nha khoa',       total: 179, new: 40, rate: '90%', cancelled: 14 },
];

const KPI_TABLE = [
  { name: 'Dr. Andrew Billard', dept: 'Tim mạch',      kpi: 91, hours: 168, leave: 2, rating: 4.8, color: 'bg-rose-400' },
  { name: 'Dr. Sarah Connor',   dept: 'Nhi khoa',      kpi: 87, hours: 152, leave: 4, rating: 4.6, color: 'bg-blue-400' },
  { name: 'Dr. Minh Hoàng',     dept: 'Tổng quát',     kpi: 85, hours: 176, leave: 1, rating: 4.7, color: 'bg-amber-400' },
  { name: 'Lê Thị Thanh',       dept: 'Phòng cấp cứu', kpi: 93, hours: 180, leave: 0, rating: 4.9, color: 'bg-emerald-400' },
];

const HISTORY = [
  { name: 'Báo cáo Doanh thu Tháng 4', range: 'Từ 01/04/2026 đến 30/04/2026', fmt: 'XLSX', fmtColor: 'bg-emerald-500', size: '1.2 MB', time: '01/05/2026 - 08:30', status: 'done' },
  { name: 'Danh sách Bệnh nhân mới Quý 1', range: 'Bộ lọc: Khoa Nhi, Khoa Tổng quát', fmt: 'PDF', fmtColor: 'bg-red-500', size: '4.5 MB', time: '28/04/2026 - 15:45', status: 'done' },
  { name: 'KPI & Lương Nhân sự Tháng 4', range: 'Toàn bộ chi nhánh', fmt: 'XLSX', fmtColor: 'bg-emerald-500', size: '—', time: 'Vừa xong', status: 'pending' },
];

const REPORT_TYPES = [
  { id: 'finance',     label: 'Tài chính & Doanh thu', desc: 'Biến động doanh thu, chi tiêu, công nợ', icon: <SortAscending size={24} /> },
  { id: 'patients',    label: 'Lịch hẹn & Bệnh nhân',  desc: 'Tỷ lệ chuyển đổi, bệnh nhân mới/cũ',  icon: <CalendarBlank size={24} /> },
  { id: 'performance', label: 'Hiệu suất KPI',           desc: 'KPI bác sĩ, thống kê giờ làm, ngày nghỉ', icon: <ChartBar size={24} /> },
];

// ── Component ──────────────────────────────────────────────
const ExportReport = () => {
  const [activeReport, setActiveReport] = useState('finance');
  const [period, setPeriod]   = useState('Tháng này (05/2026)');
  const [branch, setBranch]   = useState('Tất cả chi nhánh & khoa');
  const [format, setFormat]   = useState('Excel');
  const [generating, setGenerating] = useState(false);
  const [history, setHistory] = useState(HISTORY);

  const stats = activeReport === 'finance' ? FINANCE_STATS
              : activeReport === 'patients' ? PATIENTS_STATS
              : KPI_STATS;

  const handleGenerate = () => {
    setGenerating(true);
    const reportName =
      activeReport === 'finance'     ? `Báo cáo Tài chính – ${period}` :
      activeReport === 'patients'    ? `Báo cáo Lịch hẹn – ${period}` :
                                       `Báo cáo KPI – ${period}`;
    setTimeout(() => {
      setHistory(prev => [
        {
          name: reportName, range: branch,
          fmt: format === 'Excel' ? 'XLSX' : format.toUpperCase(),
          fmtColor: format === 'Excel' ? 'bg-emerald-500' : 'bg-red-500',
          size: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
          time: new Date().toLocaleString('vi-VN').replace(',', ' -'),
          status: 'done',
        },
        ...prev,
      ]);
      setGenerating(false);
    }, 1800);
  };

  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Xuất Báo cáo</h1>
          <p className="text-sm text-slate-500 mt-1">Tạo và tải về báo cáo theo từng loại dữ liệu</p>
        </div>
        <button
          onClick={() => alert('Tính năng lịch xuất tự động sẽ sớm ra mắt!')}
          className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm"
        >
          <CalendarPlus size={18} /> Lịch xuất tự động
        </button>
      </div>

      {/* REPORT TYPE SELECTOR */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        {REPORT_TYPES.map(rt => (
          <div
            key={rt.id}
            onClick={() => setActiveReport(rt.id)}
            className={`bg-white border rounded-xl p-5 flex flex-col gap-3 cursor-pointer relative transition-all duration-200 ${activeReport === rt.id ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600 shadow-md' : 'border-slate-200 hover:shadow-sm hover:border-slate-300'}`}
          >
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${activeReport === rt.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
              {rt.icon}
            </div>
            <div>
              <h3 className="text-sm font-bold mb-1">{rt.label}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{rt.desc}</p>
            </div>
            {activeReport === rt.id && (
              <div className="absolute top-4 right-4 text-blue-600">
                <CheckCircle size={22} weight="fill" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* PREVIEW STATS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm">
            <p className="text-xs text-slate-500 mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-slate-900 mb-1">{s.value}</p>
            <span className={`inline-flex items-center gap-1 text-xs font-semibold ${s.up ? 'text-emerald-600' : 'text-red-500'}`}>
              {s.up ? <TrendUp size={14} /> : <TrendDown size={14} />} {s.change} so với tháng trước
            </span>
          </div>
        ))}
      </div>

      {/* DETAIL TABLE per report type */}
      {activeReport === 'patients' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 mb-4">Chi tiết lịch hẹn theo khoa</h2>
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-xs font-semibold">
                <th className="pb-3">Khoa / Phòng</th>
                <th className="pb-3">Tổng lịch hẹn</th>
                <th className="pb-3">Bệnh nhân mới</th>
                <th className="pb-3">Tỷ lệ hoàn thành</th>
                <th className="pb-3">Đã hủy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PATIENTS_TABLE.map(row => (
                <tr key={row.dept} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 font-semibold text-slate-800">{row.dept}</td>
                  <td className="py-3 text-slate-600">{row.total}</td>
                  <td className="py-3 text-slate-600">{row.new}</td>
                  <td className="py-3"><span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">{row.rate}</span></td>
                  <td className="py-3 text-red-500 font-medium">{row.cancelled}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeReport === 'performance' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 mb-4">KPI chi tiết từng nhân sự</h2>
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-xs font-semibold">
                <th className="pb-3">Nhân viên</th>
                <th className="pb-3">KPI</th>
                <th className="pb-3">Giờ làm</th>
                <th className="pb-3">Ngày nghỉ</th>
                <th className="pb-3">Đánh giá BN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {KPI_TABLE.map(row => (
                <tr key={row.name} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full ${row.color} flex items-center justify-center text-white text-xs font-bold`}>{row.name.charAt(0)}</div>
                      <div>
                        <p className="font-semibold text-slate-800">{row.name}</p>
                        <p className="text-xs text-slate-400">{row.dept}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${row.kpi >= 90 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${row.kpi}%` }}></div>
                      </div>
                      <span className="font-semibold text-slate-700">{row.kpi}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-slate-600">{row.hours}h</td>
                  <td className="py-3 text-slate-600">{row.leave} ngày</td>
                  <td className="py-3"><span className="font-bold text-amber-600">★ {row.rating}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CONFIG SECTION */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-sm font-bold mb-4 text-slate-800">Cấu hình xuất dữ liệu</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Khoảng thời gian</label>
            <div className="relative">
              <CalendarBlank size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select value={period} onChange={e => setPeriod(e.target.value)}
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg py-2.5 pl-9 pr-9 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-200 outline-none cursor-pointer">
                <option>Tháng này (05/2026)</option>
                <option>Tháng trước (04/2026)</option>
                <option>Quý 1/2026</option>
                <option>Năm 2025</option>
              </select>
              <CaretDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Phạm vi</label>
            <div className="relative">
              <select value={branch} onChange={e => setBranch(e.target.value)}
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg py-2.5 pl-3 pr-9 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-200 outline-none cursor-pointer">
                <option>Tất cả chi nhánh & khoa</option>
                <option>Khoa Nhi</option>
                <option>Khoa Tim mạch</option>
                <option>Khoa Tổng quát</option>
              </select>
              <CaretDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Định dạng</label>
            <div className="relative">
              <select value={format} onChange={e => setFormat(e.target.value)}
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg py-2.5 pl-3 pr-9 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-200 outline-none cursor-pointer">
                <option value="Excel">Microsoft Excel (.xlsx)</option>
                <option value="PDF">PDF Document (.pdf)</option>
                <option value="CSV">CSV (.csv)</option>
              </select>
              <CaretDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors shadow-sm h-[42px] ${generating ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            {generating ? (
              <><Clock size={16} className="animate-spin" /> Đang tạo...</>
            ) : (
              <><DownloadSimple size={18} /> Tạo báo cáo</>
            )}
          </button>
        </div>
      </div>

      {/* HISTORY */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-bold mb-5 text-slate-800">Lịch sử xuất báo cáo ({history.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-xs font-semibold">
                <th className="pb-3 w-1/3">Tên báo cáo</th>
                <th className="pb-3">Định dạng</th>
                <th className="pb-3">Kích thước</th>
                <th className="pb-3">Thời gian tạo</th>
                <th className="pb-3">Trạng thái</th>
                <th className="pb-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className={`${row.fmtColor} text-white text-[10px] font-bold px-1.5 py-1 rounded shrink-0`}>{row.fmt}</div>
                      <div>
                        <p className="font-semibold text-slate-800">{row.name}</p>
                        <p className="text-xs text-slate-400">{row.range}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-slate-600">{row.fmt === 'XLSX' ? 'Excel Spreadsheet' : row.fmt === 'PDF' ? 'PDF Document' : 'CSV'}</td>
                  <td className="py-4 text-slate-600">{row.size}</td>
                  <td className="py-4 text-slate-600">{row.time}</td>
                  <td className="py-4">
                    {row.status === 'done' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Sẵn sàng
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span> Đang xuất...
                      </span>
                    )}
                  </td>
                  <td className="py-4 text-right">
                    {row.status === 'done' ? (
                      <button
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-md font-medium text-slate-700 transition-colors shadow-sm text-xs"
                      >
                        <DownloadSimple size={14} /> Tải về
                      </button>
                    ) : (
                      <button disabled className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-md font-medium text-slate-400 cursor-not-allowed text-xs">
                        Chờ tải...
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ExportReport;
