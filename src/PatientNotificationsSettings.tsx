import React, { useState } from 'react';
import { User, Lock, Bell, CalendarCheck, CalendarX, FileText, ClockCounterClockwise, Receipt, Info } from '@phosphor-icons/react';
import { NavLink } from 'react-router-dom';

const Toggle = ({ defaultChecked = true }: { defaultChecked?: boolean }) => {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <button 
      type="button"
      onClick={() => setChecked(!checked)}
      className={`w-9 h-5 rounded-full relative transition-colors shadow-inner ${checked ? 'bg-blue-600' : 'bg-slate-200'}`}
    >
      <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform shadow-sm ${checked ? 'translate-x-[20px]' : 'translate-x-[3px]'}`} />
    </button>
  );
};

const PatientNotificationsSettings: React.FC = () => {
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
              <h2 className="text-lg font-bold text-slate-900 mb-6">Cài đặt thông báo</h2>
              
              <div className="flex flex-col gap-4">
                
                {/* Item 1 */}
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all bg-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                      <CalendarCheck size={24} weight="duotone" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Đặt lịch hẹn mới</h3>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">Thông báo khi có lịch hẹn được đặt</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex flex-col items-center gap-1.5 w-[72px]">
                      <span className="text-[11px] font-bold text-slate-600 uppercase">Email</span>
                      <Toggle defaultChecked={true} />
                    </div>
                    <div className="flex flex-col items-center gap-1.5 w-[72px]">
                      <span className="text-[11px] font-bold text-slate-600 uppercase">SMS</span>
                      <Toggle defaultChecked={true} />
                    </div>
                    <div className="flex flex-col items-center gap-1.5 w-[72px]">
                      <span className="text-[11px] font-bold text-slate-600 uppercase">Ứng dụng</span>
                      <Toggle defaultChecked={true} />
                    </div>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all bg-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                      <CalendarX size={24} weight="duotone" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Hủy lịch hẹn</h3>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">Thông báo khi lịch hẹn bị hủy</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex flex-col items-center gap-1.5 w-[72px]">
                      <span className="text-[11px] font-bold text-slate-600 uppercase">Email</span>
                      <Toggle defaultChecked={true} />
                    </div>
                    <div className="flex flex-col items-center gap-1.5 w-[72px]">
                      <span className="text-[11px] font-bold text-slate-600 uppercase">SMS</span>
                      <Toggle defaultChecked={true} />
                    </div>
                    <div className="flex flex-col items-center gap-1.5 w-[72px]">
                      <span className="text-[11px] font-bold text-slate-600 uppercase">Ứng dụng</span>
                      <Toggle defaultChecked={true} />
                    </div>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all bg-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                      <FileText size={24} weight="duotone" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Kết quả xét nghiệm</h3>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">Thông báo khi có kết quả xét nghiệm mới</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex flex-col items-center gap-1.5 w-[72px]">
                      <span className="text-[11px] font-bold text-slate-600 uppercase">Email</span>
                      <Toggle defaultChecked={true} />
                    </div>
                    <div className="flex flex-col items-center gap-1.5 w-[72px]">
                      <span className="text-[11px] font-bold text-slate-600 uppercase">SMS</span>
                      <Toggle defaultChecked={false} />
                    </div>
                    <div className="flex flex-col items-center gap-1.5 w-[72px]">
                      <span className="text-[11px] font-bold text-slate-600 uppercase">Ứng dụng</span>
                      <Toggle defaultChecked={true} />
                    </div>
                  </div>
                </div>

                {/* Item 4 */}
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all bg-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                      <ClockCounterClockwise size={24} weight="duotone" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Nhắc nhở tái khám</h3>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">Lịch hẹn tái khám định kỳ từ bác sĩ</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex flex-col items-center gap-1.5 w-[72px]">
                      <span className="text-[11px] font-bold text-slate-600 uppercase">Email</span>
                      <Toggle defaultChecked={true} />
                    </div>
                    <div className="flex flex-col items-center gap-1.5 w-[72px]">
                      <span className="text-[11px] font-bold text-slate-600 uppercase">SMS</span>
                      <Toggle defaultChecked={true} />
                    </div>
                    <div className="flex flex-col items-center gap-1.5 w-[72px]">
                      <span className="text-[11px] font-bold text-slate-600 uppercase">Ứng dụng</span>
                      <Toggle defaultChecked={true} />
                    </div>
                  </div>
                </div>

                {/* Item 5 */}
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all bg-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                      <Receipt size={24} weight="duotone" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Hóa đơn / Thanh toán</h3>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">Thông báo khi có hóa đơn hoặc biên lai mới</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex flex-col items-center gap-1.5 w-[72px]">
                      <span className="text-[11px] font-bold text-slate-600 uppercase">Email</span>
                      <Toggle defaultChecked={true} />
                    </div>
                    <div className="flex flex-col items-center gap-1.5 w-[72px]">
                      <span className="text-[11px] font-bold text-slate-600 uppercase">SMS</span>
                      <Toggle defaultChecked={true} />
                    </div>
                    <div className="flex flex-col items-center gap-1.5 w-[72px]">
                      <span className="text-[11px] font-bold text-slate-600 uppercase">Ứng dụng</span>
                      <Toggle defaultChecked={true} />
                    </div>
                  </div>
                </div>

                {/* Item 6 */}
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all bg-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                      <Info size={24} weight="duotone" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Cảnh báo hệ thống</h3>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">Đăng nhập mới, thay đổi dữ liệu, hoặc cập nhật hệ thống</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex flex-col items-center gap-1.5 w-[72px]">
                      <span className="text-[11px] font-bold text-slate-600 uppercase">Email</span>
                      <Toggle defaultChecked={true} />
                    </div>
                    <div className="flex flex-col items-center gap-1.5 w-[72px]">
                      <span className="text-[11px] font-bold text-slate-600 uppercase">SMS</span>
                      <Toggle defaultChecked={true} />
                    </div>
                    <div className="flex flex-col items-center gap-1.5 w-[72px]">
                      <span className="text-[11px] font-bold text-slate-600 uppercase">Ứng dụng</span>
                      <Toggle defaultChecked={true} />
                    </div>
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

export default PatientNotificationsSettings;
