import React, { useState } from 'react';
import { Camera, User, Lock, Bell, CheckCircle } from '@phosphor-icons/react';
import { NavLink } from 'react-router-dom';

const PatientProfileSettings: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const [firstName, setFirstName] = useState('Nguyễn Văn');
  const [lastName, setLastName] = useState('A');

  const handleSave = () => {
    const fullName = `${firstName} ${lastName}`.trim();
    localStorage.setItem('patient_display_name', fullName);
    window.dispatchEvent(new Event('patient_name_updated'));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div>
      {/* Toast Notification - green style like booking success */}
      <div
        className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 bg-green-500 text-white shadow-xl rounded-xl px-5 py-3.5 transition-all duration-500 ${
          showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6 pointer-events-none'
        }`}
      >
        <CheckCircle size={22} weight="fill" className="shrink-0" />
        <p className="font-bold text-sm">Lưu thành công!</p>
      </div>

      <div className="flex justify-between items-center px-8 pt-6 pb-5">
        <h1 className="text-2xl font-bold text-slate-900">Cài đặt</h1>
      </div>
      <div className="mx-8 border-b border-slate-300" />

      {/* Content */}
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          {/* Inner Sidebar */}
          <div className="w-full md:w-64 shrink-0 border-r border-slate-100 p-6 flex flex-col gap-1">
            <NavLink to="/patient/settings/profile" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
              <User size={18} />
              Cài đặt hồ sơ
            </NavLink>
            <NavLink to="/patient/settings/password" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
              <Lock size={18} />
              Đổi mật khẩu
            </NavLink>
            <NavLink to="/patient/settings/notifications" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
              <Bell size={18} />
              Thông báo
            </NavLink>
          </div>

          {/* Main Form */}
          <div className="flex-1 min-w-0">

            {/* Basic Information */}
            <div className="p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Thông tin cơ bản</h2>

              <div className="flex flex-col gap-6">
                {/* Profile Image */}
                <div className="flex items-center gap-6">
                  <div className="w-48 text-sm font-semibold text-slate-700">
                    Ảnh đại diện <span className="text-red-500">*</span>
                  </div>
                  <div className="relative">
                    <img
                      src="https://i.pravatar.cc/150?img=11"
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border border-slate-200"
                    />
                    <button className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                      <Camera size={14} weight="fill" />
                    </button>
                  </div>
                </div>

                {/* First Name & Last Name */}
                <div className="flex gap-6">
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Họ và tên đệm <span className="text-red-500">*</span>
                    </label>
                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white" />
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Tên <span className="text-red-500">*</span>
                    </label>
                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white" />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="flex gap-6">
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input type="email" defaultValue="nguyenvana@example.com" className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white" />
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input type="tel" defaultValue="0901234567" className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200" />

            {/* Address Information */}
            <div className="p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Thông tin địa chỉ</h2>

              <div className="flex flex-col gap-6">
                {/* Address Lines */}
                <div className="flex gap-6">
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">Địa chỉ 1</label>
                    <input type="text" placeholder="Số nhà, tên đường..." className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white" />
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">Địa chỉ 2</label>
                    <input type="text" placeholder="Tòa nhà, khu vực (tùy chọn)..." className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white" />
                  </div>
                </div>

                {/* Country & State */}
                <div className="flex gap-6">
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">Quốc gia</label>
                    <select className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white text-slate-700 appearance-none">
                      <option>Chọn quốc gia</option>
                      <option>Việt Nam</option>
                    </select>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">Tỉnh / Thành phố</label>
                    <select className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white text-slate-700 appearance-none">
                      <option>Chọn Tỉnh/Thành phố</option>
                      <option>Hà Nội</option>
                      <option>Hồ Chí Minh</option>
                      <option>Đà Nẵng</option>
                    </select>
                  </div>
                </div>

                {/* City/District & Pincode */}
                <div className="flex gap-6">
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">Quận / Huyện</label>
                    <select className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white text-slate-700 appearance-none">
                      <option>Chọn Quận/Huyện</option>
                      <option>Cầu Giấy</option>
                    </select>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">Mã bưu điện (Pincode)</label>
                    <input type="text" placeholder="Ví dụ: 100000" className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200" />

            {/* Action Buttons */}
            <div className="p-6 flex items-center justify-end gap-3 bg-slate-50/50">

              <button
                onClick={handleSave}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
              >
                Lưu thay đổi
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileSettings;
