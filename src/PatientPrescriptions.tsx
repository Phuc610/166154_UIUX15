import React, { useState, useRef, useEffect } from 'react';
import { CaretLeft, CaretRight, CaretDown, Export, Funnel, MagnifyingGlass, DotsThreeVertical, Eye, FileArrowDown } from '@phosphor-icons/react';
const PRESCRIPTIONS = [
  { id: '#PRE0015', doc: 'BS. Mick Thompson', spec: 'Tim mạch', date: '30 Thg 4 2026', bg: 'bg-indigo-200' },
  { id: '#PRE0014', doc: 'BS. Sarah Johnson', spec: 'Chỉnh hình', date: '15 Thg 4 2026', bg: 'bg-red-300' },
  { id: '#PRE0013', doc: 'BS. Emily Carter', spec: 'Nhi khoa', date: '02 Thg 4 2026', bg: 'bg-blue-300' },
  { id: '#PRE0012', doc: 'BS. David Lee', spec: 'Phụ khoa', date: '27 Thg 3 2026', bg: 'bg-yellow-400' },
  { id: '#PRE0011', doc: 'BS. Anna Kim', spec: 'Tâm thần học', date: '12 Thg 3 2026', bg: 'bg-emerald-300' },
  { id: '#PRE0010', doc: 'BS. John Smith', spec: 'Ngoại thần kinh', date: '05 Thg 3 2026', bg: 'bg-purple-300' },
  { id: '#PRE0009', doc: 'BS. Lisa White', spec: 'Ung bướu', date: '24 Thg 2 2026', bg: 'bg-rose-300' },
  { id: '#PRE0008', doc: 'BS. Patricia Brown', spec: 'Hô hấp', date: '16 Thg 2 2026', bg: 'bg-yellow-400' },
  { id: '#PRE0007', doc: 'BS. Rachel Green', spec: 'Tiết niệu', date: '01 Thg 2 2026', bg: 'bg-indigo-100' },
  { id: '#PRE0006', doc: 'BS. Michael Smith', spec: 'Tim mạch', date: '25 Thg 1 2026', bg: 'bg-emerald-400' },
  { id: '#PRE0005', doc: 'BS. Sarah Johnson', spec: 'Chỉnh hình', date: '10 Thg 1 2026', bg: 'bg-red-300' },
  { id: '#PRE0004', doc: 'BS. Emily Carter', spec: 'Nhi khoa', date: '22 Thg 12 2025', bg: 'bg-blue-300' },
  { id: '#PRE0003', doc: 'BS. David Lee', spec: 'Phụ khoa', date: '15 Thg 12 2025', bg: 'bg-yellow-400' },
  { id: '#PRE0002', doc: 'BS. Anna Kim', spec: 'Tâm thần học', date: '05 Thg 12 2025', bg: 'bg-emerald-300' },
  { id: '#PRE0001', doc: 'BS. Mick Thompson', spec: 'Tim mạch', date: '28 Thg 11 2025', bg: 'bg-indigo-200' },
];

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const PatientPrescriptions: React.FC = () => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showMenu, setShowMenu] = useState<number | null>(null);
  
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showDocSelect, setShowDocSelect] = useState(false);
  const [filterDoc, setFilterDoc] = useState('');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  
  const parseDate = (dateStr: string) => {
    const match = dateStr.match(/(\d+)\s+Thg\s+(\d+)\s+(\d+)/);
    if (!match) return 0;
    return new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1])).getTime();
  };

  const filtered = PRESCRIPTIONS.filter(p => 
    (p.id.toLowerCase().includes(search.toLowerCase()) || p.doc.toLowerCase().includes(search.toLowerCase())) &&
    (filterDoc === '' || p.doc === filterDoc)
  );

  const sorted = [...filtered].sort((a, b) => {
    const timeA = parseDate(a.date);
    const timeB = parseDate(b.date);
    return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);
  const handlePageSize = (v: number) => { setPageSize(v); setPage(1); };

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center px-8 pt-6 pb-5">
        <h1 className="text-2xl font-bold text-slate-900">Danh sách Đơn thuốc</h1>
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
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Tìm kiếm đơn thuốc..."
              value={search}
              onChange={e => handleSearch(e.target.value)}
              className="w-full pl-4 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white placeholder-slate-400"
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
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Bác sĩ</label>
                      <div className="relative">
                        <button onClick={() => setShowDocSelect(!showDocSelect)} className="w-full flex items-center justify-between px-3 py-2 text-sm border border-slate-200 rounded-md bg-white hover:bg-slate-50 transition-colors text-slate-700">
                          <span className="truncate">{filterDoc || 'Tất cả'}</span>
                          <CaretDown size={12} className={`transition-transform duration-200 ${showDocSelect ? 'rotate-180' : ''}`} />
                        </button>
                        {showDocSelect && (
                          <>
                            <div className="fixed inset-0 z-30" onClick={() => setShowDocSelect(false)} />
                            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-40 max-h-48 overflow-y-auto">
                              <button onClick={() => {setFilterDoc(''); setShowDocSelect(false); setPage(1);}} className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition-colors ${filterDoc === '' ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700'}`}>Tất cả</button>
                              {Array.from(new Set(PRESCRIPTIONS.map(a => a.doc))).map(d => (
                                <button key={d} onClick={() => {setFilterDoc(d); setShowDocSelect(false); setPage(1);}} className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition-colors ${filterDoc === d ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700'}`}>{d}</button>
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
                <col style={{ width: '25%' }}/>
                <col style={{ width: '45%' }}/>
                <col style={{ width: '20%' }}/>
                <col style={{ width: '10%' }}/>
              </colgroup>
              <thead>
                <tr className="border-b border-slate-300 bg-slate-50/50">
                  <th className="text-left py-4 px-6 text-xs font-bold text-slate-600 uppercase tracking-wide">Mã đơn thuốc</th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-slate-600 uppercase tracking-wide">Bác sĩ kê đơn</th>
                  <th className="text-center py-4 px-6 text-xs font-bold text-slate-600 uppercase tracking-wide">Ngày kê đơn</th>
                  <th className="py-4 px-6"/>
                </tr>
              </thead>
              <tbody style={{ minHeight: `${pageSize * 64}px`, display: 'table-row-group' }}>
                {paginated.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-12 text-slate-400 text-sm">Không tìm thấy đơn thuốc</td></tr>
                ) : paginated.map((pre, i) => {
                  const realIdx = (page - 1) * pageSize + i;
                  return (
                    <tr key={realIdx} className="border-b border-slate-200 hover:bg-slate-50/60 transition-colors">
                      {/* Prescription ID */}
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-slate-500">{pre.id}</span>
                      </td>

                      {/* Doctor info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full shrink-0 ${pre.bg}`}/>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{pre.doc}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{pre.spec}</div>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 text-sm text-slate-600 font-medium text-center">
                        {pre.date}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 relative">
                        <div className="flex justify-end">
                          <button
                            onClick={e => { e.stopPropagation(); setShowMenu(showMenu === realIdx ? null : realIdx); }}
                            className="w-8 h-8 flex items-center justify-center text-slate-400 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors bg-white"
                          >
                            <DotsThreeVertical size={20} weight="bold"/>
                          </button>
                        </div>
                        {showMenu === realIdx && (
                          <div className="absolute right-6 top-full mt-1 bg-white shadow-xl border border-slate-100 rounded-xl z-30 py-2 w-40">
                            <button onClick={() => setShowMenu(null)} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors">
                              <Eye size={16} className="text-slate-400"/> Xem chi tiết
                            </button>
                            <button onClick={() => setShowMenu(null)} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors">
                              <FileArrowDown size={16} className="text-slate-400"/> Tải xuống PDF
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Số dòng mỗi trang</span>
              <select
                value={pageSize}
                onChange={e => handlePageSize(Number(e.target.value))}
                className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm outline-none text-slate-700 font-medium bg-white"
              >
                {PAGE_SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <span>Mục</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors bg-white"
              >
                <CaretLeft size={15}/>
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                    page === i + 1 ? 'bg-blue-600 text-white border border-blue-600' : 'border border-slate-200 text-slate-500 hover:bg-slate-50 bg-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors bg-white"
              >
                <CaretRight size={15}/>
              </button>
            </div>
          </div>
        </div> {/* end table card */}
      </div> {/* end content p-8 */}

      {/* Overlay to close dropdown */}
      {showMenu !== null && (
        <div className="fixed inset-0 z-20" onClick={() => setShowMenu(null)}/>
      )}
    </div>
  );
};

export default PatientPrescriptions;
