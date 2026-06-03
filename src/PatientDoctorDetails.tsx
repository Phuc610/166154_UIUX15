import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CaretLeft, EnvelopeSimple, Phone, MapPin, Drop, GenderIntersex, IdentificationCard, IdentificationBadge, Star, Certificate, CalendarBlank } from '@phosphor-icons/react';
import NewAppointmentModal from './NewAppointmentModal';

export default function PatientDoctorDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const doctor = location.state?.doctor || {
    name: 'BS. John Smith',
    spec: 'Tim mạch',
    bg: 'bg-indigo-200'
  };

  const [activeTab, setActiveTab] = useState('Thứ Hai');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const TABS = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu'];
  const TIME_SLOTS = [
    '11:30 SA - 12:30 CH', '12:30 CH - 01:30 CH', '02:30 CH - 03:30 CH', '04:30 CH - 05:30 CH', '06:00 CH - 07:30 CH', '07:00 CH - 08:30 CH', '09:00 CH - 11:00 CH', '11:00 CH - 11:30 CH'
  ];

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
            <CaretLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Chi tiết Bác sĩ</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">

          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Header Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-start gap-6 shadow-sm">
              <div className={`w-32 h-32 rounded-xl flex shrink-0 items-center justify-center text-white text-4xl font-bold shadow-inner ${doctor.bg}`}>
                {doctor.name.split(' ').pop()?.[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-slate-900 leading-none">{doctor.name}</h2>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-semibold rounded-md inline-flex items-center justify-center gap-1.5 translate-y-[1px]">
                    <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                    {doctor.spec}
                  </span>
                </div>
                <p className="text-slate-500 text-sm mb-4">MBBS, M.D, {doctor.spec}</p>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-600 flex items-center gap-2 leading-none"><MapPin size={16} /> Phòng khám đa khoa Downtown</span>
                  <span className="px-2.5 py-1 bg-green-50 text-green-600 text-[11px] font-semibold rounded-md inline-flex items-center justify-center gap-1.5 translate-y-[1px]">
                    <div className="w-1 h-1 rounded-full bg-green-500"></div>
                    Đang trống lịch
                  </span>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Lịch làm việc</h3>
              <div className="flex border-b border-slate-200 mb-6 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                {TABS.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 pb-3 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap min-w-[100px] ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}>
                    {tab}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {TIME_SLOTS.map((time, i) => (
                  <div key={i} className="px-3 py-2.5 bg-slate-50 text-slate-700 text-xs font-medium text-center rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer">
                    {time}
                  </div>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Giới thiệu ngắn</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {doctor.name} đã hành nghề y khoa gia đình trong hơn 10 năm. Bác sĩ có nhiều kinh nghiệm trong việc quản lý các bệnh mãn tính, chăm sóc phòng ngừa và điều trị một loạt các tình trạng y tế cho bệnh nhân ở mọi lứa tuổi.
              </p>
            </div>

            {/* Education */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Thông tin Học vấn</h3>
              <div className="flex flex-col gap-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
                <div className="relative pl-8">
                  <div className="absolute left-[7px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-50"></div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Viện Y khoa Boston - Bác sĩ Y khoa (MD)</h4>
                  <p className="text-slate-500 text-xs">25 Thg 5 1990 - 29 Thg 1 1992</p>
                </div>
                <div className="relative pl-8">
                  <div className="absolute left-[7px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-50"></div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Trường Y Harvard, Boston - Cử nhân Y khoa (MBBS)</h4>
                  <p className="text-slate-500 text-xs">25 Thg 5 1985 - 29 Thg 1 1990</p>
                </div>
              </div>
            </div>

            {/* Awards */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Giải thưởng & Ghi nhận</h3>
              <div className="flex flex-col gap-5">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2"><Star size={16} weight="fill" className="text-amber-400" /> Giải thưởng Bác sĩ xuất sắc (2023)</h4>
                  <p className="text-slate-500 text-sm">Được công nhận bởi Báo cáo Y khoa cho những thành tựu xuất sắc trong y học.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2"><Star size={16} weight="fill" className="text-amber-400" /> Giải thưởng Bệnh nhân bình chọn (2022)</h4>
                  <p className="text-slate-500 text-sm">Được trao tặng bởi Vitals.com vì liên tục nhận được đánh giá cao từ bệnh nhân về mức độ hài lòng.</p>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8 lg:mb-0">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Chứng chỉ</h3>
              <div className="flex flex-col gap-5">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2"><Certificate size={16} className="text-blue-600" /> Chứng nhận Hội đồng Y khoa (ABFM), 2015</h4>
                  <p className="text-slate-500 text-sm">Minh chứng sự thành thạo trong việc chăm sóc toàn diện, liên tục cho cá nhân và gia đình.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2"><Certificate size={16} className="text-blue-600" /> Hiệp hội Tim mạch Quốc gia, 2024</h4>
                  <p className="text-slate-500 text-sm">Chứng nhận thực hiện các kỹ thuật cứu sinh bao gồm CPR và chăm sóc tim mạch khẩn cấp.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">

            {/* Action Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <span className="text-sm font-medium text-slate-500">Phí tư vấn</span>
                <div className="text-right">
                  <span className="text-xl font-bold text-slate-900">300.000₫</span>
                  <span className="text-slate-500 text-xs"> / 30 Phút</span>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm shadow-blue-200 flex justify-center items-center gap-2"
              >
                Đặt lịch khám
              </button>
            </div>

            {/* About Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Thông tin cá nhân</h3>

              <div className="flex flex-col gap-5">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-slate-600"><IdentificationCard size={20} /></div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 mb-0.5">Số Giấy phép Y tế</div>
                    <div className="text-sm text-slate-500">ML566659898</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-slate-600"><Phone size={20} /></div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 mb-0.5">Số điện thoại</div>
                    <div className="text-sm text-slate-500">+84 912 345 678</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-slate-600"><EnvelopeSimple size={20} /></div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 mb-0.5">Email</div>
                    <div className="text-sm text-slate-500">doctor@preclinic.com</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-slate-600"><MapPin size={20} /></div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 mb-0.5">Địa chỉ</div>
                    <div className="text-sm text-slate-500">4150 Hiney Road, Las Vegas, NV 89109</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-slate-600"><CalendarBlank size={20} /></div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 mb-0.5">Ngày sinh</div>
                    <div className="text-sm text-slate-500">25 Thg 1 1990</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-slate-600"><Drop size={20} /></div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 mb-0.5">Nhóm máu</div>
                    <div className="text-sm text-slate-500">O</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-slate-600"><IdentificationBadge size={20} /></div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 mb-0.5">Kinh nghiệm</div>
                    <div className="text-sm text-slate-500">15+ Năm</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-slate-600"><GenderIntersex size={20} /></div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 mb-0.5">Giới tính</div>
                    <div className="text-sm text-slate-500">Nam</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Appointment Modal */}
      <NewAppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialDoctor={doctor} />
    </div>
  );
}
