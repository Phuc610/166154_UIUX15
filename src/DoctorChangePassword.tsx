import React, { useState } from 'react';
import { Lock, EyeSlash, Eye, CheckCircle } from '@phosphor-icons/react';
import { } from 'react-router-dom';

const DoctorChangePassword: React.FC = () => {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
            <h3 className="text-xl font-bold text-slate-900 mb-2">Đổi mật khẩu thành công!</h3>
            <p className="text-slate-500 text-sm mb-6">Mật khẩu của bạn đã được cập nhật an toàn vào hệ thống.</p>
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

export default DoctorChangePassword;
