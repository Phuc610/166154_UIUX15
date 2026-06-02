import React, { useState } from 'react';
import {
  MagnifyingGlass, Funnel, Plus, DownloadSimple,
  DotsThreeVertical, Eye, PencilSimple, CaretLeft, CaretRight,
  Stethoscope
} from '@phosphor-icons/react';
import Modal from './components/Modal';
import { useToast } from './contexts/ToastContext';

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();
  
  // Form State
  const [formData, setFormData] = useState({ name: '', phone: '', specialty: '' });
  const [formErrors, setFormErrors] = useState({ name: '', phone: '', specialty: '' });

  // Mock data
  const doctors = [
    { id: 'BS-001', name: 'Dr. Sarah Connor', phone: '0987 123 456', specialty: 'Khoa Nhi', schedule: 'T2, T3, T5', status: 'Sẵn sàng', statusColor: 'emerald' },
    { id: 'BS-002', name: 'Dr. Andrew Billard', phone: '0912 345 678', specialty: 'Khoa Tổng quát', schedule: 'T2 - T6', status: 'Đang khám', statusColor: 'red' },
    { id: 'BS-003', name: 'Dr. John Doe', phone: '0905 555 111', specialty: 'Khoa Ngoại', schedule: 'T4, T6, T7', status: 'Sẵn sàng', statusColor: 'emerald' },
    { id: 'BS-004', name: 'Dr. Jane Smith', phone: '0933 444 222', specialty: 'Khoa Sản', schedule: 'T3, T5, CN', status: 'Nghỉ phép', statusColor: 'slate' },
  ];

  const filteredDoctors = doctors.filter(d => {
    const term = searchTerm.toLowerCase();
    return d.name.toLowerCase().includes(term) || 
           d.id.toLowerCase().includes(term) || 
           d.specialty.toLowerCase().includes(term) ||
           d.phone.replace(/\s/g, '').includes(term.replace(/\s/g, ''));
  });

  const validateForm = () => {
    let isValid = true;
    const errors = { name: '', phone: '', specialty: '' };

    if (!formData.name.trim()) {
      errors.name = 'Vui lòng nhập tên bác sĩ.';
      isValid = false;
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại.';
      isValid = false;
    } else if (!/^[0-9\-\+]{9,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Số điện thoại không hợp lệ.';
      isValid = false;
    }
    if (!formData.specialty.trim()) {
      errors.specialty = 'Vui lòng chọn chuyên khoa.';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // In a real app, save data here
      setIsModalOpen(false);
      setFormData({ name: '', phone: '', specialty: '' });
      setFormErrors({ name: '', phone: '', specialty: '' });
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý Bác sĩ</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý hồ sơ, lịch làm việc và chuyên khoa của bác sĩ</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => showToast('Đã xuất danh sách thành công!')}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg font-semibold text-sm text-slate-700 transition-colors shadow-sm"
          >
            <DownloadSimple size={18} /> Xuất danh sách
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm"
          >
            <Plus size={18} weight="bold" /> Thêm bác sĩ
          </button>
        </div>
      </div>

      {/* Filters Area */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-80">
            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm theo tên, SĐT, Khoa..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2.5 pl-10 pr-4 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 rounded-lg text-sm outline-none transition-colors"
            />
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            <Funnel size={18} /> Lọc nâng cao
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-sm font-semibold bg-slate-50">
                <th className="px-6 py-4">Mã BS</th>
                <th className="px-6 py-4">Tên Bác sĩ</th>
                <th className="px-6 py-4">Chuyên khoa</th>
                <th className="px-6 py-4">Lịch làm việc</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-600">{doctor.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                          <Stethoscope size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{doctor.name}</span>
                          <span className="text-xs text-slate-500">{doctor.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{doctor.specialty}</td>
                    <td className="px-6 py-4 text-slate-600">{doctor.schedule}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full bg-${doctor.statusColor}-500`}></span>
                        <span className={`text-${doctor.statusColor}-700 font-medium`}>{doctor.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors tooltip" title="Chỉnh sửa">
                          <PencilSimple size={16} />
                        </button>
                        <button className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                          <DotsThreeVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Không tìm thấy bác sĩ nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Doctor */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Thêm bác sĩ mới"
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Họ và Tên <span className="text-red-500">*</span></label>
            <input 
              id="name"
              type="text" 
              placeholder="VD: Nguyễn Văn A"
              className={`w-full py-2 px-3 border rounded-lg outline-none text-sm ${formErrors.name ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'}`}
              value={formData.name}
              onChange={(e) => { setFormData({...formData, name: e.target.value}); setFormErrors({...formErrors, name: ''}); }}
              aria-invalid={!!formErrors.name}
            />
            {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
            <input 
              id="phone"
              type="tel" 
              placeholder="VD: 0987654321"
              className={`w-full py-2 px-3 border rounded-lg outline-none text-sm ${formErrors.phone ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'}`}
              value={formData.phone}
              onChange={(e) => { setFormData({...formData, phone: e.target.value}); setFormErrors({...formErrors, phone: ''}); }}
              aria-invalid={!!formErrors.phone}
            />
            {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
          </div>

          <div>
            <label htmlFor="specialty" className="block text-sm font-medium text-slate-700 mb-1">Chuyên khoa <span className="text-red-500">*</span></label>
            <select
              id="specialty"
              className={`w-full py-2 px-3 border rounded-lg outline-none text-sm bg-white ${formErrors.specialty ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'}`}
              value={formData.specialty}
              onChange={(e) => { setFormData({...formData, specialty: e.target.value}); setFormErrors({...formErrors, specialty: ''}); }}
              aria-invalid={!!formErrors.specialty}
            >
              <option value="">-- Chọn chuyên khoa --</option>
              <option value="Khoa Tổng quát">Khoa Tổng quát</option>
              <option value="Khoa Nhi">Khoa Nhi</option>
              <option value="Khoa Ngoại">Khoa Ngoại</option>
              <option value="Khoa Sản">Khoa Sản</option>
            </select>
            {formErrors.specialty && <p className="text-red-500 text-xs mt-1">{formErrors.specialty}</p>}
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors"
            >
              Xác nhận Thêm
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Doctors;
