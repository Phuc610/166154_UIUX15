import React, { useState } from 'react';
import {
  MagnifyingGlass, Funnel, Plus, SquaresFour, List,
  User, Clock, CaretDown, X, Check, DotsThreeVertical,
  ArrowRight
} from '@phosphor-icons/react';
import Modal from './components/Modal';

// --- Types ---
type Status = 'new' | 'checkin' | 'examining' | 'done';

interface Appointment {
  id: string;
  time: string;
  patientName: string;
  reason: string;
  doctor: string;
  doctorColor: string;
  status: Status;
}

// --- Column Config ---
const COLUMNS: { id: Status; label: string; dotColor: string; borderColor: string }[] = [
  { id: 'new',       label: 'Yêu cầu mới',        dotColor: 'bg-blue-500',   borderColor: 'border-slate-200' },
  { id: 'checkin',   label: 'Đã Check-in',          dotColor: 'bg-amber-500',  borderColor: 'border-amber-400' },
  { id: 'examining', label: 'Đang khám',             dotColor: 'bg-emerald-500',borderColor: 'border-emerald-500' },
  { id: 'done',      label: 'Hoàn tất (Hôm nay)',   dotColor: 'bg-slate-400',  borderColor: 'border-slate-200' },
];

const NEXT_STATUS: Record<Status, Status | null> = {
  new: 'checkin',
  checkin: 'examining',
  examining: 'done',
  done: null,
};

const STATUS_ACTION_LABEL: Record<Status, string> = {
  new: 'Check-in',
  checkin: 'Bắt đầu khám',
  examining: 'Hoàn tất',
  done: '',
};

// --- Initial data ---
const INITIAL_APPOINTMENTS: Appointment[] = [
  { id: 'a1', time: '08:00 – 08:30', patientName: 'Nguyễn Văn An',   reason: 'Khám tổng quát',         doctor: 'Dr. Andrew Billard', doctorColor: 'bg-rose-400',    status: 'new' },
  { id: 'a2', time: '09:15 – 09:45', patientName: 'Trần Thị Bé',     reason: 'Nhổ răng khôn',           doctor: 'Dr. Sarah Connor',   doctorColor: 'bg-amber-400',   status: 'new' },
  { id: 'a3', time: '10:30 – 11:00', patientName: 'Lê Đình Nam',     reason: 'Siêu âm tim',             doctor: 'Dr. Minh Hoàng',     doctorColor: 'bg-emerald-400', status: 'new' },
  { id: 'a4', time: '08:30 – 09:00', patientName: 'Nguyễn Hồng Minh', reason: 'Tư vấn dinh dưỡng (Nhi)',doctor: 'Dr. Sarah Connor',  doctorColor: 'bg-amber-400',   status: 'checkin' },
  { id: 'a5', time: '09:00 – 09:30', patientName: 'Phạm Thị Mai',    reason: 'Do huyết áp, nhịp tim',   doctor: 'Dr. Minh Hoàng',    doctorColor: 'bg-emerald-400', status: 'checkin' },
  { id: 'a6', time: '08:00 – 08:30', patientName: 'Trần Cảnh Dương', reason: 'Tái khám Nội tiết',       doctor: 'Dr. Andrew Billard', doctorColor: 'bg-rose-400',    status: 'examining' },
  { id: 'a7', time: '07:30 – 08:00', patientName: 'Hoàng Đức Nam',   reason: 'Lấy cao răng',            doctor: 'Dr. Sarah Connor',   doctorColor: 'bg-amber-400',   status: 'done' },
  { id: 'a8', time: '07:00 – 07:30', patientName: 'Vũ Thu Hương',    reason: 'Xét nghiệm máu tổng quát',doctor: 'Dr. Andrew Billard', doctorColor: 'bg-rose-400',    status: 'done' },
];

// --- Empty form default ---
const EMPTY_FORM = { patientName: '', reason: '', doctor: '', time: '' };
const EMPTY_ERRORS = { patientName: '', reason: '', doctor: '', time: '' };

// ============================================================
// COMPONENT
// ============================================================
const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDoctor, setFilterDoctor] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState(EMPTY_ERRORS);
  // Detail modal
  const [detailAppt, setDetailAppt] = useState<Appointment | null>(null);

  // --- Derived filtered list ---
  const filtered = appointments.filter(a => {
    const matchSearch = !searchTerm ||
      a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDoctor = !filterDoctor || a.doctor === filterDoctor;
    return matchSearch && matchDoctor;
  });

  const byStatus = (status: Status) => filtered.filter(a => a.status === status);

  // --- Actions ---
  const advanceStatus = (id: string) => {
    setAppointments(prev => prev.map(a => {
      if (a.id !== id) return a;
      const next = NEXT_STATUS[a.status];
      return next ? { ...a, status: next } : a;
    }));
    setDetailAppt(null);
  };

  const validateForm = () => {
    const errors = { ...EMPTY_ERRORS };
    let ok = true;
    if (!formData.patientName.trim()) { errors.patientName = 'Vui lòng nhập tên bệnh nhân.'; ok = false; }
    if (!formData.reason.trim())      { errors.reason = 'Vui lòng nhập lý do khám.'; ok = false; }
    if (!formData.doctor)             { errors.doctor = 'Vui lòng chọn bác sĩ.'; ok = false; }
    if (!formData.time)               { errors.time = 'Vui lòng nhập giờ hẹn.'; ok = false; }
    setFormErrors(errors);
    return ok;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const doctorColors: Record<string, string> = {
      'Dr. Sarah Connor': 'bg-amber-400',
      'Dr. Andrew Billard': 'bg-rose-400',
      'Dr. Minh Hoàng': 'bg-emerald-400',
    };
    setAppointments(prev => [
      ...prev,
      {
        id: `a${Date.now()}`,
        time: formData.time,
        patientName: formData.patientName,
        reason: formData.reason,
        doctor: formData.doctor,
        doctorColor: doctorColors[formData.doctor] ?? 'bg-slate-400',
        status: 'new',
      }
    ]);
    setFormData(EMPTY_FORM);
    setFormErrors(EMPTY_ERRORS);
    setIsModalOpen(false);
  };

  // Unique doctors for filter dropdown
  const allDoctors = [...new Set(appointments.map(a => a.doctor))];

  // ---- Render Card ----
  const AppointmentCard = ({ appt }: { appt: Appointment }) => {
    const col = COLUMNS.find(c => c.id === appt.status)!;
    const isDone = appt.status === 'done';

    return (
      <div
        onClick={() => setDetailAppt(appt)}
        className={`bg-white border ${col.borderColor} rounded-xl p-4 cursor-pointer hover:shadow-md transition-all duration-200 group`}
      >
        {/* Time */}
        <div className={`flex items-center gap-1.5 text-xs font-semibold mb-2 ${isDone ? 'text-slate-400 line-through' : 'text-blue-600'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${col.dotColor} shrink-0`}></span>
          {appt.time}
        </div>
        {/* Patient name */}
        <p className={`font-bold text-sm mb-0.5 ${isDone ? 'text-slate-400' : 'text-slate-900'}`}>
          {appt.patientName}
        </p>
        {/* Reason */}
        <p className={`text-xs mb-3 ${isDone ? 'text-slate-400' : 'text-slate-500'}`}>
          {appt.reason}
        </p>
        {/* Doctor */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className={`w-5 h-5 rounded-full ${appt.doctorColor} shrink-0`}></div>
            <span className={`text-xs font-medium ${isDone ? 'text-slate-400' : 'text-slate-600'}`}>{appt.doctor}</span>
          </div>
          {isDone && <Check size={16} className="text-emerald-500" />}
        </div>
      </div>
    );
  };

  // ---- Render Column ----
  const KanbanColumn = ({ col }: { col: typeof COLUMNS[0] }) => {
    const items = byStatus(col.id);
    return (
      <div className="flex flex-col min-w-[270px] flex-1">
        {/* Column header */}
        <div className="flex items-center gap-2 mb-3 px-1">
          <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`}></span>
          <span className="font-bold text-sm text-slate-800">{col.label}</span>
          <span className="ml-auto text-xs font-bold text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
            {items.length}
          </span>
        </div>
        {/* Gray container wrapping cards */}
        <div className="bg-slate-100/80 rounded-2xl p-3 flex flex-col gap-3 min-h-[120px]">
          {items.map(appt => (
            <AppointmentCard key={appt.id} appt={appt} />
          ))}
          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-6 text-slate-400">
              <span className="text-xs">Không có lịch hẹn</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ---- PAGE HEADER ---- */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Bảng Lịch hẹn</h1>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm lịch hẹn, bệnh nhân..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 w-64 transition-colors"
            />
          </div>

          {/* Filter by doctor */}
          <div className="relative">
            <Funnel size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <select
              value={filterDoctor}
              onChange={e => setFilterDoctor(e.target.value)}
              className="pl-8 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:border-blue-600 cursor-pointer appearance-none"
            >
              <option value="">Lọc: Bác sĩ, Khoa</option>
              {allDoctors.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <CaretDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Add new */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm"
          >
            <Plus size={18} weight="bold" /> Thêm mới
          </button>
        </div>
      </div>

      {/* ---- KANBAN BOARD ---- */}
      <div className="flex gap-5 overflow-x-auto pb-4">
        {COLUMNS.map(col => <KanbanColumn key={col.id} col={col} />)}
      </div>

      {/* ---- MODAL: ADD NEW APPOINTMENT ---- */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Thêm lịch hẹn mới">
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          {/* Patient name */}
          <div>
            <label htmlFor="appt-name" className="block text-sm font-medium text-slate-700 mb-1">
              Tên bệnh nhân <span className="text-red-500">*</span>
            </label>
            <input
              id="appt-name"
              type="text"
              placeholder="VD: Nguyễn Văn A"
              className={`w-full py-2 px-3 border rounded-lg outline-none text-sm ${formErrors.patientName ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'}`}
              value={formData.patientName}
              onChange={e => { setFormData({ ...formData, patientName: e.target.value }); setFormErrors({ ...formErrors, patientName: '' }); }}
            />
            {formErrors.patientName && <p className="text-red-500 text-xs mt-1">{formErrors.patientName}</p>}
          </div>

          {/* Reason */}
          <div>
            <label htmlFor="appt-reason" className="block text-sm font-medium text-slate-700 mb-1">
              Lý do khám <span className="text-red-500">*</span>
            </label>
            <input
              id="appt-reason"
              type="text"
              placeholder="VD: Khám tổng quát, siêu âm..."
              className={`w-full py-2 px-3 border rounded-lg outline-none text-sm ${formErrors.reason ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'}`}
              value={formData.reason}
              onChange={e => { setFormData({ ...formData, reason: e.target.value }); setFormErrors({ ...formErrors, reason: '' }); }}
            />
            {formErrors.reason && <p className="text-red-500 text-xs mt-1">{formErrors.reason}</p>}
          </div>

          {/* Doctor */}
          <div>
            <label htmlFor="appt-doctor" className="block text-sm font-medium text-slate-700 mb-1">
              Bác sĩ phụ trách <span className="text-red-500">*</span>
            </label>
            <select
              id="appt-doctor"
              className={`w-full py-2 px-3 border rounded-lg outline-none text-sm bg-white ${formErrors.doctor ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'}`}
              value={formData.doctor}
              onChange={e => { setFormData({ ...formData, doctor: e.target.value }); setFormErrors({ ...formErrors, doctor: '' }); }}
            >
              <option value="">-- Chọn bác sĩ --</option>
              <option>Dr. Sarah Connor</option>
              <option>Dr. Andrew Billard</option>
              <option>Dr. Minh Hoàng</option>
            </select>
            {formErrors.doctor && <p className="text-red-500 text-xs mt-1">{formErrors.doctor}</p>}
          </div>

          {/* Time */}
          <div>
            <label htmlFor="appt-time" className="block text-sm font-medium text-slate-700 mb-1">
              Giờ hẹn <span className="text-red-500">*</span>
            </label>
            <input
              id="appt-time"
              type="text"
              placeholder="VD: 09:00 – 09:30"
              className={`w-full py-2 px-3 border rounded-lg outline-none text-sm ${formErrors.time ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'}`}
              value={formData.time}
              onChange={e => { setFormData({ ...formData, time: e.target.value }); setFormErrors({ ...formErrors, time: '' }); }}
            />
            {formErrors.time && <p className="text-red-500 text-xs mt-1">{formErrors.time}</p>}
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => { setIsModalOpen(false); setFormData(EMPTY_FORM); setFormErrors(EMPTY_ERRORS); }}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors"
            >
              Xác nhận Thêm
            </button>
          </div>
        </form>
      </Modal>

      {/* ---- MODAL: APPOINTMENT DETAIL ---- */}
      {detailAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setDetailAppt(null)}></div>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">Chi tiết lịch hẹn</h2>
              <button onClick={() => setDetailAppt(null)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
                <X size={18} weight="bold" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 flex flex-col gap-4">
              {/* Status badge */}
              <div>
                {(() => {
                  const col = COLUMNS.find(c => c.id === detailAppt.status)!;
                  return (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${col.borderColor} bg-white text-slate-700`}>
                      <span className={`w-2 h-2 rounded-full ${col.dotColor}`}></span>
                      {col.label}
                    </span>
                  );
                })()}
              </div>

              <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-3 text-sm">
                <div className="flex items-center gap-3">
                  <User size={18} className="text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500">Bệnh nhân</p>
                    <p className="font-bold text-slate-900">{detailAppt.patientName}</p>
                  </div>
                </div>
                <div className="h-px bg-slate-200"></div>
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500">Thời gian</p>
                    <p className="font-semibold text-slate-900">{detailAppt.time}</p>
                  </div>
                </div>
                <div className="h-px bg-slate-200"></div>
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full ${detailAppt.doctorColor} shrink-0`}></div>
                  <div>
                    <p className="text-xs text-slate-500">Bác sĩ phụ trách</p>
                    <p className="font-semibold text-slate-900">{detailAppt.doctor}</p>
                  </div>
                </div>
                <div className="h-px bg-slate-200"></div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Lý do khám</p>
                  <p className="font-semibold text-slate-900">{detailAppt.reason}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex justify-between">
              <button
                onClick={() => setDetailAppt(null)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors"
              >
                Đóng
              </button>

              {NEXT_STATUS[detailAppt.status] && (
                <button
                  onClick={() => advanceStatus(detailAppt.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm transition-colors"
                >
                  <ArrowRight size={16} weight="bold" />
                  {STATUS_ACTION_LABEL[detailAppt.status]}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Appointments;
