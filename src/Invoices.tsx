import React, { useState, useRef, useEffect } from 'react';
import {
  MagnifyingGlass, Plus, DownloadSimple, Eye,
  PencilSimple, Trash, X, Warning, CaretDown,
  CurrencyDollar, CheckCircle, Clock, XCircle, Funnel
} from '@phosphor-icons/react';
import Modal from './components/Modal';

// ── Types ──────────────────────────────────────────────────
type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'cancelled';

interface Invoice {
  id: string;
  code: string;
  patientName: string;
  patientPhone: string;
  service: string;
  doctor: string;
  amount: string;
  date: string;
  dueDate: string;
  status: InvoiceStatus;
  avatarColor: string;
}

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; dot: string; text: string; bg: string }> = {
  paid:      { label: 'Đã thanh toán', dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50'  },
  pending:   { label: 'Chờ thanh toán', dot: 'bg-amber-500',  text: 'text-amber-700',   bg: 'bg-amber-50'    },
  overdue:   { label: 'Quá hạn',        dot: 'bg-red-500',    text: 'text-red-700',      bg: 'bg-red-50'      },
  cancelled: { label: 'Đã hủy',         dot: 'bg-slate-400',  text: 'text-slate-600',    bg: 'bg-slate-100'   },
};

const INITIAL_INVOICES: Invoice[] = [
  { id: 'i1', code: 'HD-00124', patientName: 'Nguyễn Hồng Minh', patientPhone: '0424 707 55', service: 'Khám tổng quát',    doctor: 'Dr. Andrew Billard', amount: '$400', date: '01/06/2026', dueDate: '15/06/2026', status: 'paid',      avatarColor: 'bg-rose-400'    },
  { id: 'i2', code: 'HD-00125', patientName: 'Trần Thị Mai',     patientPhone: '0987 654 32', service: 'Tư vấn dinh dưỡng', doctor: 'Dr. Sarah Connor',   amount: '$370', date: '02/06/2026', dueDate: '16/06/2026', status: 'pending',   avatarColor: 'bg-blue-400'    },
  { id: 'i3', code: 'HD-00126', patientName: 'Lê Văn Tám',       patientPhone: '0123 456 78', service: 'Siêu âm tim',       doctor: 'Dr. Minh Hoàng',     amount: '$310', date: '28/05/2026', dueDate: '11/06/2026', status: 'overdue',   avatarColor: 'bg-amber-400'   },
  { id: 'i4', code: 'HD-00127', patientName: 'Phạm Thu Trang',   patientPhone: '0912 345 67', service: 'Tái khám Nội tiết',  doctor: 'Dr. Andrew Billard', amount: '$280', date: '01/06/2026', dueDate: '15/06/2026', status: 'paid',      avatarColor: 'bg-emerald-400' },
  { id: 'i5', code: 'HD-00128', patientName: 'Hoàng Minh Tuấn',  patientPhone: '0901 234 56', service: 'Lấy cao răng',      doctor: 'Dr. Sarah Connor',   amount: '$150', date: '30/05/2026', dueDate: '13/06/2026', status: 'cancelled', avatarColor: 'bg-purple-400'  },
  { id: 'i6', code: 'HD-00129', patientName: 'Vũ Thu Hương',     patientPhone: '0977 111 22', service: 'Xét nghiệm máu',    doctor: 'Dr. Andrew Billard', amount: '$220', date: '03/06/2026', dueDate: '17/06/2026', status: 'pending',   avatarColor: 'bg-pink-400'    },
];

const EMPTY_FORM = { patientName: '', service: '', doctor: '', amount: '', dueDate: '' };
const EMPTY_ERRORS = { patientName: '', service: '', doctor: '', amount: '', dueDate: '' };

// ── Component ──────────────────────────────────────────────
const Invoices = () => {
  const [invoices, setInvoices]     = useState<Invoice[]>(INITIAL_INVOICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | InvoiceStatus>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData]     = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState(EMPTY_ERRORS);
  const [detailInvoice, setDetailInvoice] = useState<Invoice | null>(null);
  const [deleteTarget, setDeleteTarget]   = useState<Invoice | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenuId(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = invoices.filter(inv => {
    const term = searchTerm.toLowerCase();
    const matchSearch = !searchTerm ||
      inv.patientName.toLowerCase().includes(term) ||
      inv.code.toLowerCase().includes(term) ||
      inv.service.toLowerCase().includes(term);
    const matchStatus = filterStatus === 'all' || inv.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Stats
  const totalPaid    = invoices.filter(i => i.status === 'paid').length;
  const totalPending = invoices.filter(i => i.status === 'pending').length;
  const totalOverdue = invoices.filter(i => i.status === 'overdue').length;
  const totalRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + parseInt(i.amount.replace('$', '')), 0);

  const validateForm = () => {
    const errors = { ...EMPTY_ERRORS };
    let ok = true;
    if (!formData.patientName.trim()) { errors.patientName = 'Vui lòng nhập tên bệnh nhân.'; ok = false; }
    if (!formData.service.trim())     { errors.service     = 'Vui lòng nhập dịch vụ.'; ok = false; }
    if (!formData.doctor)             { errors.doctor      = 'Vui lòng chọn bác sĩ.'; ok = false; }
    if (!formData.amount.trim() || isNaN(Number(formData.amount))) { errors.amount = 'Số tiền không hợp lệ.'; ok = false; }
    if (!formData.dueDate)            { errors.dueDate     = 'Vui lòng nhập ngày đến hạn.'; ok = false; }
    setFormErrors(errors);
    return ok;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const code = `HD-${String(invoices.length + 130).padStart(5, '0')}`;
    const avatarColors = ['bg-rose-400','bg-blue-400','bg-amber-400','bg-emerald-400','bg-purple-400','bg-pink-400'];
    setInvoices(prev => [...prev, {
      id: `i${Date.now()}`, code,
      patientName: formData.patientName, patientPhone: '—',
      service: formData.service, doctor: formData.doctor,
      amount: `$${formData.amount}`,
      date: new Date().toLocaleDateString('vi-VN'),
      dueDate: formData.dueDate, status: 'pending',
      avatarColor: avatarColors[Math.floor(Math.random() * avatarColors.length)],
    }]);
    setFormData(EMPTY_FORM); setFormErrors(EMPTY_ERRORS); setIsModalOpen(false);
  };

  const handleMarkPaid = (id: string) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'paid' } : inv));
    setDetailInvoice(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setInvoices(prev => prev.filter(inv => inv.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý Hóa đơn</h1>
          <p className="text-sm text-slate-500 mt-1">Theo dõi và quản lý tình trạng thanh toán của bệnh nhân</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => window.print()} className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg font-semibold text-sm text-slate-700 transition-colors shadow-sm">
            <DownloadSimple size={18} /> Xuất hóa đơn
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm">
            <Plus size={18} weight="bold" /> Tạo hóa đơn
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        {[
          { label: 'Đã thanh toán', value: totalPaid,    suffix: ' hóa đơn', icon: <CheckCircle size={24} className="text-emerald-500" />, bg: 'bg-emerald-50', cursor: 'paid'      },
          { label: 'Chờ thanh toán',value: totalPending, suffix: ' hóa đơn', icon: <Clock       size={24} className="text-amber-500"   />, bg: 'bg-amber-50',   cursor: 'pending'   },
          { label: 'Quá hạn',       value: totalOverdue, suffix: ' hóa đơn', icon: <XCircle     size={24} className="text-red-500"     />, bg: 'bg-red-50',     cursor: 'overdue'   },
          { label: 'Tổng thu',      value: `$${totalRevenue.toLocaleString()}`, suffix: '', icon: <CurrencyDollar size={24} className="text-blue-500" />, bg: 'bg-blue-50', cursor: 'all' },
        ].map(stat => (
          <div
            key={stat.label}
            onClick={() => setFilterStatus(stat.cursor as any)}
            className={`bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-center justify-between shadow-sm cursor-pointer hover:shadow-md transition-all ${filterStatus === stat.cursor ? 'ring-1 ring-blue-600 border-blue-300' : ''}`}
          >
            <div>
              <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}{stat.suffix}</p>
            </div>
            <div className={`w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center`}>{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* FILTER BAR */}
      <div className="bg-white border border-slate-200 rounded-xl px-5 py-3.5 mb-5 flex items-center gap-4 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlass size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Tìm mã HD, tên bệnh nhân, dịch vụ..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-9 pr-4 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 rounded-lg text-sm outline-none transition-colors"
          />
        </div>
        <div className="h-7 w-px bg-slate-200"></div>
        <div className="flex items-center gap-2">
          <Funnel size={16} className="text-slate-400" />
          <span className="text-sm text-slate-500">Trạng thái:</span>
          <div className="relative">
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)}
              className="appearance-none bg-slate-50 border border-slate-200 rounded-lg py-2 pl-3 pr-8 text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-600 cursor-pointer">
              <option value="all">Tất cả</option>
              <option value="paid">Đã thanh toán</option>
              <option value="pending">Chờ thanh toán</option>
              <option value="overdue">Quá hạn</option>
              <option value="cancelled">Đã hủy</option>
            </select>
            <CaretDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div className="ml-auto text-sm text-slate-400">{filtered.length} / {invoices.length} hóa đơn</div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-xs font-semibold">
                <th className="px-6 py-4">Mã HD</th>
                <th className="px-6 py-4">Bệnh nhân</th>
                <th className="px-6 py-4">Dịch vụ</th>
                <th className="px-6 py-4">Bác sĩ</th>
                <th className="px-6 py-4">Số tiền</th>
                <th className="px-6 py-4">Ngày đến hạn</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? filtered.map(inv => {
                const cfg = STATUS_CONFIG[inv.status];
                return (
                  <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-6 py-4 font-mono font-semibold text-slate-600 text-xs">{inv.code}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full ${inv.avatarColor} flex items-center justify-center text-white font-bold text-xs shrink-0`}>{inv.patientName.charAt(0)}</div>
                        <div>
                          <p className="font-bold text-slate-900">{inv.patientName}</p>
                          <p className="text-xs text-slate-400">{inv.patientPhone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">{inv.service}</td>
                    <td className="px-6 py-4 text-slate-600">{inv.doctor}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{inv.amount}</td>
                    <td className="px-6 py-4 text-slate-600">{inv.dueDate}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 relative" ref={openMenuId === inv.id ? menuRef : undefined}>
                      <button
                        onClick={() => setOpenMenuId(openMenuId === inv.id ? null : inv.id)}
                        className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <CaretDown size={14} />
                      </button>
                      {openMenuId === inv.id && (
                        <div className="absolute right-4 top-12 z-30 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 w-48 text-sm">
                          <button onClick={() => { setDetailInvoice(inv); setOpenMenuId(null); }}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-slate-50">
                            <Eye size={15} /> Xem chi tiết
                          </button>
                          {inv.status === 'pending' || inv.status === 'overdue' ? (
                            <button onClick={() => { handleMarkPaid(inv.id); setOpenMenuId(null); }}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-emerald-700 hover:bg-emerald-50">
                              <CheckCircle size={15} /> Đánh dấu đã TT
                            </button>
                          ) : null}
                          <div className="h-px bg-slate-100 my-1"></div>
                          <button onClick={() => { setDeleteTarget(inv); setOpenMenuId(null); }}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-600 hover:bg-red-50">
                            <Trash size={15} /> Xóa hóa đơn
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-slate-400">Không tìm thấy hóa đơn phù hợp.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL: TẠO HÓA ĐƠN ── */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setFormData(EMPTY_FORM); setFormErrors(EMPTY_ERRORS); }} title="Tạo hóa đơn mới">
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tên bệnh nhân <span className="text-red-500">*</span></label>
            <input type="text" placeholder="VD: Nguyễn Văn A"
              className={`w-full py-2 px-3 border rounded-lg outline-none text-sm ${formErrors.patientName ? 'border-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'}`}
              value={formData.patientName} onChange={e => { setFormData({ ...formData, patientName: e.target.value }); setFormErrors({ ...formErrors, patientName: '' }); }} />
            {formErrors.patientName && <p className="text-red-500 text-xs mt-1">{formErrors.patientName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Dịch vụ <span className="text-red-500">*</span></label>
            <input type="text" placeholder="VD: Khám tổng quát, Siêu âm..."
              className={`w-full py-2 px-3 border rounded-lg outline-none text-sm ${formErrors.service ? 'border-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'}`}
              value={formData.service} onChange={e => { setFormData({ ...formData, service: e.target.value }); setFormErrors({ ...formErrors, service: '' }); }} />
            {formErrors.service && <p className="text-red-500 text-xs mt-1">{formErrors.service}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bác sĩ <span className="text-red-500">*</span></label>
              <select className={`w-full py-2 px-3 border rounded-lg outline-none text-sm bg-white ${formErrors.doctor ? 'border-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'}`}
                value={formData.doctor} onChange={e => { setFormData({ ...formData, doctor: e.target.value }); setFormErrors({ ...formErrors, doctor: '' }); }}>
                <option value="">-- Chọn --</option>
                <option>Dr. Andrew Billard</option>
                <option>Dr. Sarah Connor</option>
                <option>Dr. Minh Hoàng</option>
              </select>
              {formErrors.doctor && <p className="text-red-500 text-xs mt-1">{formErrors.doctor}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Số tiền ($) <span className="text-red-500">*</span></label>
              <input type="number" min="0" placeholder="VD: 350"
                className={`w-full py-2 px-3 border rounded-lg outline-none text-sm ${formErrors.amount ? 'border-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'}`}
                value={formData.amount} onChange={e => { setFormData({ ...formData, amount: e.target.value }); setFormErrors({ ...formErrors, amount: '' }); }} />
              {formErrors.amount && <p className="text-red-500 text-xs mt-1">{formErrors.amount}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ngày đến hạn <span className="text-red-500">*</span></label>
            <input type="text" placeholder="VD: 30/06/2026"
              className={`w-full py-2 px-3 border rounded-lg outline-none text-sm ${formErrors.dueDate ? 'border-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'}`}
              value={formData.dueDate} onChange={e => { setFormData({ ...formData, dueDate: e.target.value }); setFormErrors({ ...formErrors, dueDate: '' }); }} />
            {formErrors.dueDate && <p className="text-red-500 text-xs mt-1">{formErrors.dueDate}</p>}
          </div>
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => { setIsModalOpen(false); setFormData(EMPTY_FORM); setFormErrors(EMPTY_ERRORS); }}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm">Hủy bỏ</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">Xác nhận Tạo</button>
          </div>
        </form>
      </Modal>

      {/* ── MODAL: DETAIL ── */}
      {detailInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setDetailInvoice(null)}></div>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative z-10">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold">Chi tiết Hóa đơn</h2>
              <button onClick={() => setDetailInvoice(null)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"><X size={18} weight="bold" /></button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <span className={`self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_CONFIG[detailInvoice.status].bg} ${STATUS_CONFIG[detailInvoice.status].text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[detailInvoice.status].dot}`}></span>
                {STATUS_CONFIG[detailInvoice.status].label}
              </span>
              <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-3 text-sm">
                {[
                  { label: 'Mã hóa đơn', value: detailInvoice.code },
                  { label: 'Bệnh nhân',  value: `${detailInvoice.patientName} (${detailInvoice.patientPhone})` },
                  { label: 'Dịch vụ',    value: detailInvoice.service },
                  { label: 'Bác sĩ',     value: detailInvoice.doctor },
                  { label: 'Số tiền',    value: detailInvoice.amount },
                  { label: 'Ngày tạo',   value: detailInvoice.date },
                  { label: 'Đến hạn',    value: detailInvoice.dueDate },
                ].map((item, i, arr) => (
                  <React.Fragment key={item.label}>
                    <div><p className="text-xs text-slate-500">{item.label}</p><p className="font-semibold text-slate-800">{item.value}</p></div>
                    {i < arr.length - 1 && <div className="h-px bg-slate-200"></div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-between">
              <button onClick={() => setDetailInvoice(null)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm">Đóng</button>
              {(detailInvoice.status === 'pending' || detailInvoice.status === 'overdue') && (
                <button onClick={() => handleMarkPaid(detailInvoice.id)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold text-sm">
                  <CheckCircle size={16} /> Xác nhận đã thanh toán
                </button>
              )}
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
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600"><Warning size={20} weight="fill" /></div>
              <h2 className="text-lg font-bold">Xác nhận xóa</h2>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Bạn có chắc muốn xóa hóa đơn <strong>{deleteTarget.code}</strong> của <strong>{deleteTarget.patientName}</strong>?<br />
              <span className="text-red-500 text-xs">Hành động này không thể hoàn tác.</span>
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm">Hủy bỏ</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold text-sm">Xác nhận Xóa</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Invoices;
