import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  Hexagon, CaretLeft, Target, ArrowsDownUp,
  SquaresFour, User, Users, CalendarBlank,
  UsersThree, Clock, Receipt, CreditCard, Gear,
  MagnifyingGlass, Sparkle, Bell, UserCircle
} from '@phosphor-icons/react';

const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-2 text-lg font-bold text-blue-600">
            <Hexagon weight="fill" size={24} />
            <span className="text-slate-900">Preclinic</span>
          </div>
          <button className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
            <CaretLeft size={14} />
          </button>
        </div>

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

        <nav className="px-3 pb-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">MENU CHÍNH</div>
            <NavLink 
              to="/dashboard" 
              className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold transition-colors ${isActive ? 'text-blue-600 bg-blue-50 border border-blue-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              <SquaresFour size={20} />
              <span>Tổng quan</span>
            </NavLink>
          </div>

          <div className="flex flex-col gap-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">PHÒNG KHÁM</div>
            <NavLink 
              to="/dashboard/doctors" 
              className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold transition-colors ${isActive ? 'text-blue-600 bg-blue-50 border border-blue-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              <User size={20} />
              <span>Bác sĩ</span>
            </NavLink>
            <NavLink 
              to="/dashboard/patients" 
              className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold transition-colors ${isActive ? 'text-blue-600 bg-blue-50 border border-blue-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              <Users size={20} />
              <span>Bệnh nhân</span>
            </NavLink>
            <NavLink
              to="/dashboard/appointments"
              className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold transition-colors ${isActive ? 'text-blue-600 bg-blue-50 border border-blue-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              <CalendarBlank size={20} />
              <span>Lịch hẹn</span>
            </NavLink>
          </div>

          <div className="flex flex-col gap-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">NHÂN SỰ</div>
            <NavLink
              to="/dashboard/staff"
              className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold transition-colors ${isActive ? 'text-blue-600 bg-blue-50 border border-blue-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              <UsersThree size={20} />
              <span>Nhân viên</span>
            </NavLink>
            <NavLink
              to="/dashboard/schedule"
              className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold transition-colors ${isActive ? 'text-blue-600 bg-blue-50 border border-blue-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              <Clock size={20} />
              <span>Lịch làm việc</span>
            </NavLink>
          </div>

          <div className="flex flex-col gap-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">TÀI CHÍNH & KẾ TOÁN</div>
            <NavLink
              to="/dashboard/invoices"
              className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold transition-colors ${isActive ? 'text-blue-600 bg-blue-50 border border-blue-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              <CreditCard size={20} />
              <span>Hóa đơn</span>
            </NavLink>
            <NavLink
              to="/dashboard/expenses"
              className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold transition-colors ${isActive ? 'text-blue-600 bg-blue-50 border border-blue-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              <Receipt size={20} />
              <span>Chi phí</span>
            </NavLink>
          </div>

          <div className="flex flex-col gap-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">CÀI ĐẶT</div>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 font-medium transition-colors">
              <Gear size={20} />
              <span>Thông tin phòng khám</span>
            </a>
          </div>
        </nav>
      </aside>

      {/* Main Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-[70px] bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="relative w-96">
            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm..." 
              className="w-full py-2.5 pl-10 pr-12 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-lg text-sm outline-none transition-colors"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 font-medium">⌘K</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-[#1e293b] hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
              Trợ lý AI <Sparkle weight="fill" className="text-teal-400" size={16} />
            </button>
            <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
              <CalendarBlank size={20} />
            </button>
            <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
              <Gear size={20} />
            </button>
            <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="cursor-pointer text-amber-500 flex items-center">
              <UserCircle weight="fill" size={40} />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
