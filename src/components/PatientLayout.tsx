import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Hexagon, CaretLeft, CaretDown,
  SquaresFour, CalendarBlank, User, FileText, Receipt, Gear,
  MagnifyingGlass, UserCircle, ChatCircleDots, Robot,
  SignOut, X
} from '@phosphor-icons/react';
import { DOCTORS } from '../PatientDoctors';

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

const PatientLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [displayName, setDisplayName] = useState('Nguyễn Văn A');
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
    : SEARCH_ITEMS_PATIENT.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleLogoutConfirm = () => {
    setShowLogout(false);
    navigate('/');
  };

  useEffect(() => {
    const saved = localStorage.getItem('patient_display_name');
    if (saved) setDisplayName(saved);
    const onStorage = () => {
      const updated = localStorage.getItem('patient_display_name');
      if (updated) setDisplayName(updated);
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('patient_name_updated', onStorage as any);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('patient_name_updated', onStorage as any);
    };
  }, []);

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
        <div className="mx-5 mb-5 p-3 border border-slate-200 rounded-xl flex items-center gap-3 cursor-pointer hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-white flex items-center justify-center font-bold text-sm shrink-0">
              BN
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-sm truncate">{displayName}</span>
              <span className="text-xs text-slate-500">Bệnh nhân</span>
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
          <div ref={searchRef} className="relative w-96">
            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Tìm kiếm bệnh án, bác sĩ..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              className="w-full py-2.5 pl-10 pr-12 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-lg text-sm outline-none transition-colors"
              aria-label="Tìm kiếm" 
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
                  <p className="text-sm font-semibold text-slate-900 mt-0.5 truncate">{displayName}</p>
                  <p className="text-xs text-slate-400 truncate">nguyenvana@example.com</p>
                </div>

                {/* Logout */}
                <div className="py-1.5">
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

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div key={location.pathname} className="animate-fade-in-up h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        open={showLogout}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogout(false)}
      />
    </div>
  );
};

export default PatientLayout;

// ─── Search Items Data Source ──────────────────────────────────────────────────
const SEARCH_ITEMS_PATIENT = [
  { type: 'page', title: 'Tổng quan', subtitle: 'Bảng điều khiển chung', path: '/patient/dashboard' },
  { type: 'page', title: 'Lịch hẹn', subtitle: 'Lịch sử và đặt lịch', path: '/patient/schedule' },
  { type: 'page', title: 'Bác sĩ', subtitle: 'Danh sách bác sĩ', path: '/patient/doctors' },
  { type: 'page', title: 'Đơn thuốc', subtitle: 'Lịch sử đơn thuốc', path: '/patient/prescriptions' },
  { type: 'page', title: 'Hóa đơn', subtitle: 'Thanh toán & hóa đơn', path: '/patient/invoices' },
  { type: 'page', title: 'Tư vấn bác sĩ', subtitle: 'Chat với bác sĩ', path: '/patient/consult-doctor' },
  { type: 'page', title: 'Tư vấn chatbot', subtitle: 'Chatbot AI hỗ trợ', path: '/patient/consult-bot' },
  ...DOCTORS.map(d => ({
    type: 'doctor',
    title: d.name,
    subtitle: d.spec,
    path: '/patient/doctors'
  }))
];
