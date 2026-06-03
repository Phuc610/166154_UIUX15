import React, { useState } from 'react';
import { User, Lock, Bell, CalendarCheck, CalendarX, FileText, ClockCounterClockwise, Receipt, Info, CheckCircle } from '@phosphor-icons/react';
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

const DoctorNotificationsSettings: React.FC = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleSave = () => {
    setShowSuccessModal(true);
  };

  const handleCancel = () => {
    setResetKey(prev => prev + 1);
  };

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


          {/* Main Form */}
          <div key={resetKey} className="flex-1 min-w-0">
            
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
                      <h3 className="text-sm font-bold text-slate-900">Bệnh nhân đặt lịch</h3>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">Thông báo khi có bệnh nhân đặt lịch hẹn mới</p>
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
                      <h3 className="text-sm font-bold text-slate-900">Bệnh nhân hủy lịch</h3>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">Thông báo khi bệnh nhân hủy lịch hẹn</p>
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
                      <h3 className="text-sm font-bold text-slate-900">Tin nhắn mới</h3>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">Thông báo khi có tin nhắn từ bệnh nhân</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex flex-col items-center gap-1.5 w-[72px]">
                      <span className="text-[11px] font-bold text-slate-600 uppercase">Email</span>
                      <Toggle defaultChecked={false} />
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
                      <Toggle defaultChecked={false} />
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
              <button 
                onClick={handleCancel}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Hủy bỏ
              </button>
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

      {/* Success Modal Popup */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 flex flex-col items-center text-center shadow-xl">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-5 text-green-500">
              <CheckCircle size={36} weight="fill" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Lưu thành công!</h3>
            <p className="text-slate-500 text-sm mb-6">Cài đặt thông báo của bạn đã được cập nhật an toàn vào hệ thống.</p>
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              Đồng ý
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorNotificationsSettings;
