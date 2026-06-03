import React, { useState } from 'react';
import { User, Lock, Bell, EyeSlash, Eye } from '@phosphor-icons/react';
import { NavLink } from 'react-router-dom';

const PatientChangePassword: React.FC = () => {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div>
      {/* Page Header */}
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
            
            {/* Form Section */}
            <div className="p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Đổi mật khẩu</h2>
              
              <div className="flex flex-col md:flex-row gap-6">
                {/* New Password */}
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Mật khẩu mới <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type={showNew ? "text" : "password"} 
                      defaultValue="password123"
                      className="w-full pl-10 pr-10 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white tracking-wider" 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showNew ? <Eye size={16} /> : <EyeSlash size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Xác nhận mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type={showConfirm ? "text" : "password"} 
                      defaultValue="password123"
                      className="w-full pl-10 pr-10 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white tracking-wider" 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirm ? <Eye size={16} /> : <EyeSlash size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200" />

            {/* Action Buttons */}
            <div className="p-6 flex items-center justify-end gap-3 bg-slate-50/50">
              <button className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                Hủy bỏ
              </button>
              <button className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
                Lưu thay đổi
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientChangePassword;
