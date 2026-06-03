import React, { useState, useRef } from 'react';
import {
  Camera, Plus, X, FloppyDisk, Check, Warning
} from '@phosphor-icons/react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface DaySchedule {
  enabled: boolean;
  open: string;
  close: string;
}

interface HolidayEntry {
  id: string;
  label: string;
  date: string;
}

interface ClinicForm {
  logo: string | null;
  name: string;
  hotline: string;
  email: string;
  representative: string;
  taxCode: string;
  address: string;
}

interface FormErrors {
  name?: string;
  hotline?: string;
  email?: string;
  representative?: string;
  taxCode?: string;
  address?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

const DEFAULT_SCHEDULE: DaySchedule[] = [
  { enabled: true,  open: '08:00', close: '17:30' },
  { enabled: true,  open: '08:00', close: '17:30' },
  { enabled: true,  open: '08:00', close: '17:30' },
  { enabled: true,  open: '08:00', close: '17:30' },
  { enabled: true,  open: '08:00', close: '17:30' },
  { enabled: true,  open: '08:00', close: '12:00' },
  { enabled: false, open: '08:00', close: '12:00' },
];

const DEFAULT_FORM: ClinicForm = {
  logo: null,
  name: 'Trustcare Clinic - Chi nhánh Hà Nội',
  hotline: '1900 1234',
  email: 'contact@trustcare.vn',
  representative: 'Phạm Đăng Hải',
  taxCode: '0108123456',
  address: 'Tòa nhà Lotte, Số 54 Liễu Giai, Quận Ba Đình, Hà Nội',
};

// ─── Toast Component ──────────────────────────────────────────────────────────

const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => (
  <div
    className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl
      transition-all duration-300
      ${type === 'success' ? 'bg-slate-900 text-white' : 'bg-red-600 text-white'}`}
    role={type === 'error' ? 'alert' : 'status'}
    aria-live={type === 'error' ? 'assertive' : 'polite'}
  >
    {type === 'success'
      ? <Check size={20} weight="bold" className="text-emerald-400 shrink-0" />
      : <Warning size={20} weight="bold" className="text-yellow-300 shrink-0" />
    }
    <span className="font-semibold text-sm">{message}</span>
    <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">
      <X size={16} weight="bold" />
    </button>
  </div>
);

// ─── Toggle Component ─────────────────────────────────────────────────────────

const Toggle = ({ checked, onChange, id }: { checked: boolean; onChange: (v: boolean) => void; id: string }) => (
  <button
    id={id}
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent
      transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
      ${checked ? 'bg-blue-600' : 'bg-slate-200'}`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow
        transition duration-200 ease-in-out
        ${checked ? 'translate-x-5' : 'translate-x-0'}`}
    />
  </button>
);

// ─── Confirmation Modal ───────────────────────────────────────────────────────

const ConfirmModal = ({
  open, onConfirm, onCancel
}: { open: boolean; onConfirm: () => void; onCancel: () => void }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6"
        role="dialog"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
            <Warning size={22} weight="fill" className="text-amber-500" />
          </div>
          <h2 id="confirm-title" className="font-bold text-slate-900 text-base">Huỷ thay đổi?</h2>
        </div>
        <p id="confirm-desc" className="text-sm text-slate-500 mb-5 leading-relaxed">
          Bạn có chắc muốn huỷ tất cả thay đổi chưa lưu? Thao tác này không thể hoàn tác.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg
              hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            Tiếp tục chỉnh sửa
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg
              hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Huỷ thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Add Holiday Modal ────────────────────────────────────────────────────────

const AddHolidayModal = ({
  open, onAdd, onClose
}: { open: boolean; onAdd: (label: string, date: string) => void; onClose: () => void }) => {
  const [label, setLabel] = useState('');
  const [date, setDate] = useState('');
  const [errors, setErrors] = useState<{ label?: string; date?: string }>({});

  const handleSubmit = () => {
    const newErrors: { label?: string; date?: string } = {};
    if (!label.trim()) newErrors.label = 'Vui lòng nhập tên ngày nghỉ.';
    if (!date) newErrors.date = 'Vui lòng chọn ngày.';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    onAdd(label.trim(), date);
    setLabel(''); setDate(''); setErrors({});
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6"
        role="dialog"
        aria-labelledby="holiday-modal-title"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="holiday-modal-title" className="font-bold text-slate-900 text-base">Thêm ngày nghỉ</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X size={20} weight="bold" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="holiday-label" className="block text-sm font-medium text-slate-700 mb-1">
              Tên ngày nghỉ <span className="text-red-500">*</span>
            </label>
            <input
              id="holiday-label"
              type="text"
              value={label}
              onChange={e => { setLabel(e.target.value); setErrors(p => ({ ...p, label: undefined })); }}
              placeholder="VD: Tết Nguyên Đán, Quốc Khánh..."
              aria-invalid={!!errors.label}
              aria-describedby={errors.label ? 'holiday-label-error' : undefined}
              className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-colors
                ${errors.label ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'}`}
            />
            {errors.label && (
              <span id="holiday-label-error" className="text-xs text-red-500 mt-1 block" role="alert">
                {errors.label}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="holiday-date" className="block text-sm font-medium text-slate-700 mb-1">
              Ngày <span className="text-red-500">*</span>
            </label>
            <input
              id="holiday-date"
              type="date"
              value={date}
              onChange={e => { setDate(e.target.value); setErrors(p => ({ ...p, date: undefined })); }}
              aria-invalid={!!errors.date}
              aria-describedby={errors.date ? 'holiday-date-error' : undefined}
              className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-colors
                ${errors.date ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'}`}
            />
            {errors.date && (
              <span id="holiday-date-error" className="text-xs text-red-500 mt-1 block" role="alert">
                {errors.date}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg
              hover:bg-slate-50 transition-colors"
          >
            Huỷ
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg
              hover:bg-blue-700 transition-colors"
          >
            Thêm ngày nghỉ
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ClinicSettings = () => {
  // Form state
  const [form, setForm] = useState<ClinicForm>(DEFAULT_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [schedule, setSchedule] = useState<DaySchedule[]>(DEFAULT_SCHEDULE);
  const [holidays, setHolidays] = useState<HolidayEntry[]>([
    { id: '1', label: 'Tết Nguyên Đán', date: '2025-01-29' },
    { id: '2', label: 'Giỗ Tổ Hùng Vương', date: '2025-04-18' },
  ]);

  // UI state
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAddHoliday, setShowAddHoliday] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Validation ──────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = 'Tên phòng khám không được để trống.';
    if (!form.hotline.trim()) newErrors.hotline = 'Số điện thoại hotline không được để trống.';
    if (!form.email.trim()) {
      newErrors.email = 'Email không được để trống.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Email không hợp lệ. Ví dụ: ten@email.com';
    }
    if (!form.representative.trim()) newErrors.representative = 'Người đại diện không được để trống.';
    if (!form.taxCode.trim()) newErrors.taxCode = 'Mã số thuế không được để trống.';
    if (!form.address.trim()) newErrors.address = 'Địa chỉ không được để trống.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToastMsg('Ảnh vượt quá 2MB. Vui lòng chọn ảnh khác.', 'error');
      return;
    }
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      showToastMsg('Chỉ chấp nhận định dạng JPG, PNG.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm(p => ({ ...p, logo: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleFieldChange = (field: keyof ClinicForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm(p => ({ ...p, [field]: e.target.value }));
    if (errors[field as keyof FormErrors]) setErrors(p => ({ ...p, [field]: undefined }));
  };

  const handleScheduleToggle = (index: number, value: boolean) => {
    setSchedule(prev => prev.map((d, i) => i === index ? { ...d, enabled: value } : d));
  };

  const handleTimeChange = (index: number, type: 'open' | 'close', value: string) => {
    setSchedule(prev => prev.map((d, i) => i === index ? { ...d, [type]: value } : d));
  };

  const handleAddHoliday = (label: string, date: string) => {
    setHolidays(prev => [...prev, { id: Date.now().toString(), label, date }]);
    setShowAddHoliday(false);
    showToastMsg(`Đã thêm ngày nghỉ "${label}"`, 'success');
  };

  const handleRemoveHoliday = (id: string) => {
    setHolidays(prev => prev.filter(h => h.id !== id));
  };

  const handleSave = async () => {
    if (!validate()) {
      showToastMsg('Vui lòng kiểm tra lại các trường thông tin.', 'error');
      return;
    }
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    showToastMsg('Lưu cấu hình thành công!', 'success');
  };

  const handleCancel = () => setShowConfirm(true);

  const handleConfirmCancel = () => {
    setForm(DEFAULT_FORM);
    setSchedule(DEFAULT_SCHEDULE);
    setErrors({});
    setShowConfirm(false);
    showToastMsg('Đã hoàn tác tất cả thay đổi.', 'success');
  };

  const showToastMsg = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-full">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cấu hình hệ thống</h1>
          <p className="text-sm text-slate-500 mt-0.5">Quản lý thông tin và lịch hoạt động của phòng khám</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="btn-cancel-settings"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg
              hover:bg-slate-50 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            Huỷ bỏ
          </button>
          <button
            id="btn-save-settings"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg
              hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
              transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <FloppyDisk size={16} weight="bold" />
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* ── Left: Basic Info ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-5">
          <h2 className="font-semibold text-slate-900 text-base">Thông tin cơ bản</h2>

          {/* Logo Upload */}
          <div className="flex items-center gap-4">
            <div
              className="relative w-[72px] h-[72px] rounded-2xl bg-blue-50 border-2 border-blue-100
                flex items-center justify-center overflow-hidden shrink-0 cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
              title="Nhấn để thay đổi logo"
            >
              {form.logo ? (
                <img src={form.logo} alt="Logo phòng khám" className="w-full h-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  P
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity
                flex items-center justify-center rounded-2xl">
                <Camera size={20} className="text-white" weight="fill" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                <Camera size={10} className="text-white" weight="bold" />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={handleLogoChange}
              id="logo-upload"
              aria-label="Tải lên logo phòng khám"
            />
            <div>
              <p className="text-sm font-medium text-slate-700">Logo phòng khám</p>
              <p className="text-xs text-slate-400 mt-0.5">Định dạng JPG, PNG. Kích thước tối đa 2MB.</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-1.5 transition-colors"
              >
                Thay đổi ảnh
              </button>
            </div>
          </div>

          {/* Clinic Name */}
          <div>
            <label htmlFor="clinic-name" className="block text-sm font-medium text-slate-700 mb-1.5">
              Tên phòng khám / Chi nhánh <span className="text-red-500">*</span>
            </label>
            <input
              id="clinic-name"
              type="text"
              value={form.name}
              onChange={handleFieldChange('name')}
              onBlur={() => validate()}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'clinic-name-error' : undefined}
              placeholder="Nhập tên phòng khám..."
              className={`w-full px-3.5 py-2.5 text-sm border rounded-xl outline-none transition-colors
                ${errors.name
                  ? 'border-red-400 focus:border-red-500 bg-red-50/30'
                  : 'border-slate-200 focus:border-blue-500 focus:bg-white bg-slate-50'
                }`}
            />
            {errors.name && (
              <span id="clinic-name-error" className="text-xs text-red-500 mt-1 block" role="alert">
                {errors.name}
              </span>
            )}
          </div>

          {/* Hotline + Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="clinic-hotline" className="block text-sm font-medium text-slate-700 mb-1.5">
                Số điện thoại Hotline <span className="text-red-500">*</span>
              </label>
              <input
                id="clinic-hotline"
                type="tel"
                value={form.hotline}
                onChange={handleFieldChange('hotline')}
                onBlur={() => validate()}
                aria-invalid={!!errors.hotline}
                aria-describedby={errors.hotline ? 'clinic-hotline-error' : undefined}
                placeholder="1900 xxxx"
                className={`w-full px-3.5 py-2.5 text-sm border rounded-xl outline-none transition-colors
                  ${errors.hotline
                    ? 'border-red-400 focus:border-red-500 bg-red-50/30'
                    : 'border-slate-200 focus:border-blue-500 focus:bg-white bg-slate-50'
                  }`}
              />
              {errors.hotline && (
                <span id="clinic-hotline-error" className="text-xs text-red-500 mt-1 block" role="alert">
                  {errors.hotline}
                </span>
              )}
            </div>
            <div>
              <label htmlFor="clinic-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Email liên hệ <span className="text-red-500">*</span>
              </label>
              <input
                id="clinic-email"
                type="email"
                value={form.email}
                onChange={handleFieldChange('email')}
                onBlur={() => validate()}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'clinic-email-error' : undefined}
                placeholder="example@clinic.vn"
                className={`w-full px-3.5 py-2.5 text-sm border rounded-xl outline-none transition-colors
                  ${errors.email
                    ? 'border-red-400 focus:border-red-500 bg-red-50/30'
                    : 'border-slate-200 focus:border-blue-500 focus:bg-white bg-slate-50'
                  }`}
              />
              {errors.email && (
                <span id="clinic-email-error" className="text-xs text-red-500 mt-1 block" role="alert">
                  {errors.email}
                </span>
              )}
            </div>
          </div>

          {/* Representative + Tax */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="clinic-rep" className="block text-sm font-medium text-slate-700 mb-1.5">
                Người đại diện pháp luật <span className="text-red-500">*</span>
              </label>
              <input
                id="clinic-rep"
                type="text"
                value={form.representative}
                onChange={handleFieldChange('representative')}
                onBlur={() => validate()}
                aria-invalid={!!errors.representative}
                aria-describedby={errors.representative ? 'clinic-rep-error' : undefined}
                placeholder="Họ và tên..."
                className={`w-full px-3.5 py-2.5 text-sm border rounded-xl outline-none transition-colors
                  ${errors.representative
                    ? 'border-red-400 focus:border-red-500 bg-red-50/30'
                    : 'border-slate-200 focus:border-blue-500 focus:bg-white bg-slate-50'
                  }`}
              />
              {errors.representative && (
                <span id="clinic-rep-error" className="text-xs text-red-500 mt-1 block" role="alert">
                  {errors.representative}
                </span>
              )}
            </div>
            <div>
              <label htmlFor="clinic-tax" className="block text-sm font-medium text-slate-700 mb-1.5">
                Mã số thuế / GPKD <span className="text-red-500">*</span>
              </label>
              <input
                id="clinic-tax"
                type="text"
                value={form.taxCode}
                onChange={handleFieldChange('taxCode')}
                onBlur={() => validate()}
                aria-invalid={!!errors.taxCode}
                aria-describedby={errors.taxCode ? 'clinic-tax-error' : undefined}
                placeholder="0100000000"
                className={`w-full px-3.5 py-2.5 text-sm border rounded-xl outline-none transition-colors
                  ${errors.taxCode
                    ? 'border-red-400 focus:border-red-500 bg-red-50/30'
                    : 'border-slate-200 focus:border-blue-500 focus:bg-white bg-slate-50'
                  }`}
              />
              {errors.taxCode && (
                <span id="clinic-tax-error" className="text-xs text-red-500 mt-1 block" role="alert">
                  {errors.taxCode}
                </span>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="clinic-address" className="block text-sm font-medium text-slate-700 mb-1.5">
              Địa chỉ chi tiết <span className="text-red-500">*</span>
            </label>
            <textarea
              id="clinic-address"
              value={form.address}
              onChange={handleFieldChange('address')}
              onBlur={() => validate()}
              rows={3}
              aria-invalid={!!errors.address}
              aria-describedby={errors.address ? 'clinic-address-error' : undefined}
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố..."
              className={`w-full px-3.5 py-2.5 text-sm border rounded-xl outline-none transition-colors resize-none
                ${errors.address
                  ? 'border-red-400 focus:border-red-500 bg-red-50/30'
                  : 'border-slate-200 focus:border-blue-500 focus:bg-white bg-slate-50'
                }`}
            />
            {errors.address && (
              <span id="clinic-address-error" className="text-xs text-red-500 mt-1 block" role="alert">
                {errors.address}
              </span>
            )}
          </div>
        </div>

        {/* ── Right: Schedule ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-5">
          <h2 className="font-semibold text-slate-900 text-base">Lịch mở cửa</h2>

          <div className="flex flex-col gap-3">
            {DAYS.map((day, index) => {
              const d = schedule[index];
              return (
                <div key={day} className="flex items-center gap-3">
                  <span className={`w-[64px] text-sm font-medium shrink-0 ${d.enabled ? 'text-slate-700' : 'text-slate-400'}`}>
                    {day}
                  </span>

                  <Toggle
                    id={`toggle-day-${index}`}
                    checked={d.enabled}
                    onChange={v => handleScheduleToggle(index, v)}
                  />

                  {d.enabled ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="time"
                        value={d.open}
                        onChange={e => handleTimeChange(index, 'open', e.target.value)}
                        aria-label={`Giờ mở cửa ${day}`}
                        className="px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none
                          focus:border-blue-500 bg-slate-50 focus:bg-white transition-colors w-[90px]"
                      />
                      <span className="text-slate-400 text-sm font-medium">—</span>
                      <input
                        type="time"
                        value={d.close}
                        onChange={e => handleTimeChange(index, 'close', e.target.value)}
                        aria-label={`Giờ đóng cửa ${day}`}
                        className="px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none
                          focus:border-blue-500 bg-slate-50 focus:bg-white transition-colors w-[90px]"
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400 italic flex-1">Nghỉ / Đóng cửa</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100" />

          {/* Holidays */}
          <div>
            <p className="text-sm font-semibold text-slate-700">Ngày Lễ / Nghỉ phép định kỳ</p>
            <p className="text-xs text-slate-400 mt-0.5 mb-3">
              Thiết lập tự động từ chối lịch hẹn vào các ngày Lễ, Tết.
            </p>

            {holidays.length > 0 && (
              <div className="flex flex-col gap-2 mb-3">
                {holidays.map(h => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-700">{h.label}</span>
                      <span className="text-xs text-slate-400">
                        {new Date(h.date + 'T00:00:00').toLocaleDateString('vi-VN', {
                          day: '2-digit', month: '2-digit', year: 'numeric'
                        })}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveHoliday(h.id)}
                      aria-label={`Xoá ngày nghỉ ${h.label}`}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400
                        hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <X size={14} weight="bold" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              id="btn-add-holiday"
              onClick={() => setShowAddHoliday(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600
                border border-blue-200 rounded-lg hover:bg-blue-50 active:scale-95
                transition-all focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <Plus size={16} weight="bold" />
              Thêm ngày nghỉ
            </button>
          </div>
        </div>
      </div>

      {/* Modals & Toast */}
      <ConfirmModal
        open={showConfirm}
        onConfirm={handleConfirmCancel}
        onCancel={() => setShowConfirm(false)}
      />
      <AddHolidayModal
        open={showAddHoliday}
        onAdd={handleAddHoliday}
        onClose={() => setShowAddHoliday(false)}
      />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ClinicSettings;
