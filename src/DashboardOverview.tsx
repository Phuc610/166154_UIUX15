import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CurrencyDollar, CaretDown, DotsThreeVertical, FileText,
  User, CalendarBlank, DownloadSimple, Eye, ArrowRight, X
} from '@phosphor-icons/react';

// --- Appointment row type ---
interface ApptRow {
  id: string;
  name: string;
  phone: string;
  avatarColor: string;
  doctor: string;
  time: string;
  status: 'done' | 'checkin' | 'scheduled';
  fee: string;
}

const APPOINTMENTS: ApptRow[] = [
  { id: 'r1', name: 'Nguyễn Hồng Minh', phone: '+84 42 470 755', avatarColor: 'bg-red-200',     doctor: 'Dr. Andrew Billard', time: 'Hôm nay - 09:30', status: 'done',      fee: '$400' },
  { id: 'r2', name: 'Trần Thị Mai',     phone: '+84 98 765 432', avatarColor: 'bg-yellow-300',  doctor: 'Dr. Sarah Connor',   time: 'Hôm nay - 10:15', status: 'checkin',   fee: '$370' },
  { id: 'r3', name: 'Lê Văn Tám',       phone: '+84 12 345 678', avatarColor: 'bg-emerald-300', doctor: 'Dr. John Doe',       time: 'Hôm nay - 14:40', status: 'scheduled', fee: '$310' },
];

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  done:      { label: 'Đã hoàn tất', className: 'bg-emerald-100 text-emerald-700' },
  checkin:   { label: 'Đã check-in', className: 'bg-amber-100 text-amber-700' },
  scheduled: { label: 'Đã lên lịch', className: 'bg-blue-100 text-blue-700' },
};

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [filterDoctor, setFilterDoctor] = useState('');
  const [detailRow, setDetailRow] = useState<ApptRow | null>(null);

  const filtered = APPOINTMENTS.filter(a =>
    !filterDoctor || a.doctor === filterDoctor
  );

  return (
    <>
      {/* ---- HEADER ---- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trang tổng quan Quản lý</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/dashboard/export')}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg font-semibold text-sm text-slate-700 transition-colors shadow-sm"
          >
            <DownloadSimple size={18} /> Xuất báo cáo
          </button>
          <button
            onClick={() => navigate('/dashboard/doctors')}
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm"
          >
            + Thêm nhân sự
          </button>
        </div>
      </div>

      {/* ---- STATS ---- */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm cursor-pointer hover:border-blue-300 hover:shadow-md transition-all"
          onClick={() => navigate('/dashboard/export')}
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-slate-500">Tổng doanh thu (Tháng)</h3>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center">
              <CurrencyDollar size={20} weight="bold" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-3">$124,500</div>
          <div className="flex items-center gap-2 text-sm">
            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-semibold">+15%</span>
            <span className="text-slate-500">trong 30 ngày qua</span>
          </div>
        </div>

        <div
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm cursor-pointer hover:border-blue-300 hover:shadow-md transition-all"
          onClick={() => navigate('/dashboard/patients')}
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-slate-500">Tổng bệnh nhân</h3>
            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
              <User size={20} weight="bold" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-3">1,245</div>
          <div className="flex items-center gap-2 text-sm">
            <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-semibold">-2%</span>
            <span className="text-slate-500">trong 30 ngày qua</span>
          </div>
        </div>

        <div
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm cursor-pointer hover:border-blue-300 hover:shadow-md transition-all"
          onClick={() => navigate('/dashboard/appointments')}
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-slate-500">Lịch hẹn toàn cơ sở</h3>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <CalendarBlank size={20} weight="bold" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-3">856</div>
          <div className="flex items-center gap-2 text-sm">
            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-semibold">+8%</span>
            <span className="text-slate-500">trong 30 ngày qua</span>
          </div>
        </div>
      </div>

      {/* ---- APPOINTMENTS TABLE ---- */}
      <div className="bg-white border border-slate-200 rounded-xl mb-8 shadow-sm">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">Tổng quan lịch hẹn hôm nay</h2>
            <p className="text-sm text-slate-500">Dựa trên số lượng lịch hẹn hôm nay</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={filterDoctor}
                onChange={e => setFilterDoctor(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-lg py-2 pl-4 pr-10 text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-600 cursor-pointer shadow-sm"
              >
                <option value="">Tất cả bác sĩ</option>
                <option>Dr. Andrew Billard</option>
                <option>Dr. Sarah Connor</option>
                <option>Dr. John Doe</option>
              </select>
              <CaretDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>
            <button
              onClick={() => navigate('/dashboard/appointments')}
              className="flex items-center gap-1.5 text-blue-600 text-sm font-semibold hover:underline"
            >
              Xem tất cả <ArrowRight size={14} />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-sm font-semibold">
                <th className="px-6 py-4">Bệnh nhân</th>
                <th className="px-6 py-4">Bác sĩ phụ trách</th>
                <th className="px-6 py-4">Ngày &amp; giờ</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Phí khám</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map(row => (
                <tr key={row.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${row.avatarColor} shrink-0`}></div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{row.name}</span>
                        <span className="text-xs text-slate-500">{row.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{row.doctor}</td>
                  <td className="px-6 py-4 text-slate-600">{row.time}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-md text-xs font-semibold ${STATUS_BADGE[row.status].className}`}>
                      {STATUS_BADGE[row.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">{row.fee}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        title="Xem chi tiết"
                        onClick={() => setDetailRow(row)}
                        className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        title="Xem hồ sơ bệnh nhân"
                        onClick={() => navigate('/dashboard/patients')}
                        className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                      >
                        <FileText size={16} />
                      </button>
                      <button
                        title="Xem toàn bộ lịch hẹn"
                        onClick={() => navigate('/dashboard/appointments')}
                        className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                      >
                        <DotsThreeVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400 text-sm">
                    Không có lịch hẹn nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---- BOTTOM SECTION ---- */}
      <div className="grid grid-cols-2 gap-6">
        {/* Specialty Activity */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold">Hoạt động chuyên khoa</h2>
            <p className="text-sm text-slate-500">Dựa trên số lượng lịch hẹn hôm nay</p>
          </div>
          <div className="flex flex-col gap-5">
            {[
              { label: 'Khám tổng quát', pct: 45, color: 'bg-blue-600' },
              { label: 'Nhi khoa',       pct: 25, color: 'bg-emerald-500' },
              { label: 'Tim mạch',       pct: 18, color: 'bg-amber-500' },
              { label: 'Nha khoa',       pct: 12, color: 'bg-purple-500' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span>{item.label}</span>
                  <span>{item.pct}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full transition-all`} style={{ width: `${item.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staff on Duty */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Nhân sự trực hôm nay</h2>
            <button
              onClick={() => navigate('/dashboard/doctors')}
              className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1"
            >
              Xem tất cả <ArrowRight size={14} />
            </button>
          </div>
          <div className="flex flex-col gap-6">
            {[
              { name: 'Dr. Sarah Connor',   dept: 'Khoa Nhi',       hours: '08:00 - 17:00', status: 'Sẵn sàng',  dot: 'bg-emerald-500', avatarColor: 'bg-red-200' },
              { name: 'Dr. Andrew Billard', dept: 'Khoa Tổng quát', hours: '08:00 - 12:00', status: 'Đang khám', dot: 'bg-red-500',     avatarColor: 'bg-yellow-300' },
              { name: 'Lê Thị Thanh',       dept: 'Y tá trưởng',    hours: '07:00 - 15:00', status: 'Sẵn sàng',  dot: 'bg-emerald-500', avatarColor: 'bg-emerald-300' },
            ].map(staff => (
              <div
                key={staff.name}
                className="flex justify-between items-center cursor-pointer hover:bg-slate-50 rounded-lg px-2 py-1 -mx-2 transition-colors"
                onClick={() => navigate('/dashboard/doctors')}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${staff.avatarColor} shrink-0`}></div>
                  <div>
                    <div className="font-bold text-slate-900">{staff.name}</div>
                    <div className="text-sm text-slate-500">{staff.dept}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-700">{staff.hours}</div>
                  <div className="flex items-center justify-end gap-1.5 mt-1">
                    <span className={`w-2 h-2 rounded-full ${staff.dot}`}></span>
                    <span className="text-xs text-slate-500 font-medium">{staff.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---- DETAIL MODAL ---- */}
      {detailRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setDetailRow(null)}></div>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative z-10">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">Chi tiết lịch hẹn</h2>
              <button onClick={() => setDetailRow(null)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
                <X size={18} weight="bold" />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-3">
              <span className={`inline-flex self-start px-3 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[detailRow.status].className}`}>
                {STATUS_BADGE[detailRow.status].label}
              </span>
              <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-3 text-sm">
                <div><p className="text-xs text-slate-500">Bệnh nhân</p><p className="font-bold text-slate-900">{detailRow.name}</p></div>
                <div className="h-px bg-slate-200"></div>
                <div><p className="text-xs text-slate-500">Điện thoại</p><p className="font-semibold text-slate-900">{detailRow.phone}</p></div>
                <div className="h-px bg-slate-200"></div>
                <div><p className="text-xs text-slate-500">Bác sĩ</p><p className="font-semibold text-slate-900">{detailRow.doctor}</p></div>
                <div className="h-px bg-slate-200"></div>
                <div><p className="text-xs text-slate-500">Thời gian</p><p className="font-semibold text-slate-900">{detailRow.time}</p></div>
                <div className="h-px bg-slate-200"></div>
                <div><p className="text-xs text-slate-500">Phí khám</p><p className="font-bold text-blue-700 text-lg">{detailRow.fee}</p></div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-between">
              <button onClick={() => setDetailRow(null)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors">Đóng</button>
              <button onClick={() => { setDetailRow(null); navigate('/dashboard/appointments'); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm transition-colors">
                <ArrowRight size={16} weight="bold" /> Xem lịch hẹn
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardOverview;
