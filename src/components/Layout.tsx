import { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Hexagon, CaretLeft, Target, ArrowsDownUp,
  SquaresFour, User, Users, CalendarBlank,
  UsersThree, Clock, Receipt, CreditCard, Gear,
  MagnifyingGlass, Sparkle, Bell, UserCircle,
  PencilSimple, Lock, BellSimple, SignOut, X,
} from '@phosphor-icons/react';

// ─── Logout Confirmation Modal ────────────────────────────────────────────────
interface LogoutModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutModal = ({ open, onConfirm, onCancel }: LogoutModalProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6"
        role="dialog"
        aria-labelledby="logout-title"
        aria-describedby="logout-desc"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <SignOut size={20} weight="fill" className="text-red-500" />
          </div>
          <h2 id="logout-title" className="font-bold text-slate-900 text-base">Đăng xuất?</h2>
          <button onClick={onCancel} className="ml-auto text-slate-400 hover:text-slate-700 transition-colors">
            <X size={18} weight="bold" />
          </button>
        </div>
        <p id="logout-desc" className="text-sm text-slate-500 mb-5 leading-relaxed">
          Bạn có chắc muốn đăng xuất khỏi hệ thống? Phiên làm việc hiện tại sẽ kết thúc.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Huỷ bỏ
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Layout ───────────────────────────────────────────────────────────────────
const Layout = () => {
  const navigate = useNavigate();
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogoutConfirm = () => {
    setShowLogout(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold transition-colors ${
      isActive
        ? 'text-blue-600 bg-blue-50 border border-blue-100'
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
        {/* ── Sidebar ── */}
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
            {/* Menu chính */}
            <div className="flex flex-col gap-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">MENU CHÍNH</div>
              <NavLink to="/dashboard" end className={navLinkClass}>
                <SquaresFour size={20} /><span>Tổng quan</span>
              </NavLink>
              <NavLink to="/dashboard/ai-assistant" className={navLinkClass}>
                <Sparkle size={20} /><span>Trợ lý AI</span>
              </NavLink>
            </div>

            {/* Phòng khám */}
            <div className="flex flex-col gap-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">PHÒNG KHÁM</div>
              <NavLink to="/dashboard/doctors" className={navLinkClass}>
                <User size={20} /><span>Bác sĩ</span>
              </NavLink>
              <NavLink to="/dashboard/patients" className={navLinkClass}>
                <Users size={20} /><span>Bệnh nhân</span>
              </NavLink>
              <NavLink to="/dashboard/appointments" className={navLinkClass}>
                <CalendarBlank size={20} /><span>Lịch hẹn</span>
              </NavLink>
            </div>

            {/* Nhân sự */}
            <div className="flex flex-col gap-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">NHÂN SỰ</div>
              <NavLink to="/dashboard/staff" className={navLinkClass}>
                <UsersThree size={20} /><span>Nhân viên</span>
              </NavLink>
              <NavLink to="/dashboard/schedule" className={navLinkClass}>
                <Clock size={20} /><span>Lịch làm việc</span>
              </NavLink>
            </div>

            {/* Tài chính */}
            <div className="flex flex-col gap-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">TÀI CHÍNH & KẾ TOÁN</div>
              <NavLink to="/dashboard/invoices" className={navLinkClass}>
                <CreditCard size={20} /><span>Hóa đơn</span>
              </NavLink>
              <NavLink to="/dashboard/expenses" className={navLinkClass}>
                <Receipt size={20} /><span>Chi phí</span>
              </NavLink>
            </div>

            {/* Cài đặt */}
            <div className="flex flex-col gap-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">CÀI ĐẶT</div>
              <NavLink to="/dashboard/settings" className={navLinkClass}>
                <Gear size={20} /><span>Thông tin phòng khám</span>
              </NavLink>
            </div>
          </nav>
        </aside>

        {/* ── Main Wrapper ── */}
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
              <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                <CalendarBlank size={20} />
              </button>
              <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                <Gear size={20} />
              </button>
              <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>

              {/* ── Avatar + Dropdown ── */}
              <div ref={avatarRef} className="relative">
                <button
                  id="btn-avatar-menu"
                  onClick={() => setAvatarOpen(prev => !prev)}
                  aria-haspopup="true"
                  aria-expanded={avatarOpen}
                  aria-label="Menu tài khoản"
                  className={`text-amber-500 flex items-center rounded-full transition-all
                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
                    ${avatarOpen ? 'ring-2 ring-blue-400 ring-offset-1' : ''}`}
                >
                  <UserCircle weight="fill" size={40} />
                </button>

                {/* Dropdown panel */}
                <div
                  role="menu"
                  className={`absolute right-0 top-[calc(100%+10px)] w-56 bg-white rounded-2xl
                    border border-slate-200 shadow-xl overflow-hidden z-50
                    transition-all duration-200 origin-top-right
                    ${avatarOpen
                      ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                    }`}
                >
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                    <p className="text-xs text-slate-500">Đăng nhập với tư cách</p>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5 truncate">Quản lý phòng khám</p>
                    <p className="text-xs text-slate-400 truncate">admin@trustcare.vn</p>
                  </div>

                  {/* Menu items */}
                  <div className="py-1.5">
                    <button
                      role="menuitem"
                      onClick={() => { setAvatarOpen(false); navigate('/dashboard/profile'); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left group"
                    >
                      <PencilSimple size={17} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                      Chỉnh sửa hồ sơ
                    </button>
                    <button
                      role="menuitem"
                      onClick={() => { setAvatarOpen(false); navigate('/dashboard/change-password'); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left group"
                    >
                      <Lock size={17} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                      Đổi mật khẩu
                    </button>
                    <button
                      role="menuitem"
                      onClick={() => { setAvatarOpen(false); navigate('/dashboard/notifications'); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left group"
                    >
                      <BellSimple size={17} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                      Thông báo
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-slate-100 py-1.5">
                    <button
                      role="menuitem"
                      onClick={() => { setAvatarOpen(false); setShowLogout(true); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left group"
                    >
                      <SignOut size={17} className="text-red-400 group-hover:text-red-600 transition-colors" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
              {/* ── End Avatar ── */}
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto p-8">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        open={showLogout}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogout(false)}
      />
    </>
  );
};

export default Layout;
