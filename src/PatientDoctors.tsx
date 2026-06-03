import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlass, Funnel, CalendarBlank, DotsThreeVertical,
  CaretLeft, CaretRight, CaretDown, Eye, Export, ChatCircleDots
} from '@phosphor-icons/react';
import NewAppointmentModal from './NewAppointmentModal';

export const DOCTORS = [
  { name: 'BS. Mick Thompson', spec: 'Tim mạch', phone: '+84 912 345 678', lastVisit: '30 Thg 4 2025', bg: 'bg-indigo-200' },
  { name: 'BS. Sarah Johnson', spec: 'Chỉnh hình', phone: '+84 987 654 321', lastVisit: '15 Thg 4 2025', bg: 'bg-red-300' },
  { name: 'BS. Emily Carter', spec: 'Nhi khoa', phone: '+84 905 123 456', lastVisit: '02 Thg 4 2025', bg: 'bg-blue-300' },
  { name: 'BS. David Lee', spec: 'Phụ khoa', phone: '+84 933 456 789', lastVisit: '27 Thg 3 2025', bg: 'bg-yellow-400' },
  { name: 'BS. Anna Kim', spec: 'Tâm thần học', phone: '+84 868 111 222', lastVisit: '12 Thg 3 2025', bg: 'bg-teal-400' },
  { name: 'BS. John Smith', spec: 'Ngoại thần kinh', phone: '+84 899 333 444', lastVisit: '05 Thg 3 2025', bg: 'bg-purple-300' },
  { name: 'BS. Lisa White', spec: 'Ung bướu', phone: '+84 977 555 666', lastVisit: '30 Thg 4 2025', bg: 'bg-pink-300' },
  { name: 'BS. Patricia Brown', spec: 'Hô hấp', phone: '+84 944 777 888', lastVisit: '16 Thg 2 2025', bg: 'bg-yellow-300' },
  { name: 'BS. Rachel Green', spec: 'Tiết niệu', phone: '+84 922 999 000', lastVisit: '01 Thg 2 2025', bg: 'bg-indigo-200' },
  { name: 'BS. Michael Smith', spec: 'Tim mạch', phone: '+84 888 123 987', lastVisit: '25 Thg 1 2025', bg: 'bg-teal-400' },
  { name: 'BS. Thomas Lee', spec: 'Tim mạch', phone: '+84 912 000 111', lastVisit: '20 Thg 1 2025', bg: 'bg-blue-200' },
  { name: 'BS. Jennifer Wu', spec: 'Da liễu', phone: '+84 977 888 222', lastVisit: '10 Thg 1 2025', bg: 'bg-red-200' },
  { name: 'BS. Kevin Park', spec: 'Tiêu hóa', phone: '+84 933 777 333', lastVisit: '05 Thg 1 2025', bg: 'bg-green-300' },
  { name: 'BS. Amanda Clark', spec: 'Thần kinh', phone: '+84 899 666 444', lastVisit: '28 Thg 12 2024', bg: 'bg-orange-300' },
  { name: 'BS. Robert Davis', spec: 'Cơ xương khớp', phone: '+84 868 555 555', lastVisit: '15 Thg 12 2024', bg: 'bg-purple-200' },
  { name: 'BS. Maria Garcia', spec: 'Sản phụ khoa', phone: '+84 944 444 666', lastVisit: '01 Thg 12 2024', bg: 'bg-pink-200' },
  { name: 'BS. James Wilson', spec: 'Mắt', phone: '+84 922 333 777', lastVisit: '20 Thg 11 2024', bg: 'bg-cyan-300' },
  { name: 'BS. Linda Moore', spec: 'Tai mũi họng', phone: '+84 888 222 888', lastVisit: '10 Thg 11 2024', bg: 'bg-amber-300' },
  { name: 'BS. Charles Taylor', spec: 'Ung thư máu', phone: '+84 977 111 999', lastVisit: '01 Thg 11 2024', bg: 'bg-red-300' },
  { name: 'BS. Susan Harris', spec: 'Nội tiết', phone: '+84 912 999 000', lastVisit: '15 Thg 10 2024', bg: 'bg-indigo-300' },
];

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const PatientDoctors = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSpecSelect, setShowSpecSelect] = useState(false);
  const [filterSpec, setFilterSpec] = useState('');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<{name: string, spec: string, bg: string} | undefined>(undefined);
  const menuRef = useRef<HTMLDivElement>(null);

  // Filter
  const filtered = DOCTORS.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.spec.toLowerCase().includes(search.toLowerCase());
    const matchSpec = filterSpec === '' || d.spec === filterSpec;
    return matchSearch && matchSpec;
  });

  const parseDate = (dStr: string) => {
    const match = dStr.match(/(\d{1,2})\s+Thg\s+(\d{1,2})\s+(\d{4})/i);
    if (!match) return 0;
    const [_, d, m, y] = match;
    return new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10)).getTime();
  };

  const sorted = [...filtered].sort((a, b) => {
    const tA = parseDate(a.lastVisit);
    const tB = parseDate(b.lastVisit);
    return sortOrder === 'newest' ? tB - tA : tA - tB;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handlePageSize = (v: number) => { setPageSize(v); setPage(1); };

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center px-8 pt-6 pb-5">
        <h1 className="text-2xl font-bold text-slate-900">Danh sách Bác sĩ</h1>
        <div className="relative">
          <button onClick={() => setShowExportMenu(!showExportMenu)} className="flex items-center gap-2 px-4 py-2 bg-white text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <Export size={16} /> Xuất file <CaretDown size={12} className={`transition-transform duration-200 ${showExportMenu ? 'rotate-180' : ''}`} />
          </button>
          {showExportMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-20 py-2">
                <button onClick={() => setShowExportMenu(false)} className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                  Tải file PDF
                </button>
                <button onClick={() => setShowExportMenu(false)} className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                  Tải file Excel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="mx-8 border-b border-slate-300" />

      {/* Content */}
      <div className="p-8">

        {/* Toolbar - on page background */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-60">
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bác sĩ..."
              value={search}
              onChange={e => handleSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setShowFilterMenu(!showFilterMenu)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-white bg-white font-medium transition-colors">
                <Funnel size={15} /> Bộ lọc <CaretDown size={12} className={`transition-transform duration-200 ${showFilterMenu ? 'rotate-180' : ''}`} />
              </button>
              {showFilterMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowFilterMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-xl z-20 p-4 flex flex-col gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Chuyên khoa</label>
                      <div className="relative">
                        <button onClick={() => setShowSpecSelect(!showSpecSelect)} className="w-full flex items-center justify-between px-3 py-2 text-sm border border-slate-200 rounded-md bg-white hover:bg-slate-50 transition-colors text-slate-700">
                          <span className="truncate">{filterSpec || 'Tất cả'}</span>
                          <CaretDown size={12} className={`transition-transform duration-200 ${showSpecSelect ? 'rotate-180' : ''}`} />
                        </button>
                        {showSpecSelect && (
                          <>
                            <div className="fixed inset-0 z-30" onClick={() => setShowSpecSelect(false)} />
                            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-40 max-h-48 overflow-y-auto">
                              <button onClick={() => {setFilterSpec(''); setShowSpecSelect(false); setPage(1);}} className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition-colors ${filterSpec === '' ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700'}`}>Tất cả</button>
                              {Array.from(new Set(DOCTORS.map(a => a.spec))).map(s => (
                                <button key={s} onClick={() => {setFilterSpec(s); setShowSpecSelect(false); setPage(1);}} className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition-colors ${filterSpec === s ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700'}`}>{s}</button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="relative">
              <button onClick={() => setShowSortMenu(!showSortMenu)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-white bg-white font-medium transition-colors">
                {sortOrder === 'newest' ? 'Mới nhất' : 'Cũ nhất'} <CaretDown size={12} className={`transition-transform duration-200 ${showSortMenu ? 'rotate-180' : ''}`} />
              </button>
              {showSortMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-20 py-2">
                    <button onClick={() => { setSortOrder('newest'); setShowSortMenu(false); }} className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors ${sortOrder === 'newest' ? 'text-blue-600 bg-blue-50/50' : 'text-slate-600'}`}>
                      Mới nhất
                    </button>
                    <button onClick={() => { setSortOrder('oldest'); setShowSortMenu(false); }} className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors ${sortOrder === 'oldest' ? 'text-blue-600 bg-blue-50/50' : 'text-slate-600'}`}>
                      Cũ nhất
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-visible">
          {/* Table */}
          <div className="overflow-x-auto" ref={menuRef}>
            <table className="w-full table-fixed">
              <colgroup>
                <col style={{ width: '45%' }} />
                <col style={{ width: '25%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '10%' }} />
              </colgroup>
              <thead>
                <tr className="border-b border-slate-300 bg-slate-50/50">
                  <th className="text-left py-3.5 px-5 text-xs font-bold text-slate-600 uppercase tracking-wide">Tên Bác sĩ & Chuyên khoa</th>
                  <th className="text-center py-3.5 px-5 text-xs font-bold text-slate-600 uppercase tracking-wide">Số điện thoại</th>
                  <th className="text-center py-3.5 px-5 text-xs font-bold text-slate-600 uppercase tracking-wide">Lần khám cuối</th>
                  <th className="py-3.5 px-5" />
                </tr>
              </thead>
              <tbody style={{ minHeight: `${pageSize * 64}px`, display: 'table-row-group' }}>
                {paginated.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-12 text-slate-400 text-sm">Không tìm thấy bác sĩ phù hợp</td></tr>
                ) : paginated.map((doc, i) => {
                  const realIdx = (page - 1) * pageSize + i;
                  return (
                    <tr 
                      key={realIdx} 
                      onClick={() => navigate(`/patient/doctors/${encodeURIComponent(doc.name)}`, { state: { doctor: doc } })}
                      className="border-b border-slate-200 hover:bg-slate-50/60 transition-colors cursor-pointer"
                    >
                      {/* Doctor info */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full shrink-0 ${doc.bg}`} />
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{doc.name}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{doc.spec}</div>
                          </div>
                        </div>
                      </td>
                      {/* Phone */}
                      <td className="py-4 px-5 text-sm text-slate-600 text-center">{doc.phone}</td>
                      {/* Last visit */}
                      <td className="py-4 px-5 text-sm text-slate-500 font-medium text-center">{doc.lastVisit}</td>
                      {/* Actions */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1 justify-end relative">
                          {/* Calendar / Book appointment */}
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedDoc({ name: doc.name, spec: doc.spec, bg: doc.bg }); setIsModalOpen(true); }}
                            title="Đặt lịch hẹn"
                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <CalendarBlank size={18} />
                          </button>

                          {/* Three dots */}
                          <button
                            onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === realIdx ? null : realIdx); }}
                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <DotsThreeVertical size={20} />
                          </button>

                          {/* Dropdown */}
                          {openMenu === realIdx && (
                            <div className="absolute right-0 top-full mt-1 bg-white shadow-xl border border-slate-100 rounded-xl z-30 py-2 w-44">
                              <button
                                onClick={(e) => { e.stopPropagation(); setOpenMenu(null); navigate(`/patient/doctors/${encodeURIComponent(doc.name)}`, { state: { doctor: doc } }); }}
                                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                              >
                                <Eye size={16} className="text-slate-400" /> Xem hồ sơ
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setOpenMenu(null); navigate('/patient/consult-doctor', { state: { targetDoctorName: doc.name } }); }}
                                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                              >
                                <ChatCircleDots size={16} className="text-slate-400" /> Nhắn tin
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-50">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Số dòng mỗi trang</span>
              <select
                value={pageSize}
                onChange={e => handlePageSize(Number(e.target.value))}
                className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm outline-none text-slate-700"
              >
                {PAGE_SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <span>Mục</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <CaretLeft size={15} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${page === i + 1 ? 'bg-blue-600 text-white border border-blue-600' : 'border border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <CaretRight size={15} />
              </button>
            </div>
          </div>
        </div> {/* end table card */}
      </div> {/* end content p-8 */}
      {/* Overlay to close dropdown */}
      {openMenu !== null && (
        <div className="fixed inset-0 z-20" onClick={() => setOpenMenu(null)} />
      )}

      {/* New Appointment Modal */}
      <NewAppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialDoctor={selectedDoc} />
    </div>
  );
};

export default PatientDoctors;
