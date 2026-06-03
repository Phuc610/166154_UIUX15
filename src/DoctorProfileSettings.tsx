import React, { useState } from 'react';
import { Camera, User, Lock, Bell, CheckCircle } from '@phosphor-icons/react';
import { NavLink } from 'react-router-dom';

const DoctorProfileSettings: React.FC = () => {
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
      <div className="flex justify-between items-center px-8 pt-6 pb-5">
        <h1 className="text-2xl font-bold text-slate-900">Cài đặt</h1>
      </div>
      <div className="mx-8 border-b border-slate-300" />

      {/* Content */}
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">


          {/* Main Form */}
          <div key={resetKey} className="flex-1 min-w-0">
          
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
                    src="https://i.pravatar.cc/150?img=12" 
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
                  <input type="text" defaultValue="Phạm Văn" className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white" />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Tên <span className="text-red-500">*</span>
                  </label>
                  <input type="text" defaultValue="Đức" className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white" />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="flex gap-6">
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input type="email" defaultValue="dr.ducpham@preclinic.com" className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white" />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input type="tel" defaultValue="0987654321" className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white" />
                </div>
              </div>

              {/* Professional Information */}
              <div className="flex gap-6">
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Chuyên khoa <span className="text-red-500">*</span>
                  </label>
                  <input type="text" defaultValue="Tim mạch" className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white" />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Kinh nghiệm (năm)
                  </label>
                  <input type="number" defaultValue="15" className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white" />
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

      {/* Success Modal Popup */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 flex flex-col items-center text-center shadow-xl">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-5 text-green-500">
              <CheckCircle size={36} weight="fill" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Lưu thành công!</h3>
            <p className="text-slate-500 text-sm mb-6">Thông tin hồ sơ của bạn đã được cập nhật an toàn vào hệ thống.</p>
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
  </div>
  );
};

export default DoctorProfileSettings;
