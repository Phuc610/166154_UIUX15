import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Hexagon, CaretLeft, ArrowsDownUp, CaretDown,
  SquaresFour, CalendarBlank, User, FileText, Receipt, Gear,
  MagnifyingGlass, Sparkle, Bell, UserCircle, Moon,
  ChatCircleDots, Robot
} from '@phosphor-icons/react';

const PatientLayout = () => {
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const navCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-sm transition-colors w-full text-left
    ${isActive
      ? 'text-blue-600 bg-blue-50 border border-blue-100'
      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 border border-transparent'}`;

  const subNavCls = ({ isActive }: { isActive: boolean }) =>
    `relative flex items-center py-2 px-2 text-sm font-medium transition-colors rounded-lg
    ${isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside className="w-[260px] bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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

        {/* User selector */}
        <div className="mx-5 mb-5 p-3 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-white flex items-center justify-center font-bold text-sm">
              BN
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">Nguyễn Văn A</span>
              <span className="text-xs text-slate-500">Bệnh nhân</span>
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
            <NavLink to="/patient/dashboard" end className={navCls}>
              <SquaresFour size={20} />
              <span>Tổng quan</span>
            </NavLink>
          </div>

          {/* SỨC KHỎE */}
          <div className="flex flex-col gap-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
              SỨC KHỎE
            </div>
            <NavLink to="/patient/schedule" className={navCls}>
              <CalendarBlank size={20} />
              <span>Lịch hẹn</span>
            </NavLink>
            <NavLink to="/patient/doctors" className={navCls}>
              <User size={20} />
              <span>Bác sĩ</span>
            </NavLink>
            <NavLink to="/patient/prescriptions" className={navCls}>
              <FileText size={20} />
              <span>Đơn thuốc</span>
            </NavLink>
            <NavLink to="/patient/invoices" className={navCls}>
              <Receipt size={20} />
              <span>Hóa đơn</span>
            </NavLink>
          </div>

          {/* TƯ VẤN */}
          <div className="flex flex-col gap-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
              TƯ VẤN
            </div>
            <NavLink to="/patient/consult-doctor" className={navCls}>
              <ChatCircleDots size={20} />
              <span>Tư vấn với Bác sĩ</span>
            </NavLink>
            <NavLink to="/patient/consult-bot" className={navCls}>
              <Robot size={20} />
              <span>Tư vấn với Chatbot</span>
            </NavLink>
          </div>

          {/* CÀI ĐẶT */}
          <div className="flex flex-col gap-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
              CÀI ĐẶT
            </div>
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-sm transition-colors w-full text-left ${settingsOpen ? 'text-blue-600 bg-blue-50 border border-blue-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 border border-transparent'}`}
            >
              <Gear size={20} />
              <span className="flex-1">Cài đặt</span>
              <CaretDown size={14} className={`transition-transform text-slate-400 ${settingsOpen ? 'rotate-180' : ''}`} />
            </button>
            {settingsOpen && (
              <div className="flex flex-col gap-1 mt-1 pl-11 relative before:content-[''] before:absolute before:left-[22px] before:top-2 before:bottom-3 before:w-px before:border-l before:border-dashed before:border-slate-300">
                <NavLink to="/patient/settings/profile" className={subNavCls}>
                  <div className="absolute -left-[26px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-200"></div>
                  Cài đặt hồ sơ
                </NavLink>
                <NavLink to="/patient/settings/password" className={subNavCls}>
                  <div className="absolute -left-[26px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-200"></div>
                  Đổi mật khẩu
                </NavLink>
                <NavLink to="/patient/settings/notifications" className={subNavCls}>
                  <div className="absolute -left-[26px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-200"></div>
                  Thông báo
                </NavLink>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* ── Main Content Area ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-[70px] bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="relative w-96">
            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Tìm kiếm bệnh án, bác sĩ..."
              className="w-full py-2.5 pl-10 pr-12 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-lg text-sm outline-none transition-colors"
              aria-label="Tìm kiếm" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 font-medium">⌘K</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/patient/ai-assistant')}
              className="flex items-center gap-2 bg-[#1e293b] hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
            >
              Trợ lý AI <Sparkle weight="fill" className="text-teal-400" size={16} />
            </button>
            <button aria-label="Lịch" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
              <CalendarBlank size={20} />
            </button>
            <button aria-label="Cài đặt" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
              <Gear size={20} />
            </button>
            <button aria-label="Giao diện tối" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
              <Moon size={20} />
            </button>
            <button aria-label="Thông báo" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="cursor-pointer text-amber-500 flex items-center">
              <UserCircle weight="fill" size={40} />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PatientLayout;
