import React, { useState } from 'react';
import { Camera, CheckCircle } from '@phosphor-icons/react';
import { } from 'react-router-dom';

const DoctorProfileSettings: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
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
    </div>

      {/* Toast Notification */}
      <div
        className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 bg-green-500 text-white shadow-xl rounded-xl px-5 py-3.5 transition-all duration-500 ${
          showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6 pointer-events-none'
        }`}
      >
        <CheckCircle size={22} weight="fill" className="shrink-0" />
        <p className="font-bold text-sm">Cập nhật hồ sơ thành công!</p>
      </div>
    </div>
  );
};

export default DoctorProfileSettings;
