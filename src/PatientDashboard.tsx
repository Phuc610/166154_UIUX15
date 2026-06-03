import { useState } from 'react';
import {
  Eye, Download, Scales, Ruler, Drop, Thermometer,
  TrendUp, Wind, FileText
} from '@phosphor-icons/react';
import NewAppointmentModal from './NewAppointmentModal';

const PatientDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center px-8 pt-6 pb-5">
        <h1 className="text-2xl font-bold text-slate-900">Tổng quan Bệnh nhân</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors text-sm flex items-center gap-2">
          <span>+</span> Đặt lịch khám
        </button>
      </div>
      <div className="mx-8 border-b border-slate-300" />

      {/* Content */}
      <div className="p-8">

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-300 flex flex-col justify-between h-[140px]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-700 shrink-0"></div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Tổng số cuộc hẹn</div>
              <div className="text-2xl font-bold text-slate-900">24</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded text-[10px]">+66%</span>
            <span className="text-slate-400">trong 7 ngày qua</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-[140px]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500 shrink-0"></div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Tư vấn trực tuyến</div>
              <div className="text-2xl font-bold text-slate-900">36</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded text-[10px]">-15%</span>
            <span className="text-slate-400">trong 7 ngày qua</span>
          </div>
        </div>

        {/* Card 3 - Health Score */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 h-[140px] relative overflow-hidden">
          <div className="flex justify-between items-start mb-1 relative z-10">
            <div>
              <div className="text-xs text-slate-500 font-medium mb-1">Điểm sức khỏe (AI)</div>
              <div className="bg-green-100 text-green-700 text-[11px] font-bold px-2 py-0.5 rounded inline-block">Rất tốt</div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-slate-900">89</span>
              <span className="text-sm text-slate-400 font-medium"> /100</span>
            </div>
          </div>
          <svg className="absolute bottom-0 left-0 w-full h-[75px]" viewBox="0 0 300 52" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="hsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon points="15,40 48,31 81,34 115,26 150,28 184,21 218,18 252,15 285,11 285,52 15,52" fill="url(#hsGrad)" />
            <polyline points="15,40 48,31 81,34 115,26 150,28 184,21 218,18 252,15 285,11" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx="15" cy="40" r="2" fill="#3b82f6" stroke="#3b82f6" strokeWidth="2" />
            <circle cx="48" cy="31" r="2" fill="#3b82f6" stroke="#3b82f6" strokeWidth="2" />
            <circle cx="81" cy="34" r="2" fill="#3b82f6" stroke="#3b82f6" strokeWidth="2" />
            <circle cx="115" cy="26" r="2" fill="#3b82f6" stroke="#3b82f6" strokeWidth="2" />
            <circle cx="150" cy="28" r="2" fill="#3b82f6" stroke="#3b82f6" strokeWidth="2" />
            <circle cx="184" cy="21" r="2" fill="#3b82f6" stroke="#3b82f6" strokeWidth="2" />
            <circle cx="218" cy="18" r="2" fill="#3b82f6" stroke="#3b82f6" strokeWidth="2" />
            <circle cx="252" cy="15" r="2" fill="#3b82f6" stroke="#3b82f6" strokeWidth="2" />
            <circle cx="285" cy="11" r="2" fill="#3b82f6" stroke="#3b82f6" strokeWidth="2" />
          </svg>
        </div>

        {/* Card 4 - Heart Rate */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 h-[140px] relative overflow-hidden">
          <div className="flex justify-between items-start mb-1 relative z-10">
            <div>
              <div className="text-xs text-slate-500 font-medium mb-1">Nhịp tim (Bpm)</div>
              <div className="bg-red-50 text-red-500 text-[11px] font-bold px-2 py-0.5 rounded inline-block border border-red-100">+5%</div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-slate-900">87</span>
              <span className="text-sm text-slate-400 font-medium ml-1">bpm</span>
            </div>
          </div>
          <svg className="absolute bottom-0 left-0 w-full h-[72px]" viewBox="0 0 300 52" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15,34 C45,34 58,16 88,18 C118,20 132,38 162,37 C192,36 220,31 252,29 C268,28 278,31 285,31" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* 3 Columns Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Bác sĩ của tôi */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 mb-5">Bác sĩ của tôi</h2>
          <div className="flex flex-col gap-5">
            {[
              { name: "BS. Mick Thompson", spec: "Tim mạch", bg: "bg-blue-100", count: 20 },
              { name: "BS. Sarah Johnson", spec: "Chỉnh hình", bg: "bg-red-300", count: 15 },
              { name: "BS. Emily Carter", spec: "Nhi khoa", bg: "bg-blue-300", count: 12 },
              { name: "BS. David Lee", spec: "Phụ khoa", bg: "bg-yellow-400", count: 3 },
            ].map((doc, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${doc.bg}`}></div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{doc.name}</div>
                    <div className="text-xs text-slate-400 font-medium">{doc.spec}</div>
                  </div>
                </div>
                <div className="border border-red-200 text-red-500 bg-red-50 text-[10px] font-bold px-2 py-1 rounded">
                  {doc.count < 10 ? `0${doc.count}` : doc.count} Lần khám
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Đơn thuốc */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 mb-5">Đơn thuốc</h2>
          <div className="flex flex-col gap-4">
            {[
              { name: "Đơn thuốc Tim mạch", date: "20 Thg 4 2025" },
              { name: "Đơn thuốc Nha khoa", date: "25 Thg 3 2025" },
              { name: "Đơn thuốc Da liễu", date: "16 Thg 3 2025" },
              { name: "Đơn thuốc Tim mạch", date: "04 Thg 1 2025" },
            ].map((pres, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                    <FileText size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{pres.name}</div>
                    <div className="text-xs text-slate-400 font-medium">{pres.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors border border-slate-100">
                    <Eye size={16} />
                  </button>
                  <button className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors border border-slate-100">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hoạt động gần đây */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 mb-5">Hoạt động gần đây</h2>
          <div className="relative border-l border-slate-200 ml-3 pl-5 pb-2 flex flex-col gap-6">
            {[
              { title: "Khám với Bác sĩ Đa khoa", date: "24 Thg 3 2025, 10:55 SA", dot: "bg-green-500" },
              { title: "Kiểm tra Chỉ số (Tại nhà)", date: "24 Thg 4 2025, 11:00 SA", dot: "bg-red-500" },
              { title: "Buổi Vật lý trị liệu", date: "24 Thg 4 2025, 11:00 SA", dot: "bg-yellow-500" },
              { title: "Tư vấn chế độ ăn uống", date: "24 Thg 4 2025, 11:00 SA", dot: "bg-blue-500" },
            ].map((activity, i) => (
              <div key={i} className="relative">
                <div className={`absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${activity.dot}`}></div>
                <div className="text-sm font-bold text-slate-900 leading-tight mb-1" dangerouslySetInnerHTML={{ __html: activity.title.replace('Bác sĩ Đa khoa', '<strong>Bác sĩ Đa khoa</strong>') }}></div>
                <div className="text-xs text-slate-400 font-medium">{activity.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vitals */}
      <div className="bg-transparent mb-8">
        <h2 className="text-sm font-bold text-slate-900 mb-4">Chỉ số cơ thể (Vitals)</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { icon: <Scales weight="fill" />, label: "Cân nặng", val: "100", unit: "Kg" },
            { icon: <Ruler weight="fill" />, label: "Chiều cao", val: "154", unit: "Cm" },
            { icon: <TrendUp weight="fill" />, label: "Chỉ số BMI", val: "19.2", unit: "kg/m²" },
            { icon: <Drop weight="fill" />, label: "Đường huyết", val: "95", unit: "mg/dL" },
            { icon: <Wind weight="fill" />, label: "Nồng độ Oxy", val: "98", unit: "%" },
            { icon: <Thermometer weight="fill" />, label: "Nhiệt độ", val: "37.2", unit: "°C" },
          ].map((vital, i) => (
            <div key={i} className="bg-white rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center mb-3">
                {vital.icon}
              </div>
              <div className="text-xs text-slate-500 font-medium mb-1">{vital.label}</div>
              <div className="text-lg font-bold text-slate-900">
                {vital.val} <span className="text-[10px] font-medium text-slate-400">{vital.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Tần suất tương tác Trợ lý AI */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-bold text-slate-900">Tần suất tương tác Trợ lý AI</h2>
            <button className="text-xs text-slate-500 border border-slate-200 rounded px-3 py-1 hover:bg-slate-50">7 ngày qua</button>
          </div>
          {/* Compact chart: viewBox 560×150, data area y: 10→130, scale=(130-10)/40=3 */}
          <svg viewBox="0 0 560 150" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="aiGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.01" />
              </linearGradient>
            </defs>
            {/* Grid — y=130(0), 100(10), 70(20), 40(30), 10(40) */}
            {[[40, 10], [30, 40], [20, 70], [10, 100], [0, 130]].map(([lbl, y], i) => (
              <g key={i}>
                <line x1="45" y1={y} x2="540" y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                <text x="36" y={y + 4} textAnchor="end" fontSize="10" fill="#94a3b8">{lbl}</text>
              </g>
            ))}
            {/* T2=15→85, T3=27→49, T4=28→46, T5=12→94, T6=16→82, T7=15→85, CN=36→22 */}
            <polygon points="80,85 160,49 240,46 320,94 400,82 460,85 530,22 530,130 80,130" fill="url(#aiGrad2)" />
            <polyline points="80,85 160,49 240,46 320,94 400,82 460,85 530,22" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            {[[80, 85], [160, 49], [240, 46], [320, 94], [400, 82], [460, 85], [530, 22]].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="4.5" fill="white" stroke="#3b82f6" strokeWidth="2.5" />
            ))}
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((lbl, i) => (
              <text key={i} x={80 + i * (450 / 6)} y="144" textAnchor="middle" fontSize="10" fill="#94a3b8">{lbl}</text>
            ))}
          </svg>
        </div>

        {/* Giao dịch gần đây */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 self-start">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-slate-900">Giao dịch gần đây</h2>
            <button className="text-xs text-slate-500 border border-slate-200 rounded px-3 py-1 hover:bg-slate-50">Hàng tuần</button>
          </div>
          <div className="flex flex-col">
            {[
              { doc: "BS. John Smith", spec: "Ngoại thần kinh", amount: "450.000đ", status: "Thành công", st: "success" },
              { doc: "BS. Lisa White", spec: "Ung bướu", amount: "350.000đ", status: "Thành công", st: "success" },
              { doc: "BS. Lisa Black", spec: "Ung bướu", amount: "350.000đ", status: "Thành công", st: "success" },
              { doc: "BS. Rachel Green", spec: "Tiết niệu", amount: "550.000đ", status: "Thành công", st: "success" },
            ].map((tx, i) => (
              <div key={i} className="flex items-center gap-3 py-3 border-b border-slate-200 last:border-0">
                <div className={`w-8 h-8 rounded-full shrink-0 ${i === 0 ? 'bg-teal-400' : i === 1 ? 'bg-indigo-200' : i === 2 ? 'bg-red-300' : 'bg-yellow-400'
                  }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 leading-tight">{tx.doc}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{tx.spec}</div>
                </div>
                <div className="text-right shrink-0 mr-1">
                  <div className="text-[10px] text-slate-400 leading-tight">Phí tư vấn</div>
                  <div className="text-[11px] font-bold text-slate-800">{tx.amount}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 border rounded whitespace-nowrap shrink-0 ${tx.st === 'success'
                  ? 'text-green-600 border-green-400 bg-green-50'
                  : 'text-red-500 border-red-400 bg-red-50'
                  }`}>{tx.status}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Lịch hẹn gần đây */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-4">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900">Lịch hẹn gần đây</h2>
          <button className="text-xs text-slate-500 border border-slate-200 rounded px-3 py-1 hover:bg-slate-50">Hàng tuần</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-50/50">
                <th className="font-bold text-slate-700 py-3.5 px-6 text-xs uppercase tracking-wide text-left">Bác sĩ & Chuyên khoa</th>
                <th className="font-bold text-slate-700 py-3.5 px-6 text-xs uppercase tracking-wide text-left">Ngày & Giờ</th>
                <th className="font-bold text-slate-700 py-3.5 px-6 text-xs uppercase tracking-wide text-left">Phí tư vấn</th>
                <th className="font-bold text-slate-700 py-3.5 px-6 text-xs uppercase tracking-wide text-center">Hình thức</th>
                <th className="font-bold text-slate-700 py-3.5 px-6 text-xs uppercase tracking-wide text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {[
                { doc: "BS. Mick Thompson", spec: "Tim mạch", bg: "bg-blue-100", date: "27 Thg 5 2025 - 09:30 SA", fee: "400.000đ", mode: "Trực tuyến", st: "Đã hoàn tất", stColor: "bg-green-500" },
                { doc: "BS. Sarah Johnson", spec: "Chỉnh hình", bg: "bg-red-300", date: "26 Thg 5 2025 - 10:15 SA", fee: "370.000đ", mode: "Trực tuyến", st: "Đang chờ", stColor: "bg-yellow-500" },
                { doc: "BS. Emily Carter", spec: "Nhi khoa", bg: "bg-blue-300", date: "25 Thg 5 2025 - 02:40 CH", fee: "450.000đ", mode: "Trực tiếp", st: "Đã hủy", stColor: "bg-red-500" },
                { doc: "BS. David Lee", spec: "Phụ khoa", bg: "bg-yellow-400", date: "24 Thg 5 2025 - 11:30 SA", fee: "310.000đ", mode: "Trực tiếp", st: "Đã xếp lịch", stColor: "bg-blue-500" },
              ].map((apt, i) => (
                <tr key={i} className="border-b border-slate-200 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex gap-3 items-center">
                      <div className={`w-8 h-8 rounded-full shrink-0 ${apt.bg}`}></div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm leading-tight">{apt.doc}</div>
                        <div className="text-xs text-slate-400 font-medium">{apt.spec}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-sm font-medium">{apt.date}</td>
                  <td className="py-4 px-6 font-bold text-slate-900 text-sm">{apt.fee}</td>
                  <td className="py-4 px-6 text-slate-600 text-sm text-center">{apt.mode}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`${apt.stColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm inline-block whitespace-nowrap`}>
                      {apt.st}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> {/* Lịch hẹn gần đây */}

      </div> {/* end p-8 content */}

      <NewAppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default PatientDashboard;
