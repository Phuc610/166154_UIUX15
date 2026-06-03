import React, { useState, useRef, useEffect } from 'react';
import {
  List, SquaresFour, CaretLeft, CaretRight, CaretDown, DotsThreeVertical,
  MagnifyingGlass, Funnel, Plus, CalendarBlank, Export, Eye, Trash, CheckCircle
} from '@phosphor-icons/react';
import { useLocation } from 'react-router-dom';

type ViewMode = 'list' | 'calendar';

const STATUS_STYLES: Record<string, string> = {
  'Đã hoàn tất': 'bg-green-50 text-green-600 border border-green-200',
  'Đang chờ': 'bg-yellow-50 text-yellow-600 border border-yellow-200',
  'Đã hủy': 'bg-red-50 text-red-400 border border-red-200',
  'Đã xếp lịch': 'bg-purple-50 text-purple-600 border border-purple-200',
  'Đã xác nhận': 'bg-blue-50 text-blue-600 border border-blue-200',
};
import { getAppointments, type Appointment } from './data/appointments';
import NewAppointmentModal from './NewAppointmentModal';


const DAYS_OF_WEEK_FULL = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const DAYS_OF_WEEK_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const MONTH_NAMES = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

function getCalDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells: { day: number; cur: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, cur: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, cur: true });
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - daysInMonth - firstDay + 1, cur: false });
  return cells;
}

// ─── Date Range Picker ───────────────────────────────────────────────────────
interface DateRange { start: Date | null; end: Date | null }

function DateRangePicker({ onApply, onClose }: { onApply: (r: DateRange) => void; onClose: () => void }) {
  const today = new Date();
  const [leftYear, setLeftYear] = useState(today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear());
  const [leftMonth, setLeftMonth] = useState(today.getMonth() === 0 ? 11 : today.getMonth() - 1);
  const rightMonth = leftMonth === 11 ? 0 : leftMonth + 1;
  const rightYear = leftMonth === 11 ? leftYear + 1 : leftYear;

  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [hover, setHover] = useState<Date | null>(null);

  const prevLeft = () => {
    if (leftMonth === 0) { setLeftMonth(11); setLeftYear(y => y - 1); }
    else setLeftMonth(m => m - 1);
  };
  const nextLeft = () => {
    if (leftMonth === 11) { setLeftMonth(0); setLeftYear(y => y + 1); }
    else setLeftMonth(m => m + 1);
  };

  const clickDay = (d: Date) => {
    if (!range.start || (range.start && range.end)) {
      setRange({ start: d, end: null });
    } else {
      if (d < range.start) setRange({ start: d, end: range.start });
      else setRange({ start: range.start, end: d });
    }
  };

  const inRange = (d: Date) => {
    const { start, end } = range;
    const eff = end ?? hover;
    if (!start || !eff) return false;
    const [lo, hi] = start <= eff ? [start, eff] : [eff, start];
    return d > lo && d < hi;
  };

  const isStart = (d: Date) => range.start?.toDateString() === d.toDateString();
  const isEnd = (d: Date) => (range.end ?? hover)?.toDateString() === d.toDateString();

  const renderMonth = (year: number, month: number) => {
    const cells = getCalDays(year, month);
    return (
      <div className="w-[260px]">
        <div className="text-center font-bold text-slate-900 mb-3">{MONTH_NAMES[month]} {year}</div>
        <div className="grid grid-cols-7 mb-1">
          {DAYS_OF_WEEK_SHORT.map(d => (
            <div key={d} className="text-center text-xs font-semibold text-indigo-400 py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((cell, idx) => {
            if (!cell.cur) return <div key={idx} className="h-8" />;
            const d = new Date(year, month, cell.day);
            const start = isStart(d), end = isEnd(d), inR = inRange(d);
            const hasRange = range.start && (range.end || hover);
            const isStartOfRange = start && hasRange && d <= (range.end ?? hover!);
            const isEndOfRange = end && hasRange && range.start != null && d >= range.start;

            return (
              <div
                key={idx}
                className={`relative h-8 w-full flex items-center justify-center cursor-pointer text-sm
                  ${inR ? 'bg-indigo-100' : ''}
                  ${isStartOfRange ? 'bg-indigo-100 rounded-l-full' : ''}
                  ${isEndOfRange ? 'bg-indigo-100 rounded-r-full' : ''}
                `}
                onClick={() => clickDay(d)}
                onMouseEnter={() => range.start && !range.end && setHover(d)}
                onMouseLeave={() => setHover(null)}
              >
                <div className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors
                  ${start || end ? 'bg-indigo-700 text-white font-bold shadow-sm' : ''}
                  ${!start && !end ? (inR ? 'text-indigo-800 font-medium' : 'text-slate-700 hover:bg-slate-100') : ''}
                `}>
                  {cell.day}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const fmt = (d: Date | null) => d ? `${d.getMonth() + 1}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}` : '...';

  return (
    <div className="absolute left-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-30 p-5">
      <div className="flex gap-6 items-start">
        {/* Left month */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <button onClick={prevLeft} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500"><CaretLeft size={14} /></button>
            <span />
            <span />
          </div>
          {renderMonth(leftYear, leftMonth)}
        </div>
        {/* Divider */}
        <div className="w-px bg-slate-200 self-stretch mx-1" />
        {/* Right month */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span />
            <span />
            <button onClick={nextLeft} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500"><CaretRight size={14} /></button>
          </div>
          {renderMonth(rightYear, rightMonth)}
        </div>
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
        <span className="text-sm text-slate-500">{fmt(range.start)} – {fmt(range.end)}</span>
        <div className="flex gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Hủy</button>
          <button onClick={() => { onApply(range); onClose(); }} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-700 rounded-lg hover:bg-indigo-800">Áp dụng</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function PatientSchedule() {
  const location = useLocation();
  const [showToast, setShowToast] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterMode, setFilterMode] = useState('');
  const [filterSpec, setFilterSpec] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointments] = useState<Appointment[]>(getAppointments());
  const [view, setView] = useState<ViewMode>('list');
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
  const datePickerRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 10;

  const parseDate = (dStr: string) => {
    const match = dStr.match(/(\d{1,2})\s+Thg\s+(\d{1,2})\s+(\d{4})\s+-\s+(\d{1,2}):(\d{2})\s+(SA|CH)/i);
    if (!match) return 0;
    const [_, d, m, y, h, min, ampm] = match;
    let hour = parseInt(h, 10);
    if (ampm.toUpperCase() === 'CH' && hour < 12) hour += 12;
    if (ampm.toUpperCase() === 'SA' && hour === 12) hour = 0;
    return new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10), hour, parseInt(min, 10)).getTime();
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filterStatus && apt.status !== filterStatus) return false;
    if (filterMode && apt.mode !== filterMode) return false;
    if (filterSpec && apt.spec !== filterSpec) return false;
    if (search && !apt.doc.toLowerCase().includes(search.toLowerCase()) && !apt.date.toLowerCase().includes(search.toLowerCase())) return false;

    if (dateRange.start) {
      const aptTime = parseDate(apt.date);
      const aptD = new Date(aptTime);
      aptD.setHours(0, 0, 0, 0);

      const startD = new Date(dateRange.start.getTime());
      startD.setHours(0, 0, 0, 0);

      if (aptD < startD) return false;

      const endD = new Date((dateRange.end ?? dateRange.start).getTime());
      endD.setHours(23, 59, 59, 999);
      if (aptD > endD) return false;
    }

    return true;
  });

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const tA = parseDate(a.date);
    const tB = parseDate(b.date);
    return sortOrder === 'newest' ? tB - tA : tA - tB;
  });

  const totalPages = Math.max(1, Math.ceil(sortedAppointments.length / ITEMS_PER_PAGE));
  const currentAppointments = sortedAppointments.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const calDays = getCalDays(calYear, calMonth);

  const calDots = React.useMemo(() => {
    const dots: Record<number, string[]> = {};
    sortedAppointments.forEach(apt => {
      // Parse apt.date: "23 Thg 6 2026 - 10:20 SA"
      const match = apt.date.match(/(\d{1,2})\s+Thg\s+(\d{1,2})\s+(\d{4})/i);
      if (match) {
        const d = parseInt(match[1], 10);
        const m = parseInt(match[2], 10) - 1;
        const y = parseInt(match[3], 10);

        if (m === calMonth && y === calYear) {
          if (!dots[d]) dots[d] = [];
          dots[d].push(apt.bg);
        }
      }
    });
    return dots;
  }, [appointments, calMonth, calYear]);

  useEffect(() => {
    if (location.state?.newAppointmentSuccess) {
      setShowToast(true);
      // Clean up state so refresh doesn't trigger it again
      window.history.replaceState({}, document.title);
      setTimeout(() => setShowToast(false), 3000);
    }
  }, [location]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node))
        setShowDatePicker(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const prevMonth = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); };
  const nextMonth = () => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); };

  const fmt = (d: Date | null) => d ? `${d.getMonth() + 1}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}` : '';
  const dateLabel = dateRange.start ? `${fmt(dateRange.start)} – ${fmt(dateRange.end ?? dateRange.start)}` : '04/30/2025 – 05/06/2025';

  return (
    <div>
      {/* Toast Notification */}
      <div className={`fixed top-6 right-6 z-[100] transition-all duration-500 ease-out transform ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-green-500 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-semibold text-sm">
          <CheckCircle size={24} weight="fill" />
          Đặt lịch khám thành công!
        </div>
      </div>

      {/* Page Header */}
      <div className="flex justify-between items-center px-8 pt-6 pb-5">
        <h1 className="text-2xl font-bold text-slate-900">
          {view === 'calendar' ? 'Lịch hẹn' : 'Danh sách Lịch hẹn'}
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button onClick={() => setShowExportMenu(!showExportMenu)} className="flex items-center gap-2 px-4 py-2 bg-white text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
              <Export size={16} /> Xuất file <CaretDown size={12} className={`transition-transform duration-200 ${showExportMenu ? 'rotate-180' : ''}`} />
            </button>
            {showExportMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-2">
                  <button onClick={() => setShowExportMenu(false)} className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                    Tải file PDF
                  </button>
                  <button onClick={() => setShowExportMenu(false)} className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                    Tải file Excel
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
            <button onClick={() => setView('list')} className={`w-10 h-10 flex items-center justify-center transition-colors ${view === 'list' ? 'bg-blue-700 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`} aria-label="Danh sách"><List size={20} /></button>
            <button onClick={() => setView('calendar')} className={`w-10 h-10 flex items-center justify-center transition-colors ${view === 'calendar' ? 'bg-blue-700 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`} aria-label="Lịch"><SquaresFour size={20} /></button>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
            <Plus size={18} /> Đặt lịch khám
          </button>
        </div>
      </div>
      <div className="mx-8 border-b border-slate-300" />

      {/* Content */}
      <div className="p-8">

        {/* ─── LIST VIEW ─── */}
        {view === 'list' && (
          <div>
            {/* Toolbar — on gray page background, no white card */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="relative w-52">
                <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Tìm kiếm theo tên bác sĩ" value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white" />
              </div>

              {/* Date range picker trigger */}
              <div className="relative" ref={datePickerRef}>
                <button
                  onClick={() => setShowDatePicker(v => !v)}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-white font-medium bg-white"
                >
                  <CalendarBlank size={16} className="text-slate-400" /> {dateLabel}
                </button>
                {showDatePicker && (
                  <DateRangePicker onApply={r => setDateRange(r)} onClose={() => setShowDatePicker(false)} />
                )}
              </div>

              <div className="ml-auto flex items-center gap-2">
                <div className="relative">
                  <button onClick={() => setShowFilterMenu(!showFilterMenu)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-white bg-white font-medium">
                    <Funnel size={16} /> Bộ lọc <CaretDown size={12} className={`transition-transform duration-200 ${showFilterMenu ? 'rotate-180' : ''}`} />
                  </button>
                  {showFilterMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowFilterMenu(false)} />
                      <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-xl z-20 p-4 flex flex-col gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Trạng thái</label>
                          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md outline-none focus:border-blue-500 bg-white">
                            <option value="">Tất cả</option>
                            <option value="Đã hoàn tất">Đã hoàn tất</option>
                            <option value="Đang chờ">Đang chờ</option>
                            <option value="Đã hủy">Đã hủy</option>
                            <option value="Đã xếp lịch">Đã xếp lịch</option>
                            <option value="Đã xác nhận">Đã xác nhận</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Hình thức</label>
                          <select value={filterMode} onChange={e => setFilterMode(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md outline-none focus:border-blue-500 bg-white">
                            <option value="">Tất cả</option>
                            <option value="Trực tiếp">Trực tiếp</option>
                            <option value="Trực tuyến">Trực tuyến</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Chuyên khoa</label>
                          <select value={filterSpec} onChange={e => setFilterSpec(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md outline-none focus:border-blue-500 bg-white">
                            <option value="">Tất cả</option>
                            {Array.from(new Set(appointments.map(a => a.spec))).map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>

                      </div>
                    </>
                  )}
                </div>
                <div className="relative">
                  <button onClick={() => setShowSortMenu(!showSortMenu)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-white bg-white font-medium">
                    {sortOrder === 'newest' ? 'Mới nhất' : 'Cũ nhất'} <CaretDown size={12} className={`transition-transform duration-200 ${showSortMenu ? 'rotate-180' : ''}`} />
                  </button>
                  {showSortMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)} />
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-20 py-2">
                        <button onClick={() => { setSortOrder('newest'); setShowSortMenu(false); }} className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors ${sortOrder === 'newest' ? 'text-blue-600 bg-blue-50/50' : 'text-slate-600'}`}>
                          Mới nhất
                        </button>
                        <button onClick={() => { setSortOrder('oldest'); setShowSortMenu(false); }} className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors ${sortOrder === 'oldest' ? 'text-blue-600 bg-blue-50/50' : 'text-slate-600'}`}>
                          Cũ nhất
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Table card — white */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-visible">
              {/* Table */}
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-300 bg-slate-50/50">
                    <th className="text-left py-3.5 px-5 text-xs font-bold text-slate-600 uppercase tracking-wide">Ngày & Giờ</th>
                    <th className="text-left py-3.5 px-5 text-xs font-bold text-slate-600 uppercase tracking-wide">Bác sĩ & Chuyên khoa</th>
                    <th className="text-center py-3.5 px-5 text-xs font-bold text-slate-600 uppercase tracking-wide">Hình thức</th>
                    <th className="text-center py-3.5 px-5 text-xs font-bold text-slate-600 uppercase tracking-wide">Trạng thái</th>
                    <th className="py-3.5 px-5" />
                  </tr>
                </thead>
                <tbody>
                  {currentAppointments.map((apt, i) => (
                    <tr key={i} className="border-b border-slate-200 hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-5 text-sm text-slate-500 font-medium whitespace-nowrap">{apt.date}</td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full shrink-0 ${apt.bg}`} />
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{apt.doc}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{apt.spec}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-sm text-slate-600 text-center">{apt.mode}</td>
                      <td className="py-4 px-5 text-center">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${STATUS_STYLES[apt.status]}`}>{apt.status}</span>
                      </td>
                      <td className="py-4 px-5 relative">
                        <button
                          onClick={e => { e.stopPropagation(); setShowMenu(showMenu === i ? null : i); }}
                          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
                        >
                          <DotsThreeVertical size={20} />
                        </button>
                        {showMenu === i && (
                          <div className="absolute right-6 top-full mt-1 bg-white shadow-xl border border-slate-100 rounded-xl z-30 py-2 w-36">
                            <button onClick={() => setShowMenu(null)} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors">
                              <Eye size={16} className="text-slate-400" /> View
                            </button>
                            <button onClick={() => setShowMenu(null)} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2.5 transition-colors">
                              <Trash size={16} className="text-red-400" /> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-between px-5 py-4 border-t border-slate-50">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span>Số dòng mỗi trang</span>
                  <select className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm outline-none text-slate-700">
                    <option>10</option><option>20</option><option>50</option>
                  </select>
                  <span>Mục</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors">
                    <CaretLeft size={15} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${page === i + 1 ? 'bg-blue-600 text-white border border-blue-600' : 'border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                      {i + 1}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors">
                    <CaretRight size={15} />
                  </button>
                </div>
              </div>
            </div> {/* end table card */}
          </div>
        )}

        {/* ─── CALENDAR VIEW ─── */}
        {view === 'calendar' && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <button onClick={() => { setCalMonth(today.getMonth()); setCalYear(today.getFullYear()); }}
                  className="px-4 py-2 bg-blue-700 text-white text-sm font-bold rounded-lg hover:bg-blue-800 transition-colors">
                  Hôm nay
                </button>
                <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500"><CaretLeft size={16} /></button>
                <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500"><CaretRight size={16} /></button>
              </div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">{MONTH_NAMES[calMonth].toUpperCase()} {calYear}</h2>
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden text-sm font-semibold">
                {['Tháng', 'Tuần', 'Ngày'].map((label, i) => (
                  <button key={label} className={`px-4 py-2 transition-colors ${i === 0 ? 'bg-blue-700 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>{label}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-7 border-b border-slate-100">
              {DAYS_OF_WEEK_FULL.map(d => (
                <div key={d} className="py-3 text-center text-sm font-semibold text-slate-500 border-r border-slate-100 last:border-r-0">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {calDays.map((cell, idx) => {
                const isToday = cell.cur && cell.day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
                const dots = cell.cur ? (calDots[cell.day] || []) : [];
                return (
                  <div key={idx} className={`min-h-[110px] p-3 border-r border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${!cell.cur ? 'bg-slate-50/30' : ''}`}>
                    <span className={`inline-flex items-center justify-center w-8 h-8 text-sm font-medium rounded-full
                    ${isToday ? 'bg-blue-700 text-white font-bold' : cell.cur ? 'text-slate-700' : 'text-slate-300'}`}>
                      {cell.day}
                    </span>
                    {dots.length > 0 && (
                      <div className="flex flex-nowrap overflow-x-auto gap-1.5 mt-2 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" style={{ maxWidth: '124px' }}>
                        {dots.map((dot, di) => (
                          <span key={di} className={`w-5 h-5 shrink-0 rounded-full ${dot} cursor-pointer hover:scale-110 transition-transform`} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div> {/* end content p-8 */}

      {showMenu !== null && <div className="fixed inset-0 z-20" onClick={() => setShowMenu(null)} />}

      {/* New Appointment Modal */}
      <NewAppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
