import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  CalendarBlank, CaretLeft, Chat, FileText, Gear, Hexagon, Bell, User,
  X as XIcon, ArrowsDownUp, Target, SquaresFour, MagnifyingGlass, Sparkle
} from '@phosphor-icons/react';

const DoctorLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  let activeNav = 'dashboard';
  if (path.includes('schedule')) activeNav = 'schedule';
  else if (path.includes('ai-assistant')) activeNav = 'ai-assistant';
  else if (path.includes('examination') || path.includes('patients')) activeNav = 'patients';
  else if (path.includes('records')) activeNav = 'records';
  else if (path.includes('messages')) activeNav = 'messages';
  else if (path.includes('profile')) activeNav = 'profile';
  else if (path.includes('password')) activeNav = 'password';

  const navItem = (key: string, icon: React.ReactNode, label: string, onClick?: () => void) => (
    <button
      key={key}
      onClick={() => onClick?.()}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-sm transition-colors w-full text-left
        ${activeNav === key
          ? 'text-blue-600 bg-blue-50 border border-blue-100'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      {/* ── Doctor Sidebar ─────────────────────────────────────────────────── */}
      <aside className="w-[260px] bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-2 text-lg font-bold text-blue-600">
            <Hexagon weight="fill" size={24} />
            <span className="text-slate-900">Preclinic</span>
          </div>
          <button className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
            <CaretLeft size={14} />
          </button>
        </div>

        {/* Clinic selector */}
        <div className="mx-5 mb-5 p-3 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
              <Target size={16} />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">Trustcare Clinic</span>
              <span className="text-xs text-slate-500">Chi nhánh Hà Nội</span>
            </div>
          </div>
          <ArrowsDownUp size={16} className="text-slate-500" />
        </div>

        {/* Navigation */}
        <nav className="px-3 pb-6 flex flex-col gap-5">
          {/* MENU CHÍNH */}
          <div className="flex flex-col gap-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
              MENU CHÍNH
            </div>
            {navItem('dashboard', <SquaresFour size={20} weight={activeNav === 'dashboard' ? 'fill' : 'regular'} />, 'Tổng quan', () => navigate('/doctor/dashboard'))}
          </div>

          {/* PHÒNG KHÁM */}
          <div className="flex flex-col gap-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
              PHÒNG KHÁM
            </div>
            {navItem('patients',  <User size={20} />,         'Bệnh nhân', () => navigate('/doctor/patients'))}
            {navItem('schedule',  <CalendarBlank size={20} />, 'Lịch hẹn', () => navigate('/doctor/schedule'))}
            {navItem('records',   <FileText size={20} />,      'Hồ sơ bệnh án', () => navigate('/doctor/records'))}
            {navItem('messages',  <Chat size={20} />,          'Nhắn tin', () => navigate('/doctor/messages'))}
          </div>

          {/* TÀI KHOẢN */}
          <div className="flex flex-col gap-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
              TÀI KHOẢN
            </div>
            {navItem('profile',  <User size={20} />,  'Chỉnh sửa hồ sơ')}
            {navItem('password', <Gear size={20} />,  'Quản lý mật khẩu')}
            {navItem('logout',   <XIcon size={20} />, 'Đăng xuất', () => navigate('/'))}
          </div>
        </nav>
      </aside>

      {/* ── Main Content Area ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-[62px] bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="relative w-80">
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Tìm kiếm bệnh nhân, lịch hẹn..."
              className="w-full py-2 pl-9 pr-12 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg text-sm outline-none transition-colors"
              aria-label="Tìm kiếm" />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono">⌘K</kbd>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/doctor/ai-assistant')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors
                ${activeNav === 'ai-assistant' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
            >
              Trợ lý AI <Sparkle size={15} className="text-teal-400" weight="fill" />
            </button>
            <button aria-label="Lịch" onClick={() => navigate('/doctor/schedule')} className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
              <CalendarBlank size={18} />
            </button>
            <button aria-label="Cài đặt" className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
              <Gear size={18} />
            </button>
            <button aria-label="Thông báo" className="relative w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center cursor-pointer">
              <span className="text-white font-bold text-sm">AB</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
