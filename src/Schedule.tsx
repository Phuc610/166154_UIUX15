import React, { useState, useEffect } from 'react';
import {
  CaretLeft, CaretRight, Plus, DownloadSimple,
  CaretDown, X, SunHorizon, Sun, Moon, Warning
} from '@phosphor-icons/react';
import Modal from './components/Modal';
import { useToast } from './contexts/ToastContext';

// ── Types ──────────────────────────────────────────────────
type ShiftId = 'morning' | 'afternoon' | 'evening';

interface DoctorCard {
  id: string;
  name: string;
  specialty: string;
  color: string;      // avatar/dot color class
  bgColor: string;    // card background class
}

interface ShiftEntry {
  dayIndex: number;   // 0 = Mon … 6 = Sun
  shiftId: ShiftId;
  doctor: DoctorCard;
}

// ── Constants ──────────────────────────────────────────────
const DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

const SHIFTS: { id: ShiftId; label: string; hours: string; icon: React.ReactNode }[] = [
  { id: 'morning',   label: 'Ca Sáng',  hours: '08:00 – 12:00', icon: <SunHorizon size={16} weight="fill" className="text-amber-400" /> },
  { id: 'afternoon', label: 'Ca Chiều', hours: '13:00 – 17:00', icon: <Sun        size={16} weight="fill" className="text-orange-400" /> },
  { id: 'evening',   label: 'Ca Tối',   hours: '18:00 – 22:00', icon: <Moon       size={16} weight="fill" className="text-indigo-400" /> },
];

const DOCTORS: DoctorCard[] = [
  { id: 'd1', name: 'Dr. Andrew',   specialty: 'Khám tổng quát', color: 'bg-blue-400',    bgColor: 'bg-blue-50   border-blue-200'   },
  { id: 'd2', name: 'Dr. Sarah C.', specialty: 'Nhi khoa',       color: 'bg-rose-400',    bgColor: 'bg-rose-50   border-rose-200'   },
  { id: 'd3', name: 'Dr. Minh H.',  specialty: 'Tim mạch',       color: 'bg-amber-400',   bgColor: 'bg-amber-50  border-amber-200'  },
  { id: 'd4', name: 'Dr. John D.',  specialty: 'Khoa Ngoại',     color: 'bg-emerald-400', bgColor: 'bg-emerald-50 border-emerald-200' },
];

const DEPARTMENTS = ['Tất cả khoa', 'Khám tổng quát', 'Nhi khoa', 'Tim mạch', 'Khoa Ngoại'];

// ── Initial schedule data ──────────────────────────────────
const INITIAL_ENTRIES: ShiftEntry[] = [
  // Morning
  { dayIndex: 0, shiftId: 'morning',   doctor: DOCTORS[0] },
  { dayIndex: 0, shiftId: 'morning',   doctor: DOCTORS[1] },
  { dayIndex: 1, shiftId: 'morning',   doctor: DOCTORS[2] },
  { dayIndex: 2, shiftId: 'morning',   doctor: DOCTORS[0] },
  { dayIndex: 3, shiftId: 'morning',   doctor: DOCTORS[1] },
  { dayIndex: 4, shiftId: 'morning',   doctor: DOCTORS[2] },
  { dayIndex: 5, shiftId: 'morning',   doctor: DOCTORS[0] },
  { dayIndex: 6, shiftId: 'morning',   doctor: DOCTORS[1] },
  // Afternoon
  { dayIndex: 1, shiftId: 'afternoon', doctor: DOCTORS[0] },
  { dayIndex: 2, shiftId: 'afternoon', doctor: DOCTORS[2] },
  { dayIndex: 4, shiftId: 'afternoon', doctor: DOCTORS[1] },
  { dayIndex: 5, shiftId: 'afternoon', doctor: DOCTORS[2] },
  // Evening
  { dayIndex: 1, shiftId: 'evening',   doctor: DOCTORS[1] },
  { dayIndex: 3, shiftId: 'evening',   doctor: DOCTORS[0] },
];

// ── Helper: get Monday of a week containing `date` ─────────
function getMondayOf(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sun
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function formatDate(date: Date): string {
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function formatWeekLabel(monday: Date): string {
  const sunday = addDays(monday, 6);
  const months = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
                  'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];
  if (monday.getMonth() === sunday.getMonth()) {
    return `${monday.getDate()} – ${sunday.getDate()} ${months[monday.getMonth()]}, ${monday.getFullYear()}`;
  }
  return `${monday.getDate()} ${months[monday.getMonth()]} – ${sunday.getDate()} ${months[sunday.getMonth()]}, ${sunday.getFullYear()}`;
}

const EMPTY_FORM = { dayIndex: '', shiftId: '' as ShiftId | '', doctorId: '' };
const EMPTY_ERRORS = { dayIndex: '', shiftId: '', doctorId: '' };

// ── Component ──────────────────────────────────────────────
const Schedule = () => {
  const { showToast } = useToast();
  const [monday, setMonday]         = useState<Date>(getMondayOf(new Date()));
  const [entries, setEntries]       = useState<ShiftEntry[]>(INITIAL_ENTRIES);
  const [filterDept, setFilterDept] = useState('Tất cả khoa');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData]     = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState(EMPTY_ERRORS);
  const [detailEntry, setDetailEntry] = useState<{ entry: ShiftEntry; date: Date } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ShiftEntry | null>(null);
  const [animIn, setAnimIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimIn(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const getStaggStyle = (idx: number) => ({
    transitionDelay: `${idx * 100}ms`
  });
  const staggClass = `transition-all duration-700 ease-out transform ${animIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`;

  // Navigation
  const prevWeek = () => setMonday(prev => addDays(prev, -7));
  const nextWeek = () => setMonday(prev => addDays(prev, 7));
  const goToday  = () => setMonday(getMondayOf(new Date()));

  // Filtered entries
  const visibleEntries = entries.filter(e =>
    filterDept === 'Tất cả khoa' || e.doctor.specialty === filterDept
  );

  const getCell = (dayIndex: number, shiftId: ShiftId) =>
    visibleEntries.filter(e => e.dayIndex === dayIndex && e.shiftId === shiftId);

  // Check if a date is today
  const isToday = (dayIndex: number) => {
    const cellDate = addDays(monday, dayIndex);
    const today = new Date();
    return cellDate.toDateString() === today.toDateString();
  };

  // Validate form
  const validateForm = () => {
    const errors = { ...EMPTY_ERRORS };
    let ok = true;
    if (formData.dayIndex === '')  { errors.dayIndex  = 'Vui lòng chọn ngày.'; ok = false; }
    if (!formData.shiftId)        { errors.shiftId   = 'Vui lòng chọn ca trực.'; ok = false; }
    if (!formData.doctorId)       { errors.doctorId  = 'Vui lòng chọn bác sĩ.'; ok = false; }
    setFormErrors(errors);
    return ok;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const doctor = DOCTORS.find(d => d.id === formData.doctorId)!;
    const dayIndex = Number(formData.dayIndex);
    // Prevent duplicate
    const exists = entries.some(en =>
      en.dayIndex === dayIndex && en.shiftId === formData.shiftId && en.doctor.id === doctor.id
    );
    if (exists) {
      setFormErrors({ ...EMPTY_ERRORS, doctorId: 'Bác sĩ này đã có lịch trong ca này.' });
      return;
    }
    setEntries(prev => [...prev, { dayIndex, shiftId: formData.shiftId as ShiftId, doctor }]);
    setFormData(EMPTY_FORM); setFormErrors(EMPTY_ERRORS); setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setEntries(prev => prev.filter(
      e => !(e.dayIndex === deleteTarget.dayIndex && e.shiftId === deleteTarget.shiftId && e.doctor.id === deleteTarget.doctor.id)
    ));
    setDeleteTarget(null);
    setDetailEntry(null);
  };

  // ── Render ──
  return (
    <>
      {/* HEADER */}
      <div className={`flex items-center justify-between mb-6 ${staggClass}`} style={getStaggStyle(1)}>
        <div>
          <h1 className="text-2xl font-bold">Phân bổ lịch trực</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý ca làm việc theo tuần cho toàn bộ bác sĩ và nhân viên</p>
        </div>
        <div className="flex gap-3">
          {/* Department filter */}
          <div className="relative">
            <select
              value={filterDept}
              onChange={e => setFilterDept(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-lg py-2 pl-4 pr-8 text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-600 shadow-sm cursor-pointer"
            >
              {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
            </select>
            <CaretDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <button
            onClick={() => showToast('Đã xuất lịch PDF thành công!')}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg font-semibold text-sm text-slate-700 transition-colors shadow-sm"
          >
            <DownloadSimple size={18} /> Xuất lịch PDF
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm"
          >
            <Plus size={18} weight="bold" /> Thêm ca trực
          </button>
        </div>
      </div>

      {/* WEEK NAVIGATION */}
      <div className={`bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden ${staggClass}`} style={getStaggStyle(2)}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button onClick={prevWeek} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
              <CaretLeft size={16} weight="bold" />
            </button>
            <span className="font-bold text-slate-800 text-sm">{formatWeekLabel(monday)}</span>
            <button onClick={nextWeek} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
              <CaretRight size={16} weight="bold" />
            </button>
          </div>
          <button
            onClick={goToday}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          >
            Tuần này
          </button>
        </div>

        {/* CALENDAR GRID */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                {/* shift label column */}
                <th className="w-36 px-5 py-3 text-left"></th>
                {DAYS.map((day, i) => {
                  const date = addDays(monday, i);
                  const today = isToday(i);
                  const isSun = i === 6;
                  return (
                    <th key={day} className={`px-3 py-3 text-center text-sm font-semibold ${isSun ? 'text-red-500' : 'text-slate-600'}`}>
                      <span className={`block ${today ? 'text-blue-600' : ''}`}>{day}</span>
                      <span className={`text-xs font-normal ${today ? 'text-blue-500' : 'text-slate-400'}`}>{formatDate(date)}</span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {SHIFTS.map((shift, si) => (
                <tr key={shift.id} className={si < SHIFTS.length - 1 ? 'border-b border-slate-200' : ''}>
                  {/* Shift label */}
                  <td className="px-5 py-4 align-top">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {shift.icon}
                      <span className="font-bold text-sm text-slate-800">{shift.label}</span>
                    </div>
                    <span className="text-xs text-slate-400">{shift.hours}</span>
                  </td>

                  {/* Day cells */}
                  {DAYS.map((_, dayIndex) => {
                    const cells = getCell(dayIndex, shift.id);
                    const today = isToday(dayIndex);
                    return (
                      <td key={dayIndex} className={`px-2 py-3 align-top min-w-[130px] ${today ? 'bg-blue-50/40' : ''}`}>
                        <div className="flex flex-col gap-2">
                          {cells.map(entry => (
                            <div
                              key={entry.doctor.id}
                              onClick={() => setDetailEntry({ entry, date: addDays(monday, entry.dayIndex) })}
                              className={`border ${entry.doctor.bgColor} rounded-lg px-3 py-2 cursor-pointer hover:shadow-md transition-all duration-150`}
                            >
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${entry.doctor.color}`}></span>
                                <span className="font-bold text-sm text-slate-900 truncate">{entry.doctor.name}</span>
                              </div>
                              <span className="text-xs text-slate-500 pl-4">{entry.doctor.specialty}</span>
                            </div>
                          ))}
                          {/* Empty add button */}
                          {cells.length === 0 && (
                            <button
                              onClick={() => {
                                setFormData({ dayIndex: String(dayIndex), shiftId: shift.id, doctorId: '' });
                                setIsModalOpen(true);
                              }}
                              className="border-2 border-dashed border-slate-200 rounded-lg py-3 text-slate-300 hover:border-blue-300 hover:text-blue-400 text-xs font-medium transition-colors"
                            >
                              + Thêm
                            </button>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL: THÊM CA TRỰC ── */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setFormData(EMPTY_FORM); setFormErrors(EMPTY_ERRORS); }} title="Thêm ca trực mới">
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          {/* Day */}
          <div>
            <label htmlFor="sch-day" className="block text-sm font-medium text-slate-700 mb-1">Ngày trong tuần <span className="text-red-500">*</span></label>
            <select id="sch-day"
              className={`w-full py-2 px-3 border rounded-lg outline-none text-sm bg-white ${formErrors.dayIndex ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'}`}
              value={formData.dayIndex}
              onChange={e => { setFormData({ ...formData, dayIndex: e.target.value }); setFormErrors({ ...formErrors, dayIndex: '' }); }}
            >
              <option value="">-- Chọn ngày --</option>
              {DAYS.map((day, i) => (
                <option key={i} value={i}>{day} ({formatDate(addDays(monday, i))})</option>
              ))}
            </select>
            {formErrors.dayIndex && <p className="text-red-500 text-xs mt-1">{formErrors.dayIndex}</p>}
          </div>

          {/* Shift */}
          <div>
            <label htmlFor="sch-shift" className="block text-sm font-medium text-slate-700 mb-1">Ca trực <span className="text-red-500">*</span></label>
            <select id="sch-shift"
              className={`w-full py-2 px-3 border rounded-lg outline-none text-sm bg-white ${formErrors.shiftId ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'}`}
              value={formData.shiftId}
              onChange={e => { setFormData({ ...formData, shiftId: e.target.value as ShiftId }); setFormErrors({ ...formErrors, shiftId: '' }); }}
            >
              <option value="">-- Chọn ca --</option>
              {SHIFTS.map(s => <option key={s.id} value={s.id}>{s.label} ({s.hours})</option>)}
            </select>
            {formErrors.shiftId && <p className="text-red-500 text-xs mt-1">{formErrors.shiftId}</p>}
          </div>

          {/* Doctor */}
          <div>
            <label htmlFor="sch-doctor" className="block text-sm font-medium text-slate-700 mb-1">Bác sĩ / Nhân viên <span className="text-red-500">*</span></label>
            <select id="sch-doctor"
              className={`w-full py-2 px-3 border rounded-lg outline-none text-sm bg-white ${formErrors.doctorId ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'}`}
              value={formData.doctorId}
              onChange={e => { setFormData({ ...formData, doctorId: e.target.value }); setFormErrors({ ...formErrors, doctorId: '' }); }}
            >
              <option value="">-- Chọn bác sĩ --</option>
              {DOCTORS.map(d => <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>)}
            </select>
            {formErrors.doctorId && <p className="text-red-500 text-xs mt-1">{formErrors.doctorId}</p>}
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => { setIsModalOpen(false); setFormData(EMPTY_FORM); setFormErrors(EMPTY_ERRORS); }}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors">
              Hủy bỏ
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors">
              Xác nhận Thêm
            </button>
          </div>
        </form>
      </Modal>

      {/* ── MODAL: DETAIL ── */}
      {detailEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setDetailEntry(null)}></div>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm relative z-10">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">Chi tiết ca trực</h2>
              <button onClick={() => setDetailEntry(null)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
                <X size={18} weight="bold" />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div className={`border ${detailEntry.entry.doctor.bgColor} rounded-xl p-4`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-3 h-3 rounded-full ${detailEntry.entry.doctor.color}`}></span>
                  <span className="font-bold text-slate-900">{detailEntry.entry.doctor.name}</span>
                </div>
                <p className="text-sm text-slate-500 pl-5">{detailEntry.entry.doctor.specialty}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-3 text-sm">
                <div><p className="text-xs text-slate-500">Ngày trực</p>
                  <p className="font-semibold text-slate-800">{DAYS[detailEntry.entry.dayIndex]}, {formatDate(detailEntry.date)}</p>
                </div>
                <div className="h-px bg-slate-200"></div>
                <div><p className="text-xs text-slate-500">Ca trực</p>
                  <p className="font-semibold text-slate-800">
                    {SHIFTS.find(s => s.id === detailEntry.entry.shiftId)?.label} ({SHIFTS.find(s => s.id === detailEntry.entry.shiftId)?.hours})
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-between">
              <button onClick={() => setDetailEntry(null)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors">Đóng</button>
              <button
                onClick={() => setDeleteTarget(detailEntry.entry)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold text-sm transition-colors"
              >
                Xóa ca trực này
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: XÁC NHẬN XÓA ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setDeleteTarget(null)}></div>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm relative z-10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                <Warning size={20} weight="fill" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Xác nhận xóa ca trực</h2>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Bạn có chắc muốn xóa ca trực của <strong>{deleteTarget.doctor.name}</strong>?<br />
              <span className="text-red-500 text-xs">Hành động này không thể hoàn tác.</span>
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors">Hủy bỏ</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold text-sm transition-colors">Xác nhận Xóa</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Schedule;
