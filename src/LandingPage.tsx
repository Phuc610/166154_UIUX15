import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Stethoscope, Heart, Brain, Baby, Flask, Syringe,
  ChatCircle, ShieldCheck, Clock, Users,
  CheckCircle, X, ArrowRight, Sparkle,
  UserCircle, Buildings, FirstAid,
  ChatTeardropDots, Robot
} from '@phosphor-icons/react';

// ─── Role Selection Modal ────────────────────────────────────────────────────
const ROLES = [
  {
    key: 'admin',
    label: 'Quản lý',
    desc: 'Quản lý toàn bộ hệ thống, nhân sự, tài chính và báo cáo phòng khám',
    icon: <Buildings size={32} weight="fill" />,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    border: 'hover:border-blue-400',
    badge: 'bg-blue-50 text-blue-700',
    route: '/dashboard',
    features: ['Tổng quan hệ thống', 'Quản lý nhân sự', 'Báo cáo tài chính'],
  },
  {
    key: 'doctor',
    label: 'Bác sĩ',
    desc: 'Quản lý lịch hẹn cá nhân, xem hồ sơ bệnh nhân và tư vấn trực tuyến',
    icon: <Stethoscope size={32} weight="fill" />,
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    border: 'hover:border-indigo-400',
    badge: 'bg-indigo-50 text-indigo-700',
    route: '/doctor/dashboard',
    features: ['Dashboard bác sĩ', 'Lịch hẹn của tôi', 'Hồ sơ bệnh nhân'],
  },
  {
    key: 'patient',
    label: 'Bệnh nhân',
    desc: 'Đặt lịch khám, theo dõi hồ sơ sức khỏe và nhận tư vấn từ bác sĩ',
    icon: <FirstAid size={32} weight="fill" />,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    border: 'hover:border-emerald-400',
    badge: 'bg-emerald-50 text-emerald-700',
    route: '/patient/dashboard',
    features: ['Đặt lịch khám', 'Hồ sơ sức khỏe', 'Tư vấn AI'],
  },
];

const RoleModal = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [animIn, setAnimIn] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setAnimIn(true));
  }, []);

  const handleConfirm = () => {
    const role = ROLES.find(r => r.key === selected);
    if (role) {
      onClose();
      navigate(role.route);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog" aria-modal="true" aria-labelledby="role-modal-title"
    >
      <div
        className={`absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300 ${animIn ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div className={`relative z-10 bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden transition-all duration-300 ${animIn ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}>
        {/* Header */}
        <div className="px-10 pt-10 pb-6 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <UserCircle size={22} className="text-white" weight="fill" />
                </div>
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 text-lg">Đăng Nhập</span>
              </div>
              <h2 id="role-modal-title" className="text-3xl font-black text-slate-900 tracking-tight">Xác nhận vai trò</h2>
              <p className="text-slate-500 mt-2 text-base">Vui lòng chọn đúng vai trò để hệ thống tải giao diện phù hợp nhất.</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} weight="bold" />
            </button>
          </div>
        </div>

        {/* Role cards */}
        <div className="px-10 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50/50">
          {ROLES.map((role, idx) => (
            <button
              key={role.key}
              onClick={() => setSelected(role.key)}
              className={`group relative text-left p-6 rounded-2xl border-2 transition-all duration-500 cursor-pointer overflow-hidden transform
                ${animIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                ${selected === role.key
                  ? 'border-blue-600 bg-white shadow-xl shadow-blue-100/50 scale-[1.02] ring-4 ring-blue-50'
                  : `border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg hover:-translate-y-1`
                }`}
              style={{ transitionDelay: `${idx * 75}ms` }}
            >
              {selected === role.key && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-sm animate-fade-in-up">
                  <CheckCircle size={16} className="text-white" weight="bold" />
                </div>
              )}

              <div className={`w-16 h-16 rounded-2xl ${role.iconBg} ${role.iconColor} flex items-center justify-center mb-5 transition-transform duration-500 ease-out group-hover:scale-110 shadow-sm`}>
                {role.icon}
              </div>

              <div className="font-black text-slate-900 text-lg mb-2">{role.label}</div>
              <div className="text-sm text-slate-500 leading-relaxed mb-4">{role.desc}</div>
              
              <div className="w-8 h-1 bg-slate-200 rounded-full mb-4 transition-colors group-hover:bg-blue-300" />

              <ul className="flex flex-col gap-2">
                {role.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <CheckCircle size={14} className={selected === role.key ? 'text-blue-600' : 'text-slate-400'} weight="fill" />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-10 py-6 border-t border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <ShieldCheck size={18} weight="fill" className="text-emerald-500" /> Dữ liệu mã hóa chuẩn y tế E2E
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selected}
              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
            >
              Đăng Nhập Ngay <ArrowRight size={18} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingModal = ({ onClose }: { onClose: () => void }) => {
  const [animIn, setAnimIn] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setAnimIn(true));
  }, []);

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300 ${animIn ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      {/* Modal Card */}
      <div className={`relative z-10 bg-white rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden transition-all duration-300 ${animIn ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}>
        {!isSubmitted ? (
          <>
            <div className="px-8 pt-8 pb-6 border-b border-slate-100 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                    <Buildings size={16} className="text-white" weight="bold" />
                  </div>
                  <span className="font-bold text-indigo-600 text-base">Preclinic Booking</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900">Đặt Lịch Khám</h2>
                <p className="text-sm text-slate-500 mt-1">Nhanh chóng, tiện lợi, không phải chờ đợi.</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X size={16} weight="bold" />
              </button>
            </div>
            
            <div className="p-8 bg-slate-50/50">
               {/* Simple Booking Form */}
               <div className="flex flex-col gap-5">
                 <div>
                   <label className="text-sm font-bold text-slate-700 mb-2 block">Chuyên khoa</label>
                   <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 shadow-sm transition-colors">
                     <option>Nội khoa tổng quát</option>
                     <option>Tim mạch</option>
                     <option>Nhi khoa</option>
                   </select>
                 </div>
                 <div className="flex gap-4">
                   <div className="flex-1">
                     <label className="text-sm font-bold text-slate-700 mb-2 block">Ngày khám</label>
                     <input type="date" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 shadow-sm transition-colors" />
                   </div>
                   <div className="flex-1">
                     <label className="text-sm font-bold text-slate-700 mb-2 block">Giờ khám</label>
                     <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 shadow-sm transition-colors">
                       <option>08:00 - 09:00</option>
                       <option>09:00 - 10:00</option>
                       <option>10:00 - 11:00</option>
                     </select>
                   </div>
                 </div>
                 <div>
                   <label className="text-sm font-bold text-slate-700 mb-2 block">Thông tin liên hệ</label>
                   <input type="text" placeholder="Họ và tên" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 shadow-sm transition-colors mb-3" />
                   <input type="tel" placeholder="Số điện thoại" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 shadow-sm transition-colors" />
                 </div>
               </div>
            </div>

            <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <ShieldCheck size={18} weight="fill" className="text-emerald-500" /> Dữ liệu được bảo mật
              </div>
              <div className="flex gap-3">
                <button onClick={onClose} className="px-6 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors">Hủy</button>
                <button onClick={handleSubmit} className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-indigo-200 flex items-center gap-2">Xác nhận đặt lịch <ArrowRight size={16} weight="bold" /></button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-10 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <CheckCircle size={40} className="text-emerald-600" weight="fill" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Đặt Lịch Thành Công!</h2>
            <p className="text-slate-500 text-center max-w-sm mb-8 leading-relaxed">
              Cảm ơn bạn đã tin tưởng Preclinic. Mã số khám bệnh và hướng dẫn chi tiết đã được gửi đến số điện thoại của bạn.
            </p>
            <button 
              onClick={onClose} 
              className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm transition-colors w-full sm:w-auto"
            >
              Trở về trang chủ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Mini components ─────────────────────────────────────────────────────────
const NavLink = ({ children, href }: { children: React.ReactNode, href: string }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <a href={href} onClick={handleClick} className="text-sm text-slate-600 hover:text-blue-700 font-medium transition-colors relative group">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
    </a>
  );
};



const SERVICES = [
  { icon: <Stethoscope size={22} />, title: 'Nội khoa tổng quát', desc: 'Khám, theo dõi và điều trị các bệnh lý nội khoa thường gặp', price: '200.000đ' },
  { icon: <Heart size={22} />, title: 'Tim mạch', desc: 'Đo ECG, siêu âm tim, tư vấn bệnh lý tim mạch và huyết áp', price: '350.000đ' },
  { icon: <Baby size={22} />, title: 'Nhi khoa', desc: 'Chăm sóc sức khỏe toàn diện cho trẻ từ sơ sinh đến 16 tuổi', price: '220.000đ' },
  { icon: <Brain size={22} />, title: 'Thần kinh', desc: 'Đau đầu, chóng mặt, rối loạn giấc ngủ, căng thẳng mạn tính', price: '300.000đ' },
  { icon: <Flask size={22} />, title: 'Xét nghiệm', desc: 'Xét nghiệm máu, nước tiểu, sinh hóa tổng quát & chuyên sâu', price: 'từ 150.000đ' },
  { icon: <Syringe size={22} />, title: 'Tiêm chủng', desc: 'Vaccine theo lịch khuyến nghị của Bộ Y tế cho mọi độ tuổi', price: 'theo vaccine' },
];

type ChatMsg = {
  id: number;
  from: 'bot' | 'user';
  text: string;
  options?: string[];
};

const INITIAL_SCENARIO: ChatMsg[] = [
  { id: 1, from: 'bot', text: 'Tôi có thể hỗ trợ khảo sát triệu chứng ban đầu, nhưng không thay thế bác sĩ. Thông tin của bạn được bảo mật hoàn toàn.' },
  { id: 2, from: 'bot', text: 'Hôm nay bạn đang gặp vấn đề gì?', options: ['Sốt / Ớn lạnh', 'Đau đầu / Chóng mặt', 'Đau tức ngực', 'Triệu chứng khác'] }
];

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2000&auto=format&fit=crop',
];

// ─── Main Landing Page ────────────────────────────────────────────────────────
const LandingPage = () => {
  const location = useLocation();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>(INITIAL_SCENARIO);
  const [isTyping, setIsTyping] = useState(false);

  const [currentSlide, setCurrentSlide] = useState(0);


  useEffect(() => {
    if (location.search.includes('login=true')) {
      setShowRoleModal(true);
    }
  }, [location.search]);

  const handleOptionClick = (option: string) => {
    setMessages(prev => {
      const newMsgs = [...prev];
      if (newMsgs.length > 0) {
        newMsgs[newMsgs.length - 1] = { ...newMsgs[newMsgs.length - 1], options: undefined };
      }
      return [...newMsgs, { id: Date.now(), from: 'user', text: option }];
    });

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => {
        const nextId = Date.now();
        if (option === 'Sốt / Ớn lạnh') {
          return [...prev, { id: nextId, from: 'bot', text: 'Triệu chứng này xuất hiện từ bao lâu rồi?', options: ['Vừa mới hôm nay', '1-3 ngày', '4-7 ngày', 'Hơn 1 tuần'] }];
        }
        if (option === 'Đau đầu / Chóng mặt') {
          return [...prev, { id: nextId, from: 'bot', text: 'Bạn có kèm theo dấu hiệu buồn nôn hay mờ mắt không?', options: ['Chỉ đau đầu', 'Kèm buồn nôn', 'Mờ mắt', 'Cả hai'] }];
        }
        if (option === 'Đau tức ngực') {
          return [...prev, { id: nextId, from: 'bot', text: 'Đây là triệu chứng có nguy cơ cao. Cơn đau có lan ra tay trái hoặc sau lưng không?', options: ['Có lan ra', 'Chỉ đau tại chỗ', 'Đau khi hít sâu'] }];
        }
        if (['Vừa mới hôm nay', '1-3 ngày', '4-7 ngày', 'Hơn 1 tuần'].includes(option)) {
           return [...prev, { id: nextId, from: 'bot', text: 'Bạn có đo nhiệt độ cơ thể không?', options: ['Trên 38.5 độ', 'Dưới 38.5 độ', 'Không đo'] }];
        }
        if (['Trên 38.5 độ', 'Dưới 38.5 độ', 'Không đo', 'Chỉ đau đầu', 'Kèm buồn nôn', 'Mờ mắt', 'Cả hai'].includes(option)) {
           return [...prev, { id: nextId, from: 'bot', text: 'Dựa trên triệu chứng, bạn nên gặp bác sĩ sớm để được thăm khám chi tiết.', options: ['Đặt lịch ngay', 'Tôi sẽ theo dõi thêm'] }];
        }
        if (['Có lan ra', 'Chỉ đau tại chỗ', 'Đau khi hít sâu'].includes(option)) {
           return [...prev, { id: nextId, from: 'bot', text: '⚠️ CẢNH BÁO: Hãy đến cơ sở y tế gần nhất hoặc gọi cấp cứu ngay!', options: ['Gọi cấp cứu (115)', 'Đặt lịch khám khẩn'] }];
        }
        if (option === 'Đặt lịch ngay' || option === 'Đặt lịch khám khẩn') {
           setShowBookingModal(true);
           return [...prev, { id: nextId, from: 'bot', text: 'Mời bạn điền thông tin vào phiếu đặt lịch vừa mở nhé.' }];
        }
        
        return [...prev, { id: nextId, from: 'bot', text: 'Cảm ơn bạn. Nếu có triệu chứng bất thường, hãy đến phòng khám ngay.', options: ['Bắt đầu lại khảo sát'] }];
      });
    }, 1000);
  };



  // Slider animation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* ── Navbar ──────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Stethoscope size={18} className="text-white" weight="bold" />
            </div>
            <span className="font-extrabold text-slate-900 text-lg tracking-tight">Preclinic</span>
          </a>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="#">Trang chủ</NavLink>
            <NavLink href="#services">Chuyên khoa</NavLink>
            <NavLink href="#ai-chatbot">SageCare</NavLink>
            <NavLink href="#pricing">Bảng giá</NavLink>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              id="login-btn"
              onClick={() => setShowRoleModal(true)}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-700 transition-colors"
              aria-label="Đăng nhập"
            >
              Đăng nhập
            </button>
            <button
              onClick={() => setShowBookingModal(true)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all hover:shadow-md hover:shadow-blue-200 active:scale-95"
              aria-label="Đặt lịch khám"
            >
              Đặt lịch khám
            </button>
          </div>
        </div>
      </nav>

      {/* ── New Centered Hero Section ────────────────────────────────────────── */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-blue-50/50 to-white relative overflow-hidden text-center">
        <div className="max-w-5xl mx-auto px-6 relative z-10 mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white border border-slate-200 shadow-sm text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
            <Sparkle size={14} weight="fill" className="text-amber-500" />
            Hệ thống y tế tiêu chuẩn quốc tế
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight mb-6 tracking-tight">
            <span className="text-blue-600">Giải Pháp Sức Khỏe</span>
            <br /> Tối Ưu Dành Cho Gia Đình
          </h1>

          <p className="text-slate-500 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            Tích hợp trí tuệ nhân tạo thông minh nhằm nhận diện triệu chứng nhanh chóng, đồng thời kết nối bạn với chuyên gia y tế hàng đầu.
          </p>

          {/* CTA buttons */}
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => setShowRoleModal(true)} className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-sm transition-all hover:shadow-xl hover:-translate-y-1">
              <ChatCircle size={18} weight="fill" />
              Tư vấn miễn phí ngay
            </button>
            <button 
              onClick={() => setShowBookingModal(true)}
              className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-full text-sm transition-all hover:shadow-md hover:-translate-y-1">
              <Buildings size={18} />
              Đặt lịch khám
            </button>
          </div>
        </div>

        {/* Wide Slider Container */}
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="relative h-[450px] md:h-[550px] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
            {HERO_IMAGES.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Slide ${idx + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  idx === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />
            
            {/* Slider indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
              {HERO_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>

            {/* Floating Trust Card inside Hero */}
            <div className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4 text-white hidden md:flex">
              <div className="flex -space-x-2">
                <img src="https://i.pravatar.cc/100?img=1" className="w-10 h-10 rounded-full border-2 border-white" />
                <img src="https://i.pravatar.cc/100?img=2" className="w-10 h-10 rounded-full border-2 border-white" />
                <img src="https://i.pravatar.cc/100?img=3" className="w-10 h-10 rounded-full border-2 border-white" />
                <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-500 flex items-center justify-center font-bold text-xs">+50k</div>
              </div>
              <div>
                <div className="font-bold">Bệnh nhân tin tưởng</div>
                <div className="text-xs text-blue-100">Đã trải nghiệm dịch vụ</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ───────────────────────────────────────────────────────── */}
      <div className="bg-blue-700 text-white py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-4 gap-0 divide-x divide-blue-600">
            {[
              { icon: <ShieldCheck size={18} weight="fill" />, text: 'Bảo mật thông tin tuyệt đối' },
              { icon: <UserCircle size={18} weight="fill" />, text: 'Bác sĩ có chứng chỉ hành nghề' },
              { icon: <Clock size={18} weight="fill" />, text: 'Mở cửa 07:00 – 21:00 hàng ngày' },
              { icon: <Users size={18} weight="fill" />, text: '50.000+ bệnh nhân tin tưởng' },
            ].map(item => (
              <div key={item.text} className="flex items-center justify-center gap-2.5 px-4">
                <span className="text-blue-200">{item.icon}</span>
                <span className="text-sm font-medium text-blue-50">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Services Section (New Layout) ────────────────────────────────────── */}
      <section id="services" className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Left: Title & Info */}
            <div className="lg:w-1/3 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                Danh Mục Chuyên Khoa
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                Đội Ngũ Chuyên Gia Giàu Kinh Nghiệm
              </h2>
              <p className="text-slate-500 text-base leading-relaxed mb-8">
                Cơ sở y tế <span className="text-indigo-600 font-bold">Preclinic</span> tự hào mang đến các phác đồ điều trị chuẩn y khoa, đáp ứng mọi nhu cầu từ tổng quát tới chuyên sâu. Hệ thống trang thiết bị tối tân giúp việc chẩn đoán nhanh chóng và chính xác.
              </p>
              <button onClick={() => setShowServicesModal(true)} className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-sm transition-colors flex items-center gap-2">
                Xem toàn bộ dịch vụ <ArrowRight size={16} />
              </button>
            </div>

            {/* Right: Grid */}
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
              {SERVICES.map(svc => (
                <div key={svc.title} className="group p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-slate-50 text-slate-900 border-slate-100 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 cursor-pointer">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300 bg-white shadow-sm text-indigo-600 group-hover:bg-white/20 group-hover:text-white group-hover:shadow-none">
                    {svc.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{svc.title}</h3>
                  <p className="text-sm leading-relaxed mb-4 transition-colors duration-300 text-slate-500 group-hover:text-indigo-100">{svc.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── AI Chatbot Section (Flipped) ─────────────────────────────────────── */}
      <section id="ai-chatbot" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">

            {/* Left: Mobile Chat UI mockup */}
            <div className="lg:w-1/2 relative flex justify-center">
              <div className="w-[320px] bg-white rounded-[2.5rem] border-8 border-slate-900 shadow-2xl overflow-hidden relative">
                {/* Dynamic Island Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-b-xl z-20"></div>
                
                {/* Chat header */}
                <div className="flex items-center justify-between px-5 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white pt-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0 backdrop-blur-sm">
                      <Robot size={22} className="text-white" weight="fill" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">SageCare</div>
                      <div className="text-[10px] text-blue-100 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat messages */}
                <div className="px-4 py-5 flex flex-col gap-4 h-[400px] overflow-y-auto bg-[#f8faf9] scroll-smooth">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.from === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                        {msg.from === 'bot' && (
                           <div className="w-8 h-8 rounded-full bg-[#e3efeb] flex items-center justify-center shrink-0 mr-2 mt-1">
                             <ChatCircle size={16} className="text-[#1a5d4a]" weight="regular" />
                           </div>
                        )}
                        <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                          msg.from === 'user'
                            ? 'bg-[#1a5d4a] text-white rounded-br-sm'
                            : 'bg-[#e3efeb] text-[#1c3c34] rounded-bl-sm'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                      {msg.options && (
                        <div className="mt-3 flex flex-wrap gap-2 pl-10">
                          {msg.options.map((opt, idx) => (
                            <button 
                              key={idx} 
                              onClick={() => {
                                if (opt === 'Bắt đầu lại khảo sát') {
                                  setMessages(INITIAL_SCENARIO);
                                } else {
                                  handleOptionClick(opt);
                                }
                              }}
                              className="px-4 py-2 border border-[#b2cfc6] bg-[#e3efeb] text-[#1a5d4a] rounded-full text-xs font-semibold hover:bg-[#b2cfc6] hover:scale-105 active:scale-95 transition-all shadow-sm"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-[#e3efeb] flex items-center justify-center shrink-0 mr-2">
                        <ChatCircle size={16} className="text-[#1a5d4a]" weight="regular" />
                      </div>
                      <div className="px-4 py-3 bg-[#e3efeb] rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5 h-[44px]">
                        <div className="w-1.5 h-1.5 bg-[#1a5d4a]/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-[#1a5d4a]/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 bg-[#1a5d4a]/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Decorative blurs */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-[80px] -z-10"></div>
            </div>

            {/* Right: steps */}
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest mb-5">
                Trí Tuệ Nhân Tạo Y Tế
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                Phân Tích Sức Khỏe <br/><span className="text-blue-600">Theo Thời Gian Thực</span>
              </h2>
              <p className="text-slate-500 text-base leading-relaxed mb-10">
                Trợ lý số của chúng tôi hỗ trợ sàng lọc thông tin ban đầu, cung cấp phác đồ đánh giá nhanh chóng giúp bạn an tâm hơn trước khi đặt lịch hẹn trực tiếp với bác sĩ.
              </p>

              <div className="flex flex-col gap-8 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
                {[
                  { num: '01', title: 'Cung cấp thông tin', desc: 'Nhập các triệu chứng hiện tại của bạn một cách tự nhiên bằng ngôn ngữ đời thường.' },
                  { num: '02', title: 'AI phân tích & dự đoán', desc: 'Thuật toán y khoa đưa ra xác suất và mức độ nghiêm trọng của bệnh lý.' },
                  { num: '03', title: 'Chỉ định chuyên khoa', desc: 'Hệ thống tự động đề xuất bác sĩ chuyên khoa phù hợp và hỗ trợ đặt lịch ngay lập tức.' },
                ].map(step => (
                  <div key={step.num} className="flex gap-6 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-white border-4 border-slate-50 shadow-sm text-blue-600 font-black text-sm flex items-center justify-center shrink-0">
                      {step.num}
                    </div>
                    <div className="pt-2">
                      <div className="font-bold text-slate-900 mb-2 text-lg">{step.title}</div>
                      <div className="text-sm text-slate-500 leading-relaxed">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Pricing Section ──────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 bg-[#f5f5f0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              Gói dịch vụ
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Các Lựa Chọn Chăm Sóc Sức Khỏe Linh Hoạt</h2>
            <p className="text-slate-500 max-w-md mx-auto text-sm">
              Đảm bảo quyền lợi và sự minh bạch trong mọi dịch vụ để bạn đưa ra lựa chọn phù hợp nhất.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free plan */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col h-full">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <ChatTeardropDots size={20} className="text-slate-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-600">Trợ Lý Số Tự Động</div>
                  <div className="text-3xl font-extrabold text-slate-900">0đ</div>
                </div>
              </div>
              <hr className="border-slate-100 my-5" />
              <ul className="flex flex-col gap-3 mb-8">
                {[
                  'Khảo sát triệu chứng ban đầu',
                  'Phân loại mức độ cần thiết đi khám',
                  'Cảnh báo dấu hiệu nguy hiểm',
                  'Lời khuyên chăm sóc cơ bản',
                  'Gợi ý chuyên khoa phù hợp',
                  'Hỗ trợ đặt lịch tại phòng khám',
                ].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-700">
                    <CheckCircle size={15} weight="fill" className="text-emerald-500 shrink-0" />
                    {f}
                  </li>
                ))}
                {['Kê đơn thuốc', 'Chẩn đoán chính xác', 'Tư vấn chuyên sâu'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-400">
                    <X size={15} className="text-slate-300 shrink-0" weight="bold" />
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => setShowRoleModal(true)} className="mt-auto w-full py-3 border-2 border-blue-600 text-blue-700 font-bold text-sm rounded-xl hover:bg-blue-50 transition-colors">
                Bắt đầu ngay
              </button>
            </div>

            {/* Paid plan */}
            <div className="bg-blue-700 rounded-2xl border border-blue-600 p-8 shadow-xl relative overflow-hidden flex flex-col h-full">
              {/* Recommended badge */}
              <div className="absolute top-0 right-0 z-20">
                <span className="inline-block bg-amber-400 text-amber-900 text-[11px] font-black px-4 py-1.5 rounded-bl-xl">
                  Khuyến nghị
                </span>
              </div>
              
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-600 rounded-full translate-y-1/2 -translate-x-1/2 opacity-30" />

              <div className="relative z-10 flex flex-col h-full">

                <div className="flex items-center gap-3 mb-2 pt-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <UserCircle size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-blue-200">Thăm Khám Chuyên Sâu</div>
                    <div className="text-3xl font-extrabold text-white">150.000đ<span className="text-base font-medium text-blue-200"> /lần</span></div>
                  </div>
                </div>
                <hr className="border-blue-600 my-5" />
                <ul className="flex flex-col gap-3 mb-8">
                  {[
                    'Bác sĩ xem xét triệu chứng của bạn',
                    'Tư vấn cá nhân hóa, chuyên sâu',
                    'Nhận định chuyên môn cơ sở',
                    'Hướng dẫn xét nghiệm/điều trị phù hợp',
                    'Theo dõi sau buổi tư vấn',
                    'Lịch sử tư vấn được lưu trữ',
                  ].map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-blue-50">
                      <CheckCircle size={15} weight="fill" className="text-blue-200 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setShowRoleModal(true)}
                  className="mt-auto w-full py-3 bg-white hover:bg-blue-50 text-blue-700 font-bold text-sm rounded-xl transition-colors"
                  aria-label="Tư vấn với bác sĩ"
                >
                  Tư vấn với bác sĩ
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-300 pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Stethoscope size={18} className="text-white" weight="bold" />
                </div>
                <span className="font-extrabold text-white text-lg">Preclinic</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Chuỗi phòng khám gia đình hàng đầu Hà Nội — kết hợp công nghệ AI và đội ngũ bác sĩ chuyên nghiệp.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <ShieldCheck size={13} weight="fill" className="text-emerald-500" />
                Dữ liệu sức khỏe được bảo mật và mã hóa
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-bold text-white mb-4 text-sm">Dịch vụ</h4>
              <ul className="flex flex-col gap-2.5">
                {['Nội khoa tổng quát', 'Tim mạch', 'Nhi khoa', 'Xét nghiệm', 'Tiêm chủng'].map(s => (
                  <li key={s}><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{s}</a></li>
                ))}
              </ul>
            </div>

            {/* Info */}
            <div>
              <h4 className="font-bold text-white mb-4 text-sm">Thông tin</h4>
              <ul className="flex flex-col gap-2.5">
                {['Về Preclinic', 'Đội ngũ bác sĩ', 'Cơ sở phòng khám', 'Bảng giá', 'Câu hỏi thường gặp'].map(s => (
                  <li key={s}><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{s}</a></li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-white mb-4 text-sm">Liên hệ</h4>
              <div className="flex flex-col gap-2.5 mb-5">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span>📞</span> 1800 6789 (miễn phí)
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Clock size={14} /> 07:00 – 21:00 hàng ngày
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Buildings size={14} /> 4 cơ sở tại Hà Nội
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Chính sách</div>
                {['Chính sách bảo mật dữ liệu', 'Điều khoản sử dụng', 'Giới hạn sử dụng chatbot'].map(s => (
                  <a key={s} href="#" className="block text-xs text-slate-500 hover:text-slate-300 transition-colors mb-1">{s}</a>
                ))}
              </div>
            </div>
          </div>

          <hr className="border-slate-800 mb-6" />
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">© 2026 Preclinic Family Clinics. Bảo lưu mọi quyền.</p>
            <p className="text-xs text-amber-500 flex items-center gap-1.5">
              ⚠ Chatbot không thay thế bác sĩ. Cấp cứu gọi 115
            </p>
          </div>
        </div>
      </footer>

      {/* ── Floating Chat Button & Widget ──────────────────────────────────── */}
      {chatVisible && (
        <div className="fixed bottom-24 right-6 z-40 w-[350px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transform transition-all duration-300 animate-fade-in-up">
          {/* Chat header */}
          <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center shrink-0 backdrop-blur-sm">
                <Robot size={20} className="text-white" weight="fill" />
              </div>
              <div>
                <div className="font-bold text-sm">SageCare</div>
                <div className="text-[10px] text-blue-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online
                </div>
              </div>
            </div>
            <button onClick={() => setChatVisible(false)} className="text-white/80 hover:text-white transition-colors">
              <X size={20} weight="bold" />
            </button>
          </div>

          {/* Chat messages */}
          <div className="px-4 py-5 flex flex-col gap-4 h-[400px] overflow-y-auto bg-[#f8faf9] scroll-smooth">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.from === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                  {msg.from === 'bot' && (
                     <div className="w-8 h-8 rounded-full bg-[#e3efeb] flex items-center justify-center shrink-0 mr-2 mt-1">
                       <ChatCircle size={16} className="text-[#1a5d4a]" weight="regular" />
                     </div>
                  )}
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.from === 'user'
                      ? 'bg-[#1a5d4a] text-white rounded-br-sm'
                      : 'bg-[#e3efeb] text-[#1c3c34] rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
                {msg.options && (
                  <div className="mt-3 flex flex-wrap gap-2 pl-10">
                    {msg.options.map((opt, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => {
                          if (opt === 'Bắt đầu lại khảo sát') {
                            setMessages(INITIAL_SCENARIO);
                          } else {
                            handleOptionClick(opt);
                          }
                        }}
                        className="px-4 py-2 border border-[#b2cfc6] bg-[#e3efeb] text-[#1a5d4a] rounded-full text-xs font-semibold hover:bg-[#b2cfc6] hover:scale-105 active:scale-95 transition-all shadow-sm"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-[#e3efeb] flex items-center justify-center shrink-0 mr-2">
                  <ChatCircle size={16} className="text-[#1a5d4a]" weight="regular" />
                </div>
                <div className="px-4 py-3 bg-[#e3efeb] rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5 h-[44px]">
                  <div className="w-1.5 h-1.5 bg-[#1a5d4a]/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-[#1a5d4a]/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-[#1a5d4a]/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setChatVisible(!chatVisible)}
        className="fixed bottom-6 right-6 z-30 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        aria-label="Mở chat hỗ trợ"
      >
        {chatVisible ? <X size={26} weight="fill" /> : <ChatCircle size={26} weight="fill" />}
        {!chatVisible && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-[8px] font-bold text-white">1</span>
          </span>
        )}
      </button>

      {/* ── Role Selection Modal ─────────────────────────────────────────────── */}
      {showRoleModal && <RoleModal onClose={() => setShowRoleModal(false)} />}
      
      {/* ── Booking Modal ─────────────────────────────────────────────── */}
      {showBookingModal && <BookingModal onClose={() => setShowBookingModal(false)} />}

      {/* ── Services Modal ─────────────────────────────────────────────── */}
      {showServicesModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowServicesModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Danh Mục Chuyên Khoa</h2>
                <p className="text-sm text-slate-500 mt-1">Khám tổng quát và chuyên sâu tại Preclinic</p>
              </div>
              <button onClick={() => setShowServicesModal(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <X size={20} weight="bold" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SERVICES.map(svc => (
                  <div key={svc.title} className="group p-5 rounded-2xl border transition-all duration-300 hover:shadow-xl bg-slate-50 text-slate-900 border-slate-100 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 cursor-pointer flex flex-col h-full">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 bg-white shadow-sm text-indigo-600 group-hover:bg-white/20 group-hover:text-white group-hover:shadow-none">
                      {svc.icon}
                    </div>
                    <h3 className="font-bold text-base mb-2">{svc.title}</h3>
                    <p className="text-xs leading-relaxed mb-4 transition-colors duration-300 text-slate-500 group-hover:text-indigo-100 line-clamp-3">{svc.desc}</p>
                    <div className="mt-auto font-semibold text-sm transition-colors duration-300 text-indigo-600 group-hover:text-white">
                      {svc.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
