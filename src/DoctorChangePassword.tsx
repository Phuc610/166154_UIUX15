import React, { useState } from 'react';
import { Lock, Eye, EyeSlash, CheckCircle } from '@phosphor-icons/react';

const DoctorChangePassword: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [touched, setTouched] = useState({ current: false, new: false, confirm: false });

  const errors = {
    current: touched.current && !currentPassword ? 'Vui lòng nhập mật khẩu hiện tại.' : '',
    new: touched.new && newPassword.length < 8 ? 'Mật khẩu mới phải có ít nhất 8 ký tự.' : '',
    confirm: touched.confirm && confirmPassword !== newPassword ? 'Mật khẩu xác nhận không khớp.' : ''
  };

  const isFormValid = !!(currentPassword && newPassword.length >= 8 && confirmPassword === newPassword);

  const handleSave = () => {
    if (!isFormValid) return;
    setShowToast(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTouched({ current: false, new: false, confirm: false });
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div>
      {/* Toast Notification */}
      <div
        className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 bg-green-500 text-white shadow-xl rounded-xl px-5 py-3.5 transition-all duration-500 ${
          showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6 pointer-events-none'
        }`}
      >
        <CheckCircle size={22} weight="fill" className="shrink-0" />
        <p className="font-bold text-sm">Đổi mật khẩu thành công!</p>
      </div>

      <div className="flex justify-between items-center px-8 pt-6 pb-5">
        <h1 className="text-2xl font-bold text-slate-900">Cài đặt tài khoản</h1>
      </div>
      <div className="mx-8 border-b border-slate-300" />

      {/* Content */}
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          

          {/* Main Form */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Form Section */}
            <div className="flex-1 p-8 md:p-12 flex justify-center">
              <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                  <h2 className="text-2xl font-bold text-slate-900">Đổi mật khẩu</h2>
                  <p className="text-sm text-slate-500 mt-2">Cập nhật mật khẩu mới để bảo vệ tài khoản của bạn.</p>
                </div>
                
                <div className="flex flex-col gap-6">
                {/* Current Password */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="current-password" className="text-sm font-semibold text-slate-700">
                    Mật khẩu hiện tại <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      id="current-password"
                      type={showCurrent ? "text" : "password"} 
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      onBlur={() => setTouched(prev => ({ ...prev, current: true }))}
                      placeholder="Nhập mật khẩu hiện tại"
                      aria-invalid={!!errors.current}
                      aria-describedby={errors.current ? "current-password-error" : undefined}
                      className={`w-full pl-10 pr-10 py-2.5 text-sm border rounded-lg outline-none focus:border-blue-500 bg-white ${errors.current ? 'border-red-500' : 'border-slate-200'}`} 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showCurrent ? <Eye size={16} /> : <EyeSlash size={16} />}
                    </button>
                  </div>
                  {errors.current && (
                    <span id="current-password-error" className="text-red-500 text-xs mt-1 font-medium" role="alert">
                      {errors.current}
                    </span>
                  )}
                </div>

                {/* New Password */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="new-password" className="text-sm font-semibold text-slate-700">
                    Mật khẩu mới <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      id="new-password"
                      type={showNew ? "text" : "password"} 
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      onBlur={() => setTouched(prev => ({ ...prev, new: true }))}
                      placeholder="Nhập mật khẩu mới"
                      aria-invalid={!!errors.new}
                      aria-describedby={errors.new ? "new-password-error" : undefined}
                      className={`w-full pl-10 pr-10 py-2.5 text-sm border rounded-lg outline-none focus:border-blue-500 bg-white ${errors.new ? 'border-red-500' : 'border-slate-200'}`} 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showNew ? <Eye size={16} /> : <EyeSlash size={16} />}
                    </button>
                  </div>
                  {errors.new && (
                    <span id="new-password-error" className="text-red-500 text-xs mt-1 font-medium" role="alert">
                      {errors.new}
                    </span>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="confirm-password" className="text-sm font-semibold text-slate-700">
                    Xác nhận mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      id="confirm-password"
                      type={showConfirm ? "text" : "password"} 
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      onBlur={() => setTouched(prev => ({ ...prev, confirm: true }))}
                      placeholder="Xác nhận mật khẩu mới"
                      aria-invalid={!!errors.confirm}
                      aria-describedby={errors.confirm ? "confirm-password-error" : undefined}
                      className={`w-full pl-10 pr-10 py-2.5 text-sm border rounded-lg outline-none focus:border-blue-500 bg-white ${errors.confirm ? 'border-red-500' : 'border-slate-200'}`} 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showConfirm ? <Eye size={16} /> : <EyeSlash size={16} />}
                    </button>
                  </div>
                  {errors.confirm && (
                    <span id="confirm-password-error" className="text-red-500 text-xs mt-1 font-medium" role="alert">
                      {errors.confirm}
                    </span>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!isFormValid}
                    className={`w-full py-3 text-sm font-bold text-white rounded-xl transition-colors shadow-sm ${isFormValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-300 cursor-not-allowed'}`}
                  >
                    Cập nhật mật khẩu
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
      </div>
    </div>
  );
};

export default DoctorChangePassword;
