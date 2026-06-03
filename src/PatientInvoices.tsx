import React, { useState, useRef, useEffect } from 'react';
import { CaretLeft, CaretRight, Funnel, MagnifyingGlass, DotsThreeVertical, Eye, FileArrowDown, Receipt, CaretDown, Export } from '@phosphor-icons/react';

const INVOICES = [
  { id: '#INV0025', desc: 'Khám tổng quát', created: '30 Thg 4 2026', due: '30 Thg 4 2026', amount: '800.000đ', status: 'Đã thanh toán', stColor: 'text-emerald-500', dot: 'bg-emerald-500' },
  { id: '#INV0024', desc: 'Lấy cao răng', created: '15 Thg 4 2026', due: '15 Thg 4 2026', amount: '350.000đ', status: 'Thanh toán 1 phần', stColor: 'text-yellow-500', dot: 'bg-yellow-500' },
  { id: '#INV0023', desc: 'Khám mắt', created: '02 Thg 4 2026', due: '02 Thg 4 2026', amount: '400.000đ', status: 'Đã thanh toán', stColor: 'text-emerald-500', dot: 'bg-emerald-500' },
  { id: '#INV0022', desc: 'Chụp X-Quang', created: '27 Thg 3 2026', due: '27 Thg 3 2026', amount: '250.000đ', status: 'Đã thanh toán', stColor: 'text-emerald-500', dot: 'bg-emerald-500' },
  { id: '#INV0021', desc: 'Vật lý trị liệu', created: '12 Thg 3 2026', due: '12 Thg 3 2026', amount: '650.000đ', status: 'Thanh toán 1 phần', stColor: 'text-yellow-500', dot: 'bg-yellow-500' },
  { id: '#INV0020', desc: 'Khám tim mạch', created: '05 Thg 3 2026', due: '05 Thg 3 2026', amount: '900.000đ', status: 'Chưa thanh toán', stColor: 'text-red-500', dot: 'bg-red-500' },
  { id: '#INV0019', desc: 'Test dị ứng da', created: '24 Thg 2 2026', due: '24 Thg 2 2026', amount: '300.000đ', status: 'Đã thanh toán', stColor: 'text-emerald-500', dot: 'bg-emerald-500' },
  { id: '#INV0018', desc: 'Xét nghiệm máu', created: '16 Thg 2 2026', due: '16 Thg 2 2026', amount: '450.000đ', status: 'Thanh toán 1 phần', stColor: 'text-yellow-500', dot: 'bg-yellow-500' },
  { id: '#INV0017', desc: 'Khám Tai Mũi Họng', created: '01 Thg 2 2026', due: '01 Thg 2 2026', amount: '500.000đ', status: 'Đã thanh toán', stColor: 'text-emerald-500', dot: 'bg-emerald-500' },
  { id: '#INV0016', desc: 'Tư vấn dinh dưỡng', created: '25 Thg 1 2026', due: '25 Thg 1 2026', amount: '300.000đ', status: 'Chưa thanh toán', stColor: 'text-red-500', dot: 'bg-red-500' },
  { id: '#INV0015', desc: 'Khám tổng quát', created: '10 Thg 1 2026', due: '10 Thg 1 2026', amount: '800.000đ', status: 'Đã thanh toán', stColor: 'text-emerald-500', dot: 'bg-emerald-500' },
  { id: '#INV0014', desc: 'Nội soi dạ dày', created: '05 Thg 1 2026', due: '05 Thg 1 2026', amount: '1.200.000đ', status: 'Đã thanh toán', stColor: 'text-emerald-500', dot: 'bg-emerald-500' },
];

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const PatientInvoices: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showMenu, setShowMenu] = useState<number | null>(null);

  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showStatusSelect, setShowStatusSelect] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
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

  const filtered = INVOICES.filter(p => 
    (p.id.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase())) &&
    (filterStatus === '' || p.status === filterStatus)
  );

  const sorted = [...filtered].sort((a, b) => {
    const timeA = parseDate(a.created);
    const timeB = parseDate(b.created);
    return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);
  const handlePageSize = (v: number) => { setPageSize(v); setPage(1); };

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center px-8 pt-6 pb-5">
        <h1 className="text-2xl font-bold text-slate-900">Danh sách Hóa đơn</h1>
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
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input
              type="text"
              placeholder="Tìm kiếm hóa đơn..."
              value={search}
              onChange={e => handleSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white placeholder-slate-400"
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
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Trạng thái</label>
                      <div className="relative">
                        <button onClick={() => setShowStatusSelect(!showStatusSelect)} className="w-full flex items-center justify-between px-3 py-2 text-sm border border-slate-200 rounded-md bg-white hover:bg-slate-50 transition-colors text-slate-700">
                          <span className="truncate">{filterStatus || 'Tất cả'}</span>
                          <CaretDown size={12} className={`transition-transform duration-200 ${showStatusSelect ? 'rotate-180' : ''}`} />
                        </button>
                        {showStatusSelect && (
                          <>
                            <div className="fixed inset-0 z-30" onClick={() => setShowStatusSelect(false)} />
                            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-40 max-h-48 overflow-y-auto">
                              <button onClick={() => {setFilterStatus(''); setShowStatusSelect(false); setPage(1);}} className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition-colors ${filterStatus === '' ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700'}`}>Tất cả</button>
                              {Array.from(new Set(INVOICES.map(a => a.status))).map(s => (
                                <button key={s} onClick={() => {setFilterStatus(s); setShowStatusSelect(false); setPage(1);}} className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition-colors ${filterStatus === s ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700'}`}>{s}</button>
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
                <col style={{ width: '15%' }}/>
                <col style={{ width: '25%' }}/>
                <col style={{ width: '15%' }}/>
                <col style={{ width: '15%' }}/>
                <col style={{ width: '15%' }}/>
                <col style={{ width: '15%' }}/>
                <col style={{ width: '6%' }}/>
              </colgroup>
              <thead>
                <tr className="border-b border-slate-300 bg-slate-50/50">
                  <th className="text-left py-4 px-6 text-xs font-bold text-slate-600 uppercase tracking-wide">Mã hóa đơn</th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-slate-600 uppercase tracking-wide">Mô tả</th>
                  <th className="text-center py-4 px-6 text-xs font-bold text-slate-600 uppercase tracking-wide">Ngày tạo</th>
                  <th className="text-center py-4 px-6 text-xs font-bold text-slate-600 uppercase tracking-wide">Hạn thanh toán</th>
                  <th className="text-center py-4 px-6 text-xs font-bold text-slate-600 uppercase tracking-wide">Số tiền</th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-slate-600 uppercase tracking-wide">Trạng thái</th>
                  <th className="py-4 px-6"/>
                </tr>
              </thead>
              <tbody style={{ minHeight: `${pageSize * 64}px`, display: 'table-row-group' }}>
                {paginated.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-slate-400 text-sm">Không tìm thấy hóa đơn</td></tr>
                ) : paginated.map((inv, i) => {
                  const realIdx = (page - 1) * pageSize + i;
                  return (
                    <tr key={realIdx} className="border-b border-slate-200 hover:bg-slate-50/60 transition-colors">
                      {/* Invoice ID */}
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-slate-500">{inv.id}</span>
                      </td>

                      {/* Description */}
                      <td className="py-4 px-6">
                        <span className="text-sm text-slate-600 font-medium">{inv.desc}</span>
                      </td>

                      {/* Created Date */}
                      <td className="py-4 px-6 text-sm text-slate-600 font-medium text-center">
                        {inv.created}
                      </td>

                      {/* Due Date */}
                      <td className="py-4 px-6 text-sm text-slate-600 font-medium text-center">
                        {inv.due}
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-6 text-sm text-slate-900 font-bold text-center">
                        {inv.amount}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${inv.dot}`}/>
                          <span className={`text-xs font-bold ${inv.stColor}`}>{inv.status}</span>
                        </div>
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
                          <div className="absolute right-6 top-full mt-1 bg-white shadow-xl border border-slate-100 rounded-xl z-30 py-2 w-48">
                            <button onClick={() => setShowMenu(null)} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors">
                              <Eye size={16} className="text-slate-400"/> Xem chi tiết
                            </button>
                            <button onClick={() => setShowMenu(null)} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors">
                              <Receipt size={16} className="text-slate-400"/> Thanh toán ngay
                            </button>
                            <button onClick={() => setShowMenu(null)} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors border-t border-slate-100">
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

export default PatientInvoices;
