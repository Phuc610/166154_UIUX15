import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarBlank, CaretLeft, CaretRight, Chat, CheckCircle,
  Clock, FileText, Gear, Hexagon, Bell, User, VideoCamera,
  X as XIcon, ArrowsDownUp, Target, SquaresFour,
  ChatCircle, MagnifyingGlass, Sparkle, Drop, Warning,
  Heart, Phone
} from '@phosphor-icons/react';

// ─── Constants ────────────────────────────────────────────────────────────────
const HOUR_HEIGHT  = 80;  // px per hour
const START_HOUR   = 8;
const END_HOUR     = 17;
const HOURS        = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);
const TOTAL_HEIGHT = (END_HOUR - START_HOUR) * HOUR_HEIGHT;
const DAY_LABELS   = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
const MONTH_VN     = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
                      'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];

// ─── Types ────────────────────────────────────────────────────────────────────
interface Appointment {
  id: string;
  patientName: string;
  initials: string;
  avatarBg: string;
  age: number;
  gender: 'Nam' | 'Nữ';
  bloodType: string;
  allergies: string[];
  medicalHistory: string[];
  phone: string;
  dayOfWeek: number;   // 0=Mon … 6=Sun
  startHour: number;
  startMin: number;
  durationMin: number;
  type: 'Online' | 'Trực tiếp';
  status: 'scheduled' | 'done' | 'cancelled' | 'checkin';
  specialty: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────
const APPOINTMENTS: Appointment[] = [
  {
    id: 'a1', patientName: 'Nguyễn Hồng Minh', initials: 'NM', avatarBg: 'bg-red-200',
    age: 35, gender: 'Nam', bloodType: 'A+', allergies: ['Penicillin', 'Aspirin'],
    medicalHistory: ['Tăng huyết áp (2021)', 'Tiểu đường type 2 (2022)'],
    phone: '+84 42470755', dayOfWeek: 0, startHour: 8, startMin: 0, durationMin: 45,
    type: 'Online', status: 'done', specialty: 'Tim mạch',
  },
  {
    id: 'a2', patientName: 'Trần Thị Hoa', initials: 'TH', avatarBg: 'bg-pink-200',
    age: 28, gender: 'Nữ', bloodType: 'B+', allergies: [],
    medicalHistory: ['Viêm xoang mãn tính (2020)'],
    phone: '+84 98765432', dayOfWeek: 0, startHour: 9, startMin: 10, durationMin: 20,
    type: 'Trực tiếp', status: 'checkin', specialty: 'Nội khoa',
  },
  {
    id: 'a3', patientName: 'Lê Ngọc Linh', initials: 'NL', avatarBg: 'bg-sky-200',
    age: 42, gender: 'Nữ', bloodType: 'O+', allergies: ['Sulfa', 'Latex'],
    medicalHistory: ['Hen suyễn (2015)', 'Viêm khớp (2019)'],
    phone: '+84 12345678', dayOfWeek: 1, startHour: 8, startMin: 15, durationMin: 75,
    type: 'Online', status: 'scheduled', specialty: 'Hô hấp',
  },
  {
    id: 'a4', patientName: 'Phạm Văn Đức', initials: 'VD', avatarBg: 'bg-emerald-200',
    age: 55, gender: 'Nam', bloodType: 'AB+', allergies: ['Shellfish'],
    medicalHistory: ['Bệnh mạch vành (2018)', 'Phẫu thuật tim (2020)'],
    phone: '+84 90123456', dayOfWeek: 1, startHour: 13, startMin: 15, durationMin: 45,
    type: 'Trực tiếp', status: 'scheduled', specialty: 'Tim mạch',
  },
  {
    id: 'a5', patientName: 'Hoàng Thị Mai', initials: 'TM', avatarBg: 'bg-amber-200',
    age: 31, gender: 'Nữ', bloodType: 'A-', allergies: [],
    medicalHistory: ['Trầm cảm (2021)', 'Mất ngủ mãn tính (2022)'],
    phone: '+84 97654321', dayOfWeek: 2, startHour: 10, startMin: 0, durationMin: 60,
    type: 'Online', status: 'scheduled', specialty: 'Thần kinh',
  },
  {
    id: 'a6', patientName: 'Nguyễn Văn Bình', initials: 'VB', avatarBg: 'bg-violet-200',
    age: 62, gender: 'Nam', bloodType: 'B-', allergies: ['Iodine'],
    medicalHistory: ['Tiểu đường type 1 (2010)', 'Tăng cholesterol (2015)', 'Bệnh thận mãn (2022)'],
    phone: '+84 91234567', dayOfWeek: 4, startHour: 9, startMin: 0, durationMin: 30,
    type: 'Trực tiếp', status: 'scheduled', specialty: 'Nội khoa',
  },
  {
    id: 'a7', patientName: 'Vũ Thị Lan', initials: 'TL', avatarBg: 'bg-fuchsia-200',
    age: 47, gender: 'Nữ', bloodType: 'O-', allergies: [],
    medicalHistory: ['Ung thư vú giai đoạn 1 (2023) — đang theo dõi'],
    phone: '+84 93456789', dayOfWeek: 4, startHour: 10, startMin: 30, durationMin: 90,
    type: 'Trực tiếp', status: 'scheduled', specialty: 'Ung bướu',
  },
  {
    id: 'a8', patientName: 'Đỗ Quang Huy', initials: 'QH', avatarBg: 'bg-orange-200',
    age: 19, gender: 'Nam', bloodType: 'A+', allergies: ['Penicillin'],
    medicalHistory: ['Hen phế quản (2015)'],
    phone: '+84 89012345', dayOfWeek: 3, startHour: 14, startMin: 0, durationMin: 30,
    type: 'Online', status: 'scheduled', specialty: 'Nhi khoa',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtTime = (h: number, m: number) =>
  `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;

const getTopPx  = (h: number, m: number) => ((h - START_HOUR) * 60 + m) / 60 * HOUR_HEIGHT;
const getHeightPx = (dur: number)        => Math.max(dur / 60 * HOUR_HEIGHT, 44);

const getWeekDates = (offset: number): Date[] => {
  const today = new Date();
  const dow   = today.getDay();
  const diff  = dow === 0 ? -6 : 1 - dow;      // Monday of this week
  const mon   = new Date(today);
  mon.setDate(today.getDate() + diff + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return d;
  });
};

const STATUS_CFG: Record<string, { label: string; cls: string }> = {
  done:      { label: 'Đã hoàn tất', cls: 'bg-emerald-100 text-emerald-700' },
  checkin:   { label: 'Đã check-in', cls: 'bg-amber-100 text-amber-700' },
  cancelled: { label: 'Đã hủy',      cls: 'bg-red-100 text-red-700' },
  scheduled: { label: 'Đã lên lịch', cls: 'bg-blue-100 text-blue-700' },
};

// Card accent color by type
const cardStyle = (type: string) =>
  type === 'Online'
    ? { border: 'border-l-blue-500',  bg: 'bg-blue-50',   text: 'text-blue-700' }
    : { border: 'border-l-violet-500', bg: 'bg-violet-50', text: 'text-violet-700' };

// ─── Patient Detail Modal ─────────────────────────────────────────────────────
const PatientModal = ({ appt, onClose }: { appt: Appointment; onClose: () => void }) => {
  const cs = cardStyle(appt.type);
  const endH = appt.startHour + Math.floor((appt.startMin + appt.durationMin) / 60);
  const endM = (appt.startMin + appt.durationMin) % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         role="dialog" aria-modal="true" aria-labelledby="pat-modal-title">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      {/* Card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className={`px-6 py-5 ${cs.bg} border-b border-slate-100 flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full ${appt.avatarBg} flex items-center justify-center shrink-0 shadow-sm`}>
              <span className="font-bold text-slate-700 text-lg">{appt.initials}</span>
            </div>
            <div>
              <h2 id="pat-modal-title" className="text-lg font-bold text-slate-900">{appt.patientName}</h2>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="text-sm text-slate-500">{appt.age} tuổi · {appt.gender} · Nhóm máu <strong>{appt.bloodType}</strong></span>
              </div>
              <span className={`mt-1.5 inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_CFG[appt.status].cls}`}>
                {STATUS_CFG[appt.status].label}
              </span>
            </div>
          </div>
          <button onClick={onClose} aria-label="Đóng"
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-slate-500 transition-colors shadow-sm">
            <XIcon size={16} weight="bold" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Appointment info */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
              <Clock size={16} className="text-slate-400 mx-auto mb-1" />
              <div className="text-xs text-slate-500 mb-0.5">Thời gian</div>
              <div className="font-bold text-slate-800 text-sm">
                {fmtTime(appt.startHour, appt.startMin)} – {fmtTime(endH, endM)}
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
              <VideoCamera size={16} className="text-slate-400 mx-auto mb-1" />
              <div className="text-xs text-slate-500 mb-0.5">Hình thức</div>
              <div className={`font-bold text-sm ${cs.text}`}>{appt.type}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
              <Heart size={16} className="text-slate-400 mx-auto mb-1" />
              <div className="text-xs text-slate-500 mb-0.5">Chuyên khoa</div>
              <div className="font-bold text-slate-800 text-sm">{appt.specialty}</div>
            </div>
          </div>

          {/* Allergies */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Warning size={15} className="text-amber-500" weight="fill" />
              <span className="text-sm font-bold text-slate-800">Dị ứng</span>
            </div>
            {appt.allergies.length === 0 ? (
              <p className="text-sm text-slate-400 italic">Không có dị ứng đã ghi nhận</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {appt.allergies.map(a => (
                  <span key={a} className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-xs font-semibold">
                    ⚠ {a}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Medical history */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText size={15} className="text-blue-500" weight="fill" />
              <span className="text-sm font-bold text-slate-800">Lịch sử khám bệnh</span>
            </div>
            {appt.medicalHistory.length === 0 ? (
              <p className="text-sm text-slate-400 italic">Chưa có lịch sử</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {appt.medicalHistory.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Contact */}
          <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
            <Phone size={14} className="text-slate-400" />
            {appt.phone}
          </div>
        </div>

        {/* Footer — CTAs */}
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3 bg-slate-50/50">
          <button
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-200 active:scale-95"
            aria-label="Tư vấn trực tiếp">
            <VideoCamera size={18} weight="fill" />
            Tư vấn trực tiếp
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border-2 border-slate-200 hover:border-blue-300 text-slate-700 font-bold text-sm rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-md"
            aria-label="Nhắn tin">
            <ChatCircle size={18} weight="fill" />
            Nhắn tin
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Day View ─────────────────────────────────────────────────────────────────
const DayView = ({
  dayOffset, onPrev, onNext, onSelectAppt
}: {
  dayOffset: number;
  onPrev: () => void;
  onNext: () => void;
  onSelectAppt: (a: Appointment) => void;
}) => {
  const today  = new Date();
  const target = new Date(today);
  target.setDate(today.getDate() + dayOffset);

  // dayOfWeek for appointments: JS getDay() → 0=Sun, need 0=Mon
  const jsDow = target.getDay();
  const dow   = jsDow === 0 ? 6 : jsDow - 1;

  const dayAppts = APPOINTMENTS.filter(a => a.dayOfWeek === dow);
  const isToday  = dayOffset === 0;

  const dateLabel = `${target.getDate()} ${MONTH_VN[target.getMonth()]} ${target.getFullYear()}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Day header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <button onClick={onPrev} aria-label="Ngày trước"
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors">
            <CaretLeft size={14} weight="bold" />
          </button>
          <button onClick={onNext} aria-label="Ngày sau"
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors">
            <CaretRight size={14} weight="bold" />
          </button>
        </div>

        <h3 className="text-sm font-bold text-slate-900">{dateLabel}</h3>

        <button onClick={() => { /* reset to today via onPrev/onNext logic handled in parent */ }}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            isToday ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}>
          Hôm nay
        </button>
      </div>

      {/* Time grid */}
      <div className="overflow-y-auto" style={{ maxHeight: 520 }}>
        <div className="flex" style={{ minHeight: TOTAL_HEIGHT + HOUR_HEIGHT }}>

          {/* Time labels column */}
          <div className="w-20 shrink-0 border-r border-slate-100 relative" style={{ height: TOTAL_HEIGHT + HOUR_HEIGHT }}>
            {HOURS.map((h) => (
              <div key={h}
                style={{ top: (h - START_HOUR) * HOUR_HEIGHT }}
                className="absolute left-0 right-0 flex items-start justify-end pr-4 pt-2">
                <span className="text-xs text-slate-400 font-medium tabular-nums">
                  {String(h).padStart(2, '0')}:00
                </span>
              </div>
            ))}
          </div>

          {/* Appointments area */}
          <div className="flex-1 relative" style={{ height: TOTAL_HEIGHT + HOUR_HEIGHT }}>
            {/* Hour separator lines */}
            {HOURS.map((h) => (
              <div key={h}
                style={{ top: (h - START_HOUR) * HOUR_HEIGHT }}
                className="absolute left-0 right-0 border-t border-dashed border-slate-100">
                {/* Empty slot label */}
                {!dayAppts.some(a => a.startHour === h) && (
                  <span className="text-xs text-slate-300 pl-4 pt-2 inline-block select-none">Trống</span>
                )}
              </div>
            ))}

            {/* Lunch break band */}
            <div style={{ top: (12 - START_HOUR) * HOUR_HEIGHT, height: HOUR_HEIGHT }}
              className="absolute left-0 right-0 bg-slate-50/80 border-t border-b border-slate-100 flex items-center justify-center z-0">
              <span className="text-xs text-slate-400 font-medium">Giờ nghỉ trưa</span>
            </div>

            {/* Appointment cards */}
            {dayAppts.map(appt => {
              const top    = getTopPx(appt.startHour, appt.startMin);
              const height = getHeightPx(appt.durationMin);
              const cs     = cardStyle(appt.type);
              const endH   = appt.startHour + Math.floor((appt.startMin + appt.durationMin) / 60);
              const endM   = (appt.startMin + appt.durationMin) % 60;

              return (
                <div key={appt.id}
                  style={{ top, height, left: 12, right: 16, zIndex: 10 }}
                  onClick={() => onSelectAppt(appt)}
                  className={`absolute rounded-xl border-l-4 ${cs.border} ${cs.bg} px-3 py-2 cursor-pointer
                    hover:shadow-md hover:brightness-95 transition-all group select-none`}
                  role="button" tabIndex={0} aria-label={`Lịch hẹn: ${appt.patientName}`}
                  onKeyDown={e => e.key === 'Enter' && onSelectAppt(appt)}>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-8 h-8 rounded-full ${appt.avatarBg} flex items-center justify-center shrink-0 shadow-sm`}>
                        <span className="text-[10px] font-bold text-slate-700">{appt.initials}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-sm truncate">{appt.patientName}</div>
                        {height > 56 && (
                          <div className={`text-xs font-medium ${cs.text} truncate`}>{appt.specialty}</div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className={`flex items-center gap-1 text-xs font-semibold ${cs.text}`}>
                        <VideoCamera size={12} weight="fill" />
                        {fmtTime(appt.startHour, appt.startMin)}
                      </div>
                      {appt.status === 'done' && (
                        <CheckCircle size={14} className="text-emerald-500" weight="fill" />
                      )}
                    </div>
                  </div>

                  {height > 70 && (
                    <div className="mt-1.5 ml-10 text-[11px] text-slate-500">
                      {fmtTime(appt.startHour, appt.startMin)} – {fmtTime(endH, endM)} · {appt.durationMin} phút
                    </div>
                  )}
                </div>
              );
            })}

            {/* Empty state */}
            {dayAppts.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-300">
                <CalendarBlank size={40} />
                <p className="text-sm font-medium">Không có lịch hẹn trong ngày này</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Week View ────────────────────────────────────────────────────────────────
const WeekView = ({
  weekOffset, onPrev, onNext, onSelectAppt
}: {
  weekOffset: number;
  onPrev: () => void;
  onNext: () => void;
  onSelectAppt: (a: Appointment) => void;
}) => {
  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);
  const today = new Date();

  const isTodayDate = (d: Date) =>
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  const weekLabel = `${weekDates[0].getDate()} ${MONTH_VN[weekDates[0].getMonth()]} – ${weekDates[6].getDate()} ${MONTH_VN[weekDates[6].getMonth()]} ${weekDates[6].getFullYear()}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Week header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <button onClick={onPrev} aria-label="Tuần trước"
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
            <CaretLeft size={14} weight="bold" />
          </button>
          <button onClick={onNext} aria-label="Tuần sau"
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
            <CaretRight size={14} weight="bold" />
          </button>
        </div>
        <h3 className="text-sm font-bold text-slate-900">{weekLabel}</h3>
        <div className="w-24" />
      </div>

      {/* Grid */}
      <div className="overflow-auto" style={{ maxHeight: 560 }}>
        <div className="min-w-[700px]">

          {/* Column headers */}
          <div className="grid border-b border-slate-100 sticky top-0 bg-white z-20"
            style={{ gridTemplateColumns: '72px repeat(7, 1fr)' }}>
            <div className="py-3 text-center text-xs text-slate-400 font-semibold border-r border-slate-100">Giờ</div>
            {weekDates.map((d, i) => {
              const isToday = isTodayDate(d);
              return (
                <div key={i} className={`py-3 text-center border-r border-slate-100 last:border-r-0 ${isToday ? 'bg-blue-50' : ''}`}>
                  <div className={`text-xs font-semibold mb-1 ${isToday ? 'text-blue-600' : 'text-slate-500'}`}>
                    {DAY_LABELS[i]}
                  </div>
                  <div className={`text-lg font-bold leading-none ${isToday ? 'text-blue-600' : 'text-slate-800'}`}>
                    {d.getDate()}
                    {isToday && <span className="block w-1.5 h-1.5 bg-blue-600 rounded-full mx-auto mt-1" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time grid body */}
          <div className="grid relative" style={{ gridTemplateColumns: '72px repeat(7, 1fr)', height: TOTAL_HEIGHT }}>

            {/* Time labels */}
            <div className="relative border-r border-slate-100">
              {HOURS.slice(0, -1).map((h) => (
                <div key={h}
                  style={{ top: (h - START_HOUR) * HOUR_HEIGHT, height: HOUR_HEIGHT }}
                  className="absolute left-0 right-0 border-t border-slate-100 flex items-start justify-end pr-3 pt-2">
                  <span className="text-[11px] text-slate-400 font-medium tabular-nums">
                    {String(h).padStart(2,'0')}:00
                  </span>
                </div>
              ))}
            </div>

            {/* Day columns */}
            {weekDates.map((_, dayIdx) => {
              const isToday = isTodayDate(weekDates[dayIdx]);
              const colAppts = APPOINTMENTS.filter(a => a.dayOfWeek === dayIdx);

              return (
                <div key={dayIdx}
                  className={`relative border-r border-slate-100 last:border-r-0 ${isToday ? 'bg-blue-50/30' : ''}`}
                  style={{ height: TOTAL_HEIGHT }}>

                  {/* Hour lines */}
                  {HOURS.slice(0, -1).map((h) => (
                    <div key={h}
                      style={{ top: (h - START_HOUR) * HOUR_HEIGHT, height: HOUR_HEIGHT }}
                      className="absolute left-0 right-0 border-t border-slate-100" />
                  ))}

                  {/* Lunch break */}
                  <div style={{ top: (12 - START_HOUR) * HOUR_HEIGHT, height: HOUR_HEIGHT }}
                    className="absolute left-0 right-0 bg-slate-100/60 border-t border-b border-slate-200 z-0 flex items-center justify-center">
                    {dayIdx === 3 && (
                      <span className="text-[10px] text-slate-400 font-medium">Giờ nghỉ trưa</span>
                    )}
                  </div>

                  {/* Appointment cards */}
                  {colAppts.map(appt => {
                    const top    = getTopPx(appt.startHour, appt.startMin);
                    const height = getHeightPx(appt.durationMin);
                    const cs     = cardStyle(appt.type);
                    const endH   = appt.startHour + Math.floor((appt.startMin + appt.durationMin) / 60);
                    const endM   = (appt.startMin + appt.durationMin) % 60;

                    return (
                      <div key={appt.id}
                        style={{ top, height, left: 3, right: 3, zIndex: 10 }}
                        onClick={() => onSelectAppt(appt)}
                        className={`absolute rounded-lg border-l-[3px] ${cs.border} ${cs.bg}
                          px-2 py-1.5 cursor-pointer hover:shadow-md hover:brightness-95 transition-all`}
                        role="button" tabIndex={0} aria-label={`Lịch hẹn: ${appt.patientName}`}
                        onKeyDown={e => e.key === 'Enter' && onSelectAppt(appt)}>
                        <div className={`text-[11px] font-bold ${cs.text} truncate leading-tight`}>
                          {appt.initials.replace('', '. ')} {appt.patientName.split(' ').slice(-1)[0]}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate tabular-nums">
                          {fmtTime(appt.startHour, appt.startMin)} – {fmtTime(endH, endM)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
const DoctorSchedule = () => {
  const [viewMode,    setViewMode]    = useState<'day' | 'week'>('day');
  const [dayOffset,   setDayOffset]   = useState(0);
  const [weekOffset,  setWeekOffset]  = useState(0);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

  const totalAppts = viewMode === 'day'
    ? (() => {
        const today  = new Date();
        const target = new Date(today);
        target.setDate(today.getDate() + dayOffset);
        const jsDow = target.getDay();
        const dow   = jsDow === 0 ? 6 : jsDow - 1;
        return APPOINTMENTS.filter(a => a.dayOfWeek === dow).length;
      })()
    : APPOINTMENTS.length;

  return (
    <div id="doctor-schedule-main" className="flex flex-col h-full">
          {/* Page header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Lịch trình làm việc</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {totalAppts > 0
                  ? `${totalAppts} lịch khám trong khoảng thời gian này`
                  : 'Không có lịch khám nào'}
              </p>
            </div>

            {/* View toggle — Ngày / Tuần */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1" role="group" aria-label="Chọn kiểu xem">
              {(['day', 'week'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                    viewMode === mode
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                  aria-pressed={viewMode === mode}
                >
                  {mode === 'day' ? 'Ngày' : 'Tuần'}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar view */}
          {viewMode === 'day' ? (
            <DayView
              dayOffset={dayOffset}
              onPrev={() => setDayOffset(d => d - 1)}
              onNext={() => setDayOffset(d => d + 1)}
              onSelectAppt={setSelectedAppt}
            />
          ) : (
            <WeekView
              weekOffset={weekOffset}
              onPrev={() => setWeekOffset(w => w - 1)}
              onNext={() => setWeekOffset(w => w + 1)}
              onSelectAppt={setSelectedAppt}
            />
          )}

      {/* Patient detail modal */}
      {selectedAppt && (
        <PatientModal appt={selectedAppt} onClose={() => setSelectedAppt(null)} />
      )}
    </div>
  );
};

export default DoctorSchedule;
