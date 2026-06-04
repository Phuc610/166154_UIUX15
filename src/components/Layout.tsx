import { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Hexagon, CaretLeft,
  SquaresFour, User, Users, CalendarBlank,
  UsersThree, Clock, Receipt, CreditCard, Gear,
  MagnifyingGlass, UserCircle,
  PencilSimple, Lock, BellSimple, SignOut, X, CaretDown,
} from '@phosphor-icons/react';
import { MOCK_PATIENTS_LIST } from '../Patients';
import { MOCK_DOCTORS_LIST } from '../Doctors';

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
  const location = useLocation();
  const path = location.pathname;
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [adminName, setAdminName] = useState(() => localStorage.getItem('admin_display_name') || 'Quản lý phòng khám');
  const [adminEmail, setAdminEmail] = useState(() => localStorage.getItem('admin_email') || 'admin@trustcare.vn');

  useEffect(() => {
    const handleUpdate = () => {
      setAdminName(localStorage.getItem('admin_display_name') || 'Quản lý phòng khám');
      setAdminEmail(localStorage.getItem('admin_email') || 'admin@trustcare.vn');
    };
    window.addEventListener('admin_profile_updated', handleUpdate);
    return () => window.removeEventListener('admin_profile_updated', handleUpdate);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Keyboard shortcut (Ctrl+K or Cmd+K) to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredSearch = searchQuery.trim() === ''
    ? []
    : SEARCH_ITEMS.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleLogoutConfirm = () => {
    setShowLogout(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-sm transition-colors w-full text-left border ${
      isActive
        ? 'text-blue-600 bg-blue-50 border-blue-100'
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 border-transparent'
    }`;

  const subNavCls = ({ isActive }: { isActive: boolean }) =>
    `relative flex items-center py-2 px-2 text-sm font-medium transition-colors rounded-lg
    ${isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`;

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

          {/* Profile */}
          <div className="mx-5 mb-5 p-3 border border-slate-200 rounded-xl flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm uppercase">
                {adminName.substring(0, 2)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-sm text-slate-900 truncate pr-2" title={adminName}>{adminName}</span>
                <span className="text-xs text-slate-500 truncate">Ban điều hành</span>
              </div>
            </div>
          </div>

          <nav className="px-3 pb-6 flex flex-col gap-5">
            {/* Menu chính */}
            <div className="flex flex-col gap-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">MENU CHÍNH</div>
              <NavLink to="/dashboard" end className={navLinkClass}>
                <SquaresFour size={20} /><span>Tổng quan</span>
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
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-sm transition-colors w-full text-left border ${settingsOpen || path.includes('/dashboard/settings') || path.includes('/dashboard/profile') || path.includes('/dashboard/change-password') || path.includes('/dashboard/notifications') ? 'text-blue-600 bg-blue-50 border-blue-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 border-transparent'}`}
              >
                <Gear size={20} />
                <span className="flex-1">Cài đặt</span>
                <CaretDown size={14} className={`transition-transform text-slate-400 ${settingsOpen ? 'rotate-180' : ''}`} />
              </button>
              {settingsOpen && (
                <div className="flex flex-col gap-1 mt-1 pl-11 relative before:content-[''] before:absolute before:left-[22px] before:top-2 before:bottom-3 before:w-px before:border-l before:border-dashed before:border-slate-300">
                  <NavLink to="/dashboard/settings" end className={subNavCls}>
                    <div className="absolute -left-[26px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-200"></div>
                    Thông tin phòng khám
                  </NavLink>
                  <NavLink to="/dashboard/profile" className={subNavCls}>
                    <div className="absolute -left-[26px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-200"></div>
                    Cài đặt hồ sơ
                  </NavLink>
                  <NavLink to="/dashboard/change-password" className={subNavCls}>
                    <div className="absolute -left-[26px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-200"></div>
                    Đổi mật khẩu
                  </NavLink>
                  <NavLink to="/dashboard/notifications" className={subNavCls}>
                    <div className="absolute -left-[26px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-200"></div>
                    Thông báo
                  </NavLink>
                </div>
              )}
            </div>
          </nav>
        </aside>

        {/* ── Main Wrapper ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-[70px] bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
            <div ref={searchRef} className="relative w-96">
              <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                className="w-full py-2.5 pl-10 pr-12 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-lg text-sm outline-none transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 font-medium">⌘K</span>

              {/* Search Dropdown */}
              {searchOpen && searchQuery.trim() !== '' && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] max-h-[320px] overflow-y-auto bg-white rounded-xl border border-slate-200 shadow-xl z-50 py-2">
                  {filteredSearch.length > 0 ? (
                    filteredSearch.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchQuery('');
                          setSearchOpen(false);
                          navigate(item.path);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-left transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                          {item.type === 'page' && <SquaresFour size={16} className="text-blue-500" />}
                          {item.type === 'doctor' && <User size={16} className="text-emerald-500" />}
                          {item.type === 'patient' && <Users size={16} className="text-violet-500" />}
                          {item.type === 'invoice' && <Receipt size={16} className="text-amber-500" />}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-semibold text-slate-800 truncate">{item.title}</span>
                          <span className="text-xs text-slate-400 truncate">{item.subtitle}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-sm text-slate-400 font-medium">
                      Không tìm thấy kết quả cho "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
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
                    <p className="text-sm font-semibold text-slate-900 mt-0.5 truncate">{adminName}</p>
                    <p className="text-xs text-slate-400 truncate">{adminEmail}</p>
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
            <div key={location.pathname} className="animate-fade-in-up h-full">
              <Outlet />
            </div>
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

// ─── Search Items Data Source ──────────────────────────────────────────────────
const SEARCH_ITEMS = [
  // Pages
  { type: 'page', title: 'Tổng quan', subtitle: 'Báo cáo hoạt động phòng khám', path: '/dashboard' },
  { type: 'page', title: 'Bác sĩ', subtitle: 'Quản lý danh sách bác sĩ', path: '/dashboard/doctors' },
  { type: 'page', title: 'Bệnh nhân', subtitle: 'Quản lý thông tin bệnh nhân', path: '/dashboard/patients' },
  { type: 'page', title: 'Lịch hẹn', subtitle: 'Xem & đặt lịch khám bệnh', path: '/dashboard/appointments' },
  { type: 'page', title: 'Nhân viên', subtitle: 'Quản lý nhân viên phòng khám', path: '/dashboard/staff' },
  { type: 'page', title: 'Lịch làm việc', subtitle: 'Xem lịch trực & phân ca', path: '/dashboard/schedule' },
  { type: 'page', title: 'Hóa đơn', subtitle: 'Quản lý hóa đơn & thanh toán', path: '/dashboard/invoices' },
  { type: 'page', title: 'Chi phí', subtitle: 'Chi phí vận hành & vật tư', path: '/dashboard/expenses' },
  { type: 'page', title: 'Cài đặt phòng khám', subtitle: 'Thông tin chung phòng khám', path: '/dashboard/settings' },
  { type: 'page', title: 'Cài đặt hồ sơ', subtitle: 'Chỉnh sửa hồ sơ cá nhân', path: '/dashboard/profile' },
  { type: 'page', title: 'Đổi mật khẩu', subtitle: 'Thay đổi mật khẩu tài khoản', path: '/dashboard/change-password' },
  { type: 'page', title: 'Cài đặt thông báo', subtitle: 'Tùy chỉnh thông báo cá nhân', path: '/dashboard/notifications' },
  // Doctors
  ...MOCK_DOCTORS_LIST.map(d => ({
    type: 'doctor',
    title: d.name,
    subtitle: `Mã: ${d.id} • ${d.specialty}`,
    path: '/dashboard/doctors'
  })),
  // Patients
  ...MOCK_PATIENTS_LIST.map(p => ({
    type: 'patient',
    title: p.name,
    subtitle: `Mã: ${p.id} • SĐT: ${p.phone}`,
    path: '/dashboard/patients'
  })),
  // Invoices
  { type: 'invoice', title: 'Hóa đơn HD-001', subtitle: 'Số tiền: 500,000 đ • Trạng thái: Đã thanh toán', path: '/dashboard/invoices' },
  { type: 'invoice', title: 'Hóa đơn HD-002', subtitle: 'Số tiền: 1,200,000 đ • Trạng thái: Chờ thanh toán', path: '/dashboard/invoices' },
  { type: 'invoice', title: 'Hóa đơn HD-003', subtitle: 'Số tiền: 850,000 đ • Trạng thái: Đã thanh toán', path: '/dashboard/invoices' },
];
