import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, NavLink } from 'react-router-dom';
import {
  CalendarBlank, CaretLeft, Chat, FileText, Gear, Hexagon, Bell, User,
  X as XIcon, SquaresFour, MagnifyingGlass, Sparkle, CaretDown
} from '@phosphor-icons/react';

const DoctorLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'calendar', title: 'Nguyễn Văn A', message: 'vừa đặt lịch khám mới lúc 09:00.', time: '10 phút trước', isRead: false },
    { id: 2, type: 'lab', title: 'Trần Thị B', message: 'Có kết quả xét nghiệm mới', time: '1 giờ trước', isRead: false }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const loadMoreNotifications = () => {
    setNotifications(prev => [
      ...prev,
      { id: Date.now(), type: 'calendar', title: 'Lê Văn C', message: 'đã hủy lịch hẹn khám.', time: 'Hôm qua', isRead: true },
      { id: Date.now() + 1, type: 'lab', title: 'Hệ thống', message: 'Cập nhật phiên bản phần mềm thành công.', time: 'Hôm qua', isRead: true }
    ]);
  };

  const subNavCls = ({ isActive }: { isActive: boolean }) =>
    `relative flex items-center py-2 px-2 text-sm font-medium transition-colors rounded-lg
    ${isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`;

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
          <div onClick={() => navigate('/')} className="flex items-center gap-2 text-lg font-bold text-blue-600 cursor-pointer">
            <Hexagon weight="fill" size={24} />
            <span className="text-slate-900">Preclinic</span>
          </div>
          <button onClick={() => navigate('/')} aria-label="Trở về trang chủ" className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
            <CaretLeft size={14} />
          </button>
        </div>

        {/* Profile */}
        <div className="mx-5 mb-5 p-3 border border-slate-200 rounded-xl flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-400 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              ĐP
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-slate-900">BS. Phạm Văn Đức</span>
              <span className="text-xs text-slate-500">Bác sĩ chuyên khoa</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 pb-6 flex flex-col gap-5">
          {/* MENU CHÍNH */}
          <div className="flex flex-col gap-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
              MENU CHÍNH
            </div>
            {navItem('dashboard', <SquaresFour size={20} weight={activeNav === 'dashboard' ? 'fill' : 'regular'} />, 'Tổng quan', () => navigate('/doctor/dashboard'))}
            {navItem('ai-assistant', <Sparkle size={20} weight={activeNav === 'ai-assistant' ? 'fill' : 'regular'} />, 'Trợ lý AI', () => navigate('/doctor/ai-assistant'))}
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

          {/* CÀI ĐẶT */}
          <div className="flex flex-col gap-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
              CÀI ĐẶT
            </div>
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-sm transition-colors w-full text-left ${settingsOpen || activeNav === 'profile' || activeNav === 'password' ? 'text-blue-600 bg-blue-50 border border-blue-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 border border-transparent'}`}
            >
              <Gear size={20} />
              <span className="flex-1">Cài đặt</span>
              <CaretDown size={14} className={`transition-transform text-slate-400 ${settingsOpen ? 'rotate-180' : ''}`} />
            </button>
            {settingsOpen && (
              <div className="flex flex-col gap-1 mt-1 pl-11 relative before:content-[''] before:absolute before:left-[22px] before:top-2 before:bottom-3 before:w-px before:border-l before:border-dashed before:border-slate-300">
                <NavLink to="/doctor/settings/profile" className={subNavCls}>
                  <div className="absolute -left-[26px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-200"></div>
                  Cài đặt hồ sơ
                </NavLink>
                <NavLink to="/doctor/settings/password" className={subNavCls}>
                  <div className="absolute -left-[26px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-200"></div>
                  Đổi mật khẩu
                </NavLink>
                <NavLink to="/doctor/settings/notifications" className={subNavCls}>
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
        <header className="h-[62px] bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="relative w-80">
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Tìm kiếm bệnh nhân, lịch hẹn..."
              className="w-full py-2 pl-9 pr-12 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg text-sm outline-none transition-colors"
              aria-label="Tìm kiếm" />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono">⌘K</kbd>
          </div>
          <div className="flex items-center gap-3">

            <button aria-label="Lịch" onClick={() => navigate('/doctor/schedule')} className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
              <CalendarBlank size={18} />
            </button>
            <button aria-label="Cài đặt" onClick={() => navigate('/doctor/settings/profile')} className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
              <Gear size={18} />
            </button>
            
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                aria-label="Thông báo" 
                className="relative w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
              >
                <Bell size={18} />
                {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />}
              </button>
              
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                      <h3 className="font-bold text-slate-900">Thông báo mới</h3>
                      {unreadCount > 0 && (
                        <span onClick={markAllAsRead} className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline">Đánh dấu đã đọc</span>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer flex gap-3 relative">
                          {!n.isRead && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-red-500 rounded-full" />}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ml-2 ${n.type === 'calendar' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                            {n.type === 'calendar' ? <CalendarBlank size={20} weight="fill" /> : <FileText size={20} weight="fill" />}
                          </div>
                          <div>
                            <p className={`text-sm font-medium line-clamp-2 ${n.isRead ? 'text-slate-500' : 'text-slate-700'}`}>
                              {n.type === 'calendar' ? (
                                <>Bệnh nhân <span className={`font-bold ${n.isRead ? 'text-slate-600' : 'text-slate-900'}`}>{n.title}</span> {n.message}</>
                              ) : (
                                <>{n.message} của <span className={`font-bold ${n.isRead ? 'text-slate-600' : 'text-slate-900'}`}>{n.title}</span>.</>
                              )}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">{n.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 text-center border-t border-slate-100">
                      <button onClick={loadMoreNotifications} className="text-sm font-semibold text-blue-600 hover:text-blue-700">Xem tất cả</button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <div 
                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-amber-200 transition-all"
              >
                <span className="text-white font-bold text-sm">ĐP</span>
              </div>

              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 z-50 py-2">
                    <div className="px-4 py-3 border-b border-slate-100 mb-2">
                      <p className="text-sm font-bold text-slate-900">BS. Phạm Văn Đức</p>
                      <p className="text-xs text-slate-500 truncate">dr.ducpham@preclinic.com</p>
                    </div>
                    <button onClick={() => { setShowProfileMenu(false); navigate('/doctor/settings/profile'); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                      <User size={16} /> Hồ sơ cá nhân
                    </button>
                    <button onClick={() => { setShowProfileMenu(false); navigate('/doctor/settings/password'); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                      <Gear size={16} /> Cài đặt tài khoản
                    </button>
                    <div className="border-t border-slate-100 my-2"></div>
                    <button onClick={() => { setShowProfileMenu(false); navigate('/'); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium">
                      <XIcon size={16} /> Đăng xuất
                    </button>
                  </div>
                </>
              )}
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
