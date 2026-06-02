import React, { useState, useRef, useEffect } from 'react';
import {
  MagnifyingGlass, Plus, DownloadSimple, Funnel,
  CaretDown, X, Warning, Check, DotsThreeVertical,
  ArrowDown, ArrowUp, Money, Pill, Gauge, Megaphone
} from '@phosphor-icons/react';
import Modal from './components/Modal';

// ── Types ──────────────────────────────────────────────────
type ExpenseStatus = 'paid' | 'pending' | 'rejected';
type ExpenseCategory = 'Vật tư y tế' | 'Vận hành' | 'Marketing' | 'Lương nhân sự' | 'Khác';
type PaymentMethod = 'Chuyển khoản' | 'Tiền mặt' | 'Thẻ tín dụng';

interface Expense {
  id: string;
  code: string;
  category: ExpenseCategory;
  title: string;
  description: string;
  method: PaymentMethod;
  date: string;
  status: ExpenseStatus;
  amount: number;
}

// ── Constants ──────────────────────────────────────────────
const STATUS_CFG: Record<ExpenseStatus, { label: string; dot: string; text: string; bg: string }> = {
  paid:     { label: 'Đã thanh toán', dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
  pending:  { label: 'Chờ duyệt',     dot: 'bg-amber-400',  text: 'text-amber-700',   bg: 'bg-amber-50'   },
  rejected: { label: 'Từ chối',        dot: 'bg-red-500',    text: 'text-red-700',     bg: 'bg-red-50'     },
};

const CATEGORY_CFG: Record<ExpenseCategory, { color: string; bg: string }> = {
  'Vật tư y tế':   { color: 'text-blue-700',   bg: 'bg-blue-100'    },
  'Vận hành':      { color: 'text-purple-700',  bg: 'bg-purple-100'  },
  'Marketing':     { color: 'text-orange-700',  bg: 'bg-orange-100'  },
  'Lương nhân sự': { color: 'text-emerald-700', bg: 'bg-emerald-100' },
  'Khác':          { color: 'text-slate-700',   bg: 'bg-slate-100'   },
};

const CATEGORIES: ExpenseCategory[] = ['Vật tư y tế','Vận hành','Marketing','Lương nhân sự','Khác'];
const METHODS: PaymentMethod[] = ['Chuyển khoản','Tiền mặt','Thẻ tín dụng'];

// Cơ cấu chi phí (tháng)
const BREAKDOWN = [
  { label: 'Lương nhân sự',      pct: 42, color: 'bg-blue-600'    },
  { label: 'Vật tư y tế',        pct: 34, color: 'bg-emerald-500' },
  { label: 'Vận hành & Điện nước',pct: 15, color: 'bg-amber-500'  },
  { label: 'Marketing',           pct: 9,  color: 'bg-purple-500'  },
];

const INITIAL_EXPENSES: Expense[] = [
  { id: 'e1', code: '#EXP-1001', category: 'Vật tư y tế',   title: 'Nhập thuốc kháng sinh',        description: 'Đợt 1 tháng 5 - Cty Dược TW1',          method: 'Chuyển khoản',  date: '05/05/2026', status: 'paid',    amount: 1200 },
  { id: 'e2', code: '#EXP-1002', category: 'Vận hành',       title: 'Thanh toán tiền điện',          description: 'Chi phí điện cơ sở tháng 4',             method: 'Tiền mặt',      date: '04/05/2026', status: 'paid',    amount: 150  },
  { id: 'e3', code: '#EXP-1003', category: 'Marketing',      title: 'Chạy quảng cáo Facebook',       description: 'Chiến dịch khám tổng quát mùa hè',       method: 'Thẻ tín dụng',  date: '02/05/2026', status: 'pending', amount: 400  },
  { id: 'e4', code: '#EXP-1004', category: 'Vật tư y tế',   title: 'Mua thiết bị đo huyết áp',      description: 'Nhập 10 máy Omron HEM-7156T',            method: 'Chuyển khoản',  date: '01/05/2026', status: 'paid',    amount: 3500 },
  { id: 'e5', code: '#EXP-1005', category: 'Lương nhân sự',  title: 'Thanh toán lương tháng 4',      description: 'Toàn bộ nhân sự 48 người',               method: 'Chuyển khoản',  date: '30/04/2026', status: 'paid',    amount: 6500 },
  { id: 'e6', code: '#EXP-1006', category: 'Vận hành',       title: 'Sửa chữa máy lạnh phòng khám', description: 'Phòng Khám Tổng quát tầng 2',            method: 'Tiền mặt',      date: '28/04/2026', status: 'rejected',amount: 650  },
];

const EMPTY_FORM = { category: '' as ExpenseCategory | '', title: '', description: '', method: '' as PaymentMethod | '', date: '', amount: '' };
const EMPTY_ERRORS = { category: '', title: '', method: '', date: '', amount: '' };

// ── Component ──────────────────────────────────────────────
const Expenses = () => {
  const [expenses, setExpenses]     = useState<Expense[]>(INITIAL_EXPENSES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('Tháng này');
  const [filterCat, setFilterCat]   = useState<ExpenseCategory | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData]     = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState(EMPTY_ERRORS);
  const [detailExp, setDetailExp]   = useState<Expense | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenuId(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Derived ──
  const filtered = expenses.filter(exp => {
    const term = searchTerm.toLowerCase();
    const matchSearch = !searchTerm ||
      exp.code.toLowerCase().includes(term) ||
      exp.title.toLowerCase().includes(term) ||
      exp.description.toLowerCase().includes(term);
    const matchCat = filterCat === 'all' || exp.category === filterCat;
    return matchSearch && matchCat;
  });

  const totalSpend  = expenses.reduce((s, e) => s + e.amount, 0);
  const medicalCost = expenses.filter(e => e.category === 'Vật tư y tế').reduce((s, e) => s + e.amount, 0);
  const salaryCost  = expenses.filter(e => e.category === 'Lương nhân sự').reduce((s, e) => s + e.amount, 0);

  // ── Validate ──
  const validateForm = () => {
    const errors = { ...EMPTY_ERRORS };
    let ok = true;
    if (!formData.category)           { errors.category = 'Vui lòng chọn hạng mục.'; ok = false; }
    if (!formData.title.trim())       { errors.title    = 'Vui lòng nhập tên khoản chi.'; ok = false; }
    if (!formData.method)             { errors.method   = 'Vui lòng chọn hình thức.'; ok = false; }
    if (!formData.date)               { errors.date     = 'Vui lòng nhập ngày chi.'; ok = false; }
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0)
                                      { errors.amount   = 'Số tiền phải là số dương.'; ok = false; }
    setFormErrors(errors);
    return ok;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const newCode = `#EXP-${String(expenses.length + 1007).padStart(4, '0')}`;
    setExpenses(prev => [...prev, {
      id: `exp${Date.now()}`, code: newCode,
      category: formData.category as ExpenseCategory,
      title: formData.title,
      description: formData.description,
      method: formData.method as PaymentMethod,
      date: formData.date, status: 'pending',
      amount: Number(formData.amount),
    }]);
    setFormData(EMPTY_FORM); setFormErrors(EMPTY_ERRORS); setIsModalOpen(false);
  };

  const handleApprove = (id: string) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: 'paid' } : e));
    setDetailExp(null);
  };

  const handleReject = (id: string) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: 'rejected' } : e));
    setDetailExp(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setExpenses(prev => prev.filter(e => e.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  // ── Render ──
  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý Chi tiêu</h1>
          <p className="text-sm text-slate-500 mt-1">Theo dõi và kiểm soát toàn bộ chi phí hoạt động của phòng khám</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => window.print()} className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg font-semibold text-sm text-slate-700 transition-colors shadow-sm">
            <DownloadSimple size={18} /> Xuất báo cáo
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm">
            <Plus size={18} weight="bold" /> Thêm khoản chi
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl px-6 py-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm text-slate-500 mb-1">Tổng chi (Tháng này)</p>
            <p className="text-3xl font-bold text-slate-900">${totalSpend.toLocaleString()}</p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 mt-1">
              <ArrowUp size={12} /> +5.2% so với tháng trước
            </span>
          </div>
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <ArrowDown size={26} className="text-red-500" weight="bold" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl px-6 py-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm text-slate-500 mb-1">Chi phí vật tư y tế</p>
            <p className="text-3xl font-bold text-slate-900">${medicalCost.toLocaleString()}</p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-1">
              <ArrowDown size={12} /> -2.1% so với tháng trước
            </span>
          </div>
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
            <Pill size={26} className="text-blue-500" weight="bold" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl px-6 py-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm text-slate-500 mb-1">Quỹ lương nhân sự</p>
            <p className="text-3xl font-bold text-slate-900">${salaryCost.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-1">Đã thanh toán <strong>100%</strong> trong tháng</p>
          </div>
          <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center">
            <Money size={26} className="text-purple-500" weight="bold" />
          </div>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-6">
        {/* Filter bar */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-4">
          <div className="relative flex-1 max-w-xs">
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text" placeholder="Tìm kiếm mã phiếu, nội dung..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-9 pr-4 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 rounded-lg text-sm outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Funnel size={16} className="text-slate-400" />
            <span className="text-sm text-slate-500">Hạng mục:</span>
            <div className="relative">
              <select value={filterCat} onChange={e => setFilterCat(e.target.value as any)}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-lg py-2 pl-3 pr-8 text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-600 cursor-pointer">
                <option value="all">Tất cả</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <CaretDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative ml-2">
              <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-lg py-2 pl-3 pr-8 text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-600 cursor-pointer">
                <option>Tháng này</option>
                <option>Tháng trước</option>
                <option>Quý này</option>
                <option>Năm nay</option>
              </select>
              <CaretDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-xs font-semibold">
                <th className="px-5 py-3.5">Mã phiếu</th>
                <th className="px-5 py-3.5">Hạng mục</th>
                <th className="px-5 py-3.5">Nội dung chi</th>
                <th className="px-5 py-3.5">Hình thức</th>
                <th className="px-5 py-3.5">Ngày chi</th>
                <th className="px-5 py-3.5">Trạng thái</th>
                <th className="px-5 py-3.5 text-right">Số tiền</th>
                <th className="px-4 py-3.5 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? filtered.map(exp => {
                const sCfg = STATUS_CFG[exp.status];
                const cCfg = CATEGORY_CFG[exp.category];
                return (
                  <tr key={exp.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-5 py-4 font-mono font-bold text-blue-600 text-xs">{exp.code}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold ${cCfg.bg} ${cCfg.color}`}>
                        {exp.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">{exp.title}</p>
                      <p className="text-xs text-slate-400">{exp.description}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{exp.method}</td>
                    <td className="px-5 py-4 text-slate-600">{exp.date}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${sCfg.bg} ${sCfg.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sCfg.dot}`}></span>
                        {sCfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-bold text-red-600">
                      -${exp.amount.toLocaleString()}
                    </td>
                    <td className="px-3 py-4 relative" ref={openMenuId === exp.id ? menuRef : undefined}>
                      <button
                        onClick={() => setOpenMenuId(openMenuId === exp.id ? null : exp.id)}
                        className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <DotsThreeVertical size={16} />
                      </button>
                      {openMenuId === exp.id && (
                        <div className="absolute right-3 top-12 z-30 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 w-48 text-sm">
                          <button
                            onClick={() => { setDetailExp(exp); setOpenMenuId(null); }}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-slate-50"
                          >
                            <Gauge size={15} /> Xem chi tiết
                          </button>
                          {exp.status === 'pending' && (
                            <button
                              onClick={() => { handleApprove(exp.id); setOpenMenuId(null); }}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-emerald-700 hover:bg-emerald-50"
                            >
                              <Check size={15} weight="bold" /> Duyệt khoản chi
                            </button>
                          )}
                          <div className="h-px bg-slate-100 my-1"></div>
                          <button
                            onClick={() => { setDeleteTarget(exp); setOpenMenuId(null); }}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-600 hover:bg-red-50"
                          >
                            <X size={15} weight="bold" /> Xóa phiếu chi
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-slate-400">Không tìm thấy khoản chi phù hợp.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CƠ CẤU CHI PHÍ */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="font-bold text-slate-800 mb-4">Cơ cấu chi phí (Tháng này)</h2>
        {/* Stacked bar */}
        <div className="flex w-full rounded-full overflow-hidden h-7 mb-4">
          {BREAKDOWN.map(b => (
            <div
              key={b.label}
              className={`${b.color} flex items-center justify-center text-white text-xs font-bold transition-all`}
              style={{ width: `${b.pct}%` }}
            >
              {b.pct}%
            </div>
          ))}
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {BREAKDOWN.map(b => (
            <div key={b.label} className="flex items-center gap-2 text-sm text-slate-600">
              <span className={`w-2.5 h-2.5 rounded-full ${b.color}`}></span>
              {b.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── MODAL: THÊM KHOẢN CHI ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setFormData(EMPTY_FORM); setFormErrors(EMPTY_ERRORS); }}
        title="Thêm khoản chi mới"
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Hạng mục <span className="text-red-500">*</span></label>
            <select
              className={`w-full py-2 px-3 border rounded-lg outline-none text-sm bg-white ${formErrors.category ? 'border-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'}`}
              value={formData.category}
              onChange={e => { setFormData({ ...formData, category: e.target.value as ExpenseCategory }); setFormErrors({ ...formErrors, category: '' }); }}
            >
              <option value="">-- Chọn hạng mục --</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {formErrors.category && <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tên khoản chi <span className="text-red-500">*</span></label>
            <input type="text" placeholder="VD: Nhập thuốc kháng sinh"
              className={`w-full py-2 px-3 border rounded-lg outline-none text-sm ${formErrors.title ? 'border-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'}`}
              value={formData.title}
              onChange={e => { setFormData({ ...formData, title: e.target.value }); setFormErrors({ ...formErrors, title: '' }); }}
            />
            {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả chi tiết</label>
            <input type="text" placeholder="VD: Đợt 1 tháng 5 - Cty Dược TW1"
              className="w-full py-2 px-3 border border-slate-300 rounded-lg outline-none text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hình thức TT <span className="text-red-500">*</span></label>
              <select
                className={`w-full py-2 px-3 border rounded-lg outline-none text-sm bg-white ${formErrors.method ? 'border-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'}`}
                value={formData.method}
                onChange={e => { setFormData({ ...formData, method: e.target.value as PaymentMethod }); setFormErrors({ ...formErrors, method: '' }); }}
              >
                <option value="">-- Chọn --</option>
                {METHODS.map(m => <option key={m}>{m}</option>)}
              </select>
              {formErrors.method && <p className="text-red-500 text-xs mt-1">{formErrors.method}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ngày chi <span className="text-red-500">*</span></label>
              <input type="text" placeholder="VD: 10/06/2026"
                className={`w-full py-2 px-3 border rounded-lg outline-none text-sm ${formErrors.date ? 'border-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'}`}
                value={formData.date}
                onChange={e => { setFormData({ ...formData, date: e.target.value }); setFormErrors({ ...formErrors, date: '' }); }}
              />
              {formErrors.date && <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Số tiền ($) <span className="text-red-500">*</span></label>
            <input type="number" min="1" placeholder="VD: 500"
              className={`w-full py-2 px-3 border rounded-lg outline-none text-sm ${formErrors.amount ? 'border-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'}`}
              value={formData.amount}
              onChange={e => { setFormData({ ...formData, amount: e.target.value }); setFormErrors({ ...formErrors, amount: '' }); }}
            />
            {formErrors.amount && <p className="text-red-500 text-xs mt-1">{formErrors.amount}</p>}
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
            <button type="button"
              onClick={() => { setIsModalOpen(false); setFormData(EMPTY_FORM); setFormErrors(EMPTY_ERRORS); }}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm"
            >Hủy bỏ</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
              Xác nhận Thêm
            </button>
          </div>
        </form>
      </Modal>

      {/* ── MODAL: CHI TIẾT ── */}
      {detailExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setDetailExp(null)}></div>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative z-10">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold">Chi tiết khoản chi</h2>
              <button onClick={() => setDetailExp(null)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500">
                <X size={18} weight="bold" />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className={`inline-flex px-3 py-1 rounded-md text-xs font-bold ${CATEGORY_CFG[detailExp.category].bg} ${CATEGORY_CFG[detailExp.category].color}`}>{detailExp.category}</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_CFG[detailExp.status].bg} ${STATUS_CFG[detailExp.status].text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CFG[detailExp.status].dot}`}></span>
                  {STATUS_CFG[detailExp.status].label}
                </span>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-3 text-sm">
                {[
                  { label: 'Mã phiếu',    value: detailExp.code },
                  { label: 'Tên khoản',   value: detailExp.title },
                  { label: 'Mô tả',       value: detailExp.description || '—' },
                  { label: 'Hình thức',   value: detailExp.method },
                  { label: 'Ngày chi',    value: detailExp.date },
                  { label: 'Số tiền',     value: `-$${detailExp.amount.toLocaleString()}` },
                ].map((item, i, arr) => (
                  <React.Fragment key={item.label}>
                    <div><p className="text-xs text-slate-500">{item.label}</p>
                      <p className={`font-semibold ${item.label === 'Số tiền' ? 'text-red-600 text-lg' : 'text-slate-800'}`}>{item.value}</p>
                    </div>
                    {i < arr.length - 1 && <div className="h-px bg-slate-200"></div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-between">
              <button onClick={() => setDetailExp(null)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm">Đóng</button>
              {detailExp.status === 'pending' && (
                <div className="flex gap-2">
                  <button onClick={() => handleReject(detailExp.id)} className="px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 font-medium text-sm">Từ chối</button>
                  <button onClick={() => handleApprove(detailExp.id)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold text-sm">
                    <Check size={16} weight="bold" /> Duyệt khoản chi
                  </button>
                </div>
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
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <Warning size={20} weight="fill" />
              </div>
              <h2 className="text-lg font-bold">Xác nhận xóa</h2>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Bạn có chắc muốn xóa phiếu chi <strong>{deleteTarget.code}</strong>?<br />
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

export default Expenses;
