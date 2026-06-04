import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlass, Plus, DownloadSimple,
  DotsThreeVertical, Eye, PencilSimple, CaretLeft, CaretRight,
  Chat, FileText
} from '@phosphor-icons/react';
import Modal from './components/Modal';
import { useToast } from './contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

export const MOCK_PATIENTS_LIST = [
  { id: 'BN-00124', name: 'Nguyễn Hồng Minh', phone: '0424 707 55', gender: 'Nam', age: 34, lastVisit: '12/05/2026', status: 'Đang điều trị', statusColor: 'blue' },
  { id: 'BN-00125', name: 'Trần Thị Mai', phone: '0987 654 32', gender: 'Nữ', age: 28, lastVisit: '15/05/2026', status: 'Đã hoàn thành', statusColor: 'emerald' },
  { id: 'BN-00126', name: 'Lê Văn Tám', phone: '0123 456 78', gender: 'Nam', age: 45, lastVisit: '20/05/2026', status: 'Chờ khám', statusColor: 'amber' },
  { id: 'BN-00127', name: 'Phạm Thu Trang', phone: '0912 345 67', gender: 'Nữ', age: 52, lastVisit: '01/06/2026', status: 'Đang điều trị', statusColor: 'blue' },
  { id: 'BN-00128', name: 'Hoàng Minh Tuấn', phone: '0901 234 56', gender: 'Nam', age: 19, lastVisit: '28/04/2026', status: 'Đã hoàn thành', statusColor: 'emerald' },
  { id: 'BN-00129', name: 'Ngô Thanh Hải', phone: '0911 223 34', gender: 'Nam', age: 60, lastVisit: '02/06/2026', status: 'Chờ khám', statusColor: 'amber' },
  { id: 'BN-00130', name: 'Vũ Thị Nhung', phone: '0988 776 65', gender: 'Nữ', age: 41, lastVisit: '01/06/2026', status: 'Đang điều trị', statusColor: 'blue' },
  { id: 'BN-00131', name: 'Bùi Văn Hùng', phone: '0933 445 56', gender: 'Nam', age: 33, lastVisit: '10/05/2026', status: 'Đã hoàn thành', statusColor: 'emerald' },
  { id: 'BN-00132', name: 'Đặng Mai Phương', phone: '0944 556 67', gender: 'Nữ', age: 25, lastVisit: '03/06/2026', status: 'Chờ khám', statusColor: 'amber' },
  { id: 'BN-00133', name: 'Phan Tuấn Kiệt', phone: '0955 667 78', gender: 'Nam', age: 29, lastVisit: '18/05/2026', status: 'Đang điều trị', statusColor: 'blue' },
  { id: 'BN-00134', name: 'Lý Thu Hà', phone: '0966 778 89', gender: 'Nữ', age: 48, lastVisit: '22/05/2026', status: 'Đã hoàn thành', statusColor: 'emerald' },
];

const Patients = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const { showToast } = useToast();
  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({ id: '', name: '', phone: '', gender: '', age: '' });
  const [formErrors, setFormErrors] = useState({ name: '', phone: '', gender: '', age: '' });
  const [animIn, setAnimIn] = useState(false);
  
  const [patientList, setPatientList] = useState(MOCK_PATIENTS_LIST);

  // Filtering
  const filteredPatients = patientList.filter(p => {
    const term = searchTerm.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(term) || 
                        p.id.toLowerCase().includes(term) || 
                        p.phone.replace(/\s/g, '').includes(term.replace(/\s/g, ''));
    const matchStatus = statusFilter === 'Tất cả' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Pagination
  const itemsPerPage = 7;
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage) || 1;
  const currentPatients = filteredPatients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1); // Reset page on filter change
  }, [searchTerm, statusFilter]);

  // Click outside to close dropdown
  useEffect(() => {
    const timer = setTimeout(() => setAnimIn(true), 50);
    const closeDropdown = () => setOpenDropdownId(null);
    window.addEventListener('click', closeDropdown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', closeDropdown);
    };
  }, []);

  const getStaggStyle = (idx: number) => ({
    transitionDelay: `${idx * 100}ms`
  });
  const staggClass = `transition-all duration-700 ease-out transform ${animIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`;

  const handleExport = () => {
    showToast('Đã xuất danh sách thành công!');
  };

  const handleView = (patient: any) => {
    setViewData(patient);
    setIsViewModalOpen(true);
  };

  const handleEdit = (patient: any) => {
    setFormData({ id: patient.id, name: patient.name, phone: patient.phone, gender: patient.gender, age: patient.age.toString() });
    setFormErrors({ name: '', phone: '', gender: '', age: '' });
    setIsFormModalOpen(true);
  };

  const handleAdd = () => {
    setFormData({ id: '', name: '', phone: '', gender: '', age: '' });
    setFormErrors({ name: '', phone: '', gender: '', age: '' });
    setIsFormModalOpen(true);
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { name: '', phone: '', gender: '', age: '' };

    if (!formData.name.trim()) { errors.name = 'Vui lòng nhập họ tên bệnh nhân.'; isValid = false; }
    if (!formData.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại.'; isValid = false;
    } else if (!/^[0-9\-\+]{9,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Số điện thoại không hợp lệ.'; isValid = false;
    }
    if (!formData.gender) { errors.gender = 'Vui lòng chọn giới tính.'; isValid = false; }
    if (!formData.age || isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      errors.age = 'Tuổi phải là số lớn hơn 0.'; isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (formData.id) {
        setPatientList(patientList.map(p => p.id === formData.id ? { ...p, ...formData, age: Number(formData.age) } : p));
        showToast('Cập nhật thông tin thành công!');
      } else {
        const newPatient = {
          id: `BN${Math.floor(1000 + Math.random() * 9000)}`,
          ...formData,
          age: Number(formData.age),
          status: 'Đang điều trị',
          lastVisit: 'Chưa có',
        };
        setPatientList([newPatient, ...patientList]);
        showToast('Thêm bệnh nhân mới thành công!');
      }
      setIsFormModalOpen(false);
    }
  };

  return (
    <div className="relative">

      {/* Header */}
      <div className={`flex justify-between items-center mb-6 ${staggClass}`} style={getStaggStyle(1)}>
        <div>
          <h1 className="text-2xl font-bold">Quản lý Bệnh nhân</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý hồ sơ, thông tin cá nhân và lịch sử khám của bệnh nhân</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg font-semibold text-sm text-slate-700 transition-colors shadow-sm">
            <DownloadSimple size={18} /> Xuất danh sách
          </button>
          <button onClick={handleAdd} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm">
            <Plus size={18} weight="bold" /> Thêm bệnh nhân
          </button>
        </div>
      </div>

      {/* Filters Area */}
      <div className={`bg-white border border-slate-200 rounded-xl p-4 mb-6 flex items-center justify-between shadow-sm ${staggClass}`} style={getStaggStyle(2)}>
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
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">Trạng thái:</span>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-slate-50 border border-slate-200 rounded-lg py-2 pl-3 pr-8 text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-600 cursor-pointer shadow-sm"
          >
            <option>Tất cả</option>
            <option>Đang điều trị</option>
            <option>Đã hoàn thành</option>
            <option>Chờ khám</option>
          </select>
        </div>
      </div>

      {/* Table Area */}
      <div className={`bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col min-h-[500px] ${staggClass}`} style={getStaggStyle(3)}>
        <div className="overflow-x-auto flex-1">
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
              {currentPatients.length > 0 ? (
                currentPatients.map((patient, index) => (
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
                    <td className="px-6 py-4 relative">
                      <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleView(patient)} className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors tooltip" title="Xem thông tin cơ bản">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleEdit(patient)} className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors tooltip" title="Chỉnh sửa">
                          <PencilSimple size={16} />
                        </button>
                        <div className="relative">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === patient.id ? null : patient.id); }}
                            className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                          >
                            <DotsThreeVertical size={16} />
                          </button>
                          
                          {openDropdownId === patient.id && (
                            <div className="absolute right-0 top-10 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-2 animate-fade-in-up">
                              <button onClick={() => navigate('/doctor/messages')} className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 transition-colors">
                                <Chat size={16} /> Nhắn tin
                              </button>
                              <button onClick={() => navigate('/doctor/records/1')} className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 transition-colors">
                                <FileText size={16} /> Xem hồ sơ bệnh án
                              </button>
                            </div>
                          )}
                        </div>
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
        {filteredPatients.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-white rounded-bl-xl rounded-br-xl">
            <div className="text-sm text-slate-500">
              Hiển thị <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> đến <strong>{Math.min(currentPage * itemsPerPage, filteredPatients.length)}</strong> trong số <strong>{filteredPatients.length}</strong> bệnh nhân
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded flex items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:text-slate-300 disabled:bg-slate-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
              >
                <CaretLeft size={16} weight="bold" />
              </button>
              
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-8 h-8 rounded flex items-center justify-center font-semibold text-sm transition-colors border
                    ${currentPage === idx + 1 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  {idx + 1}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded flex items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:text-slate-300 disabled:bg-slate-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
              >
                <CaretRight size={16} weight="bold" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Add/Edit Patient */}
      <Modal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)} 
        title={formData.id ? "Chỉnh sửa bệnh nhân" : "Thêm bệnh nhân mới"}
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
              onClick={() => setIsFormModalOpen(false)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors"
            >
              Xác nhận {formData.id ? "Lưu" : "Thêm"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal View Basic Info */}
      <Modal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)} 
        title="Thông tin cơ bản bệnh nhân"
      >
        {viewData && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl">
                {viewData.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{viewData.name}</h2>
                <p className="text-slate-500">{viewData.id}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div>
                <p className="text-slate-500 mb-1">Số điện thoại</p>
                <p className="font-bold text-slate-900">{viewData.phone}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Giới tính / Tuổi</p>
                <p className="font-bold text-slate-900">{viewData.gender} • {viewData.age} tuổi</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Lần khám cuối</p>
                <p className="font-bold text-slate-900">{viewData.lastVisit}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Trạng thái</p>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-${viewData.statusColor}-100 text-${viewData.statusColor}-700`}>
                  {viewData.status}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-slate-100">
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium text-sm transition-colors"
              >
                Đóng
              </button>
              <button 
                onClick={() => { setIsViewModalOpen(false); navigate('/doctor/records/1'); }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors flex items-center gap-2"
              >
                <FileText size={16} /> Xem hồ sơ chi tiết
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Patients;
