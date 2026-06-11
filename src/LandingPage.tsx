import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Stethoscope, Heart, Brain, Baby, Flask, Syringe,
  ChatCircle, Star, ShieldCheck, Clock, Users,
  CheckCircle, X, ArrowRight, Sparkle,
  UserCircle, Buildings, FirstAid,
  ChatTeardropDots
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
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${animIn ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div className={`relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transition-all duration-300 ${animIn ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}>
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Stethoscope size={16} className="text-white" weight="bold" />
                </div>
                <span className="font-bold text-blue-600 text-base">Preclinic</span>
              </div>
              <h2 id="role-modal-title" className="text-xl font-bold text-slate-900">Chọn vai trò của bạn</h2>
              <p className="text-sm text-slate-500 mt-1">Chọn đúng vai trò để truy cập đúng giao diện phù hợp với bạn.</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Đóng"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            >
              <X size={16} weight="bold" />
            </button>
          </div>
        </div>

        {/* Role cards */}
        <div className="px-8 py-6 grid grid-cols-3 gap-4">
          {ROLES.map(role => (
            <button
              key={role.key}
              onClick={() => setSelected(role.key)}
              className={`group relative text-left p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer
                ${selected === role.key
                  ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-100'
                  : `border-slate-200 bg-white ${role.border} hover:shadow-md`
                }`}
              aria-pressed={selected === role.key}
            >
              {/* Selected indicator */}
              {selected === role.key && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <CheckCircle size={14} className="text-white" weight="fill" />
                </div>
              )}

              <div className={`w-14 h-14 rounded-xl ${role.iconBg} ${role.iconColor} flex items-center justify-center mb-4 transition-transform group-hover:scale-105`}>
                {role.icon}
              </div>

              <div className="font-bold text-slate-900 text-base mb-1">{role.label}</div>
              <div className="text-xs text-slate-500 leading-relaxed mb-3">{role.desc}</div>

              <ul className="flex flex-col gap-1">
                {role.features.map(f => (
                  <li key={f} className="flex items-center gap-1.5 text-xs text-slate-600">
                    <CheckCircle size={12} className="text-emerald-500 shrink-0" weight="fill" />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <p className="text-xs text-slate-400">🔒 Đăng nhập bảo mật · Dữ liệu được mã hoá</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selected}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-colors flex items-center gap-2"
              aria-label="Xác nhận vai trò và vào hệ thống"
            >
              Vào hệ thống <ArrowRight size={16} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Mini components ─────────────────────────────────────────────────────────
const NavLink = ({ children }: { children: React.ReactNode }) => (
  <a href="#" className="text-sm text-slate-600 hover:text-blue-700 font-medium transition-colors">
    {children}
  </a>
);

const ServiceCard = ({
  icon, title, desc, price, highlight
}: {
  icon: React.ReactNode; title: string; desc: string; price: string; highlight?: boolean;
}) => (
  <div className={`group bg-white rounded-2xl p-6 border transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-1 ${highlight ? 'border-blue-200 hover:border-blue-400' : 'border-slate-100 hover:border-slate-200'}`}>
    <div className={`w-12 h-12 rounded-xl ${highlight ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
    <p className={`text-sm leading-relaxed mb-4 ${highlight ? 'text-blue-600' : 'text-slate-500'}`}>{desc}</p>
    <div className="flex items-center justify-between">
      <span className="font-bold text-slate-900 text-sm">{price}</span>
      <ArrowRight size={16} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
    </div>
  </div>
);

const SERVICES = [
  { icon: <Stethoscope size={22} />, title: 'Nội khoa tổng quát', desc: 'Khám, theo dõi và điều trị các bệnh lý nội khoa thường gặp', price: '200.000đ' },
  { icon: <Heart size={22} />, title: 'Tim mạch', desc: 'Đo ECG, siêu âm tim, tư vấn bệnh lý tim mạch và huyết áp', price: '350.000đ', highlight: true },
  { icon: <Baby size={22} />, title: 'Nhi khoa', desc: 'Chăm sóc sức khỏe toàn diện cho trẻ từ sơ sinh đến 16 tuổi', price: '220.000đ' },
  { icon: <Brain size={22} />, title: 'Thần kinh', desc: 'Đau đầu, chóng mặt, rối loạn giấc ngủ, căng thẳng mạn tính', price: '300.000đ' },
  { icon: <Flask size={22} />, title: 'Xét nghiệm', desc: 'Xét nghiệm máu, nước tiểu, sinh hóa tổng quát & chuyên sâu', price: 'từ 150.000đ' },
  { icon: <Syringe size={22} />, title: 'Tiêm chủng', desc: 'Vaccine theo lịch khuyến nghị của Bộ Y tế cho mọi độ tuổi', price: 'theo vaccine' },
];

const CHAT_MESSAGES = [
  { from: 'bot', text: 'Xin chào! Tôi có thể hỗ trợ khảo sát triệu chứng bạn đang gặp phải.' },
  { from: 'user', text: 'Tôi bị đau đầu từ hôm qua' },
  { from: 'bot', text: 'Triệu chứng xuất hiện từ bao lâu và mức độ đau như thế nào (nhẹ / vừa / nặng)?' },
  { from: 'user', text: 'Từ hôm qua, vừa phải thôi' },
];

// ─── Main Landing Page ────────────────────────────────────────────────────────
const LandingPage = () => {
  const location = useLocation();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [typingText, setTypingText] = useState('');
  const heroText = 'Chăm Sóc Sức Khỏe';

  useEffect(() => {
    if (location.search.includes('login=true')) {
      setShowRoleModal(true);
    }
  }, [location.search]);

  // Simple typing animation for hero
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypingText(heroText.slice(0, i + 1));
      i++;
      if (i >= heroText.length) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>

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
            <NavLink>Trang chủ</NavLink>
            <NavLink>Dịch vụ</NavLink>
            <NavLink>Bác sĩ</NavLink>
            <NavLink>Cơ sở</NavLink>
            <NavLink>Bảng giá</NavLink>
            <NavLink>FAQ</NavLink>
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
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all hover:shadow-md hover:shadow-blue-200 active:scale-95"
              aria-label="Đặt lịch khám"
            >
              Đặt lịch khám
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 bg-[#f8fafc] flex flex-col items-center text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 w-full relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-white border border-slate-200 rounded-full text-xs font-extrabold text-blue-600 tracking-wider shadow-sm mb-8 uppercase">
            <Sparkle size={14} weight="fill" className="text-amber-400" />
            Hệ thống y tế tiêu chuẩn quốc tế
          </div>

          {/* Heading */}
          <h1 className="text-[56px] font-black tracking-tight text-slate-900 leading-[1.1] mb-6 mx-auto">
            <span className="text-blue-600">Giải Pháp Sức Khỏe</span> <br/>
            Tối Ưu Dành Cho Gia Đình
          </h1>

          {/* Subtitle */}
          <p className="text-slate-500 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            Tích hợp trí tuệ nhân tạo thông minh nhằm nhận diện triệu chứng nhanh chóng, đồng thời kết nối bạn với chuyên gia y tế hàng đầu.
          </p>

          {/* CTA buttons */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <button
              className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-sm transition-all hover:shadow-xl hover:-translate-y-1"
              aria-label="Tư vấn miễn phí ngay"
              onClick={() => setShowRoleModal(true)}
            >
              <ChatCircle size={18} weight="fill" />
              Tư vấn miễn phí ngay
            </button>
            <button
              onClick={() => setShowBookingModal(true)}
              className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-full text-sm transition-all hover:shadow-md hover:-translate-y-1"
              aria-label="Đặt lịch khám"
            >
              <Buildings size={18} />
              Đặt lịch khám
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="max-w-6xl w-full mx-auto px-6 relative z-10">
          <div className="rounded-[2rem] border-8 border-white shadow-2xl overflow-hidden relative w-full aspect-[21/9]">
            <img 
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop" 
              alt="Phòng khám" 
              className="w-full h-full object-cover"
            />
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

      {/* ── Services Section ─────────────────────────────────────────────────── */}
      <section id="services" className="py-20 bg-[#f5f5f0]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              Dịch vụ khám
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Chuyên khoa đa dạng, đội ngũ chuyên nghiệp</h2>
            <p className="text-slate-500 max-w-lg mx-auto text-sm leading-relaxed">
              Phòng khám gia đình <span className="text-blue-600 font-semibold">Preclinic</span> cung cấp đầy đủ dịch vụ y tế
              từ khám tổng quát đến chuyên khoa sâu.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {SERVICES.map(svc => (
              <ServiceCard key={svc.title} {...svc} />
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Chatbot Section ───────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 gap-16 items-center">

            {/* Left: steps */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest mb-5">
                Trợ lý AI sức khỏe
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4 leading-tight">
                Khảo sát triệu chứng thông minh, nhanh chóng
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Chatbot Preclinic giúp bạn hiểu tình trạng sức khỏe ban đầu trước khi quyết định đi khám.
              </p>

              <div className="flex flex-col gap-6 mb-8">
                {[
                  { num: '01', title: 'Mô tả triệu chứng', desc: 'Trả lời các câu hỏi ngắn về triệu chứng, thời gian và mức độ.' },
                  { num: '02', title: 'Nhận đánh giá ban đầu', desc: 'Chatbot phân loại mức độ và đưa ra gợi ý phù hợp — tự theo dõi, đi khám, hay liên hệ bác sĩ sớm.' },
                  { num: '03', title: 'Đặt lịch hoặc tư vấn bác sĩ', desc: 'Đặt lịch khám trực tiếp hoặc nâng cấp lên tư vấn bác sĩ chuyên sâu (có phí).' },
                ].map(step => (
                  <div key={step.num} className="flex gap-4">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                      {step.num}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 mb-1">{step.title}</div>
                      <div className="text-sm text-slate-500 leading-relaxed">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2.5">
                <span className="text-amber-600 mt-0.5 shrink-0">⚠</span>
                <p className="text-xs text-amber-700 leading-relaxed">
                  <strong>Lưu ý quan trọng:</strong> Chatbot không kê đơn thuốc, không chẩn đoán bệnh, và không thay thế bác sĩ. Thông tin chỉ mang tính tham khảo ban đầu.
                </p>
              </div>
            </div>

            {/* Right: Chat UI mockup */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
              {/* Chat header */}
              <div className="flex items-center justify-between px-5 py-4 bg-slate-50 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                    <ChatTeardropDots size={18} className="text-white" weight="fill" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Trợ lý MedCare</div>
                    <div className="text-[11px] text-slate-500">Hỗ trợ khảo sát ban đầu · Miễn phí</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                  <ShieldCheck size={13} weight="fill" className="text-emerald-500" />
                  Bảo mật
                </div>
              </div>

              {/* Chat messages */}
              <div className="px-5 py-4 flex flex-col gap-3 h-64 overflow-y-auto">
                {CHAT_MESSAGES.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.from === 'user'
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-slate-100 text-slate-700 rounded-bl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {/* Typing indicator */}
                <div className="flex justify-start">
                  <div className="bg-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>

              {/* Chat footer */}
              <div className="px-5 py-4 border-t border-slate-100">
                <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                  <ChatCircle size={17} weight="fill" />
                  Bắt đầu tư vấn miễn phí
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing Section ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#f5f5f0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              Gói dịch vụ
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Miễn phí và có phí — khác nhau thế nào?</h2>
            <p className="text-slate-500 max-w-md mx-auto text-sm">
              Chúng tôi cam kết minh bạch về giá trị và giới hạn của từng gói dịch vụ.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free plan */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <ChatTeardropDots size={20} className="text-slate-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-600">Chatbot Miễn Phí</div>
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
              <button className="w-full py-3 border-2 border-blue-600 text-blue-700 font-bold text-sm rounded-xl hover:bg-blue-50 transition-colors">
                Bắt đầu ngay
              </button>
            </div>

            {/* Paid plan */}
            <div className="bg-blue-700 rounded-2xl border border-blue-600 p-8 shadow-xl relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-600 rounded-full translate-y-1/2 -translate-x-1/2 opacity-30" />

              <div className="relative z-10">
                {/* Recommended badge */}
                <div className="absolute -top-0 right-0">
                  <span className="bg-amber-400 text-amber-900 text-[11px] font-black px-3 py-1 rounded-bl-xl rounded-tr-xl">
                    Khuyến nghị
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-2 pt-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <UserCircle size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-blue-200">Tư Vấn Bác Sĩ</div>
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
                  className="w-full py-3 bg-white hover:bg-blue-50 text-blue-700 font-bold text-sm rounded-xl transition-colors"
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

      {/* ── Floating Chat Button ─────────────────────────────────────────────── */}
      <button
        onClick={() => setChatVisible(!chatVisible)}
        className="fixed bottom-6 right-6 z-30 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        aria-label="Mở chat hỗ trợ"
      >
        <ChatCircle size={26} weight="fill" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
          <span className="text-[8px] font-bold text-white">1</span>
        </span>
      </button>

      {/* ── Role Selection Modal ─────────────────────────────────────────────── */}
      {showRoleModal && <RoleModal onClose={() => setShowRoleModal(false)} />}
    </div>
  );
};

export default LandingPage;
