import React, { useState, useRef, useEffect } from 'react';
import {
  MagnifyingGlass, Plus, DownloadSimple, Funnel,
  DotsThreeVertical, PencilSimple, Trash, Eye,
  X, Users, UserCheck, Buildings, CaretDown, Warning
} from '@phosphor-icons/react';
import Modal from './components/Modal';
import { useToast } from './contexts/ToastContext';

// ── Types ──────────────────────────────────────────────────
type StaffStatus = 'active' | 'leave' | 'remote';

interface StaffMember {
  id: string;
  code: string;
  name: string;
  email: string;
  role: string;
  department: string;
  phone: string;
  joinDate: string;
  status: StaffStatus;
  avatarColor: string;
}

// ── Constants ──────────────────────────────────────────────
const STATUS_CONFIG: Record<StaffStatus, { label: string; dot: string; text: string; bg: string }> = {
  active: { label: 'Đang trực',  dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
  leave:  { label: 'Nghỉ phép',  dot: 'bg-red-500',     text: 'text-red-700',     bg: 'bg-red-50'     },
  remote: { label: 'Ngoại tuyến',dot: 'bg-slate-400',   text: 'text-slate-600',   bg: 'bg-slate-100'  },
};

const DEPARTMENTS = ['Tất cả', 'Khoa Tim mạch', 'Khoa Nhi', 'Phòng cấp cứu', 'Sảnh chính', 'Khoa Tổng quát'];

const INITIAL_STAFF: StaffMember[] = [
  { id: 's1', code: '#NV-001', name: 'Dr. Andrew Billard', email: 'andrew.b@clinic.vn', role: 'Bác sĩ trưởng',    department: 'Khoa Tim mạch',    phone: '0908 123 456', joinDate: '12/05/2020', status: 'active', avatarColor: 'bg-rose-400'    },
  { id: 's2', code: '#NV-005', name: 'Dr. Sarah Connor',   email: 'sarah.c@clinic.vn',  role: 'Bác sĩ điều trị',  department: 'Khoa Nhi',         phone: '0912 987 654', joinDate: '01/02/2022', status: 'leave',  avatarColor: 'bg-blue-400'    },
  { id: 's3', code: '#NV-024', name: 'Lê Thị Thanh',       email: 'thanh.le@clinic.vn', role: 'Y tá trưởng',      department: 'Phòng cấp cứu',    phone: '0334 555 666', joinDate: '15/08/2021', status: 'active', avatarColor: 'bg-emerald-400' },
  { id: 's4', code: '#NV-088', name: 'Phạm Minh Tú',       email: 'tu.pham@clinic.vn',  role: 'Lễ tân',           department: 'Sảnh chính',       phone: '0988 111 222', joinDate: '20/01/2023', status: 'remote', avatarColor: 'bg-amber-400'   },
  { id: 's5', code: '#NV-012', name: 'Dr. Minh Hoàng',     email: 'minh.h@clinic.vn',   role: 'Bác sĩ điều trị',  department: 'Khoa Tổng quát',   phone: '0901 222 333', joinDate: '03/07/2019', status: 'active', avatarColor: 'bg-purple-400'  },
  { id: 's6', code: '#NV-031', name: 'Nguyễn Thị Lan',     email: 'lan.nt@clinic.vn',   role: 'Điều dưỡng',       department: 'Khoa Tim mạch',    phone: '0977 444 555', joinDate: '10/11/2021', status: 'active', avatarColor: 'bg-pink-400'    },
];

const EMPTY_FORM = { name: '', email: '', role: '', department: '', phone: '' };
const EMPTY_ERRORS = { name: '', email: '', role: '', department: '', phone: '' };

// ── Component ──────────────────────────────────────────────
const Staff = () => {
  const { showToast } = useToast();
  const [staffList, setStaffList]   = useState<StaffMember[]>(INITIAL_STAFF);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('Tất cả');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData]     = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState(EMPTY_ERRORS);
  const [detailStaff, setDetailStaff] = useState<StaffMember | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StaffMember | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Derived ──
  const filtered = staffList.filter(s => {
    const term = searchTerm.toLowerCase();
    const matchSearch = !searchTerm ||
      s.name.toLowerCase().includes(term) ||
      s.code.toLowerCase().includes(term) ||
      s.phone.includes(term) ||
      s.email.toLowerCase().includes(term);
    const matchDept = filterDept === 'Tất cả' || s.department === filterDept;
    return matchSearch && matchDept;
  });

  const totalActive  = staffList.filter(s => s.status === 'active').length;
  const totalDoctors = staffList.filter(s => s.role.toLowerCase().includes('bác sĩ')).length;

  // ── Validation ──
  const validateForm = () => {
    const errors = { ...EMPTY_ERRORS };
    let ok = true;
    if (!formData.name.trim())   { errors.name = 'Vui lòng nhập họ tên.'; ok = false; }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email không hợp lệ. Ví dụ: ten@clinic.vn'; ok = false;
    }
    if (!formData.role.trim())   { errors.role = 'Vui lòng nhập chức vụ.'; ok = false; }
    if (!formData.department)    { errors.department = 'Vui lòng chọn phòng ban.'; ok = false; }
    if (!formData.phone.trim() || !/^[0-9\s]{9,15}$/.test(formData.phone)) {
      errors.phone = 'Số điện thoại không hợp lệ.'; ok = false;
    }
    setFormErrors(errors);
    return ok;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const colors = ['bg-rose-400','bg-blue-400','bg-emerald-400','bg-amber-400','bg-purple-400','bg-pink-400'];
    const newCode = `#NV-${String(staffList.length + 1).padStart(3,'0')}`;
    setStaffList(prev => [...prev, {
      id: `s${Date.now()}`, code: newCode,
      name: formData.name, email: formData.email,
      role: formData.role, department: formData.department,
      phone: formData.phone,
      joinDate: new Date().toLocaleDateString('vi-VN'),
      status: 'active',
      avatarColor: colors[Math.floor(Math.random() * colors.length)],
    }]);
    setFormData(EMPTY_FORM); setFormErrors(EMPTY_ERRORS); setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setStaffList(prev => prev.filter(s => s.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  // ── Render ──
  return (
    <>
      {/* PAGE HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Danh sách Nhân sự</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý thông tin, chức vụ và trạng thái toàn bộ nhân sự</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => showToast('Đã xuất báo cáo thành công!')}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg font-semibold text-sm text-slate-700 transition-colors shadow-sm"
          >
            <DownloadSimple size={18} /> Xuất báo cáo
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm"
          >
            <Plus size={18} weight="bold" /> Thêm mới
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        {[
          { label: 'Tổng số nhân sự',      value: `${staffList.length} người`, icon: <Users size={28} className="text-blue-500" />,   bg: 'bg-blue-50' },
          { label: 'Bác sĩ & Chuyên gia',   value: `${totalDoctors} người`,     icon: <UserCheck size={28} className="text-emerald-500" />, bg: 'bg-emerald-50' },
          { label: 'Nhân viên đang trực',   value: `${totalActive} người`,      icon: <Buildings size={28} className="text-amber-500" />, bg: 'bg-amber-50' },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-xl px-6 py-5 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            </div>
            <div className={`w-14 h-14 rounded-full ${stat.bg} flex items-center justify-center`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* FILTER BAR */}
      <div className="bg-white border border-slate-200 rounded-xl px-5 py-3.5 mb-5 flex items-center gap-4 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlass size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm tên, SĐT, Email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-9 pr-4 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 rounded-lg text-sm outline-none transition-colors"
          />
        </div>

        <div className="h-7 w-px bg-slate-200"></div>

        <div className="relative flex items-center gap-2">
          <Funnel size={17} className="text-slate-500" />
          <span className="text-sm text-slate-500">Lọc phòng ban:</span>
          <div className="relative">
            <select
              value={filterDept}
              onChange={e => setFilterDept(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 rounded-lg py-2 pl-3 pr-8 text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
            </select>
            <CaretDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="ml-auto text-sm text-slate-400">
          {filtered.length} / {staffList.length} nhân sự
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-sm font-semibold">
                <th className="px-6 py-4">Nhân viên</th>
                <th className="px-6 py-4">Mã nhân sự</th>
                <th className="px-6 py-4">Chức vụ / Khoa</th>
                <th className="px-6 py-4">Số điện thoại</th>
                <th className="px-6 py-4">Ngày gia nhập</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 w-12"></th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {filtered.length > 0 ? filtered.map(staff => {
                const cfg = STATUS_CONFIG[staff.status];
                return (
                  <tr key={staff.id} className="hover:bg-slate-50/60 transition-colors group">
                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${staff.avatarColor} flex items-center justify-center text-white font-bold shrink-0 text-sm`}>
                          {staff.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{staff.name}</p>
                          <p className="text-xs text-slate-400">{staff.email}</p>
                        </div>
                      </div>
                    </td>
                    {/* Code */}
                    <td className="px-6 py-4 font-mono text-slate-600 font-semibold text-sm">{staff.code}</td>
                    {/* Role */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{staff.role}</p>
                      <p className="text-xs text-slate-400">{staff.department}</p>
                    </td>
                    {/* Phone */}
                    <td className="px-6 py-4 text-slate-600">{staff.phone}</td>
                    {/* Join date */}
                    <td className="px-6 py-4 text-slate-600">{staff.joinDate}</td>
                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                        {cfg.label}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-4 relative" ref={openMenuId === staff.id ? menuRef : undefined}>
                      <button
                        onClick={() => setOpenMenuId(openMenuId === staff.id ? null : staff.id)}
                        className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <DotsThreeVertical size={16} />
                      </button>

                      {openMenuId === staff.id && (
                        <div className="absolute right-4 top-12 z-30 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 w-44 text-sm">
                          <button
                            onClick={() => { setDetailStaff(staff); setOpenMenuId(null); }}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <Eye size={16} /> Xem chi tiết
                          </button>
                          <button
                            onClick={() => {
                              setFormData({ name: staff.name, email: staff.email, role: staff.role, department: staff.department, phone: staff.phone });
                              setIsModalOpen(true); setOpenMenuId(null);
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <PencilSimple size={16} /> Chỉnh sửa
                          </button>
                          <div className="h-px bg-slate-100 my-1"></div>
                          <button
                            onClick={() => { setDeleteTarget(staff); setOpenMenuId(null); }}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash size={16} /> Xóa nhân sự
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={7} className="px-6 py-14 text-center text-slate-400">
                    Không tìm thấy nhân sự phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL: THÊM / SỬA NHÂN SỰ ── */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setFormData(EMPTY_FORM); setFormErrors(EMPTY_ERRORS); }} title="Thêm nhân sự mới">
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label htmlFor="staff-name" className="block text-sm font-medium text-slate-700 mb-1">Họ và Tên <span className="text-red-500">*</span></label>
            <input id="staff-name" type="text" placeholder="VD: Nguyễn Văn A"
              className={`w-full py-2 px-3 border rounded-lg outline-none text-sm ${formErrors.name ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'}`}
              value={formData.name} onChange={e => { setFormData({ ...formData, name: e.target.value }); setFormErrors({ ...formErrors, name: '' }); }}
            />
            {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
          </div>

          <div>
            <label htmlFor="staff-email" className="block text-sm font-medium text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
            <input id="staff-email" type="email" placeholder="VD: ten@clinic.vn"
              className={`w-full py-2 px-3 border rounded-lg outline-none text-sm ${formErrors.email ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'}`}
              value={formData.email} onChange={e => { setFormData({ ...formData, email: e.target.value }); setFormErrors({ ...formErrors, email: '' }); }}
            />
            {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="staff-role" className="block text-sm font-medium text-slate-700 mb-1">Chức vụ <span className="text-red-500">*</span></label>
              <input id="staff-role" type="text" placeholder="VD: Y tá, Bác sĩ..."
                className={`w-full py-2 px-3 border rounded-lg outline-none text-sm ${formErrors.role ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'}`}
                value={formData.role} onChange={e => { setFormData({ ...formData, role: e.target.value }); setFormErrors({ ...formErrors, role: '' }); }}
              />
              {formErrors.role && <p className="text-red-500 text-xs mt-1">{formErrors.role}</p>}
            </div>
            <div>
              <label htmlFor="staff-dept" className="block text-sm font-medium text-slate-700 mb-1">Phòng ban <span className="text-red-500">*</span></label>
              <select id="staff-dept"
                className={`w-full py-2 px-3 border rounded-lg outline-none text-sm bg-white ${formErrors.department ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'}`}
                value={formData.department} onChange={e => { setFormData({ ...formData, department: e.target.value }); setFormErrors({ ...formErrors, department: '' }); }}
              >
                <option value="">-- Chọn phòng ban --</option>
                {DEPARTMENTS.filter(d => d !== 'Tất cả').map(d => <option key={d}>{d}</option>)}
              </select>
              {formErrors.department && <p className="text-red-500 text-xs mt-1">{formErrors.department}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="staff-phone" className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
            <input id="staff-phone" type="tel" placeholder="VD: 0987 654 321"
              className={`w-full py-2 px-3 border rounded-lg outline-none text-sm ${formErrors.phone ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'}`}
              value={formData.phone} onChange={e => { setFormData({ ...formData, phone: e.target.value }); setFormErrors({ ...formErrors, phone: '' }); }}
            />
            {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => { setIsModalOpen(false); setFormData(EMPTY_FORM); setFormErrors(EMPTY_ERRORS); }}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors">
              Hủy bỏ
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors">
              Xác nhận Thêm
            </button>
          </div>
        </form>
      </Modal>

      {/* ── MODAL: DETAIL ── */}
      {detailStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setDetailStaff(null)}></div>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative z-10">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">Hồ sơ nhân sự</h2>
              <button onClick={() => setDetailStaff(null)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
                <X size={18} weight="bold" />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full ${detailStaff.avatarColor} flex items-center justify-center text-white font-bold text-2xl`}>
                  {detailStaff.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-xl text-slate-900">{detailStaff.name}</p>
                  <p className="text-sm text-slate-500">{detailStaff.role} • {detailStaff.department}</p>
                  <span className={`inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_CONFIG[detailStaff.status].bg} ${STATUS_CONFIG[detailStaff.status].text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[detailStaff.status].dot}`}></span>
                    {STATUS_CONFIG[detailStaff.status].label}
                  </span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-3 text-sm">
                {[
                  { label: 'Mã nhân sự', value: detailStaff.code },
                  { label: 'Email',      value: detailStaff.email },
                  { label: 'Điện thoại', value: detailStaff.phone },
                  { label: 'Ngày gia nhập', value: detailStaff.joinDate },
                ].map((item, i, arr) => (
                  <React.Fragment key={item.label}>
                    <div><p className="text-xs text-slate-500">{item.label}</p><p className="font-semibold text-slate-800">{item.value}</p></div>
                    {i < arr.length - 1 && <div className="h-px bg-slate-200"></div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setDetailStaff(null)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors">Đóng</button>
              <button
                onClick={() => {
                  setFormData({ name: detailStaff.name, email: detailStaff.email, role: detailStaff.role, department: detailStaff.department, phone: detailStaff.phone });
                  setDetailStaff(null); setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors flex items-center gap-2"
              >
                <PencilSimple size={16} /> Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: XÁC NHẬN XÓA ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setDeleteTarget(null)}></div>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm relative z-10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                <Warning size={20} weight="fill" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Xác nhận xóa</h2>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Bạn có chắc muốn xóa nhân sự <strong>{deleteTarget.name}</strong>?<br />
              <span className="text-red-500">Hành động này không thể hoàn tác.</span>
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors">Hủy bỏ</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold text-sm transition-colors">Xác nhận Xóa</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Staff;
