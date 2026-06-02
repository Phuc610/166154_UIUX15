import React, { useState } from 'react';
import {
  MagnifyingGlass, Funnel, Plus, DownloadSimple,
  DotsThreeVertical, Eye, PencilSimple, CaretLeft, CaretRight
} from '@phosphor-icons/react';
import Modal from './components/Modal';

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ name: '', phone: '', gender: '', age: '' });
  const [formErrors, setFormErrors] = useState({ name: '', phone: '', gender: '', age: '' });

  // Mock data
  const patients = [
    { id: 'BN-00124', name: 'Nguyễn Hồng Minh', phone: '0424 707 55', gender: 'Nam', age: 34, lastVisit: '12/05/2026', status: 'Đang điều trị', statusColor: 'blue' },
    { id: 'BN-00125', name: 'Trần Thị Mai', phone: '0987 654 32', gender: 'Nữ', age: 28, lastVisit: '15/05/2026', status: 'Đã hoàn thành', statusColor: 'emerald' },
    { id: 'BN-00126', name: 'Lê Văn Tám', phone: '0123 456 78', gender: 'Nam', age: 45, lastVisit: '20/05/2026', status: 'Chờ khám', statusColor: 'amber' },
    { id: 'BN-00127', name: 'Phạm Thu Trang', phone: '0912 345 67', gender: 'Nữ', age: 52, lastVisit: '01/06/2026', status: 'Đang điều trị', statusColor: 'blue' },
    { id: 'BN-00128', name: 'Hoàng Minh Tuấn', phone: '0901 234 56', gender: 'Nam', age: 19, lastVisit: '28/04/2026', status: 'Đã hoàn thành', statusColor: 'emerald' },
  ];

  const filteredPatients = patients.filter(p => {
    const term = searchTerm.toLowerCase();
    return p.name.toLowerCase().includes(term) || 
           p.id.toLowerCase().includes(term) || 
           p.phone.replace(/\s/g, '').includes(term.replace(/\s/g, ''));
  });

  const validateForm = () => {
    let isValid = true;
    const errors = { name: '', phone: '', gender: '', age: '' };

    if (!formData.name.trim()) {
      errors.name = 'Vui lòng nhập họ tên bệnh nhân.';
      isValid = false;
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại.';
      isValid = false;
    } else if (!/^[0-9\-\+]{9,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Số điện thoại không hợp lệ.';
      isValid = false;
    }
    if (!formData.gender) {
      errors.gender = 'Vui lòng chọn giới tính.';
      isValid = false;
    }
    if (!formData.age || isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      errors.age = 'Tuổi phải là số lớn hơn 0.';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Save data here
      setIsModalOpen(false);
      setFormData({ name: '', phone: '', gender: '', age: '' });
      setFormErrors({ name: '', phone: '', gender: '', age: '' });
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý Bệnh nhân</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý hồ sơ, thông tin cá nhân và lịch sử khám của bệnh nhân</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg font-semibold text-sm text-slate-700 transition-colors shadow-sm">
            <DownloadSimple size={18} /> Xuất danh sách
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm"
          >
            <Plus size={18} weight="bold" /> Thêm bệnh nhân
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
              placeholder="Tìm theo tên, SĐT, Mã BN..." 
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

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">Trạng thái:</span>
          <select className="appearance-none bg-slate-50 border border-slate-200 rounded-lg py-2 pl-3 pr-8 text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-600 cursor-pointer shadow-sm">
            <option>Tất cả</option>
            <option>Đang điều trị</option>
            <option>Đã hoàn thành</option>
            <option>Chờ khám</option>
          </select>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-sm font-semibold bg-slate-50">
                <th className="px-6 py-4 rounded-tl-xl w-16 text-center">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                </th>
                <th className="px-6 py-4">Mã BN</th>
                <th className="px-6 py-4">Tên Bệnh nhân</th>
                <th className="px-6 py-4">Giới tính / Tuổi</th>
                <th className="px-6 py-4">Lần khám cuối</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right rounded-tr-xl">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 text-center">
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600">{patient.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold shrink-0">
                        {patient.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{patient.name}</span>
                        <span className="text-xs text-slate-500">{patient.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {patient.gender} • {patient.age}t
                  </td>
                  <td className="px-6 py-4 text-slate-600">{patient.lastVisit}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-${patient.statusColor}-100 text-${patient.statusColor}-700`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors tooltip" title="Xem hồ sơ">
                        <Eye size={16} />
                      </button>
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
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    Không tìm thấy bệnh nhân nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-white rounded-bl-xl rounded-br-xl">
          <div className="text-sm text-slate-500">
            Hiển thị <strong>1</strong> đến <strong>{filteredPatients.length}</strong> trong số <strong>{searchTerm ? filteredPatients.length : '1,245'}</strong> bệnh nhân
          </div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded flex items-center justify-center border border-slate-200 text-slate-400 cursor-not-allowed">
              <CaretLeft size={16} weight="bold" />
            </button>
            <button className="w-8 h-8 rounded flex items-center justify-center bg-blue-600 text-white font-semibold text-sm">
              1
            </button>
            <button className="w-8 h-8 rounded flex items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-sm transition-colors">
              2
            </button>
            <button className="w-8 h-8 rounded flex items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-sm transition-colors">
              3
            </button>
            <span className="text-slate-400 px-1">...</span>
            <button className="w-8 h-8 rounded flex items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-sm transition-colors">
              249
            </button>
            <button className="w-8 h-8 rounded flex items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
              <CaretRight size={16} weight="bold" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Add Patient */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Thêm bệnh nhân mới"
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-1">Giới tính <span className="text-red-500">*</span></label>
              <select
                id="gender"
                className={`w-full py-2 px-3 border rounded-lg outline-none text-sm bg-white ${formErrors.gender ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'}`}
                value={formData.gender}
                onChange={(e) => { setFormData({...formData, gender: e.target.value}); setFormErrors({...formErrors, gender: ''}); }}
                aria-invalid={!!formErrors.gender}
              >
                <option value="">-- Chọn --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
              {formErrors.gender && <p className="text-red-500 text-xs mt-1">{formErrors.gender}</p>}
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-slate-700 mb-1">Tuổi <span className="text-red-500">*</span></label>
              <input 
                id="age"
                type="number" 
                placeholder="VD: 30"
                min="1"
                max="150"
                className={`w-full py-2 px-3 border rounded-lg outline-none text-sm ${formErrors.age ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'}`}
                value={formData.age}
                onChange={(e) => { setFormData({...formData, age: e.target.value}); setFormErrors({...formErrors, age: ''}); }}
                aria-invalid={!!formErrors.age}
              />
              {formErrors.age && <p className="text-red-500 text-xs mt-1">{formErrors.age}</p>}
            </div>
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

export default Patients;
