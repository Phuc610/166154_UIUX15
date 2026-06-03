import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlass, CalendarBlank, CaretRight, User
} from '@phosphor-icons/react';

const INITIAL_MOCK_PATIENTS = [
  { id: 'p1', code: 'BN001', name: 'Phạm Văn Đức', gender: 'Nam', age: 55, lastVisit: '02/06/2026', doctor: 'BS. Lê Minh', status: 'Đang khám' },
  { id: 'p2', code: 'BN002', name: 'Nguyễn Thị Hoa', gender: 'Nữ', age: 34, lastVisit: '28/05/2026', doctor: 'BS. Trần Hà', status: 'Đã khám' },
  { id: 'p3', code: 'BN003', name: 'Trần Minh Tuấn', gender: 'Nam', age: 42, lastVisit: '15/05/2026', doctor: 'BS. Lê Minh', status: 'Đang khám' },
  { id: 'p4', code: 'BN004', name: 'Lê Hoàng Yến', gender: 'Nữ', age: 28, lastVisit: '10/04/2026', doctor: 'BS. Nguyễn An', status: 'Đã khám' },
  { id: 'p5', code: 'BN005', name: 'Vũ Thanh Bình', gender: 'Nam', age: 61, lastVisit: '01/06/2026', doctor: 'BS. Trần Hà', status: 'Đã khám' },
];

const MedicalRecords = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('preclinic_patients');
    if (!saved) {
      localStorage.setItem('preclinic_patients', JSON.stringify(INITIAL_MOCK_PATIENTS));
      return INITIAL_MOCK_PATIENTS;
    }
    return JSON.parse(saved);
  });

  useEffect(() => {
    const saved = localStorage.getItem('preclinic_patients');
    if (saved) {
      setPatients(JSON.parse(saved));
    }
  }, []);

  const displayPatients = patients
    .filter((p: any) => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'Tất cả' || p.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a: any, b: any) => {
      // Priority: Đang khám on top
      if (a.status === 'Đang khám' && b.status !== 'Đang khám') return -1;
      if (a.status !== 'Đang khám' && b.status === 'Đang khám') return 1;
      return 0;
    });

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-slate-900">Hồ sơ bệnh án</h1>
            <button 
              onClick={() => { localStorage.removeItem('preclinic_patients'); window.location.reload(); }}
              className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-md font-semibold hover:bg-slate-200 hover:text-slate-700 transition-colors"
              title="Khôi phục lại dữ liệu mẫu"
            >
              Làm mới dữ liệu
            </button>
          </div>
          <p className="text-sm text-slate-500">Quản lý và tra cứu lịch sử khám chữa bệnh</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden flex-1">
        {/* Filters */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4">
          <div className="relative w-80">
            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Mã BN, Tên bệnh nhân, SĐT..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 cursor-pointer shadow-sm hover:bg-slate-50 transition-colors"
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              <option value="Đang khám">Đang khám</option>
              <option value="Đã khám">Đã khám</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 sticky top-0 backdrop-blur-sm z-10">
              <tr>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Mã BN</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Họ tên</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Thông tin</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Ngày khám gần nhất</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Bác sĩ phụ trách</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Trạng thái</th>
                <th className="py-4 px-6 border-b border-slate-200 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {displayPatients.map((p: any) => (
                <tr 
                  key={p.id} 
                  onClick={() => navigate(`/doctor/records/${p.id}`)}
                  className={`group hover:bg-blue-50/50 transition-colors border-b border-slate-100 last:border-0 cursor-pointer ${p.status === 'Đang khám' ? 'bg-amber-50/30' : ''}`}
                >
                  <td className="py-4 px-6">
                    <span className="font-mono text-sm font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">{p.code}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                        <User size={18} className="text-slate-500" />
                      </div>
                      <span className="font-bold text-slate-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-slate-600">{p.gender} · {p.age} tuổi</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CalendarBlank size={16} className="text-slate-400" /> {p.lastVisit}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-700 font-medium">
                    {p.doctor}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide
                      ${p.status === 'Đang khám' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shadow-sm">
                      <CaretRight size={14} weight="bold" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;
